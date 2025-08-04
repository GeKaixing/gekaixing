import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // 允许所有 https 域名
      },
      {
        protocol: "http",
        hostname: "**", // 允许所有 http 域名
      },
    ],
  },
};

export default nextConfig;
