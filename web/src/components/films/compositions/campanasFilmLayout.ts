import { CAMPANAS_FILM } from "@/data/films/campanasFilm";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea, splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { fitHeadline, headlineHeight } from "../scenes/siteText";
import { badgeHeight, badgeWidth } from "./useCaseLayout";

/**
 * Geometría de la cinemática de /campanas (pura y testeada): cada escena recibe
 * sus cajas y nada se improvisa en el JSX. Todas comparten la misma columna:
 * rótulo y honestidad arriba, titular y un escenario que llena lo que queda.
 */

const SIZES = {
  landscape: { kicker: 15, badge: 12, headlines: [60, 54, 48, 44], maxLines: 2, gap: 22, mono: 16, body: 23, title: 28, small: 15 },
  portrait: { kicker: 21, badge: 17, headlines: [72, 64, 58, 52], maxLines: 3, gap: 26, mono: 23, body: 29, title: 36, small: 23 },
} as const;

export type HeadlineBox = { size: number; box: Box };

function headlineBox(text: string, area: Box, y: number, format: FilmFormatName): HeadlineBox {
  const sizes = SIZES[format];
  const { size, lines } = fitHeadline(text, area.w, sizes.maxLines, [...sizes.headlines]);
  return { size, box: { x: area.x, y, w: area.w, h: headlineHeight(size, lines) } };
}

/** Lo que queda debajo del titular. */
function stageBelow(headline: HeadlineBox, area: Box, gap: number): Box {
  const y = headline.box.y + headline.box.h + gap;
  return { x: area.x, y, w: area.w, h: area.y + area.h - y };
}

/** Pestañas en cascada dentro del escritorio, con la planilla adelante. */
function desk(box: Box, count: number) {
  const tab = { w: box.w * 0.54, h: box.h * 0.6 };
  const stepX = (box.w * 0.34) / Math.max(1, count - 1);
  const stepY = (box.h * 0.26) / Math.max(1, count - 1);
  const tabs: Box[] = Array.from({ length: count }, (_, index) => ({ x: box.x + index * stepX, y: box.y + index * stepY, w: tab.w, h: tab.h }));
  const sheetW = box.w * 0.6;
  const sheetH = box.h * 0.66;
  return { tabs, sheet: { x: box.x + box.w - sheetW, y: box.y + box.h - sheetH, w: sheetW, h: sheetH } };
}

function pills(area: Box, labels: string[], height: number, gap: number): Box[] {
  const widths = area.w - gap * (labels.length - 1);
  const w = widths / labels.length;
  return labels.map((_, index) => ({ x: area.x + index * (w + gap), y: area.y, w, h: height }));
}

