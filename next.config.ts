import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Recommended for modern React apps
  swcMinify: true,       // Use SWC for faster builds
  output: undefined,     // Standard output, not static export
};

export default nextConfig;

