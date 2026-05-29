import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@insforge/sdk', '@insforge/shared-schemas']
};

export default nextConfig;
