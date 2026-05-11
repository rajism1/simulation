import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  allowedDevOrigins: ["localhost", "127.0.0.1", "192.168.1.9"]
};

export default nextConfig;
