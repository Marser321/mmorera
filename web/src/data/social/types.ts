import type { Box } from "@/lib/filmLayout";

/**
 * Modelo de una pieza de redes (contenido/piezas/<id>/pieza.json). Puro, sin
 * React: lo leen el render, el validador y los agentes. Una pieza es la idea
 * del día ("pieza madre"); sus `salidas` son las versiones por plataforma.
 */

export type Rama = "casos" | "criterio" | "sistemas" | "oficio" | "comunidad";
export type Estado = "idea" | "borrador" | "listo" | "aprobado" | "publicado";
export type Plataforma = "linkedin" | "instagram" | "tiktok" | "shorts" | "x";
export type Formato = "reel" | "feed" | "cuadrado";
/** Blanco y negro: fondo negro con texto marfil, o al revés. */
export type Tono = "oscuro" | "claro";

export const RAMAS: Rama[] = ["casos", "criterio", "sistemas", "oficio", "comunidad"];
export const ESTADOS: Estado[] = ["idea", "borrador", "listo", "aprobado", "publicado"];
export const PLATAFORMAS: Plataforma[] = ["linkedin", "instagram", "tiktok", "shorts", "x"];

export const SOCIAL_FPS = 30;

export const SOCIAL_FORMATS: Record<Formato, { width: number; height: number }> = {
  reel: { width: 1080, height: 1920 },
  feed: { width: 1080, height: 1350 },
  cuadrado: { width: 1080, height: 1080 },
};

/**
 * Zona segura por formato. En 9:16 se deja libre lo que tapan Reels, TikTok
 * y Shorts: arriba la cabecera, abajo el texto y los botones, a la derecha la
 * columna de acciones.
 */
export function socialSafeArea(formato: Formato): Box {
  if (formato === "reel") return { x: 96, y: 250, w: 820, h: 1190 };
  if (formato === "feed") return { x: 96, y: 104, w: 888, h: 1142 };
  return { x: 88, y: 88, w: 904, h: 904 };
}

/** Duración máxima de un video por plataforma (segundos). */
export const DURACION_MAXIMA: Record<Plataforma, number> = {
  linkedin: 600,
  instagram: 90,
  tiktok: 180,
  shorts: 60,
  x: 140,
};

export type Diapositiva =
  | { tipo: "portada"; kicker?: string; titulo: string; bajada?: string }
  | { tipo: "texto"; kicker?: string; titulo: string; cuerpo: string }
  | { tipo: "lista"; kicker?: string; titulo: string; items: string[] }
  | { tipo: "cita"; kicker?: string; cita: string; autor?: string }
  | { tipo: "comparacion"; kicker?: string; titulo?: string; antes: { rotulo: string; texto: string }; despues: { rotulo: string; texto: string } }
  | { tipo: "imagen"; kicker?: string; imagen: string; titulo?: string; pie?: string }
  | { tipo: "cierre"; titulo: string; cta: string; enlace?: string }
  | { tipo: "tarjeta"; kicker?: string; texto: string }
  | { tipo: "encuesta"; pregunta: string; opciones: string[] }
  | { tipo: "sorteo"; premio: string; pasos: string[]; cierre: string; bases: string };

export type TipoDiapositiva = Diapositiva["tipo"];

/** Un pulso del reel de texto: una idea por pantalla. `*palabra*` se resalta. */
export type Pulso = { texto: string; kicker?: string };

type SalidaBase = { id: string; para: Plataforma[] };

export type Salida =
  | (SalidaBase & { plantilla: "carrusel"; formato: "feed" | "cuadrado"; tono?: Tono; diapositivas: Diapositiva[]; video?: boolean })
  | (SalidaBase & { plantilla: "imagen"; formato: Formato; tono?: Tono; diapositiva: Diapositiva })
  | (SalidaBase & { plantilla: "reel-texto"; tono?: Tono; gancho: string; pulsos: Pulso[]; remate: string; cta: string })
  | (SalidaBase & { plantilla: "reel-caso"; caso: string; gancho: string; decisiones: string[]; cierre: string })
  | (SalidaBase & {
      plantilla: "desafio";
      formato: "feed" | "cuadrado";
      tono?: Tono;
      titulo: string;
      contexto: string;
      problema: string;
      decision: string;
      resultado: string;
      aprendizaje: string;
      enlace?: string;
    });

export type Plantilla = Salida["plantilla"];

export type ImagenSlot = { slot: string; formato: Formato; prompt: string };

export type Pieza = {
  id: string;
  fecha: string;
  rama: Rama;
  serie?: string;
  titulo: string;
  estado: Estado;
  /** De dónde sale: un caso del sitio, una capacidad, el propio sitio o una experiencia de Mario. */
  fuente?: { tipo: "caso" | "capacidad" | "sitio" | "experiencia"; slug?: string; capitulo?: string; nota?: string };
  /** Muestra datos de ejemplo: alguna salida tiene que decirlo en pantalla. */
  ejemplo?: boolean;
  /** Es una opinión: Mario ajusta su postura antes de aprobar. */
  postura?: boolean;
  imagenes?: ImagenSlot[];
  salidas: Salida[];
  publicaciones?: Array<{ plataforma: Plataforma; url: string; fecha: string }>;
  historial?: Array<{ fecha: string; estado: Estado; quien: string; nota?: string }>;
};
