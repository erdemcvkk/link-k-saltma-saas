import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.clinkor.com' }],
        destination: 'https://clinkor.com/:path*',
        permanent: true,
      },
    ];
  },
  async headers() {
    // VERCEL_ENV: 'production' | 'preview' | 'development'
    // NODE_ENV is always 'production' on Vercel builds, so we must use VERCEL_ENV
    const vercelEnv = process.env.VERCEL_ENV;
    const isProd = vercelEnv === 'production' || (!vercelEnv && process.env.NODE_ENV === 'production');
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: isProd ? 'index, follow' : 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

