import type { NextConfig } from "next";

// 本地服务器 SSL 证书问题，Cloudflare 部署时可移除
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["47.105.123.24"],
  devIndicators: false
};

export default nextConfig;
import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
