import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { apiKey } = body;

    const keyToTest =
      apiKey?.trim() ||
      process.env.GEMINI_API_KEY?.trim() ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim();

    if (!keyToTest) {
      return NextResponse.json(
        { success: false, error: 'No API key provided' },
        { status: 400 }
      );
    }

    // Ping Gemini endpoint with a tiny prompt
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${keyToTest}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with JSON: {"status":"ok"}' }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (res.ok) {
      return NextResponse.json({
        success: true,
        message: 'Gemini API Key is valid and connected!',
        model: 'gemini-flash-latest',
      });
    }

    // Try gemini-3.6-flash
    const fallbackEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${keyToTest}`;
    const fallbackRes = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Respond with JSON: {"status":"ok"}' }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    });

    if (fallbackRes.ok) {
      return NextResponse.json({
        success: true,
        message: 'Gemini API Key is valid and connected!',
        model: 'gemini-3.6-flash',
      });
    }

    const errText = await fallbackRes.text();
    let parsedErr = 'Invalid API key or quota exceeded';
    try {
      const errJson = JSON.parse(errText);
      if (errJson.error?.message) {
        parsedErr = errJson.error.message;
      }
    } catch {}

    return NextResponse.json(
      { success: false, error: parsedErr },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Connection test failed' },
      { status: 500 }
    );
  }
}
