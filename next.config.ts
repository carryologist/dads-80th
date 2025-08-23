import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "media.vrbo.com" },
    ],
  },
};

export default nextConfig;
