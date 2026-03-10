import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const { base64Data, mimeType, editPrompt } = await req.json();

    if (!base64Data || !mimeType || !editPrompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: editPrompt }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return NextResponse.json({ image: part.inlineData.data });
      }
    }

    return NextResponse.json({ error: 'Failed to edit image data' }, { status: 500 });
  } catch (error: any) {
    console.error('Error editing image:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
