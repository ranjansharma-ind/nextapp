import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // Prevent face-api.js from using Node.js modules
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;

