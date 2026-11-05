import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// Herramientas internas (Radar/Backstage de contenido, portfolio-preview) viven
// en archivos `*.dev.tsx`: solo existen con `next dev`, nunca en el build público.
const PAGE_EXTENSIONS = ["tsx", "ts", "jsx", "js"];

// Política de contenido. Las páginas son estáticas y Next escribe scripts en línea,
// así que no se pueden usar nonces y `script-src` necesita 'unsafe-inline'. Lo que
// sí frena: código y recursos de otros dominios, el secuestro del <base>, los
// formularios hacia afuera y que otra web meta el sitio en un marco. Los iframes
// son las demos de los casos, que viven en dominios de cada proyecto.
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "media-src 'self' blob:",
  "connect-src 'self'",
  "frame-src 'self' https:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CONTENT_SECURITY_POLICY },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

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
  // Solo en producción: `next dev` necesita eval y sockets para la recarga en caliente.
  async headers() {
    return phase === PHASE_DEVELOPMENT_SERVER ? [] : [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
  async redirects() {
    return [
      // El CV vive dentro de «Sobre mí», debajo de la película de autor (1/11).
      { source: "/cv", destination: "/sobre-mi#cv", permanent: false },
      { source: "/en/cv", destination: "/en/sobre-mi#cv", permanent: false },
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
