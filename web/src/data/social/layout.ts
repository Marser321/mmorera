import type { Box } from "@/lib/filmLayout";
import { countLines, GLYPH, textHeight, type LayoutBlock, type TextBlock } from "@/components/films/scenes/brand/layout/dataText";
import { socialSafeArea, type Diapositiva, type Formato } from "./types";

/**
 * Geometría de las piezas de redes (pura, sin React). Cada diapositiva o
 * pulso se resuelve en una lista de elementos con su caja y su orden de
 * entrada; `SlideScene` y los reels los dibujan sin decidir tamaños a ojo, y
 * los tests verifican con `layoutProblems` que nada se pise ni salga de la
 * zona segura.
 */

export type Fuente = "display" | "cuerpo" | "mono";
export type Rol = "kicker" | "titulo" | "cuerpo" | "item" | "indice" | "cita" | "autor" | "pie" | "enlace" | "contador" | "marca" | "opcion" | "letra" | "fecha" | "rotulo";

/** `text` es lo que se mide (sin asteriscos); `raw` conserva los `*énfasis*` para dibujar. */
export type SocialText = TextBlock & { raw: string; fuente: Fuente; lh: number; upper: boolean };

export type SlideElement =
  | { kind: "text"; rol: Rol; block: SocialText; order: number; invert?: boolean; reveal: "words" | "fade" }
  | { kind: "rule"; box: Box; order: number }
  | { kind: "panel"; box: Box; order: number; invert: boolean }
  | { kind: "image"; box: Box; slot: string; order: number }
  | { kind: "logo"; box: Box; order: number };

export type SlideLayout = { safe: Box; elements: SlideElement[]; blocks: LayoutBlock[] };

/** `*palabra*` marca el énfasis; para medir se quitan los asteriscos. */
export const plain = (text: string) => text.replace(/\*/g, "");

const LH = { display: 1.06, cuerpo: 1.3, mono: 1.25 } as const;
/** Ancho de glifo para medir: mono en mayúsculas con tracking 0,14 em; mono en minúsculas (enlaces). */
const GLYPH_MONO_UPPER = GLYPH.upper;
const GLYPH_MONO = GLYPH.digits;

function glyphOf(fuente: Fuente, upper: boolean) {
  if (fuente === "mono") return upper ? GLYPH_MONO_UPPER : GLYPH_MONO;
  return GLYPH.text;
}

function text(id: string, box: Box, value: string, size: number, lines: number, fuente: Fuente, upper = fuente === "mono"): SocialText {
  const shown = upper ? plain(value).toUpperCase() : plain(value);
  return { kind: "text", id, box, text: shown, raw: upper ? value.toUpperCase() : value, size, lines, glyph: glyphOf(fuente, upper), fuente, lh: LH[fuente], upper };
}

/** Líneas y alto de un texto a un tamaño dado. */
function measure(value: string, size: number, width: number, fuente: Fuente, upper = fuente === "mono") {
  const shown = upper ? plain(value).toUpperCase() : plain(value);
  const lines = countLines(shown, size, width, glyphOf(fuente, upper));
  return { lines, h: textHeight(size, lines, LH[fuente]) };
}

/** Tamaños por formato: escaleras de mayor a menor. */
const SPEC = {
  feed: { kicker: 22, foot: 20, cover: [128, 116, 104, 96, 88, 80, 72, 64, 56], title: [104, 96, 88, 80, 72, 64, 58, 52, 48, 44], body: [52, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28], quote: [104, 96, 88, 80, 72, 64, 58, 52, 48, 44], gap: 40 },
  cuadrado: { kicker: 22, foot: 20, cover: [112, 100, 92, 84, 76, 68, 60, 54, 48], title: [96, 88, 80, 72, 64, 58, 52, 48, 44, 40], body: [48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28, 26], quote: [96, 88, 80, 72, 64, 58, 52, 48, 44, 42], gap: 34 },
  reel: { kicker: 26, foot: 24, cover: [124, 112, 104, 96, 88, 80, 72, 64, 58], title: [108, 100, 92, 84, 76, 68, 62, 56, 52, 48], body: [54, 50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30], quote: [108, 100, 92, 84, 76, 68, 62, 56, 52, 48], gap: 44 },
} as const;

