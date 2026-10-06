import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { sampleBadgeBox } from "./factWall";
import { chipWidth, countLines, flowBoxes, flowHeight, GLYPH, largestFit, textBlock, textHeight, type LayoutBlock, type TextBlock } from "./dataText";

/**
 * Búsqueda por palabras clave (BM25, no vectorial): el campo con la consulta,
 * los términos que se buscan, la lista de fragmentos por relevancia (sin
 * puntajes) y la banda con el tamaño del índice. Puro: sin React ni Remotion.
 */

export type KeywordResult = { title: string; fragment: string };
export type KeywordStat = { value: string; label: string };

export type KeywordSearchData = {
  query: string;
  /** Términos de la consulta que usa el índice (se resaltan en la consulta y en los fragmentos). */
  tokens: string[];
  results: KeywordResult[];
  /** Tamaño del índice, con valores ya formateados (p. ej. "1.096" videos). */
  stats: KeywordStat[];
  /** Línea que dice el método (p. ej. "Búsqueda por palabras clave (BM25), no vectorial"). */
  methodLabel: string;
  sampleLabel: string;
  language: FilmLanguage;
};

/** Rótulos chicos de la interfaz (se localizan acá, no vienen del film). */
export const KEYWORD_CHROME: Record<FilmLanguage, { terms: string; results: string }> = {
  es: { terms: "Términos", results: "Fragmentos por relevancia" },
  en: { terms: "Terms", results: "Fragments by relevance" },
};

export type KeywordResultLayout = { card: Box; rankFrame: Box; rank: TextBlock; title: TextBlock; fragment: TextBlock };

export type KeywordSearchLayout = {
  method: TextBlock;
  stats: Array<{ value: TextBlock; label: TextBlock }>;
  /** Separadores entre cifras del índice (gráficos). */
  statRules: Box[];
  field: Box;
  icon: Box;
  query: TextBlock;
  termsLabel: TextBlock;
  tokens: Array<{ frame: Box; text: TextBlock }>;
  resultsLabel: TextBlock;
  sample: TextBlock;
  results: KeywordResultLayout[];
  blocks: LayoutBlock[];
};

const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const WORD = /[A-Za-z0-9À-ɏ]+(?:-[A-Za-z0-9À-ɏ]+)*/g;

/**
 * Parte un texto en tramos y marca las palabras que empiezan con alguno de los
 * términos (sin distinguir mayúsculas ni tildes), como hace un índice de
 * palabras clave con raíces.
 */
export function highlightSegments(text: string, tokens: string[]) {
  const keys = tokens.map(fold).filter(Boolean);
  const out: Array<{ text: string; hit: boolean }> = [];
  let last = 0;
  for (const match of text.matchAll(WORD)) {
    const word = match[0];
    const start = match.index ?? 0;
    if (!keys.some((key) => fold(word).startsWith(key))) continue;
    if (start > last) out.push({ text: text.slice(last, start), hit: false });
    out.push({ text: word, hit: true });
    last = start + word.length;
  }
  if (last < text.length) out.push({ text: text.slice(last), hit: false });
  return out;
}

type Step = { title: number; fragment: number };

const SPEC = {
  landscape: {
    method: [34, 32, 30, 28, 26, 24],
    statValue: [60, 56, 52, 48, 44, 40],
    statLabel: [22, 21, 20, 19, 18],
    query: [30, 28, 26, 24, 22, 20],
    terms: 15,
    token: [22, 21, 20, 19, 18],
    resultsLabel: 15,
    sample: 16,
    steps: [
      { title: 26, fragment: 21 },
      { title: 24, fragment: 20 },
      { title: 23, fragment: 19 },
      { title: 22, fragment: 18 },
      { title: 20, fragment: 17 },
    ] as Step[],
    fragmentLines: 3,
    padX: 24,
    padY: 18,
  },
  portrait: {
    method: [38, 36, 34, 32, 30, 28],
    statValue: [64, 60, 56, 52, 48, 44, 40],
    statLabel: [26, 25, 24, 23, 22],
    query: [34, 32, 30, 28, 26, 24],
    terms: 20,
    token: [28, 27, 26, 25, 24, 23],
    resultsLabel: 20,
    sample: 22,
    steps: [
      { title: 32, fragment: 27 },
      { title: 30, fragment: 26 },
      { title: 29, fragment: 25 },
      { title: 28, fragment: 24 },
      { title: 27, fragment: 23 },
      { title: 26, fragment: 22 },
    ] as Step[],
    fragmentLines: 3,
    padX: 28,
    padY: 22,
  },
} as const;

