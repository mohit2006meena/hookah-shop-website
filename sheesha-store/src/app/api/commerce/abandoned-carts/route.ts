import { NextResponse } from 'next/server';
import { captureAbandonedCart } from '@/lib/server/commerce-store';
import { jsonError } from '@/app/api/commerce/_helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      phone?: string;
      lines: unknown;
      shippingMode: unknown;
      couponCode?: unknown;
      total?: unknown;
    };

    await captureAbandonedCart({
      fullName: typeof body.fullName === 'string' ? body.fullName : '',
      email: typeof body.email === 'string' ? body.email : '',
      phone: typeof body.phone === 'string' ? body.phone : '',
      lines: Array.isArray(body.lines) ? body.lines : [],
      shippingMode: String(body.shippingMode || 'standard') as 'standard' | 'express' | 'pickup',
      couponCode: typeof body.couponCode === 'string' ? body.couponCode : '',
      total: typeof body.total === 'number' ? body.total : undefined
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return jsonError(error);
  }
}
