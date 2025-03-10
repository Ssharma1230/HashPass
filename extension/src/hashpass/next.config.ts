import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'build',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,

  env: {
    // This ensures that NEXT_PUBLIC_API_BASE_URL is replaced at build time.
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },

  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude `ssh2` from the Webpack build for server-side code
      config.externals = [
        ...config.externals,
        'ssh2',  // Correctly add 'ssh2' to externals
      ];
    }

    return config;
  },

};

export default nextConfig;