const MAX_LINES = {
  cover: { feed: 5, cuadrado: 4, reel: 6 },
  title: { feed: 3, cuadrado: 3, reel: 4 },
  body: { feed: 10, cuadrado: 7, reel: 12 },
  quote: { feed: 7, cuadrado: 6, reel: 8 },
} as const;


/**
 * Prueba escalones de tamaño (todos bajan a la vez) hasta que el contenido
 * entra en el alto disponible y cada texto en su máximo de líneas.
 */
function pickStep<T extends { h: number; ok: boolean }>(steps: number, build: (step: number) => T): T {
  let last = build(0);
  if (last.ok) return last;
  for (let step = 1; step < steps; step++) {
    last = build(step);
    if (last.ok) return last;
  }
  return last;
}

const at = (ladder: readonly number[], step: number) => ladder[Math.min(step, ladder.length - 1)];

/** Los bloques cortos se apoyan un poco por encima del centro óptico del área. */
const OPTICAL = 0.38;

/** Un enlace no se corta: el tamaño baja hasta que entra en una línea. */
function linkSize(value: string, width: number, max: number) {
  for (let size = max; size > 16; size -= 2) if (plain(value).length * size * GLYPH_MONO <= width) return size;
  return 16;
}

/** Ancho de la columna de índices ("01") con su separación. */
const indexWidth = (size: number) => Math.ceil(size * GLYPH_MONO_UPPER * 2) + 8 + 28;

export type Pagina = { n: number; total: number };

/**
 * Cabecera (rótulo) y pie (contador y marca) comunes. Devuelve el área libre
 * para el cuerpo entre ambos.
 */
function frame(formato: Formato, kicker: string | undefined, pagina: Pagina | undefined, marca: boolean) {
  const safe = socialSafeArea(formato);
  const s = SPEC[formato];
  const elements: SlideElement[] = [];
  let top = safe.y;
  if (kicker) {
    const k = text("kicker", { x: safe.x, y: safe.y, w: safe.w, h: textHeight(s.kicker, 1, LH.mono) }, kicker, s.kicker, 1, "mono");
    elements.push({ kind: "text", rol: "kicker", block: k, order: 0, reveal: "fade" });
    elements.push({ kind: "rule", box: { x: safe.x, y: k.box.y + k.box.h + 18, w: 120, h: 2 }, order: 0 });
    top = k.box.y + k.box.h + 18 + 2 + s.gap;
  }
  let bottom = safe.y + safe.h;
  if (pagina || marca) {
    const footH = textHeight(s.foot, 1, LH.mono);
    const y = safe.y + safe.h - footH;
    if (pagina) {
      const label = `${String(pagina.n).padStart(2, "0")} / ${String(pagina.total).padStart(2, "0")}`;
      elements.push({ kind: "text", rol: "contador", block: text("contador", { x: safe.x, y, w: 200, h: footH }, label, s.foot, 1, "mono"), order: 9, reveal: "fade" });
    }
    if (marca) {
      const w = Math.ceil(s.foot * GLYPH_MONO * "mmorera.agency".length) + 8;
      elements.push({ kind: "text", rol: "marca", block: text("marca", { x: safe.x + safe.w - w, y, w, h: footH }, "mmorera.agency", s.foot, 1, "mono", false), order: 9, reveal: "fade" });
    }
    bottom = y - s.gap;
  }
  return { safe, elements, body: { x: safe.x, y: top, w: safe.w, h: bottom - top } as Box };
}

