import { NextResponse } from 'next/server';

export async function GET(_request: Request): Promise<NextResponse> {
  // TODO: Authenticate user, parse query params for filters, call getMatches service
  return NextResponse.json(
    { error: 'Not implemented', code: 'NOT_IMPLEMENTED' },
    { status: 501 },
  );
}

export async function POST(_request: Request): Promise<NextResponse> {
  // TODO: Authenticate user, validate body with Zod, call createMatch service
  return NextResponse.json(
    { error: 'Not implemented', code: 'NOT_IMPLEMENTED' },
    { status: 501 },
  );
}
