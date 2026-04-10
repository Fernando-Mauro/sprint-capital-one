import { describe, it, expect } from '@jest/globals';

describe('Upload Service', () => {
  it('test runner works', () => {
    expect(true).toBe(true);
  });

  it.todo('should generate a presigned URL for uploading');

  it.todo('should delete a file from S3');

  it.todo('should return a public URL for a given S3 key');
});
