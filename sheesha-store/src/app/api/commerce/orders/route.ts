import { NextResponse } from 'next/server';
import { createOrder, findOrders } from '@/lib/server/commerce-store';
import { jsonError } from '@/app/api/commerce/_helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId') || undefined;
    const email = searchParams.get('email') || undefined;
    const phone = searchParams.get('phone') || undefined;
    const limit = Number(searchParams.get('limit') || 10);

    const orders = await findOrders({ orderId, email, phone, limit });
    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      lines: unknown;
      shippingMode: unknown;
      couponCode?: unknown;
      customer: unknown;
    };

    const result = await createOrder({
      lines: Array.isArray(body.lines) ? body.lines : [],
      shippingMode: String(body.shippingMode || 'standard') as 'standard' | 'express' | 'pickup',
      couponCode: typeof body.couponCode === 'string' ? body.couponCode : '',
      customer: (body.customer || {}) as never
    });

    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    return jsonError(error);
  }
}
