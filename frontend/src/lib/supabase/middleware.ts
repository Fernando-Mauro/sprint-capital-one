import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function updateSession(
  _request: NextRequest,
): Promise<NextResponse> {
  // TODO: Create Supabase server client with request/response cookies,
  // refresh session, and return updated response
  return NextResponse.next();
}
