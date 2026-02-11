import { NextResponse } from 'next/server';
import { getOrderById } from '@/lib/server/commerce-store';
import { jsonError } from '@/app/api/commerce/_helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  context: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await context.params;
    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ ok: false, code: 'ORDER_NOT_FOUND', message: 'Order not found.' }, { status: 404 });
    }

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return jsonError(error);
  }
}
