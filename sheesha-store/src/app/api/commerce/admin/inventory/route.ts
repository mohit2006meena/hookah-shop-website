import { NextResponse } from 'next/server';
import { getInventoryView, setInventoryStock } from '@/lib/server/commerce-store';
import { jsonError } from '@/app/api/commerce/_helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    void request;
    const inventory = await getInventoryView();
    return NextResponse.json({ ok: true, inventory });
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as {
      productId?: string;
      variantId?: string;
      stock?: number;
    };

    const updated = await setInventoryStock({
      productId: String(body.productId || ''),
      variantId: String(body.variantId || ''),
      stock: Number(body.stock)
    });

    return NextResponse.json({ ok: true, updated });
  } catch (error) {
    return jsonError(error);
  }
}
