/**
 * Tráiler de Vespera (la demo de agencia de viajes): el vuelo de la portada
 * contado de corrido. La ventanilla, el avión entre nubes y la llegada a tres
 * ciudades, con el avión cenital como transición y un sello por destino.
 *
 * No lleva frases: los nombres van en su idioma (Venezia, Paris, Granada) y el
 * resto son códigos y números. Así un solo render sirve para español e inglés.
 *
 * Los clips son los de la demo (`viajes-demo/public/media/flow/v1`), de 144
 * cuadros a 24 por segundo y sin cuadros repetidos. Nunca se aceleran: cada
 * escena usa un tramo del clip, cuadro por cuadro.
 */

export const VESPERA_FPS = 24;
export const VESPERA_SIZE = { width: 1280, height: 720 } as const;
/** El reel de la tarjeta del caso va en 16:10, como los demás reels. */
export const VESPERA_REEL_SIZE = { width: 1280, height: 800 } as const;
export const CLIP_FRAMES = 144;
/** Cuadros que comparte una escena con la anterior, con fundido o con el avión. */
export const XFADE = 12;

export const CLIP_IDS = ["window", "airplane", "arr-venice", "venice", "arr-paris", "paris", "arr-granada", "granada"] as const;
export type ClipId = (typeof CLIP_IDS)[number];

export const CITY_IDS = ["venice", "paris", "granada"] as const;
export type CityId = (typeof CITY_IDS)[number];

/** Los datos del sello y de la tarjeta de cada destino, como en la demo. */
export const CITIES: Record<CityId, { name: string; code: string; country: string; coords: string; km: number }> = {
  venice: { name: "Venezia", code: "VCE", country: "IT", coords: "45.44° N · 12.34° E", km: 0 },
  paris: { name: "Paris", code: "PAR", country: "FR", coords: "48.86° N · 2.35° E", km: 843 },
  granada: { name: "Granada", code: "GRX", country: "ES", coords: "37.18° N · 3.60° W", km: 2228 },
};

export interface SceneCut {
  clip: ClipId;
  /** Primer cuadro del clip que se usa. */
  start: number;
  frames: number;
  /** Cómo entra: con fundido o detrás del avión cenital. */
  enter: "fade" | "plane";
  /** Acercamiento de principio a fin, con el mismo paso en cada cuadro. */
  zoom: readonly [number, number];
  /** La ciudad cuya tarjeta y sello se ven en esta escena. */
  city?: CityId;
}

const TRAILER_CUTS: SceneCut[] = [
  { clip: "window", start: 52, frames: 88, enter: "fade", zoom: [1, 1.03] },
  { clip: "airplane", start: 14, frames: 100, enter: "fade", zoom: [1.03, 1] },
  { clip: "arr-venice", start: 36, frames: 72, enter: "fade", zoom: [1, 1.04] },
  { clip: "venice", start: 24, frames: 102, enter: "fade", zoom: [1, 1.04], city: "venice" },
  { clip: "arr-paris", start: 40, frames: 60, enter: "plane", zoom: [1, 1.04] },
  { clip: "paris", start: 24, frames: 102, enter: "fade", zoom: [1, 1.04], city: "paris" },
  { clip: "arr-granada", start: 40, frames: 60, enter: "plane", zoom: [1, 1.04] },
  { clip: "granada", start: 24, frames: 102, enter: "fade", zoom: [1, 1.04], city: "granada" },
];

/** El reel: el avión, la llegada a Venecia y el canal con su sello. Seis segundos. */
const REEL_CUTS: SceneCut[] = [
  { clip: "airplane", start: 20, frames: 56, enter: "fade", zoom: [1.04, 1] },
  { clip: "arr-venice", start: 44, frames: 46, enter: "fade", zoom: [1, 1.03] },
  { clip: "venice", start: 24, frames: 66, enter: "fade", zoom: [1, 1.04], city: "venice" },
];

export interface Scene extends SceneCut {
  /** Cuadro del film en el que empieza. */
  from: number;
}

function place(cuts: SceneCut[]): Scene[] {
  let from = 0;
  return cuts.map((cut, index) => {
    if (index > 0) from += cuts[index - 1].frames - XFADE;
    return { ...cut, from };
  });
}

/** Cuadros del cierre del tráiler: el pasaje con los tres sellos. */
export const END_FRAMES = 66;

export const TRAILER_SCENES = place(TRAILER_CUTS);
export const REEL_SCENES = place(REEL_CUTS);

const lastFrame = (scenes: Scene[]) => scenes[scenes.length - 1].from + scenes[scenes.length - 1].frames;

/** El cierre entra con fundido sobre la última ciudad. */
export const END_FROM = lastFrame(TRAILER_SCENES) - XFADE;
export const TRAILER_FRAMES = END_FROM + END_FRAMES;
export const REEL_FRAMES = lastFrame(REEL_SCENES);

/**
 * El avión cenital cruza de abajo hacia arriba y descubre la escena que sigue
 * por detrás de sus alas. Empieza PLANE_LEAD cuadros antes que esa escena.
 */
export const PLANE = {
  /** Ancho en el film: las alas pasan de lado a lado. */
  width: 1500,
  /** Proporción de la imagen (plane-top.json de la demo). */
  ratio: 1960 / 1883,
  /** Por dónde pasa el corte, bajo el ala: en la raíz y en la punta (0–1 del alto). */
  seamRoot: 0.4294,
  seamTip: 0.5909,
  /** Punta del ala (0–1 del ancho, desde el centro). */
  wingTip: 0.4618,
  frames: 40,
  lead: 15,
} as const;

/** Cuadros de póster, de cine puro: el avión de perfil sobre las nubes. */
export const TRAILER_POSTER = 120;
export const REEL_POSTER = 14;
