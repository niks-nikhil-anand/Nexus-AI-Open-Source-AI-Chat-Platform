import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_secret_key_for_development_only"
);

export async function middleware(request: NextRequest) {
  // Check for an auth token in cookies
  const authToken = request.cookies.get('authToken')?.value;
  const { pathname } = request.nextUrl;

  // Define which paths require authentication
  const protectedPaths = ['/dashboard', '/admin', '/me'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));

  let isValidToken = false;

  if (authToken) {
    try {
      await jwtVerify(authToken, secret);
      isValidToken = true;
    } catch (error) {
      console.error("JWT Verification failed:", error);
    }
  }

  // If the user tries to access a protected path without a valid token, redirect to login
  if (isProtectedPath && !isValidToken) {
    const loginUrl = new URL('/login', request.url);
    // Optional: add a callback url parameter to redirect back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If the user has a valid token and tries to access the login or register page, redirect to dashboard
  if ((pathname === '/login' || pathname === '/register') && isValidToken) {
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
