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
  const hasGeminiKey = Boolean(process.env.GEMINI_API_KEY);
  return NextResponse.json(
    {
      status: 'online',
      app: 'Valut - AI Bookmark Vault',
      version: '1.0.0',
      supabaseConnected: isSupabaseConfigured,
      geminiConfigured: hasGeminiKey,
      timestamp: Date.now(),
    },
    { headers: corsHeaders() }
  );
}
