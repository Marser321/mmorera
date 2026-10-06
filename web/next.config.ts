import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Herramientas internas (Radar/Backstage de contenido, portfolio-preview) viven
// en archivos `*.dev.tsx`: solo existen con `next dev`, nunca en el build público.
const PAGE_EXTENSIONS = ["tsx", "ts", "jsx", "js"];

const createConfig = (phase: string): NextConfig => ({
  pageExtensions: phase === PHASE_DEVELOPMENT_SERVER ? ["dev.tsx", ...PAGE_EXTENSIONS] : PAGE_EXTENSIONS,
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
});

export default createConfig;
