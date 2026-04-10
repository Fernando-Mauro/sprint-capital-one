import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
