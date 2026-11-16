import type { CaseReelSources } from "@/data/caseMedia";
import { DOORS, type DoorId } from "@/components/films/puertas/timing";

/**
 * Films de las puertas de servicio del home (escena 02). Los genera
 * `npx tsx scripts/render-doors.ts` en public/portfolio/puertas/: cine a sangre
 * primero y la interfaz después, y un color por puerta.
 */
const DOOR_OF_SERVICE: Record<string, DoorId> = {
  "web-ecommerce": "webs",
  "booking-payments": "agentes",
  "crm-automation": "sistemas",
  "ai-software": "contenido",
};

export const DOOR_FILM_SERVICES = Object.keys(DOOR_OF_SERVICE);

/**
 * El caso del que sale el film de cada puerta: su rótulo enlaza a esa página.
 * La de agentes no lleva: muestra la demo guiada del propio sitio.
 */
const DOOR_CASE: Partial<Record<DoorId, string>> = {
  webs: "lb-elite-wash-detail",
  sistemas: "te-cargo",
  contenido: "vespera",
};

export interface DoorFilm extends CaseReelSources {
  /** El color de la puerta: su línea, su avance y su punto en la lista del teléfono. */
  tone: string;
  /** El caso que se ve en el film, si tiene página. */
  caseSlug?: string;
}

export function getDoorFilm(serviceId: string, language: "es" | "en"): DoorFilm | undefined {
  const door = DOOR_OF_SERVICE[serviceId];
  if (!door) return undefined;
  // Las que llevan texto tienen una versión por idioma; el póster es cine puro y sirve para las dos.
  const name = DOORS[door].bilingual ? `${door}-${language}` : door;
  return { mp4: `/portfolio/puertas/${name}.mp4`, webm: `/portfolio/puertas/${name}.webm`, poster: `/portfolio/puertas/${door}-poster.jpg`, tone: DOORS[door].tone, caseSlug: DOOR_CASE[door] };
}
