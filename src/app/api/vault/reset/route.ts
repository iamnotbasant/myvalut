import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId } = body;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Valid authenticated userId is required to reset vault data' },
        { status: 400 }
      );
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured && supabase) {
      // Strictly delete ONLY this user's data
      await supabase.from('bookmarks').delete().eq('user_id', userId);
      await supabase.from('collections').delete().eq('user_id', userId);
      await supabase.from('tags').delete().eq('user_id', userId);
    }

    return NextResponse.json({ success: true, message: 'Your vault data was reset successfully' });
  } catch (err: any) {
    console.error('API vault reset error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
