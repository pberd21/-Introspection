import { NextResponse } from 'next/server';

export function apiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (error.message === 'FORBIDDEN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    if (error.message === 'VERIFICATION_REQUIRED') return NextResponse.json({ error: 'Investor verification required' }, { status: 403 });
  }
  return NextResponse.json({ error: 'Request failed' }, { status: 400 });
}
