import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const maxDuration = 300; // Allow enough time for video generation

export async function POST(req: NextRequest) {
  try {
    const { base64Data, mimeType, videoPrompt } = await req.json();

    if (!base64Data || !mimeType) {
      return NextResponse.json({ error: 'Missing required image fields' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: videoPrompt || undefined,
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
      return NextResponse.json({ error: 'Video generation failed or returned no uri' }, { status: 500 });
    }

    const videoResponse = await fetch(downloadLink, {
      headers: { 'x-goog-api-key': process.env.GEMINI_API_KEY as string }
    });

    if (!videoResponse.ok) {
        return NextResponse.json({ error: 'Failed to download video from Google API' }, { status: videoResponse.status });
    }

    // Proxy the video response stream to the client directly
    const headers = new Headers(videoResponse.headers);
    // Don't forward the api key if it was somehow in the response headers (unlikely, but safe)
    headers.delete('x-goog-api-key');
    // Ensure CORS headers if needed, though NextJS handles it if on same domain

    return new NextResponse(videoResponse.body, {
        status: 200,
        headers: {
            'Content-Type': videoResponse.headers.get('Content-Type') || 'video/mp4',
            'Content-Length': videoResponse.headers.get('Content-Length') || '',
            // Expose needed headers
            'Cache-Control': 'public, max-age=3600',
        }
    });

  } catch (error: any) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
