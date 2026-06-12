import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check for an auth token in cookies (simulated authentication state)
  const authToken = request.cookies.get('authToken');
  const { pathname } = request.nextUrl;

  // Define which paths require authentication
  const protectedPaths = ['/dashboard', '/admin', '/me'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  // If the user tries to access a protected path without a token, redirect to login
  if (isProtectedPath && !authToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If the user is logged in and tries to access the login page, redirect to dashboard
  if (pathname === '/login' && authToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
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
