import { safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { FENIX_ASSETS } from "@/data/films/flagships/fenix";

/**
 * Datos de ejemplo de las escenas de medios (puro): los usan las demos del
 * laboratorio y los tests de geometría, así se verifica exactamente lo que se
 * ve. Los medios son los reales de cada marca, con su medida nativa; los
 * textos son de ejemplo y las demos los rotulan como tales.
 */

export const MEDIA_ASSETS = {
  corridor: FENIX_ASSETS.corridor,
  corridorPoster: FENIX_ASSETS.corridorPoster.src,
  chamber: FENIX_ASSETS.chamber,
  chamberPoster: FENIX_ASSETS.chamberPoster.src,
  plasma: FENIX_ASSETS.mechanismPlasma,
  diffusion: FENIX_ASSETS.mechanismDiffusion,
  angiogenesis: FENIX_ASSETS.mechanismAngiogenesis,
  bookingDay: FENIX_ASSETS.bookingDay,
  bookingTime: FENIX_ASSETS.bookingTime,
  bookingDetails: FENIX_ASSETS.bookingDetails,
  siteHbot: FENIX_ASSETS.siteHbot,
  adReel: { src: "/portfolio/reels/ad-media-solution.mp4", w: 1280, h: 800, fps: 30, seconds: 6.2 },
  adReelPoster: "/portfolio/reels/ad-media-solution-poster.jpg",
} as const;

export const MEDIA_SAMPLE_LABEL = { es: "Datos de ejemplo", en: "Sample data" } as const;

export type MediaLanguage = keyof typeof MEDIA_SAMPLE_LABEL;

export type MediaSample = {
  plateCaption: { kicker?: string; text: string };
  beats: Array<{ kicker?: string; text: string }>;
  formula: { kicker?: string; text: string };
  mechanism: Array<{ title: string; body?: string }>;
  steps: string[];
  phoneSteps: string[];
};

export const MEDIA_SAMPLES: Record<MediaLanguage, MediaSample> = {
  es: {
    plateCaption: { kicker: "La llegada", text: "La consulta empieza antes de entrar." },
    beats: [
      { kicker: "El titular", text: "Tu médico de cabecera, que también conoce tu *plan de longevidad*." },
      { kicker: "La ética", text: "Normal es un rango.\nTu salud necesita *contexto*." },
      { kicker: "La confianza", text: "Precios claros y un sitio en tu idioma." },
      { text: "El compliance define la *tecnología*." },
    ],
    formula: { kicker: "Ley de Henry", text: "Bajo presión, el oxígeno se disuelve en el *plasma*." },
    mechanism: [
      { title: "Plasma saturado", body: "Bajo presión, el oxígeno también viaja disuelto en el plasma." },
      { title: "Difusión en el tejido", body: "El oxígeno disuelto se difunde hacia el tejido que rodea al vaso." },
      { title: "Angiogénesis", body: "Se estudia su papel en la formación de nuevos vasos." },
    ],
    steps: ["Día", "Hora", "Tus datos"],
    phoneSteps: ["Elegí el día", "Elegí la hora", "Tus datos"],
  },
  en: {
    plateCaption: { kicker: "Arrival", text: "The visit begins before you walk in." },
    beats: [
      { kicker: "The headline", text: "Your family doctor, who also knows your *longevity plan*." },
      { kicker: "The ethics", text: "Normal is a range.\nYour health needs *context*." },
      { kicker: "The trust", text: "Clear prices and a site in your language." },
      { text: "Compliance shapes the *technology*." },
    ],
    formula: { kicker: "Henry's law", text: "Under pressure, oxygen dissolves into *plasma*." },
    mechanism: [
      { title: "Saturated plasma", body: "Under pressure, oxygen also travels dissolved in the plasma." },
      { title: "Tissue diffusion", body: "Dissolved oxygen diffuses into the tissue around the vessel." },
      { title: "Angiogenesis", body: "Its role in forming new vessels is being studied." },
    ],
    steps: ["Day", "Time", "Your details"],
    phoneSteps: ["Pick a day", "Pick a time", "Your details"],
  },
};

/** Rutas reales que muestran las barras de los navegadores de ejemplo. */
export const MEDIA_URLS = {
  fenix: { host: "fenixmedicalcenters.com", path: "/tratamientos/camara-hiperbarica" },
  adMedia: { host: "admediasolution.vercel.app", path: "/" },
} as const;

/** Caja de las demos: la zona útil menos una banda al pie para el rótulo "Datos de ejemplo". */
export function mediaDemoFrame(format: FilmFormatName) {
  const safe = safeArea(format);
  const badgeH = format === "portrait" ? 40 : 32;
  const gap = format === "portrait" ? 24 : 18;
  return {
    box: { ...safe, h: safe.h - badgeH - gap } as Box,
    badge: { left: safe.x, top: safe.y + safe.h - badgeH, fontSize: format === "portrait" ? 19 : 14 },
  };
}

/**
 * Cajas con las que se prueba cada escena: la zona útil entera, la de la
 * demo y una más baja (como cuando el film pone un título arriba).
 */
export function mediaTestBoxes(format: FilmFormatName): Box[] {
  const safe = safeArea(format);
  const titled = format === "portrait" ? 300 : 170;
  return [safe, mediaDemoFrame(format).box, { ...safe, y: safe.y + titled, h: safe.h - titled }];
}
