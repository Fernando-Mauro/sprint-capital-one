import { NextResponse } from 'next/server';

export async function POST(_request: Request): Promise<NextResponse> {
  // TODO: Verify webhook signature, process Supabase event payload
  return NextResponse.json({ error: 'Not implemented', code: 'NOT_IMPLEMENTED' }, { status: 501 });
}
