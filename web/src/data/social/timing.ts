import { plain } from "./layout";
import { SOCIAL_FPS, type Diapositiva, type Salida, type Tono } from "./types";

/**
 * Ritmo de los reels: cada pulso dura lo justo para leerse y corta al
 * siguiente con una transición distinta (golpe, barrido, flash, zoom); el
 * gancho y el remate se sostienen un poco más. Puro: lo usan las
 * composiciones, el render y el validador (duraciones por plataforma).
 */

export const frames = (seconds: number) => Math.round(seconds * SOCIAL_FPS);

const wordCount = (text: string) => plain(text).split(/\s+/).filter(Boolean).length;

/** Segundos de lectura de una frase: 1 s + 0,24 s por palabra, entre 1,4 y 3,4 s. */
export function beatSeconds(text: string, extra = 0) {
  return Math.min(3.4, Math.max(1.4, 1 + 0.24 * wordCount(text))) + extra;
}

export const FIRMA_SECONDS = 3;
export const SLIDE_SECONDS = 3.6;
/** Duración de la animación de entrada de una diapositiva (el cuadro fijo es el último). */
export const SLIDE_STILL_FRAMES = frames(3.2);

export const invert = (tono: Tono): Tono => (tono === "oscuro" ? "claro" : "oscuro");

/**
 * Ritmo del carrusel: la portada en el tono base y, desde ahí, cada
 * diapositiva alterna blanco y negro (el cierre también). Cada deslizada
 * cambia la luz.
 */
export function tonoDeDiapositiva(slide: Diapositiva, index: number, tono: Tono): Tono {
  if (slide.tipo === "portada") return tono;
  return index % 2 === 1 ? invert(tono) : tono;
}


export type Transicion = "golpe" | "barrido" | "flash" | "zoom";
const CICLO: Transicion[] = ["golpe", "barrido", "zoom", "golpe", "barrido", "flash"];

/**
 * La palabra que hace de eco gigante detrás del pulso: un número si lo hay;
 * si no, el primer énfasis; si no, la palabra más larga.
 */
export function ecoDe(text: string) {
  const number = plain(text).match(/\d[\d.:]*/);
  if (number) return number[0].replace(/[.:]$/, "");
  const enfasis = text.match(/\*([^*]+)\*/);
  const pool = (enfasis ? enfasis[1] : plain(text)).split(/\s+/).map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""));
  return pool.reduce((best, word) => (word.length > best.length ? word : best), "");
}

export type Beat = {
  id: string;
  rol: "gancho" | "pulso" | "remate" | "decision" | "firma";
  texto: string;
  kicker?: string;
  tono: Tono;
  /** Cómo entra este pulso (el corte desde el anterior). */
  transicion: Transicion;
  /** Palabra o número gigante de fondo. */
  eco: string;
  /** Reel de caso: qué cuadro del film va en la placa. */
  placa?: "og" | "hero";
  from: number;
  duration: number;
};

function place(beats: Array<Omit<Beat, "from" | "duration" | "transicion" | "eco"> & { seconds: number }>): Beat[] {
  let from = 0;
  return beats.map(({ seconds, ...beat }, index) => {
    const duration = frames(seconds);
    const previous = beats[index - 1];
    // Un cambio de color siempre entra con flash; la firma, con zoom.
    const transicion: Transicion = beat.rol === "firma" ? "zoom" : previous && previous.tono !== beat.tono ? "flash" : CICLO[index % CICLO.length];
    const placed = { ...beat, transicion, eco: beat.rol === "firma" ? "" : ecoDe(beat.texto), from, duration };
    from += duration;
    return placed;
  });
}

