import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, request) => {
  const url = request.nextUrl;
  const pathname = url.pathname;

  // Redirect Turkish characters in about-us path to standard URL path
  try {
    const decodedPath = decodeURIComponent(pathname);
    if (decodedPath === '/hakkımızda' || decodedPath === '/hakkımızda/') {
      return NextResponse.redirect(new URL('/hakkimizda', request.url));
    }
  } catch (e) {}

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Admin panel ve medya API'leri için cookie kontrolü (admin-login sayfası hariç)
  if ((pathname.startsWith('/admin') && pathname !== '/admin-login') || pathname.startsWith('/api/media')) {
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

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
