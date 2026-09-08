import { NextRequest, NextResponse } from 'next/server';
import {
  generateGeminiTags,
  detectPlatformFromUrl,
  scrapeUrlMetadata,
  fetchYouTubeTranscript,
  generateMediaSummary,
} from '@/lib/gemini-tagger';
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
      regenerateSummary = false,
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

    // If YouTube or Instagram and not yet summarized or user requested regeneration
    let updatedText = text;
    if (
      (platform === 'youtube' || platform === 'instagram') &&
      (!text || !text.includes('Takeaway') || text.length < 120 || regenerateSummary)
    ) {
      try {
        let transcriptToSummarize = text;
        if (platform === 'youtube') {
          const vidMatch = url?.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          if (vidMatch) {
            const fetched = await fetchYouTubeTranscript(vidMatch[1]);
            if (fetched && fetched.length > 25) {
              transcriptToSummarize = fetched;
            }
          }
        }

        if (transcriptToSummarize && transcriptToSummarize.length > 25) {
          const summary = await generateMediaSummary({
            platform,
            title: title || '',
            transcriptOrText: transcriptToSummarize,
            creator: displayName || username,
            apiKey,
          });

          if (summary && summary.length > 50) {
            updatedText = summary;
          }
        }
      } catch (sumErr) {
        console.warn('AI summary generation error in tag route:', sumErr);
      }
    }

    const result = await generateGeminiTags({
      platform,
      title: title || updatedText.slice(0, 80) || url,
      text: updatedText || title || url,
      displayName,
      username,
      apiKey,
    });

    const tags = result.tags || [];

    // If bookmark ID provided, update database
    let savedToDatabase = false;
    if (id && isSupabaseConfigured && supabase) {
      try {
        const updatePayload: Record<string, any> = {};
        if (tags.length > 0) updatePayload.tags = tags;
        if (updatedText && updatedText !== text) updatePayload.text = updatedText;

        const { error: updateErr } = await supabase
          .from('bookmarks')
          .update(updatePayload)
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
      text: updatedText,
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
