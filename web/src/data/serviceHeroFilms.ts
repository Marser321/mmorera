import type { CaseReelSources } from "@/data/caseMedia";
import { getDoorFilm } from "@/data/doorFilms";
import { getProjectCase } from "@/data/projectCases";
import type { LocalizedText } from "@/types/site";

/**
 * El film de la portada de cada página de servicio. Antes abrían con texto y
 * media pantalla vacía; ahora quien entra por una puerta del home encuentra
 * del otro lado el mismo film y el mismo color.
 *
 * La página de contenido abre con el tráiler de Vespera, que es la pieza más
 * vistosa hecha con escenas generadas; el film de su puerta va más abajo, con
 * los otros tres. /campanas todavía no tiene film.
 */
export interface ServiceHeroFilm {
  reel: CaseReelSources;
  /** Los films de las puertas son 4:3 y el tráiler, 16:9. */
  ratio: "4 / 3" | "16 / 9";
  /** El color del servicio, el mismo de su puerta. */
  tone: string;
  /** Qué se está viendo, dicho tal cual. */
  caption: LocalizedText;
  /** El caso que se ve, si tiene página: el pie lleva a él. */
  caseSlug?: string;
}

export const SERVICE_HERO_PAGES = ["estudio", "agentes", "sistemas", "fabricas"] as const;
export type ServiceHeroPage = (typeof SERVICE_HERO_PAGES)[number];

/** La puerta del home que lleva a cada página. */
const DOOR_SERVICE: Record<Exclude<ServiceHeroPage, "fabricas">, string> = {
  estudio: "web-ecommerce",
  agentes: "booking-payments",
  sistemas: "crm-automation",
};

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;

export function getServiceHeroFilm(page: ServiceHeroPage, language: "es" | "en"): ServiceHeroFilm | undefined {
  if (page === "fabricas") {
    const trailer = getProjectCase("vespera")?.trailer;
    const tone = getDoorFilm("ai-software", language)?.tone;
    if (!trailer || !tone) return undefined;
    return {
      reel: trailer,
      ratio: "16 / 9",
      tone,
      caption: {
        es: `Tráiler de Vespera · ${clock(trailer.seconds)} · escenas generadas con IA`,
        en: `Vespera trailer · ${clock(trailer.seconds)} · AI-generated scenes`,
      },
      caseSlug: "vespera",
    };
  }
  const film = getDoorFilm(DOOR_SERVICE[page], language);
  if (!film) return undefined;
  return { reel: film, ratio: "4 / 3", tone: film.tone, caption: film.source, caseSlug: film.caseSlug };
}
