import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "github.com",
      "raw.githubusercontent.com",
    ],
  },
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features you want to use
  },
};

export default nextConfig;
