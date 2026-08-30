import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiTags, detectPlatformFromUrl, scrapeUrlMetadata } from '@/lib/gemini-tagger';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let {
      id,
      url = '',
      text = '',
      platform: customPlatform,
      title = '',
      displayName = '',
      username = '',
      apiKey,
      userId,
    } = body;

    let platform = customPlatform || (url ? detectPlatformFromUrl(url) : 'web');

    // If URL is provided and metadata is sparse, attempt scraping
    if (url && (!title || !text || text.length < 20)) {
      try {
        const scraped = await scrapeUrlMetadata(url);
        title = title || scraped.title;
        text = text || scraped.text;
        displayName = displayName || scraped.displayName;
        username = username || scraped.username;
        platform = scraped.platform || platform;
      } catch (scrapeErr) {
        console.warn('AI tag route auto-scrape warning:', scrapeErr);
      }
    }

    const result = await generateGeminiTags({
      platform,
      title: title || text.slice(0, 80) || url,
      text: text || title || url,
      displayName,
      username,
      apiKey,
    });

    const tags = result.tags || [];

    // If bookmark ID provided, update database
    let savedToDatabase = false;
    if (id && isSupabaseConfigured && supabase && tags.length > 0) {
      try {
        const { error: updateErr } = await supabase
          .from('bookmarks')
          .update({ tags })
          .eq('id', id);

        if (!updateErr) {
          savedToDatabase = true;

          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          const validUserId = (userId && typeof userId === 'string' && uuidRegex.test(userId)) ? userId : null;

          for (const t of tags) {
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
            } catch {}
          }
        }
      } catch (dbErr) {
        console.warn('Database tag update warning:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      tags,
      bookmarkId: id,
      savedToDatabase,
      details: result.rawDetails,
    });
  } catch (error: any) {
    console.error('API /api/ai/tag error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI tags' },
      { status: 500 }
    );
  }
}