function result(safe: Box, elements: SlideElement[]): SlideLayout {
  const blocks: LayoutBlock[] = elements.flatMap((element): LayoutBlock[] => {
    if (element.kind === "text") return [element.block];
    if (element.kind === "image") return [{ kind: "media", id: `imagen.${element.slot}`, box: element.box }];
    if (element.kind === "panel") return [{ kind: "frame", id: `panel.${element.order}`, box: element.box }];
    if (element.kind === "logo") return [{ kind: "media", id: "logo", box: element.box }];
    return [];
  });
  return { safe, elements, blocks };
}

/** Bloques de texto apilados, con su alto real, desde `y`. */
function stack(items: Array<{ id: string; rol: Rol; value: string; size: number; fuente: Fuente; maxLines: number; gapAfter: number; reveal: "words" | "fade"; order: number }>, area: Box) {
  let y = 0;
  let ok = true;
  const placed = items.map((item) => {
    // Los enlaces van en minúsculas; el resto del mono, en mayúsculas.
    const upper = item.fuente === "mono" && item.rol !== "enlace";
    const { lines, h } = measure(item.value, item.size, area.w, item.fuente, upper);
    if (lines > item.maxLines) ok = false;
    const block = text(item.id, { x: area.x, y: area.y + y, w: area.w, h }, item.value, item.size, lines, item.fuente, upper);
    y += h + item.gapAfter;
    return { kind: "text" as const, rol: item.rol, block, order: item.order, reveal: item.reveal };
  });
  const last = items.at(-1);
  const h = y - (last ? last.gapAfter : 0);
  return { placed, h, ok: ok && h <= area.h };
}

/** Desplaza elementos ya ubicados en vertical. */
function shift(elements: SlideElement[], dy: number) {
  for (const element of elements) {
    if (element.kind === "text") element.block.box = { ...element.block.box, y: element.block.box.y + dy };
    else element.box = { ...element.box, y: element.box.y + dy };
  }
}

export type ImageSizes = Record<string, { w: number; h: number }>;

