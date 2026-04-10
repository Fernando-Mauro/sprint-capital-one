'use client';

interface UseUploadReturn {
  uploading: boolean;
  error: string | null;
  upload: (file: File, type: 'avatar' | 'match_photo') => Promise<string | null>;
}

export function useUpload(): UseUploadReturn {
  // TODO: Implement file upload flow (request presigned URL, upload to S3, return key)
  const upload = async (
    _file: File,
    _type: 'avatar' | 'match_photo',
  ): Promise<string | null> => {
    // TODO: Request presigned URL from /api/upload, upload file, return S3 key
    return null;
  };

  return {
    uploading: false,
    error: null,
    upload,
  };
}
