import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PRIVATE_ROUTES = ['/profile', '/favorites', '/my-recipes'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const isPrivate = PRIVATE_ROUTES.some(r => request.nextUrl.pathname.startsWith(r));

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/favorites/:path*', '/my-recipes/:path*'],
};