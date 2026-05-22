// src/middleware.ts
import { NextResponse } from 'next/server';
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Admin login ve super-admin sayfaları herkese açık olsun (giriş yapamazsınız aksi halde)
  if (
    pathname === '/admin-login' ||
    pathname === '/super-admin' ||
    pathname.startsWith('/api/admin-auth')
  ) {
    return NextResponse.next();
  }

  // Admin panel ve medya API'leri için cookie kontrolü
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/media')) {
    const superAdminSession = request.cookies.get('super-admin-session')?.value;
    const adminSession = request.cookies.get('admin-session')?.value;
    const superAdminToken = process.env.SUPER_ADMIN_TOKEN;

    const isSuperAdmin = superAdminSession && superAdminSession === superAdminToken;
    const isAdmin = !!adminSession;

    if (!isSuperAdmin && !isAdmin) {
      // API rotaları için 401 döndür
      if (pathname.startsWith('/api/')) {
        return new NextResponse('Unauthorized', { status: 401 });
      }
      // Sayfa rotaları için login'e yönlendir
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
