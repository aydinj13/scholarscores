import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'bbk12e1-cdn.myschoolcdn.com',
        },
      ],
    },
  }

export default nextConfig;