/** Diapositiva → elementos. `imagenes` da la proporción de cada imagen (por defecto 4:5). */
export function slideLayout(formato: Formato, slide: Diapositiva, pagina?: Pagina, imagenes: ImageSizes = {}): SlideLayout {
  const s = SPEC[formato];
  const kicker = "kicker" in slide ? slide.kicker : slide.tipo === "encuesta" ? "Encuesta" : slide.tipo === "sorteo" ? "Sorteo" : undefined;
  const marca = slide.tipo !== "cierre";
  const { safe, elements, body } = frame(formato, kicker, pagina, marca);

  switch (slide.tipo) {
    case "portada": {
      const fit = pickStep(9, (step) =>
        stack(
          [
            { id: "titulo", rol: "titulo", value: slide.titulo, size: at(s.cover, step), fuente: "display", maxLines: MAX_LINES.cover[formato], gapAfter: s.gap, reveal: "words", order: 1 },
            ...(slide.bajada ? [{ id: "bajada", rol: "cuerpo" as Rol, value: slide.bajada, size: at(s.body, step), fuente: "cuerpo" as Fuente, maxLines: 4, gapAfter: 0, reveal: "fade" as const, order: 2 }] : []),
          ],
          body,
        ),
      );
      // Portada editorial: el bloque se apoya abajo.
      shift(fit.placed, Math.max(0, body.h - fit.h));
      return result(safe, [...elements, ...fit.placed]);
    }
    case "texto": {
      const fit = pickStep(12, (step) =>
        stack(
          [
            { id: "titulo", rol: "titulo", value: slide.titulo, size: at(s.title, step), fuente: "display", maxLines: MAX_LINES.title[formato], gapAfter: s.gap, reveal: "words", order: 1 },
            { id: "cuerpo", rol: "cuerpo", value: slide.cuerpo, size: at(s.body, step), fuente: "cuerpo", maxLines: MAX_LINES.body[formato], gapAfter: 0, reveal: "fade", order: 2 },
          ],
          body,
        ),
      );
      shift(fit.placed, Math.max(0, (body.h - fit.h) * OPTICAL));
      return result(safe, [...elements, ...fit.placed]);
    }
    case "lista": {
      const indexW = indexWidth(s.kicker);
      const fit = pickStep(12, (step) => {
        const title = stack([{ id: "titulo", rol: "titulo", value: slide.titulo, size: at(s.title, step), fuente: "display", maxLines: MAX_LINES.title[formato], gapAfter: 0, reveal: "words", order: 1 }], body);
        let y = body.y + title.h + s.gap;
        let ok = title.ok;
        const size = at(s.body, step);
        const items: SlideElement[] = [];
        slide.items.forEach((item, index) => {
          const area = { x: body.x + indexW, y, w: body.w - indexW, h: body.y + body.h - y };
          const { lines, h } = measure(item, size, area.w, "cuerpo");
          if (lines > 3) ok = false;
          const idxH = textHeight(s.kicker, 1, LH.mono);
          items.push({ kind: "text", rol: "indice", block: text(`indice.${index}`, { x: body.x, y: y + (textHeight(size, 1, LH.cuerpo) - idxH) / 2, w: indexW - 28, h: idxH }, String(index + 1).padStart(2, "0"), s.kicker, 1, "mono"), order: 2 + index, reveal: "fade" });
          items.push({ kind: "text", rol: "item", block: text(`item.${index}`, { x: area.x, y, w: area.w, h }, item, size, lines, "cuerpo"), order: 2 + index, reveal: "fade" });
          y += h;
          if (index < slide.items.length - 1) {
            items.push({ kind: "rule", box: { x: area.x, y: y + s.gap / 2 - 1, w: area.w, h: 1 }, order: 2 + index });
            y += s.gap;
          }
        });
        const h = y - body.y;
        return { placed: [...title.placed, ...items], h, ok: ok && h <= body.h };
      });
      shift(fit.placed, Math.max(0, (body.h - fit.h) * OPTICAL));
      return result(safe, [...elements, ...fit.placed]);
    }
    case "cita":
    case "tarjeta": {
      const value = slide.tipo === "cita" ? slide.cita : slide.texto;
      const autor = slide.tipo === "cita" ? slide.autor : undefined;
      const fit = pickStep(8, (step) =>
        stack(
          [
            { id: "cita", rol: "cita", value, size: at(s.quote, step), fuente: "display", maxLines: MAX_LINES.quote[formato] + (slide.tipo === "tarjeta" ? 1 : 0), gapAfter: s.gap, reveal: "words", order: 1 },
            ...(autor ? [{ id: "autor", rol: "autor" as Rol, value: autor, size: s.kicker, fuente: "mono" as Fuente, maxLines: 2, gapAfter: 0, reveal: "fade" as const, order: 2 }] : []),
          ],
          body,
        ),
      );
      shift(fit.placed, Math.max(0, (body.h - fit.h) / 2));
      return result(safe, [...elements, ...fit.placed]);
    }
    case "comparacion": {
      const pad = 32;
      const fit = pickStep(8, (step) => {
        const placed: SlideElement[] = [];
        let y = body.y;
        let ok = true;
        if (slide.titulo) {
          const title = stack([{ id: "titulo", rol: "titulo", value: slide.titulo, size: at(s.title, step + 1), fuente: "display", maxLines: 2, gapAfter: 0, reveal: "words", order: 1 }], body);
          placed.push(...title.placed);
          ok = title.ok;
          y += title.h + s.gap;
        }
        const size = at(s.body, step);
        const rotH = textHeight(s.kicker, 1, LH.mono);
        const panels = [
          { key: "antes", ...slide.antes, invert: false, order: 2 },
          { key: "despues", ...slide.despues, invert: true, order: 3 },
        ];
        for (const panel of panels) {
          const inner = body.w - pad * 2;
          const { lines, h } = measure(panel.texto, size, inner, "cuerpo");
          if (lines > 6) ok = false;
          const panelH = pad + rotH + 18 + h + pad;
          placed.push({ kind: "panel", box: { x: body.x, y, w: body.w, h: panelH }, order: panel.order, invert: panel.invert });
          placed.push({ kind: "text", rol: "rotulo", block: text(`rotulo.${panel.key}`, { x: body.x + pad, y: y + pad, w: inner, h: rotH }, panel.rotulo, s.kicker, 1, "mono"), order: panel.order, invert: panel.invert, reveal: "fade" });
          placed.push({ kind: "text", rol: "cuerpo", block: text(`texto.${panel.key}`, { x: body.x + pad, y: y + pad + rotH + 18, w: inner, h }, panel.texto, size, lines, "cuerpo"), order: panel.order, invert: panel.invert, reveal: "fade" });
          y += panelH + 24;
        }
        const h = y - 24 - body.y;
        return { placed, h, ok: ok && h <= body.h };
      });
      shift(fit.placed, Math.max(0, (body.h - fit.h) * OPTICAL));
      return result(safe, [...elements, ...fit.placed]);
    }
    case "imagen": {
      const size = imagenes[slide.imagen] ?? { w: 4, h: 5 };
      const fit = pickStep(6, (step) => {
        const texts = stack(
          [
            ...(slide.titulo ? [{ id: "titulo", rol: "titulo" as Rol, value: slide.titulo, size: at(s.title, step + 1), fuente: "display" as Fuente, maxLines: 2, gapAfter: 16, reveal: "words" as const, order: 2 }] : []),
            ...(slide.pie ? [{ id: "pie", rol: "pie" as Rol, value: slide.pie, size: at(s.body, step + 2), fuente: "cuerpo" as Fuente, maxLines: 3, gapAfter: 0, reveal: "fade" as const, order: 3 }] : []),
          ],
          body,
        );
        // La imagen ocupa todo el ancho y se recorta (cover) al alto que dejan los textos.
        const imageH = Math.min(body.h - (texts.h ? texts.h + s.gap : 0), Math.round((body.w * size.h) / size.w));
        const image: SlideElement = { kind: "image", box: { x: body.x, y: body.y, w: body.w, h: imageH }, slot: slide.imagen, order: 1 };
        shift(texts.placed, imageH + s.gap);
        return { placed: [image, ...texts.placed], h: imageH + (texts.h ? s.gap + texts.h : 0), ok: texts.ok && imageH >= body.h * 0.45 };
      });
      return result(safe, [...elements, ...fit.placed]);
    }
    case "cierre": {
      const logo = formato === "reel" ? 168 : 132;
      const fit = pickStep(8, (step) => {
        const texts = stack(
          [
            { id: "titulo", rol: "titulo", value: slide.titulo, size: at(s.title, step), fuente: "display", maxLines: 4, gapAfter: s.gap, reveal: "words", order: 2 },
            { id: "cta", rol: "cuerpo", value: slide.cta, size: at(s.body, step), fuente: "cuerpo", maxLines: 4, gapAfter: slide.enlace ? s.gap : 0, reveal: "fade", order: 3 },
            ...(slide.enlace ? [{ id: "enlace", rol: "enlace" as Rol, value: slide.enlace, size: linkSize(slide.enlace, body.w, s.kicker), fuente: "mono" as Fuente, maxLines: 1, gapAfter: 0, reveal: "fade" as const, order: 4 }] : []),
          ],
          { ...body, y: body.y + logo + s.gap, h: body.h - logo - s.gap },
        );
        return { placed: texts.placed, h: logo + s.gap + texts.h, ok: texts.ok };
      });
      const dy = Math.max(0, (body.h - fit.h) / 2);
      const placed: SlideElement[] = [{ kind: "logo", box: { x: body.x, y: body.y + dy, w: logo, h: Math.round(logo * (1885.03 / 2239.69)) }, order: 1 }, ...fit.placed];
      shift(fit.placed, dy);
      return result(safe, [...elements, ...placed]);
    }
    case "encuesta": {
      const pill = 30;
      const fit = pickStep(8, (step) => {
        const q = stack([{ id: "pregunta", rol: "titulo", value: slide.pregunta, size: at(s.title, step), fuente: "display", maxLines: 4, gapAfter: 0, reveal: "words", order: 1 }], body);
        let y = body.y + q.h + s.gap;
        let ok = q.ok;
        const size = at(s.body, step);
        const letterW = Math.ceil(s.kicker * GLYPH_MONO_UPPER) + 8;
        const placed: SlideElement[] = [...q.placed];
        slide.opciones.forEach((option, index) => {
          const inner = body.w - pill * 2 - letterW - 20;
          const { lines, h } = measure(option, size, inner, "cuerpo");
          if (lines > 2) ok = false;
          const boxH = pill + h + pill - 12;
          placed.push({ kind: "panel", box: { x: body.x, y, w: body.w, h: boxH }, order: 2 + index, invert: false });
          const letH = textHeight(s.kicker, 1, LH.mono);
          placed.push({ kind: "text", rol: "letra", block: text(`letra.${index}`, { x: body.x + pill, y: y + (boxH - letH) / 2, w: letterW, h: letH }, "ABCD"[index], s.kicker, 1, "mono"), order: 2 + index, reveal: "fade" });
          placed.push({ kind: "text", rol: "opcion", block: text(`opcion.${index}`, { x: body.x + pill + letterW + 20, y: y + (boxH - h) / 2, w: inner, h }, option, size, lines, "cuerpo"), order: 2 + index, reveal: "fade" });
          y += boxH + 18;
        });
        const h = y - 18 - body.y;
        return { placed, h, ok: ok && h <= body.h };
      });
      // En 9:16 la encuesta queda arriba: abajo va el sticker nativo de la plataforma.
      if (formato !== "reel") shift(fit.placed, Math.max(0, (body.h - fit.h) / 2));
      return result(safe, [...elements, ...fit.placed]);
    }
    case "sorteo": {
      const fit = pickStep(8, (step) => {
        const head = stack([{ id: "premio", rol: "titulo", value: slide.premio, size: at(s.title, step), fuente: "display", maxLines: 3, gapAfter: 0, reveal: "words", order: 1 }], body);
        let y = body.y + head.h + s.gap;
        let ok = head.ok;
        const size = at(s.body, step + 1);
        const indexW = indexWidth(s.kicker);
        const placed: SlideElement[] = [...head.placed];
        slide.pasos.forEach((paso, index) => {
          const area = { x: body.x + indexW, w: body.w - indexW };
          const { lines, h } = measure(paso, size, area.w, "cuerpo");
          if (lines > 3) ok = false;
          const idxH = textHeight(s.kicker, 1, LH.mono);
          placed.push({ kind: "text", rol: "indice", block: text(`paso.indice.${index}`, { x: body.x, y: y + (textHeight(size, 1, LH.cuerpo) - idxH) / 2, w: indexW - 28, h: idxH }, String(index + 1).padStart(2, "0"), s.kicker, 1, "mono"), order: 2 + index, reveal: "fade" });
          placed.push({ kind: "text", rol: "item", block: text(`paso.${index}`, { x: area.x, y, w: area.w, h }, paso, size, lines, "cuerpo"), order: 2 + index, reveal: "fade" });
          y += h + 22;
        });
        y += s.gap - 22;
        const tail = stack(
          [
            { id: "cierre", rol: "fecha", value: slide.cierre, size: s.kicker, fuente: "mono", maxLines: 2, gapAfter: 12, reveal: "fade", order: 8 },
            { id: "bases", rol: "enlace", value: slide.bases, size: linkSize(slide.bases, body.w, s.foot), fuente: "mono", maxLines: 1, gapAfter: 0, reveal: "fade", order: 8 },
          ],
          { ...body, y, h: body.y + body.h - y },
        );
        placed.push(...tail.placed);
        const h = y + tail.h - body.y;
        return { placed, h, ok: ok && tail.ok && h <= body.h };
      });
      return result(safe, [...elements, ...fit.placed]);
    }
  }
}