export function campanasLayout(format: FilmFormatName, language: FilmLanguage) {
  const land = format === "landscape";
  const area = safeArea(format);
  const sizes = SIZES[format];
  const film = CAMPANAS_FILM;
  const topHeight = land ? 30 : 36;
  const headlineY = area.y + topHeight + sizes.gap;
  const badge = { size: sizes.badge, w: badgeWidth(film.badge[language], sizes.badge), h: badgeHeight(sizes.badge) };
  const top = {
    kicker: { x: area.x, y: area.y, size: sizes.kicker },
    badge: { ...badge, x: area.x + area.w - badge.w, y: area.y },
  };

  // 1 · Antes: pestañas y planilla, y el reloj que corre al costado.
  const beforeHead = headlineBox(film.before.headline[language], area, headlineY, format);
  const beforeStage = stageBelow(beforeHead, area, sizes.gap + 6);
  const clockBand = land ? 300 : 210;
  const [deskBox, clockBox] = land
    ? splitColumns(beforeStage, [beforeStage.w - clockBand - 44, clockBand], 44)
    : ((bands) => [bands.desk, bands.clock])(stackBands(beforeStage, [{ id: "desk", flex: 1 }, { id: "clock", h: clockBand }], sizes.gap));
  const before = { headline: beforeHead, ...desk(deskBox, film.before.tabs.length), clock: clockBox };

  // 2 · Una pregunta: la barra, las fuentes que lee y lo que cuenta mientras tanto.
  const questionHead = headlineBox(film.question.headline[language], area, headlineY, format);
  const questionStage = stageBelow(questionHead, area, sizes.gap + 10);
  const promptH = land ? 92 : 112;
  const pillH = land ? 54 : 68;
  const countersH = land ? 120 : 190;
  const questionBands = stackBands(questionStage, [
    { id: "prompt", h: promptH },
    { id: "links", flex: 1 },
    { id: "sources", h: pillH },
    { id: "space", h: land ? 34 : 46 },
    { id: "counters", h: countersH },
  ]);
  const question = {
    headline: questionHead,
    prompt: questionBands.prompt,
    links: questionBands.links,
    sources: pills(questionBands.sources, film.question.sources, pillH, land ? 16 : 12),
    counters: pills(questionBands.counters, [...film.question.counters, { label: film.question.elapsed }].map((item) => item.label[language]), countersH, land ? 20 : 14),
  };

  // 3 · La máquina: la curva y lo que encontró.
  const machineHead = headlineBox(film.machine.headline[language], area, headlineY, format);
  const machineStage = stageBelow(machineHead, area, sizes.gap + 10);
  const [chart, list] = land
    ? splitColumns(machineStage, [5, 6], 28)
    : ((bands) => [bands.chart, bands.list])(stackBands(machineStage, [{ id: "chart", h: 320 }, { id: "list", flex: 1 }], sizes.gap));
  const findingsBands = stackBands(list, film.machine.findings.map((item) => ({ id: item.id, flex: 1 })), land ? 14 : 18);
  const machine = { headline: machineHead, chart, findings: film.machine.findings.map((item) => findingsBands[item.id]) };

  // 4 · La persona: propuesta, compuerta del criterio y decisión, fila por fila.
  const personHead = headlineBox(film.person.headline[language], area, headlineY, format);
  const personStage = stageBelow(personHead, area, sizes.gap + 6);
  const labelsH = land ? 26 : 34;
  const personBands = stackBands(personStage, [{ id: "labels", h: labelsH }, { id: "rows", flex: 1 }], land ? 12 : 16);
  const rowBands = stackBands(personBands.rows, film.person.decisions.map((item) => ({ id: item.id, flex: 1 })), land ? 14 : 18);
  const gateW = land ? 96 : 60;
  const proposalW = personStage.w * (land ? 0.36 : 0.37);
  const gateX = personStage.x + proposalW + gateW / 2;
  const decisionX = personStage.x + proposalW + gateW;
  const person = {
    headline: personHead,
    labels: {
      proposes: { x: personStage.x, y: personBands.labels.y, w: proposalW, h: labelsH },
      decides: { x: decisionX, y: personBands.labels.y, w: personStage.x + personStage.w - decisionX, h: labelsH },
    },
    gate: { x: gateX, top: personBands.rows.y, bottom: personBands.rows.y + personBands.rows.h },
    rows: film.person.decisions.map((item) => {
      const row = rowBands[item.id];
      return {
        proposal: { x: row.x, y: row.y, w: proposalW, h: row.h },
        node: { x: gateX, y: row.y + row.h / 2 },
        decision: { x: decisionX, y: row.y, w: personStage.x + personStage.w - decisionX, h: row.h },
      };
    }),
  };

  // 5 · Toda la cuenta: la persona al centro y seis frentes alrededor.
  const accountHead = headlineBox(film.account.headline[language], area, headlineY, format);
  const accountStage = stageBelow(accountHead, area, sizes.gap + 10);
  const nodeW = land ? 196 : 250;
  const nodeH = land ? 58 : 76;
  const center = { x: accountStage.x + accountStage.w / 2, y: accountStage.y + accountStage.h / 2 };
  const radiusX = (accountStage.w - nodeW) / 2;
  const radiusY = (accountStage.h - nodeH) / 2;
  const nodes = film.account.nodes.map((_, index) => {
    const angle = ((-90 + index * 60) * Math.PI) / 180;
    const cx = center.x + Math.cos(angle) * radiusX * (land ? 0.82 : 1);
    const cy = center.y + Math.sin(angle) * radiusY;
    return { x: cx - nodeW / 2, y: cy - nodeH / 2, w: nodeW, h: nodeH, cx, cy };
  });
  const account = { headline: accountHead, center, core: land ? 148 : 190, nodes };

  // 6 · La firma.
  const signature = {
    logo: { x: area.x + area.w / 2, y: area.y + area.h * (land ? 0.3 : 0.32), size: land ? 190 : 270 },
    first: { x: area.x, y: area.y + area.h * (land ? 0.58 : 0.57), w: area.w, size: land ? 46 : 62 },
    second: { x: area.x, y: area.y + area.h * (land ? 0.68 : 0.65), w: area.w, size: land ? 46 : 62 },
    name: { x: area.x, y: area.y + area.h * (land ? 0.84 : 0.8), w: area.w, size: land ? 16 : 24 },
  };

  return { format, land, area, sizes, top, before, question, machine, person, account, signature };
}

export type CampanasLayout = ReturnType<typeof campanasLayout>;
