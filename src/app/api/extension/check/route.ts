import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const targetUrl = searchParams.get('url')?.trim();
    const videoId = searchParams.get('videoId')?.trim();

    if (!targetUrl && !videoId) {
      return NextResponse.json({ isSaved: false }, { headers: corsHeaders() });
    }

    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ isSaved: false }, { headers: corsHeaders() });
    }

    const isValidVideoId = Boolean(videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId));
    const twitterStatusMatch = targetUrl ? targetUrl.match(/(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/i) : null;
    const twitterStatusId = twitterStatusMatch ? twitterStatusMatch[1] : null;

    let query = supabase.from('bookmarks').select('*').limit(1);

    if (isValidVideoId) {
      query = query.ilike('url', `%${videoId}%`);
    } else if (twitterStatusId) {
      query = query.ilike('url', `%status/${twitterStatusId}%`);
    } else if (targetUrl && targetUrl.length > 5) {
      const cleanUrl = targetUrl.split('?')[0].split('&ab_channel=')[0].split('&feature=')[0];
      query = query.or(`url.eq.${cleanUrl},url.eq.${targetUrl}`);
    } else {
      return NextResponse.json({ isSaved: false }, { headers: corsHeaders() });
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return NextResponse.json({ isSaved: false }, { headers: corsHeaders() });
    }

    return NextResponse.json(
      {
        isSaved: true,
        bookmark: data[0],
      },
      { headers: corsHeaders() }
    );
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Internal server error';
    console.error('Check bookmark API error:', err);
    return NextResponse.json(
      { error: errorMsg, isSaved: false },
      { status: 500, headers: corsHeaders() }
    );
  }
}
