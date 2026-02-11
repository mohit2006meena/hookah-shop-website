import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { eligible?: boolean };
  const eligible = Boolean(body.eligible);
  const forwardedProto = request.headers.get('x-forwarded-proto');
  const isSecure = forwardedProto === 'https' || request.url.startsWith('https://');

  const response = NextResponse.json({ ok: true, eligible });
  response.cookies.set('age_verified', eligible ? 'yes' : 'no', {
    path: '/',
    httpOnly: false,
    sameSite: 'lax',
    secure: isSecure,
    maxAge: eligible ? 60 * 60 * 24 * 180 : 60 * 60 * 24
  });

  return response;
}
