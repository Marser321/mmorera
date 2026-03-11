import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/gemini-live')) {
    const newUrl = request.nextUrl.clone();
    newUrl.searchParams.delete('key');
    newUrl.searchParams.set('key', process.env.GEMINI_API_KEY as string);
    return NextResponse.rewrite(newUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/api/gemini-live/:path*',
};