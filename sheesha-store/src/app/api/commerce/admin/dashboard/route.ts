import { NextResponse } from 'next/server';
import { getAdminDashboard } from '@/lib/server/commerce-store';
import { jsonError } from '@/app/api/commerce/_helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    void request;
    const dashboard = await getAdminDashboard();
    return NextResponse.json({ ok: true, ...dashboard });
  } catch (error) {
    return jsonError(error);
  }
}
