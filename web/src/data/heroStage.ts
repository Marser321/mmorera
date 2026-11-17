import type { CaseReelSources } from "@/data/caseMedia";
import type { LocalizedText } from "@/types/site";

/**
 * Escenario del hero: cada tecnología y en qué se convierte.
 *
 * Las partículas dibujan primero el logo de la tecnología, como siempre, y
 * después se transforman en el marco de una ventana chica que muestra algo
 * hecho con ella. Un par por servicio del home, con el color de su puerta.
 *
 * Los clips son cortes de seis segundos de cinemáticas que ya están en el
 * sitio, elegidos para no repetir los films de las puertas de Servicios, que
 * quedan justo debajo. Viven en public/portfolio/hero/.
 */
export interface HeroStagePair {
  id: string;
  /** Nombre de la tecnología tal como figura en TECH_STACK: es el logo que dibujan las partículas. */
  tech: string;
  /** El servicio del home que se enciende mientras se ve este par. */
  serviceId: string;
  /** En qué se convierte la tecnología, dicho corto. */
  becomes: LocalizedText;
  /** Qué se ve en la ventana, dicho tal cual. */
  source: LocalizedText;
  /** A dónde lleva el rótulo de la ventana. */
  href: string;
  tone: string;
  reel: Record<"es" | "en", CaseReelSources>;
}

const clip = (name: string): CaseReelSources => ({ mp4: `/portfolio/hero/${name}.mp4`, webm: `/portfolio/hero/${name}.webm`, poster: `/portfolio/hero/${name}-poster.jpg` });
const same = (name: string) => ({ es: clip(name), en: clip(name) });

export const HERO_STAGE_PAIRS: HeroStagePair[] = [
  {
    id: "nextjs",
    tech: "Next.js",
    serviceId: "web-ecommerce",
    becomes: { es: "una web que vende", en: "a website that sells" },
    source: { es: "Caso real · Rangel Oviedo Group", en: "Real case · Rangel Oviedo Group" },
    href: "/casos-de-exito/rangel-oviedo-group",
    tone: "#3F8CFF",
    reel: same("nextjs"),
  },
  {
    id: "ia",
    tech: "Multi-model AI",
    serviceId: "booking-payments",
    becomes: { es: "un asistente dentro de tu sistema", en: "an assistant inside your system" },
    source: { es: "Producto propio · Oficio", en: "Own product · Oficio" },
    href: "/casos-de-exito/oficio",
    tone: "#E2A75A",
    reel: same("ia"),
  },
  {
    id: "ghl",
    tech: "GoHighLevel",
    serviceId: "crm-automation",
    becomes: { es: "un CRM que hace el seguimiento", en: "a CRM that does the follow-up" },
    source: { es: "Caso real · Fenix Medical Center", en: "Real case · Fenix Medical Center" },
    href: "/casos-de-exito/fenix-medical-center",
    tone: "#C9ED4E",
    reel: same("ghl"),
  },
  {
    id: "gemini",
    tech: "Google Gemini",
    serviceId: "ai-software",
    becomes: { es: "video y piezas con tu voz", en: "video and pieces in your voice" },
    source: { es: "Film propio · fábrica de contenido", en: "Own film · content factory" },
    href: "/fabricas",
    tone: "#FF8F7A",
    // El film lleva texto: tiene un corte por idioma.
    reel: { es: clip("gemini"), en: clip("gemini-en") },
  },
];

/**
 * Cuánto dura cada paso: el logo en partículas y después la ventana con su film.
 * `reveal` es lo que espera la ventana a que el logo se rompa y arme su marco;
 * recién ahí aparece y arranca el film, que así no llega a dar la vuelta.
 */
export const HERO_STAGE_MS = { logo: 3600, film: 6200, reveal: 650 } as const;

/** Largo de los clips del escenario. */
export const HERO_STAGE_CLIP_MS = 6000;
