// src/middleware.ts
import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

/**
 * Combined Clerk middleware + custom admin‑token check.
 * Exported as default per Clerk's requirement.
 */
export default clerkMiddleware(async (auth, request) => {
  // Custom admin token validation for protected routes.
  const url = request.nextUrl;
  const isProtected = url.pathname.startsWith('/admin') || url.pathname.startsWith('/api/media');
  if (isProtected) {
    const token =
      request.headers.get('authorization')?.replace('Bearer ', '') ||
      request.cookies.get('admin-token')?.value;
    const expected = process.env.ADMIN_TOKEN;
    if (!expected || token !== expected) {
      return new NextResponse('Forbidden – invalid admin token', { status: 403 });
    }
  }
  // Let Clerk (or Next.js) continue.
  return NextResponse.next();
});

// Match all routes except static files, Next.js internals, etc.
// This ensures clerkMiddleware is invoked for page.tsx where auth() is called.
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
