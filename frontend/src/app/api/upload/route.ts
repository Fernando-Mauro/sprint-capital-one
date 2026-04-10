import { NextResponse } from 'next/server';

export async function POST(_request: Request): Promise<NextResponse> {
  // TODO: Authenticate user, validate content type & size, generate S3 presigned URL
  return NextResponse.json({ error: 'Not implemented', code: 'NOT_IMPLEMENTED' }, { status: 501 });
}
