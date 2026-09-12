import { NextRequest, NextResponse } from 'next/server';
import {
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
    } = body;

    let platform = customPlatform || (url ? detectPlatformFromUrl(url) : 'web');

    // 1. If metadata is sparse and URL is provided, scrape page
    if (url && (!title || !text || text.length < 20)) {
      try {
        const scraped = await scrapeUrlMetadata(url);
        title = title || scraped.title;
        text = text || scraped.text;
        displayName = displayName || scraped.displayName;
        username = username || scraped.username;
        platform = scraped.platform || platform;
      } catch (scrapeErr) {
        console.warn('[AI Summarize] Auto-scrape warning:', scrapeErr);
      }
    }

    // 2. Fetch transcript if YouTube video
    let transcriptOrText = text;
    if (platform === 'youtube' && url) {
      const vidMatch = url.match(/(?:watch\?v=|shorts\/|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (vidMatch) {
        try {
          const fetched = await fetchYouTubeTranscript(vidMatch[1]);
          if (fetched && fetched.length > 25) {
            transcriptOrText = fetched;
          }
        } catch (ytErr) {
          console.warn('[AI Summarize] YouTube transcript fetch warning:', ytErr);
        }
      }
    }

    const contentToSummarize = (transcriptOrText && transcriptOrText.trim().length >= 10)
      ? transcriptOrText.trim()
      : (title ? `${title}: ${text || ''}` : text).trim();

    if (!contentToSummarize || contentToSummarize.length < 8) {
      return NextResponse.json(
        { error: 'Not enough context or transcript to generate an AI summary' },
        { status: 400 }
      );
    }

    // 3. Generate Rich Post-Style AI Summary
    const summary = await generateMediaSummary({
      platform,
      title: title || '',
      transcriptOrText: contentToSummarize,
      creator: displayName || username || 'Creator',
      apiKey,
    });

    if (!summary || summary.length < 30) {
      return NextResponse.json(
        { error: 'Failed to generate comprehensive summary from AI' },
        { status: 502 }
      );
    }

    // 4. Update ONLY bookmark text in Supabase (tags are NEVER touched!)
    let savedToDatabase = false;
    if (id && isSupabaseConfigured && supabase) {
      try {
        const { error: updateErr } = await supabase
          .from('bookmarks')
          .update({ text: summary })
          .eq('id', id);

        if (!updateErr) {
          savedToDatabase = true;
        } else {
          console.warn('[AI Summarize] Database text update error:', updateErr);
        }
      } catch (dbErr) {
        console.warn('[AI Summarize] Database update exception:', dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      text: summary,
      bookmarkId: id,
      savedToDatabase,
    });
  } catch (error: any) {
    console.error('API /api/ai/summarize error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI summary' },
      { status: 500 }
    );
  }
}
