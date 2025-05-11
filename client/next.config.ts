import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['example.com'], // Add any other domains you use here
  },
  devIndicators: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Enable polling for file changes in Docker
      config.watchOptions = {
        poll: 1000,  // Check for changes every second
        aggregateTimeout: 300,  // Delay before rebuilding
      };
    }
    return config;
  },
  // Alternative method (works alongside webpack config)
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ["tailwindcss"],
  },
};

export default nextConfig;