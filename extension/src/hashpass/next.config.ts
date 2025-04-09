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

      // Enable async WebAssembly experiments
      config.experiments = {
        ...config.experiments,
        asyncWebAssembly: true,
      };

      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
  
      // Use asset/resource for .wasm files from argon2-browser
      config.module.rules.push({
        test: /\.wasm$/,
        include: /argon2-browser/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[hash][ext][query]',
        },
      });
    }

    return config;
  },

};

export default nextConfig;
