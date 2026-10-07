import type { FilmLanguage, UseCaseFilmScript } from "@/data/films/filmTypes";
import { safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { flowGeometry, type FlowGeometry } from "../scenes/flowLayout";
import { fitHeadline, headlineHeight, monoWidth } from "../scenes/siteText";

/**
 * Cajas del film de casos de uso (UseCaseFilm + ResultScene). Puro y
 * testeable: cada texto vive en su banda, los visuales en la suya, y todo
 * queda dentro de la zona útil del formato. Los titulares eligen el mayor
 * tamaño con el que entran en sus líneas, en los dos idiomas.
 */

export type HeadlineSpec = { text: string; box: Box; size: number; lines: number };

export type UseCaseLayout = {
  format: FilmFormatName;
  safe: Box;
  kicker: { text: string; size: number; box: Box };
  badge: { size: number; box: Box };
  problem: HeadlineSpec;
  diagnosis: HeadlineSpec;
  /** Caja del visual del problema (ProblemVisuals): incluye el rótulo de quiebre al pie. */
  visual: Box;
  system: { headline: HeadlineSpec; flow: FlowGeometry; log: { box: Box; size: number } | null };
  result: {
    headline: HeadlineSpec;
    facts: Box[];
    /** 4:5: cifra y etiqueta en fila; 16:9: en columna. */
    row: boolean;
    valueSize: number;
    labelSize: number;
    /** Teléfono con la captura real (solo 16:9 y casos reales). */
    phone: Box | null;
    caption: Box | null;
  };
  ticks: { left: number; right: number; bottom: number; size: number };
};

export const KICKER_TRACKING = 0.18;
/** Marco del teléfono del resultado (la captura se dibuja dentro). */
export const PHONE_BEZEL = 10;
export const BADGE_TRACKING = 0.14;
/** Alto mínimo del visual del problema en 4:5: el chat de cinco mensajes y el rótulo de quiebre no se tocan. */
export const PORTRAIT_VISUAL_MIN = 690;

/** Ancho de HonestyBadge (punto + texto en mayúsculas + relleno + borde). */
export function badgeWidth(label: string, size: number) {
  return Math.ceil(monoWidth(label.toUpperCase(), size, BADGE_TRACKING) + size * 1.1 * 2 + size * 0.55 + size * 0.6 + 2);
}

export const badgeHeight = (size: number) => Math.ceil(size * 1.25 + size * 0.55 * 2 + 2);

/** Tamaño del rótulo de quiebre que dibuja ProblemVisuals (DiagnosisFrame). */
export const breakpointSize = (portrait: boolean) => (portrait ? 30 : 20);

/**
 * Ancho del rótulo de quiebre en una línea (punto + texto + relleno + borde),
 * con las mismas medidas que DiagnosisFrame. Si la caja del visual es más
 * angosta, el rótulo se parte en dos líneas y sube sobre el contenido.
 */
export function breakpointWidth(text: string, size: number) {
  return Math.ceil(monoWidth(text, size, 0.04) + size * 1.1 * 2 + size * 0.5 + size * 0.6 + 2);
}

export function systemTitle(script: UseCaseFilmScript, language: FilmLanguage) {
  if (script.kind === "real") return language === "es" ? "Así lo resolví." : "How I solved it.";
  return language === "es" ? "Así se resuelve." : "How it gets solved.";
}

function headline(text: string, x: number, y: number, width: number, maxLines: number, sizes: number[]): HeadlineSpec {
  const { size, lines } = fitHeadline(text, width, maxLines, sizes);
  return { text, size, lines, box: { x, y, w: width, h: headlineHeight(size, lines) } };
}

const bottomOf = (box: Box) => box.y + box.h;

export function layoutUseCaseFilm(script: UseCaseFilmScript, language: FilmLanguage, format: FilmFormatName, badgeLabel: string): UseCaseLayout {
  const portrait = format === "portrait";
  const safe = safeArea(format);
  const right = safe.x + safe.w;
  const bottom = safe.y + safe.h;
  const real = script.kind === "real" && Boolean(script.result.screenshot);

  // Cabecera: rubro (y título en 16:9) a la izquierda, rótulo de honestidad a la derecha.
  const badgeSize = portrait ? 20 : 13;
  const badgeW = badgeWidth(badgeLabel, badgeSize);
  const badgeH = badgeHeight(badgeSize);
  const badge = { size: badgeSize, box: { x: right - badgeW, y: safe.y, w: badgeW, h: badgeH } };
  const kickerSize = portrait ? 22 : 14;
  const kickerRoom = badge.box.x - 40 - safe.x;
  const full = `${script.category[language]} · ${script.title[language]}`.toUpperCase();
  const kickerText = !portrait && monoWidth(full, kickerSize, KICKER_TRACKING) <= kickerRoom ? full : script.category[language].toUpperCase();
  const kickerH = Math.ceil(kickerSize * 1.25);
  const kicker = {
    text: kickerText,
    size: kickerSize,
    box: { x: safe.x, y: safe.y + (badgeH - kickerH) / 2, w: Math.ceil(monoWidth(kickerText, kickerSize, KICKER_TRACKING)), h: kickerH },
  };

  const top = portrait ? 170 : 150;

  // Problema y diagnóstico: titular a la izquierda (16:9) o arriba (4:5); el visual en su caja.
  let problem: HeadlineSpec;
  let diagnosis: HeadlineSpec;
  let visual: Box;
  if (portrait) {
    problem = headline(script.problem.headline[language], safe.x, top, safe.w, 3, [92, 86, 80, 74]);
    diagnosis = headline(script.diagnosis.headline[language], safe.x, top, safe.w, 3, [78, 72, 66, 60]);
    const visualTop = Math.max(bottomOf(problem.box), bottomOf(diagnosis.box)) + 40;
    const h = Math.min(720, bottom - 16 - visualTop);
    visual = { x: safe.x, y: visualTop, w: safe.w, h };
  } else {
    // El visual se ensancha lo justo para que el rótulo de quiebre entre en una línea.
    const visualW = Math.max(690, breakpointWidth(script.diagnosis.breakpoint[language], breakpointSize(false)) + 8);
    const textWidth = safe.w - visualW - 50;
    problem = headline(script.problem.headline[language], safe.x, top, textWidth, 4, [70, 64, 58, 52]);
    diagnosis = headline(script.diagnosis.headline[language], safe.x, top, textWidth, 4, [58, 54, 50, 46]);
    visual = { x: right - visualW, y: top, w: visualW, h: 600 };
  }

  // Sistema: titular de una línea, el diagrama debajo y (en 16:9) el registro.
  const systemHeadline = headline(systemTitle(script, language), safe.x, top, safe.w, 1, portrait ? [76, 68, 60] : [56, 50, 44]);
  const logSize = 16;
  const logGap = 52;
  const logH = Math.ceil(script.stages.length * logSize * 1.75);
  let flowTop = bottomOf(systemHeadline.box) + (portrait ? 46 : 64);
  if (!portrait) {
    // 16:9: diagrama y registro centrados (con un poco más de aire abajo) entre el titular y el pie.
    const block = flowGeometry(script.stages, language, false, 0).bottom + logGap + logH;
    const free = bottom - bottomOf(systemHeadline.box) - block;
    flowTop = bottomOf(systemHeadline.box) + Math.round(Math.min(120, Math.max(64, free * 0.45)));
  }
  const flow = flowGeometry(script.stages, language, portrait, flowTop);
  const log = portrait ? null : { size: logSize, box: { x: safe.x, y: flow.bottom + logGap, w: safe.w, h: logH } };

  // Resultado: titular, hechos y —en casos reales en 16:9— el teléfono con la captura.
  const phoneW = 300;
  const phone = real && !portrait ? { x: right - phoneW, y: top, w: phoneW, h: phoneW * 2 } : null;
  const caption = phone ? { x: phone.x, y: bottomOf(phone) + 18, w: phone.w, h: 20 } : null;
  const resultWidth = portrait ? safe.w : phone ? 760 : 1180;
  const resultHeadline = headline(script.result.headline[language], safe.x, top, resultWidth, portrait ? 4 : 3, portrait ? [84, 78, 72, 66] : [66, 60, 54]);
  const facts: Box[] = [];
  const factCount = script.result.facts.length;
  if (portrait) {
    const factsTop = bottomOf(resultHeadline.box) + 56;
    const factH = 150;
    for (let index = 0; index < factCount; index++) facts.push({ x: safe.x, y: factsTop + index * (factH + 20), w: safe.w, h: factH });
  } else {
    const factsTop = Math.max(500, bottomOf(resultHeadline.box) + 64);
    const factW = phone ? 240 : 360;
    for (let index = 0; index < factCount; index++) facts.push({ x: safe.x + index * (factW + 24), y: factsTop, w: factW, h: 170 });
  }

  return {
    format,
    safe,
    kicker,
    badge,
    problem,
    diagnosis,
    visual,
    system: { headline: systemHeadline, flow, log },
    result: { headline: resultHeadline, facts, row: portrait, valueSize: portrait ? 68 : 52, labelSize: portrait ? 30 : 19, phone, caption },
    ticks: { left: safe.x, right: portrait ? 1080 - right : 1600 - right, bottom: portrait ? 46 : 34, size: portrait ? 10 : 8 },
  };
}