export function reelTextoBeats(salida: Extract<Salida, { plantilla: "reel-texto" }>): Beat[] {
  const tono = salida.tono ?? "oscuro";
  return place([
    { id: "gancho", rol: "gancho", texto: salida.gancho, tono, seconds: beatSeconds(salida.gancho, 0.4) },
    ...salida.pulsos.map((pulso, index) => ({ id: `pulso-${index + 1}`, rol: "pulso" as const, texto: pulso.texto, kicker: pulso.kicker, tono, seconds: beatSeconds(pulso.texto) })),
    // El remate invierte el color: es el signo de puntuación del reel.
    { id: "remate", rol: "remate", texto: salida.remate, tono: invert(tono), seconds: beatSeconds(salida.remate, 0.4) },
    { id: "firma", rol: "firma", texto: salida.cta, tono, seconds: FIRMA_SECONDS },
  ]);
}

export function reelCasoBeats(salida: Extract<Salida, { plantilla: "reel-caso" }>, nombre: string): Beat[] {
  return place([
    { id: "gancho", rol: "gancho", texto: salida.gancho, kicker: nombre, tono: "oscuro", seconds: beatSeconds(salida.gancho, 0.4) },
    ...salida.decisiones.map((decision, index) => ({
      id: `decision-${index + 1}`,
      rol: "decision" as const,
      texto: decision,
      kicker: `Decisión ${String(index + 1).padStart(2, "0")}`,
      tono: "oscuro" as const,
      placa: (index % 2 === 0 ? "hero" : "og") as "og" | "hero",
      // La placa también se mira: un poco más que una frase sola.
      seconds: beatSeconds(decision, 0.9),
    })),
    { id: "remate", rol: "remate", texto: salida.cierre, tono: "claro", seconds: beatSeconds(salida.cierre, 0.4) },
    { id: "firma", rol: "firma", texto: "Mirá el film completo del caso", tono: "oscuro", seconds: FIRMA_SECONDS },
  ]);
}

export function carruselVideoFrames(diapositivas: Diapositiva[]) {
  return diapositivas.length * frames(SLIDE_SECONDS);
}

export const totalFrames = (beats: Beat[]) => beats.reduce((sum, beat) => sum + beat.duration, 0);

/** Desafío del mes → diapositivas de carrusel (documento de LinkedIn). */
export function desafioDiapositivas(salida: Extract<Salida, { plantilla: "desafio" }>): Diapositiva[] {
  return [
    { tipo: "portada", kicker: "Desafío del mes", titulo: salida.titulo, bajada: "Contexto, problema, decisión y lo que aprendí." },
    { tipo: "texto", kicker: "01 · Contexto", titulo: "El contexto", cuerpo: salida.contexto },
    { tipo: "texto", kicker: "02 · Problema", titulo: "El problema", cuerpo: salida.problema },
    { tipo: "texto", kicker: "03 · Decisión", titulo: "La decisión", cuerpo: salida.decision },
    { tipo: "texto", kicker: "04 · Resultado", titulo: "El resultado", cuerpo: salida.resultado },
    { tipo: "texto", kicker: "05 · Aprendizaje", titulo: "Lo que aprendí", cuerpo: salida.aprendizaje },
    { tipo: "cierre", titulo: "¿Te pasó algo parecido?", cta: "Contame en los comentarios cómo lo resolviste.", enlace: salida.enlace ?? "mmorera.agency" },
  ];
}

/** Diapositivas de una salida de carrusel (o de un desafío). */
export function diapositivasDe(salida: Salida): Diapositiva[] {
  if (salida.plantilla === "carrusel") return salida.diapositivas;
  if (salida.plantilla === "desafio") return desafioDiapositivas(salida);
  if (salida.plantilla === "imagen") return [salida.diapositiva];
  return [];
}

/** Duración en segundos de lo que se publica como video (0 si es solo imagen). */
export function videoSeconds(salida: Salida, nombreCaso = ""): number {
  if (salida.plantilla === "reel-texto") return totalFrames(reelTextoBeats(salida)) / SOCIAL_FPS;
  if (salida.plantilla === "reel-caso") return totalFrames(reelCasoBeats(salida, nombreCaso)) / SOCIAL_FPS;
  if (salida.plantilla === "carrusel" && salida.video) return carruselVideoFrames(salida.diapositivas) / SOCIAL_FPS;
  return 0;
}
