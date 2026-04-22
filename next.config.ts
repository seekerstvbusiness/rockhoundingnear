import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lidnfpafqcrhtmcgxkbi.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: '*.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.unsplash.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/locations/:state/:city/:slug',
        destination: '/locations/:state',
        permanent: true,
      },
      {
        source: '/locations/:state/:city',
        destination: '/locations/:state',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
