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
/** Pared y marfil: fondo pared (#0B0B0A) con texto marfil (#ECE7DD), o al revés. */
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

/**
 * `fondo` (portada, tarjeta, cita y cierre) nombra un slot de `Pieza.imagenes`:
 * arte sin letras de ChatGPT (versión A) que va de fondo a sangre, con velo y
 * grano compartido para que el texto quede integrado. El arte se guarda en
 * imagenes/<slot>.png y deja libre la zona donde va el texto.
 *
 * `mosaico` (solo portada, formato feed): la portada es una de las nueve del
 * feed que arman el monograma (data/social/mosaico.ts). Lleva solo rótulo y
 * título corto, sale siempre del código y le da su luz al resto del carrusel.
 */
export type Diapositiva =
  | { tipo: "portada"; kicker?: string; titulo: string; bajada?: string; fondo?: string; mosaico?: { celda: number } }
  | { tipo: "texto"; kicker?: string; titulo: string; cuerpo: string }
  | { tipo: "lista"; kicker?: string; titulo: string; items: string[] }
  | { tipo: "cita"; kicker?: string; cita: string; autor?: string; fondo?: string }
  | { tipo: "comparacion"; kicker?: string; titulo?: string; antes: { rotulo: string; texto: string }; despues: { rotulo: string; texto: string } }
  | { tipo: "imagen"; kicker?: string; imagen: string; titulo?: string; pie?: string }
  | { tipo: "cierre"; titulo: string; cta: string; enlace?: string; fondo?: string }
  | { tipo: "tarjeta"; kicker?: string; texto: string; fondo?: string }
  | { tipo: "encuesta"; pregunta: string; opciones: string[] }
  | { tipo: "sorteo"; premio: string; pasos: string[]; cierre: string; bases: string };

export type TipoDiapositiva = Diapositiva["tipo"];

/** Tipos de diapositiva que aceptan un arte de fondo. */
export const CON_FONDO: TipoDiapositiva[] = ["portada", "tarjeta", "cita", "cierre"];

/** Slot del arte de fondo de una diapositiva, si lo tiene. */
export const fondoDe = (slide: Diapositiva): string | undefined => ("fondo" in slide && slide.fondo ? slide.fondo : undefined);

/** Un pulso del reel de texto: una idea por pantalla. `*palabra*` se resalta. */
export type Pulso = { texto: string; kicker?: string };

type SalidaBase = { id: string; para: Plataforma[] };

/**
 * Quién diseña las piezas estáticas (carrusel, desafío, imagen): ChatGPT, con
 * el sistema de diseño de contenido/marca/chatgpt-diseno.md y el código como
 * respaldo (por defecto), o solo el código.
 */
export type Generador = "chatgpt" | "codigo";
type Estatica = { generador?: Generador };

export type Salida =
  | (SalidaBase & Estatica & { plantilla: "carrusel"; formato: "feed" | "cuadrado"; tono?: Tono; diapositivas: Diapositiva[]; video?: boolean })
  | (SalidaBase & Estatica & { plantilla: "imagen"; formato: Formato; tono?: Tono; diapositiva: Diapositiva })
  | (SalidaBase & { plantilla: "reel-texto"; tono?: Tono; gancho: string; pulsos: Pulso[]; remate: string; cta: string })
  | (SalidaBase & { plantilla: "reel-caso"; caso: string; gancho: string; decisiones: string[]; cierre: string })
  | (SalidaBase &
      Estatica & {
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

/**
 * Luz de una pieza: el único color que puede llevar, y solo como luz fina (el
 * punto del rótulo, el filo del arco, el punto del hilo). Son los tres colores
 * del sitio. Sin `luz`, la pieza va en pared y marfil, sin color.
 */
export const LUCES = { violeta: "#B68CFF", azul: "#55D8FF", verde: "#71F3A2" } as const;
export type Luz = keyof typeof LUCES;

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
  /** Color de luz de la pieza (ver LUCES). Un carrusel que abre con una portada de mosaico toma el de su celda. */
  luz?: Luz;
  salidas: Salida[];
  publicaciones?: Array<{ plataforma: Plataforma; url: string; fecha: string }>;
  historial?: Array<{ fecha: string; estado: Estado; quien: string; nota?: string }>;
};
