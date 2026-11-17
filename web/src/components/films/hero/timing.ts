import { DOORS } from "@/components/films/puertas/timing";

/**
 * Hero de la home, «El equipo» (guion en docs/films/HERO-EQUIPO.md): llega un
 * pedido, cinco personajes discuten y buscan cada uno por su lado, una mano
 * los ordena y lo resuelven juntos.
 *
 * Este es el reloj del boceto animado, con muñecos provisorios: sirve para
 * aprobar la historia, el ritmo y el encuadre antes de generar imágenes y
 * video. El film final reemplaza los muñecos, no el reloj.
 */

export const HERO_FPS = 24;
/** Panorámico, como un diorama: el título va abajo a la izquierda y los personajes, del centro a la derecha. */
export const HERO_SIZE = { width: 1920, height: 820 } as const;
/** Altura de la mesa: donde pisan los personajes. */
export const TABLE_Y = 610;

export const BEATS = [
  { id: "pedido", from: 0, frames: 72, es: "Llega el pedido", en: "A request arrives" },
  { id: "discuten", from: 72, frames: 120, es: "Discuten", en: "They argue" },
  { id: "buscan", from: 192, frames: 96, es: "Cada uno busca por su lado", en: "Each one searches alone" },
  { id: "mano", from: 288, frames: 96, es: "La mano que ordena", en: "The hand that brings order" },
  { id: "juntos", from: 384, frames: 96, es: "Lo resuelven juntos", en: "They solve it together" },
  { id: "otro", from: 480, frames: 48, es: "Y llega otro pedido", en: "And another request arrives" },
] as const;

export const HERO_FRAMES = 528;

export type CastId = "plano" | "cable" | "voz" | "toma" | "lupa";

/**
 * Un personaje por servicio, con el color de su puerta. `home` es dónde
 * descansa y `slot`, su lugar en la fila cuando la mano los ordena.
 */
export const CAST: ReadonlyArray<{ id: CastId; name: string; service: string; color: string; home: number; slot: number }> = [
  { id: "plano", name: "Plano", service: "Webs y landings", color: DOORS.webs.tone, home: 900, slot: 1020 },
  { id: "cable", name: "Cable", service: "Automatización y CRM", color: DOORS.sistemas.tone, home: 1260, slot: 1150 },
  { id: "voz", name: "Voz", service: "Agentes de IA", color: DOORS.agentes.tone, home: 1080, slot: 1280 },
  { id: "toma", name: "Toma", service: "Contenido con IA", color: DOORS.contenido.tone, home: 1440, slot: 1410 },
  { id: "lupa", name: "Lupa", service: "Campañas con IA", color: DOORS.campanas.tone, home: 1620, slot: 1540 },
];

/** Dónde cae el pedido. */
export const PAPER_X = 1170;
/** Cuadro en el que el papel toca la mesa. */
export const PAPER_LANDS = 30;
/** La mano entra, golpea dos veces y después señala la fila de izquierda a derecha. */
export const HAND = { enters: 288, taps: [300, 310], sweepFrom: 324, sweepTo: 380, leaves: 394 } as const;
/** Cuadro en el que cada personaje salta a su lugar, cuando el dedo pasa por encima. */
export const PLACED: Record<CastId, number> = { plano: 322, cable: 334, voz: 346, toma: 358, lupa: 370 };
/** El papel pasa de mano en mano: cuadro en el que llega a cada uno. */
export const PASSES: Record<CastId, number> = { plano: 396, cable: 408, voz: 420, toma: 432, lupa: 444 };
/** El papel se levanta convertido en una ventanita encendida. */
export const CARD = { rises: 444, up: 458, fades: 480, gone: 500 } as const;
