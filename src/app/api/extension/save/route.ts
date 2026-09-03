import { NextRequest, NextResponse, after } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BookmarkItem, PlatformType } from '@/types/stashr';
import { scrapeUrlMetadata, generateGeminiTags, detectPlatformFromUrl } from '@/lib/gemini-tagger';
import { repairFragmentedUrls } from '@/lib/url-utils';

// Helper for CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      url,
      platform,
      userId,
      customTags = [],
      note,
      apiKey,
    } = body;
    let {
      title,
      text = '',
      displayName,
      username,
      avatarUrl,
      imageUrl,
    } = body;

    if (!url && !text) {
      return NextResponse.json(
        { error: 'Either URL or text content is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // Clean fragmented URLs from incoming text & title
    if (text) text = repairFragmentedUrls(text);
    if (title) title = repairFragmentedUrls(title);

    // 1. Auto-detect platform
    const detectedPlatform = url ? detectPlatformFromUrl(url) : ((platform || 'web') as PlatformType);
    const finalPlatform: PlatformType = (platform as PlatformType) || detectedPlatform;

    // 2. Format Date and generate Unique Bookmark ID
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const bookmarkId = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const initialTags = Array.isArray(customTags) ? customTags : [];

    // 3. Construct initial bookmark item
    const fallbackDisplayName = finalPlatform === 'youtube'
      ? 'YouTube'
      : finalPlatform === 'twitter'
      ? 'X / Twitter'
      : finalPlatform === 'reddit'
      ? 'Reddit'
      : finalPlatform === 'instagram'
      ? 'Instagram'
      : 'Web';

    const bookmarkItem: BookmarkItem = {
      id: bookmarkId,
      platform: finalPlatform,
      displayName: displayName || fallbackDisplayName,
      username: username ? (username.startsWith('@') ? username.slice(1) : username) : finalPlatform,
      avatarUrl: avatarUrl || undefined,
      imageUrl: imageUrl || undefined,
      title: title || undefined,
      text: text || title || url || 'Saved from Valut Extension',
      url: url || undefined,
      date: formattedDate,
      createdAt: Date.now(),
      tags: initialTags,
      isFavorite: false,
      isArchived: false,
      note: note || undefined,
    };

    // 4. Save to Supabase immediately (1-click Instant Save)
    let savedToDatabase = false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validUserId = (userId && typeof userId === 'string' && uuidRegex.test(userId)) ? userId : null;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: bmError } = await supabase.from('bookmarks').insert({
          id: bookmarkItem.id,
          platform: bookmarkItem.platform,
          display_name: bookmarkItem.displayName,
          username: bookmarkItem.username,
          avatar_url: bookmarkItem.avatarUrl || null,
          image_url: bookmarkItem.imageUrl || null,
          title: bookmarkItem.title || null,
          text: bookmarkItem.text,
          url: bookmarkItem.url || null,
          date: bookmarkItem.date,
          created_at_ms: bookmarkItem.createdAt,
          tags: bookmarkItem.tags,
          is_favorite: false,
          is_archived: false,
          note: bookmarkItem.note || null,
          user_id: validUserId,
        });

        if (bmError) {
          console.error('[Instant Save] Supabase initial bookmark insert error:', bmError);
        } else {
          savedToDatabase = true;

          // Upsert custom tags if provided
          for (const t of initialTags) {
            try {
              const tagId = `tag_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
              await supabase.from('tags').upsert(
                {
                  id: tagId,
                  name: t.name,
                  color: t.color,
                  user_id: validUserId,
                },
                { onConflict: 'id' }
              );
            } catch (tagErr) {
              console.warn('Initial tag upsert warning:', tagErr);
            }
          }
        }
      } catch (dbErr) {
        console.error('[Instant Save] Supabase execution error:', dbErr);
      }
    }

    // 5. Asynchronous Background Worker: Scrapes metadata + Calls Gemini AI + Updates DB
    // User does NOT need to open website; tags will be updated directly in Supabase in background!
    if (initialTags.length === 0) {
      const runBackgroundAutoTagging = async () => {
        try {
          let bgTitle = title;
          let bgText = text;
          let bgDisplayName = displayName;
          let bgUsername = username;
          let bgAvatarUrl = avatarUrl;
          let bgImageUrl = imageUrl;
          let bgPlatform = finalPlatform;

          // Scrape detailed metadata if sparse and URL exists
          if (url && (!bgTitle || !bgImageUrl || !bgAvatarUrl || !bgText || bgText.length < 30)) {
            try {
              const scraped = await scrapeUrlMetadata(url);
              if (bgPlatform !== 'twitter' && bgPlatform !== 'threads' && bgPlatform !== 'bluesky') {
                bgTitle = bgTitle || scraped.title;
              }
              bgText = bgText || scraped.text;
              bgDisplayName = bgDisplayName || scraped.displayName;
              bgUsername = bgUsername || scraped.username;
              bgAvatarUrl = bgAvatarUrl || scraped.avatarUrl;
              bgImageUrl = bgImageUrl || scraped.imageUrl;
              bgPlatform = scraped.platform || bgPlatform;

              if (bgText) bgText = repairFragmentedUrls(bgText);
              if (bgTitle) bgTitle = repairFragmentedUrls(bgTitle);
            } catch (scrapeErr) {
              console.warn(`[Background Worker] Auto-scrape warning for ${url}:`, scrapeErr);
            }
          }

          // Generate tags via Gemini AI
          const tagResult = await generateGeminiTags({
            platform: bgPlatform,
            title: bgTitle || '',
            text: bgText || bgTitle || url || '',
            displayName: bgDisplayName,
            username: bgUsername,
            apiKey,
          });

          const generatedTags = tagResult.tags || [];
          if (generatedTags.length > 0 && isSupabaseConfigured && supabase) {
            const updates: Record<string, any> = {
              tags: generatedTags,
            };
            if (bgTitle && !title) updates.title = bgTitle;
            if (bgText && !text) updates.text = bgText;
            if (bgImageUrl && !imageUrl) updates.image_url = bgImageUrl;
            if (bgAvatarUrl && !avatarUrl) updates.avatar_url = bgAvatarUrl;
            if (bgDisplayName && !displayName) updates.display_name = bgDisplayName;
            if (bgUsername && !username) {
              updates.username = bgUsername.startsWith('@') ? bgUsername.slice(1) : bgUsername;
            }

            const { error: updateErr } = await supabase
              .from('bookmarks')
              .update(updates)
              .eq('id', bookmarkId);

            if (updateErr) {
              console.error(`[Background Worker] DB update error for ${bookmarkId}:`, updateErr);
            } else {
              console.log(`[Background Worker] Successfully saved ${generatedTags.length} AI tags for ${bookmarkId}`);
            }

            // Upsert generated tags to tags catalog
            for (const t of generatedTags) {
              try {
                const tagId = `tag_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
                await supabase.from('tags').upsert(
                  {
                    id: tagId,
                    name: t.name,
                    color: t.color,
                    user_id: validUserId,
                  },
                  { onConflict: 'id' }
                );
              } catch (tagErr) {
                console.warn('[Background Worker] Tag upsert warning:', tagErr);
              }
            }
          }
        } catch (bgErr) {
          console.error(`[Background Worker] Error processing bookmark ${bookmarkId}:`, bgErr);
        }
      };

      try {
        after(runBackgroundAutoTagging);
      } catch {
        // Fallback execution if called outside standard after() context
        runBackgroundAutoTagging().catch((err) => {
          console.error('[Background Worker] Detached execution error:', err);
        });
      }
    }

    // 6. Return response immediately (<150ms) to Extension!
    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark saved to Valut! AI tags are being generated in the background.',
        bookmark: bookmarkItem,
        tags: initialTags,
        savedToDatabase,
        backgroundTagging: initialTags.length === 0,
      },
      { headers: corsHeaders() }
    );
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Internal server error';
    console.error('Extension save API error:', error);
    return NextResponse.json(
      { error: errorMsg },
      { status: 500, headers: corsHeaders() }
    );
  }
}
