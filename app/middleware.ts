import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith('/admin/dashboard') || pathname.startsWith('/admin/picnics')) {
    const authCookie = request.cookies.get('adminAuth');
    
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard', '/admin/picnics/:path*'],
};
