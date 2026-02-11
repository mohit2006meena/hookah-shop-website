import { NextResponse } from 'next/server';
import { verifyOrderPayment } from '@/lib/server/commerce-store';
import { jsonError } from '@/app/api/commerce/_helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      orderId?: string;
      razorpayOrderId?: string;
      razorpayPaymentId?: string;
      razorpaySignature?: string;
    };

    const order = await verifyOrderPayment({
      orderId: String(body.orderId || ''),
      razorpayOrderId: String(body.razorpayOrderId || ''),
      razorpayPaymentId: String(body.razorpayPaymentId || ''),
      razorpaySignature: String(body.razorpaySignature || '')
    });

    return NextResponse.json({ ok: true, order });
  } catch (error) {
    return jsonError(error);
  }
}