/* ─── Reels ─── */

export type BeatRol = "gancho" | "pulso" | "remate";

/** Un pulso del reel de texto: rótulo opcional y la frase grande, centrados en la zona segura. */
export function reelBeatLayout(value: string, rol: BeatRol, kicker?: string): SlideLayout {
  const safe = socialSafeArea("reel");
  const ladder = rol === "pulso" ? [112, 104, 96, 88, 80, 72, 64, 58, 52] : [128, 116, 108, 100, 92, 84, 76, 68, 60];
  const maxLines = rol === "pulso" ? 7 : 6;
  // El contador va arriba; la frase se centra en lo que queda.
  const counterH = textHeight(SPEC.reel.kicker, 1, LH.mono);
  const area = { x: safe.x, y: safe.y + counterH + 40, w: safe.w, h: safe.h - counterH - 40 };
  const fit = pickStep(ladder.length, (step) =>
    stack(
      [
        ...(kicker ? [{ id: "kicker", rol: "kicker" as Rol, value: kicker, size: SPEC.reel.kicker, fuente: "mono" as Fuente, maxLines: 1, gapAfter: 36, reveal: "fade" as const, order: 0 }] : []),
        { id: "frase", rol: "titulo" as Rol, value, size: at(ladder, step), fuente: "display" as Fuente, maxLines, gapAfter: 0, reveal: "words" as const, order: 1 },
      ],
      area,
    ),
  );
  shift(fit.placed, Math.max(0, (area.h - fit.h) / 2));
  const counter: SlideElement = { kind: "text", rol: "contador", block: text("contador", { x: safe.x, y: safe.y, w: 240, h: counterH }, "00 / 00", SPEC.reel.kicker, 1, "mono"), order: 0, reveal: "fade" };
  return result(safe, [counter, ...fit.placed]);
}

