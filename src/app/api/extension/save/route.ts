import { NextRequest, NextResponse } from 'next/server';
import { generateAutoTags } from '@/lib/ai-tagger';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BookmarkItem, PlatformType } from '@/types/stashr';

// Helper for CORS headers
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-gemini-key',
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
      platform = 'web',
      title,
      text = '',
      displayName = 'Web User',
      username = 'user',
      avatarUrl,
      imageUrl,
      userId,
      customTags = [],
      geminiApiKey,
      note,
    } = body;

    if (!url && !text) {
      return NextResponse.json(
        { error: 'Either URL or text content is required' },
        { status: 400, headers: corsHeaders() }
      );
    }

    // 1. Generate AI & Heuristic Tags
    const tags = await generateAutoTags(
      {
        title,
        text: text || title || url,
        platform,
        url,
        customTags,
      },
      geminiApiKey || req.headers.get('x-gemini-key') || undefined
    );

    // 2. Format Date
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const bookmarkId = `bm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const bookmarkItem: BookmarkItem = {
      id: bookmarkId,
      platform: (platform.toLowerCase() as PlatformType) || 'web',
      displayName: displayName || 'Creator',
      username: username ? (username.startsWith('@') ? username.slice(1) : username) : 'creator',
      avatarUrl: avatarUrl || undefined,
      imageUrl: imageUrl || undefined,
      title: title || undefined,
      text: text || title || url || 'Saved from Valut Extension',
      url: url || undefined,
      date: formattedDate,
      createdAt: Date.now(),
      tags,
      isFavorite: false,
      isArchived: false,
      note: note || undefined,
    };

    // 3. Save to Supabase if configured
    let savedToDatabase = false;
    if (isSupabaseConfigured && supabase) {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      const validUserId = (userId && typeof userId === 'string' && uuidRegex.test(userId)) ? userId : null;

      try {
        // Insert into bookmarks table
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
          console.error('Supabase bookmark insert error:', bmError);
        } else {
          savedToDatabase = true;

          // Upsert tags into tags table
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
            } catch (tagErr) {
              console.warn('Tag upsert warning:', tagErr);
            }
          }
        }
      } catch (dbErr) {
        console.error('Supabase execution error:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark saved successfully with AI tags',
        bookmark: bookmarkItem,
        tags,
        savedToDatabase,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error('Extension save API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
