import type { ServiceResult } from '@/types';

export async function generatePresignedUrl(
  _key: string,
  _contentType: string,
): Promise<ServiceResult<{ url: string }>> {
  // TODO: Generate S3 presigned PUT URL with 5 min TTL
  return { data: null, error: 'Not implemented' };
}

export async function deleteFile(_key: string): Promise<ServiceResult<null>> {
  // TODO: Delete file from S3 bucket
  return { data: null, error: 'Not implemented' };
}

export async function getPublicUrl(_key: string): Promise<ServiceResult<{ url: string }>> {
  // TODO: Return CDN/public URL for the given S3 key
  return { data: null, error: 'Not implemented' };
}
