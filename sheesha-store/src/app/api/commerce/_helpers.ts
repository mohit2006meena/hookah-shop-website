import { NextResponse } from 'next/server';
import { CommerceError } from '@/lib/server/commerce-store';

export function jsonError(error: unknown) {
  if (error instanceof CommerceError) {
    return NextResponse.json(
      {
        ok: false,
        code: error.code,
        message: error.message,
        details: error.details
      },
      { status: error.status }
    );
  }

  const message = error instanceof Error ? error.message : 'Unexpected server error.';
  return NextResponse.json(
    {
      ok: false,
      code: 'SERVER_ERROR',
      message
    },
    { status: 500 }
  );
}
