import { NextRequest, NextResponse } from 'next/server';
import { generateAutoTags } from '@/lib/ai-tagger';

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
    const { title, text, platform = 'web', url, customTags = [], geminiApiKey, context, subreddit, headings, chapters } = body;

    const tags = await generateAutoTags(
      {
        title,
        text: text || title || url || '',
        platform,
        url,
        customTags,
        context,
        subreddit,
        headings,
        chapters,
      },
      geminiApiKey || req.headers.get('x-gemini-key') || undefined
    );

    return NextResponse.json({ success: true, tags }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI tags' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