/** Pulso del reel de caso: el cuadro del film arriba (16:9) y la decisión debajo. */
export function reelCasoLayout(value: string, kicker: string, conPlaca: boolean): SlideLayout {
  const safe = socialSafeArea("reel");
  const counterH = textHeight(SPEC.reel.kicker, 1, LH.mono);
  const elements: SlideElement[] = [{ kind: "text", rol: "contador", block: text("contador", { x: safe.x, y: safe.y, w: 240, h: counterH }, "00 / 00", SPEC.reel.kicker, 1, "mono"), order: 0, reveal: "fade" }];
  let area: Box = { x: safe.x, y: safe.y + counterH + 40, w: safe.w, h: safe.h - counterH - 40 };
  if (conPlaca) {
    const plate: Box = { x: safe.x, y: area.y, w: safe.w, h: Math.round((safe.w * 9) / 16) };
    elements.push({ kind: "image", box: plate, slot: "placa", order: 0 });
    area = { x: safe.x, y: plate.y + plate.h + 56, w: safe.w, h: safe.y + safe.h - (plate.y + plate.h + 56) };
  }
  const ladder = conPlaca ? [84, 76, 70, 64, 58, 54, 50, 46] : [120, 108, 100, 92, 84, 76, 68, 60];
  const fit = pickStep(ladder.length, (step) =>
    stack(
      [
        { id: "kicker", rol: "kicker", value: kicker, size: SPEC.reel.kicker, fuente: "mono", maxLines: 1, gapAfter: 28, reveal: "fade", order: 1 },
        { id: "frase", rol: "titulo", value, size: at(ladder, step), fuente: "display", maxLines: conPlaca ? 5 : 6, gapAfter: 0, reveal: "words", order: 2 },
      ],
      area,
    ),
  );
  if (!conPlaca) shift(fit.placed, Math.max(0, (area.h - fit.h) / 2));
  return result(safe, [...elements, ...fit.placed]);
}

/** Firma final de los reels: monograma, marca y llamado a la acción. */
export function reelFirmaLayout(cta: string, enlace = "mmorera.agency"): SlideLayout {
  const slide: Diapositiva = { tipo: "cierre", titulo: "Mario Morera", cta, enlace };
  return slideLayout("reel", slide);
}
