import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for NextAuth token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const isValidToken = !!token;

  // Define which paths require authentication
  const protectedPaths = ['/', '/dashboard', '/admin', '/me'];
  const isProtectedPath = protectedPaths.some((path) => pathname === path || (pathname.startsWith(path) && path !== '/'));

  // If the user tries to access a protected path without a valid token, redirect to login
  if (isProtectedPath && !isValidToken) {
    const loginUrl = new URL('/login', request.url);
    // Optional: add a callback url parameter to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user has a valid token and tries to access the login or register page, redirect to home page
  if ((pathname === '/login' || pathname === '/register') && isValidToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
