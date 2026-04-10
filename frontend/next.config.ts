import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output .next/ to repo root so Vercel can find it
  distDir: '../.next',

  // Configure remote image patterns for S3/CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
      },
    ],
  },
};

export default nextConfig;
