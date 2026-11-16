/**
 * Las puertas de servicio del home (escena 02) llevan cada una un film corto
 * a sangre: primero el cine, después la interfaz. Acá vive el reloj de los
 * cuatro, que se hacen en Remotion.
 *
 * Un color por puerta (Mario, 16/11: «armonizar es transmitir»). Cada film
 * sale de un proyecto que destaca por su color, y ninguno se repite:
 *   01 webs      · azul    · L&B Elite Wash & Detail (caso real)
 *   02 agentes   · dorado  · la barbería de Oficio (demo guiada)
 *   03 sistemas  · verde   · te_Cargo (producto propio)
 *   04 contenido · coral   · Vespera (escenas generadas con IA)
 *
 * Hay un quinto film con el mismo criterio, el de «Campañas con IA». No es una
 * puerta del home: abre la portada de /campanas.
 *      campanas  · violeta · Truckers Choice (cine) y una cuenta de ejemplo
 *
 * Cada film son dos planos. El plano 0 trae XFADE cuadros de entrada que se
 * funden sobre el final del plano 1: así el video se repite sin salto.
 *
 *   plano 0: clip [XFADE, frames)            → cuadros [0, frames − XFADE)
 *   plano 1: clip [0, frames)                → desde frames₀ − 2·XFADE
 *   cola:    clip₀ [0, XFADE) fundiéndose    → últimos XFADE cuadros
 */

export const DOOR_FPS = 24;
/** 4:3: la puerta abierta mide entre 0,6 y 1,1 de ancho por alto, y se recorta a los costados. */
export const DOOR_SIZE = { width: 1200, height: 900 } as const;
export const DOOR_SOURCE = { width: 1280, height: 720 } as const;
export const XFADE = 8;

/**
 * Lo que se lee tiene que entrar en la columna central: en pantallas de 1024 px
 * la puerta abierta muestra solo el 43 % del ancho del film.
 */
export const SAFE = { x: 350, width: 500, top: 150, bottom: 470 } as const;

export const DOOR_IDS = ["webs", "agentes", "sistemas", "contenido", "campanas"] as const;
export type DoorId = (typeof DOOR_IDS)[number];

export interface DoorShot {
  /** Cuadros del clip en film-sources/puertas/<puerta>-<n>.mp4. */
  frames: number;
  /** Punto de la toma (0–1) que va a parar a `target`. */
  focal: readonly [number, number];
  /** Dónde cae ese punto en el film (0–1). El alto útil de la puerta es el 60 % de arriba. */
  target: readonly [number, number];
  zoom: number;
}

export interface DoorSpec {
  shots: readonly [DoorShot, DoorShot];
  /** Cuadro en el que entra la interfaz; antes es cine puro. */
  overlayFrom: number;
  /** Cuadro en el que la interfaz ya salió (antes del fundido de la cola). */
  overlayOut: number;
  /** Con texto en pantalla: una versión por idioma. */
  bilingual: boolean;
  /** Cuadro del póster: cine puro, es lo que se ve con la puerta cerrada. */
  poster: number;
  /** El color de la puerta: la línea y el avance en el sitio, y los acentos dentro del film. */
  tone: string;
  /** Un velo del color de la puerta sobre la toma, para que el tono se lea de lejos. */
  tint?: { color: string; strength: number };
  /** Baja la luz de una toma de día, para que pese lo mismo que las demás puertas. */
  shade?: number;
}

export const DOORS: Record<DoorId, DoorSpec> = {
  // L&B: el lavado con chorros, de corrido. Después, su web en una ventana.
  webs: {
    shots: [
      { frames: 68, focal: [0.5, 0.52], target: [0.5, 0.42], zoom: 1.12 },
      { frames: 140, focal: [0.5, 0.52], target: [0.5, 0.42], zoom: 1.12 },
    ],
    overlayFrom: 98,
    overlayOut: 182,
    bilingual: false,
    poster: 40,
    tone: "#3F8CFF",
  },
  // Barbería de Oficio: la navaja con vapor y el barbero ocupado. Mientras corta, el agente responde.
  agentes: {
    shots: [
      { frames: 68, focal: [0.55, 0.56], target: [0.5, 0.44], zoom: 1.16 },
      { frames: 140, focal: [0.6, 0.42], target: [0.5, 0.4], zoom: 1.06 },
    ],
    overlayFrom: 78,
    overlayOut: 182,
    bilingual: true,
    poster: 30,
    tone: "#E2A75A",
  },
  // te_Cargo: el auto cargando frente al viñedo y el cargador con su luz verde. La reserva se cobra sola.
  sistemas: {
    shots: [
      { frames: 68, focal: [0.5, 0.56], target: [0.5, 0.44], zoom: 1.1 },
      { frames: 140, focal: [0.62, 0.42], target: [0.56, 0.42], zoom: 1.04 },
    ],
    overlayFrom: 80,
    overlayOut: 182,
    bilingual: true,
    poster: 34,
    tone: "#C9ED4E",
    tint: { color: "#12804A", strength: 0.52 },
    shade: 0.2,
  },
  // Vespera: el avión que pasa y el campanario entre nubes rosadas. Una escena, cada formato.
  contenido: {
    shots: [
      { frames: 68, focal: [0.34, 0.42], target: [0.5, 0.4], zoom: 1.1 },
      { frames: 140, focal: [0.66, 0.44], target: [0.5, 0.36], zoom: 1.12 },
    ],
    overlayFrom: 80,
    overlayOut: 182,
    bilingual: false,
    poster: 66,
    tone: "#FF8F7A",
    tint: { color: "#FF5E62", strength: 0.34 },
  },
  // Truckers Choice: el camión al amanecer y la autopista de noche vista desde arriba. Una pregunta a la cuenta y una persona que decide.
  campanas: {
    shots: [
      { frames: 68, focal: [0.64, 0.6], target: [0.5, 0.46], zoom: 1.08 },
      { frames: 133, focal: [0.5, 0.5], target: [0.5, 0.42], zoom: 1.06 },
    ],
    overlayFrom: 68,
    overlayOut: 175,
    bilingual: true,
    poster: 34,
    tone: "#A98BFF",
    tint: { color: "#5B2BD6", strength: 0.42 },
  },
};

/** Cuadros totales del film de una puerta. */
export const doorFrames = (id: DoorId) => DOORS[id].shots[0].frames - 2 * XFADE + DOORS[id].shots[1].frames;

/** Cuadro en el que empieza el plano 1 (y su fundido sobre el plano 0). */
export const secondShotStart = (id: DoorId) => DOORS[id].shots[0].frames - 2 * XFADE;

/** La web de L&B dentro de la ventana: capturas a 1600×1000 en film-sources/puertas/. */
export const WEBS_UI = ["webs-ui-hero.jpg", "webs-ui-cotizador.jpg"] as const;
