import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@insforge/sdk', '@insforge/shared-schemas'],
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    contentDispositionType: 'inline',
    // AppleDouble sidecars on external macOS volumes can poison Next's disk
    // image cache. Native browser loading keeps local media reliable and lazy.
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/casos-de-exito/booking-barberia",
        destination: "/casos-de-exito/new-brothers-barberia",
        permanent: true,
      },
      {
        source: "/en/casos-de-exito/booking-barberia",
        destination: "/en/casos-de-exito/new-brothers-barberia",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
