import { NextRequest, NextResponse } from 'next/server';
import { scrapeUrlMetadata, generateGeminiTags, detectPlatformFromUrl, ExtractedMetadata } from '@/lib/gemini-tagger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, text: rawText, platform: requestedPlatform, apiKey } = body;

    if (!url && !rawText) {
      return NextResponse.json(
        { error: 'Either a valid URL or text content is required' },
        { status: 400 }
      );
    }

    let metadata: ExtractedMetadata = {
      title: '',
      text: rawText || '',
      displayName: 'Creator',
      username: 'creator',
      avatarUrl: undefined,
      imageUrl: undefined,
      platform: (requestedPlatform || 'web') as any,
      url: url || '',
    };

    if (url) {
      metadata = await scrapeUrlMetadata(url);
      if (rawText && rawText.trim()) {
        metadata.text = rawText.trim() + ' ' + metadata.text;
      }
    }

    // Generate AI tags with Gemini JSON mode & normalizer
    const tagResult = await generateGeminiTags({
      platform: metadata.platform,
      title: metadata.title,
      text: metadata.text,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      data: {
        ...metadata,
        tags: tagResult.tags,
        aiDetails: tagResult.rawDetails,
      },
    });
  } catch (error: any) {
    console.error('API /api/ai/ingest error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to ingest URL with AI' },
      { status: 500 }
    );
  }
}