export function keywordSearchLayout(box: Box, data: KeywordSearchData, format: FilmFormatName): KeywordSearchLayout {
  const spec = SPEC[format];
  const portrait = format === "portrait";
  const chrome = KEYWORD_CHROME[data.language];
  const [left, right] = portrait ? [box, box] : splitColumns(box, [0.34, 0.66], 56);

  // ── Método e índice ──
  const methodLines = portrait ? 2 : 3;
  const methodSize = largestFit([data.methodLabel], left.w, methodLines, [...spec.method]);
  const methodUsed = Math.min(methodLines, countLines(data.methodLabel, methodSize, left.w));
  const method = textBlock("method", { x: left.x, y: left.y, w: left.w, h: textHeight(methodSize, methodUsed) }, data.methodLabel, methodSize, methodUsed);

  const stats: KeywordSearchLayout["stats"] = [];
  const statRules: Box[] = [];
  let leftBottom = method.box.y + method.box.h;
  if (portrait) {
    const columns = splitColumns({ x: box.x, y: 0, w: box.w, h: 0 }, data.stats.map(() => 1), 28);
    const colW = columns[0]?.w ?? box.w;
    const valueSize = largestFit(data.stats.map((stat) => stat.value), colW, 1, [...spec.statValue], GLYPH.digits);
    const labelSize = largestFit(data.stats.map((stat) => stat.label), colW, 2, [...spec.statLabel]);
    const labelLines = Math.max(1, ...data.stats.map((stat) => Math.min(2, countLines(stat.label, labelSize, colW))));
    const top = leftBottom + 30;
    const valueH = textHeight(valueSize, 1, 1.06);
    data.stats.forEach((stat, index) => {
      const col = columns[index];
      stats.push({
        value: textBlock(`stat.${index}.value`, { x: col.x, y: top, w: col.w, h: valueH }, stat.value, valueSize, 1, GLYPH.digits),
        label: textBlock(`stat.${index}.label`, { x: col.x, y: top + valueH + 4, w: col.w, h: textHeight(labelSize, labelLines) }, stat.label, labelSize, labelLines),
      });
    });
    leftBottom = top + valueH + 4 + textHeight(labelSize, labelLines);
  } else {
    const valueSize = largestFit(data.stats.map((stat) => stat.value), left.w, 1, [...spec.statValue], GLYPH.digits);
    const labelSize = largestFit(data.stats.map((stat) => stat.label), left.w, 2, [...spec.statLabel]);
    const valueH = textHeight(valueSize, 1, 1.06);
    let y = leftBottom + 40;
    data.stats.forEach((stat, index) => {
      if (index > 0) {
        statRules.push({ x: left.x, y: y + 2, w: Math.min(left.w, 200), h: 1 });
        y += 24;
      }
      const labelLines = Math.min(2, countLines(stat.label, labelSize, left.w));
      stats.push({
        value: textBlock(`stat.${index}.value`, { x: left.x, y, w: left.w, h: valueH }, stat.value, valueSize, 1, GLYPH.digits),
        label: textBlock(`stat.${index}.label`, { x: left.x, y: y + valueH + 2, w: left.w, h: textHeight(labelSize, labelLines) }, stat.label, labelSize, labelLines),
      });
      y += valueH + 2 + textHeight(labelSize, labelLines);
    });
    leftBottom = y;
  }

  // ── Campo de búsqueda ──
  const fieldTop = portrait ? leftBottom + 40 : right.y;
  const iconGap = 18;
  const fieldPad = portrait ? 26 : 22;
  const querySize = largestFit([data.query], right.w - fieldPad * 2 - spec.query[0] - iconGap - 20, 1, [...spec.query]);
  const iconSize = Math.round(querySize * 1.05);
  const fieldH = Math.round(querySize * 2.4);
  const field = { x: right.x, y: fieldTop, w: right.w, h: fieldH };
  const icon = { x: field.x + fieldPad, y: field.y + (fieldH - iconSize) / 2, w: iconSize, h: iconSize };
  const queryX = icon.x + iconSize + iconGap;
  const query = textBlock("query", { x: queryX, y: field.y + (fieldH - textHeight(querySize, 1)) / 2, w: field.x + field.w - fieldPad - queryX, h: textHeight(querySize, 1) }, data.query, querySize, 1);

  // ── Términos ──
  const termsTop = field.y + fieldH + 18;
  const termsW = chipWidth(chrome.terms, spec.terms, 0, GLYPH.upper);
  const tokenArea = { x: right.x + termsW + 16, y: termsTop, w: right.w - termsW - 16, h: 9999 };
  let tokenSize: number = spec.token[spec.token.length - 1];
  let tokenBoxes: Box[] = [];
  for (const size of spec.token) {
    const pad = Math.round(size * 0.7);
    const placed = flowBoxes(tokenArea, data.tokens.map((token) => chipWidth(token, size, pad)), textHeight(size, 1) + Math.round(size * 0.6), 10);
    if (placed && flowHeight(placed) <= (textHeight(size, 1) + Math.round(size * 0.6)) * 2 + 10) {
      tokenSize = size;
      tokenBoxes = placed;
      break;
    }
  }
  const tokenPad = Math.round(tokenSize * 0.7);
  const tokenRowH = textHeight(tokenSize, 1) + Math.round(tokenSize * 0.6);
  const termsLabel = textBlock("terms", { x: right.x, y: termsTop, w: termsW, h: tokenRowH }, chrome.terms, spec.terms, 1, GLYPH.upper);
  const tokens = tokenBoxes.map((frame, index) => ({ frame, text: textBlock(`token.${index}`, { x: frame.x + tokenPad - 2, y: frame.y, w: frame.w - (tokenPad - 2) * 2, h: frame.h }, data.tokens[index], tokenSize, 1) }));
  const termsBottom = termsTop + Math.max(tokenRowH, flowHeight(tokenBoxes));

  // ── Cabecera de resultados: rótulo a la izquierda, "Datos de ejemplo" a la derecha ──
  const headTop = termsBottom + (portrait ? 34 : 28);
  const sampleBox = sampleBadgeBox(data.sampleLabel, spec.sample, 0, 0);
  const headH = Math.max(sampleBox.h, textHeight(spec.resultsLabel, 1));
  const sample = textBlock("sample", { ...sampleBox, x: right.x + right.w - sampleBox.w, y: headTop + (headH - sampleBox.h) / 2 }, data.sampleLabel, spec.sample, 1);
  const resultsLabel = textBlock("results.label", { x: right.x, y: headTop + (headH - textHeight(spec.resultsLabel, 1)) / 2, w: Math.max(0, right.w - sampleBox.w - 24), h: textHeight(spec.resultsLabel, 1) }, chrome.results, spec.resultsLabel, 1, GLYPH.upper);

  // ── Resultados ──
  const listTop = headTop + headH + 14;
  const listH = box.y + box.h - listTop;
  const results: KeywordResultLayout[] = [];
  for (let stepIndex = 0; stepIndex < spec.steps.length; stepIndex++) {
    const step = spec.steps[stepIndex];
    const rankSize = Math.round(step.title * 0.95);
    const rankD = Math.round(rankSize * 1.7);
    const textX = right.x + spec.padX + rankD + 20;
    const textW = right.x + right.w - spec.padX - textX;
    const fragmentLines = data.results.map((result) => countLines(result.fragment, step.fragment, textW));
    const titleOk = data.results.every((result) => countLines(result.title, step.title, textW) === 1);
    const last = stepIndex === spec.steps.length - 1;
    if ((!titleOk || fragmentLines.some((lines) => lines > spec.fragmentLines)) && !last) continue;
    const heights = fragmentLines.map((lines) => spec.padY * 2 + textHeight(step.title, 1) + 8 + textHeight(step.fragment, Math.min(lines, spec.fragmentLines)));
    const minGap = 12;
    const used = heights.reduce((sum, h) => sum + h, 0) + minGap * Math.max(0, heights.length - 1);
    if (used > listH && !last) continue;
    const gap = heights.length > 1 ? Math.min(22, Math.max(minGap, (listH - heights.reduce((sum, h) => sum + h, 0)) / (heights.length - 1))) : 0;
    let y = listTop;
    data.results.forEach((result, index) => {
      const card = { x: right.x, y, w: right.w, h: heights[index] };
      const lines = Math.min(fragmentLines[index], spec.fragmentLines);
      const titleBox = { x: textX, y: y + spec.padY, w: textW, h: textHeight(step.title, 1) };
      const rankFrame = { x: right.x + spec.padX, y: titleBox.y + (titleBox.h - rankD) / 2, w: rankD, h: rankD };
      results.push({
        card,
        rankFrame,
        rank: textBlock(`result.${index}.rank`, { x: rankFrame.x + 4, y: rankFrame.y, w: rankD - 8, h: rankD }, String(index + 1), rankSize, 1, GLYPH.digits),
        title: textBlock(`result.${index}.title`, titleBox, result.title, step.title, 1),
        fragment: textBlock(`result.${index}.fragment`, { x: textX, y: titleBox.y + titleBox.h + 8, w: textW, h: textHeight(step.fragment, lines) }, result.fragment, step.fragment, lines),
      });
      y += heights[index] + gap;
    });
    break;
  }

  const blocks: LayoutBlock[] = [method];
  for (const stat of stats) blocks.push(stat.value, stat.label);
  statRules.forEach((rule, index) => blocks.push({ kind: "media", id: `stat.rule.${index}`, box: rule }));
  blocks.push({ kind: "frame", id: "field", box: field }, { kind: "media", id: "field.icon", box: icon }, query, termsLabel);
  for (const token of tokens) blocks.push({ kind: "frame", id: `${token.text.id}.frame`, box: token.frame }, token.text);
  blocks.push(resultsLabel, sample);
  for (const result of results) blocks.push({ kind: "frame", id: `${result.title.id}.card`, box: result.card }, { kind: "frame", id: `${result.rank.id}.frame`, box: result.rankFrame }, result.rank, result.title, result.fragment);
  return { method, stats, statRules, field, icon, query, termsLabel, tokens, resultsLabel, sample, results, blocks };
}
