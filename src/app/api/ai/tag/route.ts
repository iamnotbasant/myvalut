import { NextRequest, NextResponse } from 'next/server';
import { generateGeminiTags, detectPlatformFromUrl } from '@/lib/gemini-tagger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url = '', text = '', platform: customPlatform, title = '', apiKey } = body;

    const platform = customPlatform || (url ? detectPlatformFromUrl(url) : 'web');

    const result = await generateGeminiTags({
      platform,
      title: title || text.slice(0, 80),
      text: text || title || url,
      apiKey,
    });

    return NextResponse.json({
      success: true,
      tags: result.tags,
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
