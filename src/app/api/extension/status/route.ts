import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase';

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

export async function GET() {
  return NextResponse.json(
    {
      status: 'online',
      app: 'Valut - Bookmark Vault',
      version: '1.0.0',
      supabaseConnected: isSupabaseConfigured,
      timestamp: Date.now(),
    },
    { headers: corsHeaders() }
  );
}
