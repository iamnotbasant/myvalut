import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { userId } = body;

    if (isSupabaseConfigured && supabase) {
      if (userId && typeof userId === 'string') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(userId)) {
          await supabase.from('bookmarks').delete().eq('user_id', userId);
          await supabase.from('collections').delete().eq('user_id', userId);
          await supabase.from('tags').delete().eq('user_id', userId);
        }
      }
      // Wipe all remaining tags, collections, and bookmarks
      await supabase.from('bookmarks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('collections').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('tags').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }

    return NextResponse.json({ success: true, message: 'Vault data reset successfully' });
  } catch (err: any) {
    console.error('API vault reset error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
