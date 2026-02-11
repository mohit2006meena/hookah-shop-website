import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ALLOWED_WITHOUT_AGE = [
  '/age-check',
  '/api/age/verify'
];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (ALLOWED_WITHOUT_AGE.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const ageCookie = request.cookies.get('age_verified')?.value;
  if (ageCookie === 'yes') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { ok: false, code: 'AGE_VERIFICATION_REQUIRED', message: 'Age verification is required.' },
      { status: 403 }
    );
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = '/age-check';
  redirectUrl.searchParams.set('next', `${pathname}${search}`);
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|robots.txt|sitemap.xml).*)'
  ]
};
