import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Lint runs separately via eslint CLI — skip during build
  eslint: {
    ignoreDuringBuilds: true,
  },
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
