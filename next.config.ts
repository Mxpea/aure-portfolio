import type { NextConfig } from "next";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["47.105.123.24"],
  devIndicators: false
};

export default nextConfig;