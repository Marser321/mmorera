import type { FilmLanguage, Localized } from "@/data/films/filmTypes";
import { OPENING_BEAT_FRAMES, SYSTEM_RAIL_STAGES } from "@/data/films/systemsFilms";
import type { Box, FilmFormatName } from "@/lib/filmLayout";
import { bodyWidth, monoWidth } from "../scenes/siteText";

/**
 * Coreografía del film de apertura de /sistemas, pura y por frame (sin
 * Remotion): la composición la pinta y los tests la recorren cuadro a cuadro
 * para comprobar que nada se pisa.
 *
 * Reglas que cumple:
 * - Las herramientas sueltas están repartidas en columnas, una por estado del
 *   riel: al alinearse viajan casi en vertical (16:9) o en su fila (4:5) y
 *   ninguna cruza a otra.
 * - El lead se posa encima de cada herramienta (nunca sobre su ícono ni su
 *   rótulo) y salta subiendo, cruzando por arriba y bajando.
 * - Los rótulos cambian en secuencia: el de la herramienta sale y, recién
 *   cuando el mosaico llegó al riel, entra el del estado.
 * - El paquete del riel viaja solo por los cables, de borde a borde.
 */

export type Point = { x: number; y: number };

const B = OPENING_BEAT_FRAMES;

/** Etiqueta de cada herramienta (en el orden del riel). */
export const OPENING_TOOLS: Array<{ id: "instagram" | "form" | "sheet" | "email" | "whatsapp"; label: Localized }> = [
  { id: "instagram", label: { es: "Instagram", en: "Instagram" } },
  { id: "form", label: { es: "Formulario", en: "Form" } },
  { id: "sheet", label: { es: "Planilla", en: "Spreadsheet" } },
  { id: "email", label: { es: "Email", en: "Email" } },
  { id: "whatsapp", label: { es: "WhatsApp", en: "WhatsApp" } },
];

/** Estado ilustrativo del prospecto al pasar por cada etapa (beat 4). */
export const LEAD_STATES: Localized[] = [
  { es: "Formulario web", en: "Web form" },
  { es: "Prioridad A", en: "Priority A" },
  { es: "Historia única", en: "Single history" },
  { es: "Jue 10:00 ✓", en: "Thu 10:00 ✓" },
  { es: "Asignado al equipo", en: "Assigned to the team" },
];

export const LOST_LABEL: Localized = { es: "Acá se pierde", en: "Lost here" };

type FormatSpec = {
  tile: number;
  rail: Point[];
  scatter: Point[];
  /** Grieta donde cae el lead: columna libre entre la planilla y el email. */
  crack: { x: number; top: number; bottom: number };
  pill: { y: number; size: number; padX: number; padY: number };
  toolLabel: { size: number; gap: number };
  title: { size: number };
  chip: { size: number; padX: number; padY: number };
  number: { size: number };
  lead: { size: number; halo: number };
  packet: { size: number; halo: number };
  /** Cuánto sube el lead por encima del punto más alto de cada salto. */
  lift: number;
  wobble: { x: number; y: number };
};

export const OPENING_SPECS: Record<FilmFormatName, FormatSpec> = {
  landscape: {
    tile: 140,
    rail: [230, 515, 800, 1085, 1370].map((x) => ({ x, y: 430 })),
    scatter: [
      { x: 250, y: 250 },
      { x: 520, y: 650 },
      { x: 790, y: 240 },
      { x: 1110, y: 640 },
      { x: 1360, y: 270 },
    ],
    crack: { x: 950, top: 196, bottom: 700 },
    pill: { y: 396, size: 18, padX: 16, padY: 9 },
    toolLabel: { size: 22, gap: 16 },
    title: { size: 28 },
    chip: { size: 14, padX: 12, padY: 5 },
    number: { size: 17 },
    lead: { size: 26, halo: 5 },
    packet: { size: 14, halo: 4 },
    lift: 20,
    wobble: { x: 6, y: 5 },
  },
  portrait: {
    tile: 132,
    rail: [230, 460, 690, 920, 1150].map((y) => ({ x: 250, y })),
    scatter: [
      { x: 300, y: 250 },
      { x: 780, y: 440 },
      { x: 470, y: 680 },
      { x: 800, y: 910 },
      { x: 330, y: 1130 },
    ],
    crack: { x: 640, top: 626, bottom: 1040 },
    pill: { y: 720, size: 24, padX: 20, padY: 10 },
    toolLabel: { size: 26, gap: 16 },
    title: { size: 36 },
    chip: { size: 20, padX: 14, padY: 6 },
    number: { size: 24 },
    lead: { size: 26, halo: 5 },
    packet: { size: 14, halo: 4 },
    lift: 24,
    wobble: { x: 6, y: 5 },
  },
};

/* ─── Tiempo: rampas con el mismo ease que theme.ts (sin Remotion) ─── */

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 40; i++) {
      const value = sampleX(t);
      if (Math.abs(value - x) < 1e-7) break;
      if (value < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return sampleY(t);
  };
}

export const EASE_OUT_FN = cubicBezier(0.22, 1, 0.36, 1);
export const EASE_IN_OUT_FN = cubicBezier(0.65, 0, 0.35, 1);

/** 0→1 entre dos frames (equivale a progress() de theme.ts). */
export function ramp(frame: number, from: number, to: number, ease = EASE_OUT_FN) {
  if (frame <= from) return 0;
  if (frame >= to) return 1;
  return ease((frame - from) / (to - from));
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function cubic(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
    y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
  };
}

/**
 * Salto del lead: sube en vertical, cruza por arriba y baja en vertical sobre
 * el destino (dos Bézier cúbicas unidas en la cima). Así nunca pasa sobre el
 * contador ni el rótulo de la herramienta de la que sale o a la que llega.
 */
export function hop(from: Point, to: Point, t: number, lift: number): Point {
  const top = Math.min(from.y, to.y) - lift;
  const apex = { x: (from.x + to.x) / 2, y: top };
  const reach = (to.x - from.x) / 4;
  if (t <= 0.5) return cubic(from, { x: from.x, y: top }, { x: apex.x - reach, y: top }, apex, t * 2);
  return cubic(apex, { x: apex.x + reach, y: top }, { x: to.x, y: top }, to, t * 2 - 1);
}

/* ─── Estado de cada cuadro ─── */

export type TextItem = { text: string; box: Box; opacity: number };

export type ToolFrame = {
  center: Point;
  /** Escala del mosaico (entrada). */
  scale: number;
  enter: number;
  ping: { scale: number; opacity: number };
  badge: { count: number; lost: number; opacity: number; box: Box };
  iconDim: number;
  glow: number;
  toolLabel: TextItem;
  title: TextItem;
  number: TextItem;
  chip: TextItem;
};

export type OpeningFrame = {
  spec: FormatSpec;
  tools: ToolFrame[];
  lead: { point: Point; opacity: number };
  crack: { draw: number; opacity: number };
  pill: TextItem;
  cables: Array<{ from: Point; to: Point; draw: number; lit: number }>;
  packet: { point: Point; opacity: number } | null;
};

/** Ventanas del beat 4: el paquete llega a cada estado del riel en estos frames. */
export const PACKET_ARRIVALS = [0, 1, 2, 3, 4].map((index) => 3 * B + 14 + index * 30);
const PACKET_DWELL = 8;

export function chipWidth(text: string, spec: FormatSpec) {
  return Math.ceil(monoWidth(text, spec.chip.size, 0.06) + spec.chip.padX * 2 + 2);
}

export function pillWidth(text: string, spec: FormatSpec) {
  return Math.ceil(monoWidth(text.toUpperCase(), spec.pill.size, 0.12) + spec.pill.padX * 2 + 2);
}

const pillHeight = (spec: FormatSpec) => Math.ceil(spec.pill.size * 1.25 + spec.pill.padY * 2 + 2);

/**
 * Punto donde se posa el lead: encima del mosaico y por arriba de su contador,
 * así al saltar hacia la derecha no le pasa por encima.
 */
export function perch(center: Point, spec: FormatSpec): Point {
  return { x: center.x, y: center.y - spec.tile / 2 - spec.lead.size / 2 - spec.lead.halo - 22 };
}

export function openingFrame(frame: number, format: FilmFormatName, language: FilmLanguage): OpeningFrame {
  const spec = OPENING_SPECS[format];
  const portrait = format === "portrait";
  const { tile } = spec;
  const half = tile / 2;

  // Beat 1–2: deriva suave; beat 3: cada herramienta viaja a su estado del riel.
  const drift = 1 - ramp(frame, 2 * B, 2 * B + 30);
  const centers = spec.scatter.map((scatter, index) => {
    const settle = ramp(frame, 2 * B + 18 + index * 6, 2 * B + 88 + index * 6, EASE_IN_OUT_FN);
    const target = spec.rail[index];
    return {
      x: lerp(scatter.x, target.x, settle) + Math.sin(frame / 38 + index * 1.7) * spec.wobble.x * drift,
      y: lerp(scatter.y, target.y, settle) + Math.cos(frame / 45 + index) * spec.wobble.y * drift,
    };
  });

  // Beat 4: el paquete (solo por los cables) y el brillo de cada estado.
  const legs = PACKET_ARRIVALS.slice(0, -1).map((arrive, index) => ({ depart: arrive + PACKET_DWELL, arrive: PACKET_ARRIVALS[index + 1] }));
  const cables = spec.rail.slice(0, -1).map((point, index) => {
    const next = spec.rail[index + 1];
    const from = portrait ? { x: point.x, y: point.y + half } : { x: point.x + half, y: point.y };
    const to = portrait ? { x: next.x, y: next.y - half } : { x: next.x - half, y: next.y };
    return {
      from,
      to,
      draw: ramp(frame, 2 * B + 100 + index * 6, 2 * B + 130 + index * 6),
      lit: ramp(frame, legs[index].depart, legs[index].arrive, EASE_IN_OUT_FN),
    };
  });
  const activeLeg = legs.findIndex((leg) => frame > leg.depart && frame < leg.arrive);
  let packet: OpeningFrame["packet"] = null;
  if (activeLeg >= 0) {
    const cable = cables[activeLeg];
    const u = cable.lit;
    const reach = spec.packet.size / 2 + spec.packet.halo + 5;
    const length = Math.hypot(cable.to.x - cable.from.x, cable.to.y - cable.from.y);
    const along = reach + (length - reach * 2) * u;
    packet = {
      point: {
        x: cable.from.x + ((cable.to.x - cable.from.x) / length) * along,
        y: cable.from.y + ((cable.to.y - cable.from.y) / length) * along,
      },
      opacity: Math.max(0, Math.min(1, u / 0.12, (1 - u) / 0.12)),
    };
  }
  const settled = ramp(frame, 4 * B - 14, 4 * B - 2);

  const titlesIn = (index: number) => ramp(frame, 2 * B + 112 + index * 3, 2 * B + 128 + index * 3);
  const toolLabelOut = 1 - ramp(frame, 2 * B, 2 * B + 16);
  const pingFade = 1 - ramp(frame, B - 20, B);
  const lost = ramp(frame, B + 112, B + 126);

  const tools: ToolFrame[] = centers.map((center, index) => {
    // Visibles desde el cuadro 0: es lo primero que se ve al llegar a la sección
    // (el film arranca con el scroll). Solo los avisos de mensaje se mueven.
    const enter = 1;
    const phase = ((frame + index * 11) % 60) / 60;
    const rail = spec.rail[index];
    const arrived = ramp(frame, PACKET_ARRIVALS[index] - 2, PACKET_ARRIVALS[index] + 10);
    const glow = Math.max(arrived * (1 - ramp(frame, PACKET_ARRIVALS[index] + 10, PACKET_ARRIVALS[index] + 40)) * 0.9, settled, arrived * 0.45);
    const badgeSize = tile * 0.3;
    const scale = 0.92 + enter * 0.08;

    const toolText = OPENING_TOOLS[index].label[language];
    const toolW = Math.ceil(monoWidth(toolText, spec.toolLabel.size, 0.08));
    const toolH = Math.ceil(spec.toolLabel.size * 1.25);
    const titleText = SYSTEM_RAIL_STAGES[index].title[language];
    const titleW = Math.ceil(bodyWidth(titleText, spec.title.size, -0.02));
    const titleH = Math.ceil(spec.title.size * 1.25);
    const chipText = LEAD_STATES[index][language];
    const chipW = chipWidth(chipText, spec);
    const chipH = Math.ceil(spec.chip.size * 1.25 + spec.chip.padY * 2 + 2);
    const numberText = `0${index + 1}`;
    const numberW = Math.ceil(monoWidth(numberText, spec.number.size, 0.16));
    const numberH = Math.ceil(spec.number.size * 1.25);

    const titleBox = portrait
      ? { x: rail.x + half + 28, y: rail.y - 12 - titleH / 2, w: titleW, h: titleH }
      : { x: rail.x - titleW / 2, y: rail.y + half + 18, w: titleW, h: titleH };
    const chipBox = portrait
      ? { x: titleBox.x, y: titleBox.y + titleH + 8, w: chipW, h: chipH }
      : { x: rail.x - chipW / 2, y: titleBox.y + titleH + 10, w: chipW, h: chipH };
    const numberBox = portrait
      ? { x: rail.x - half - 18 - numberW, y: rail.y - numberH / 2, w: numberW, h: numberH }
      : { x: rail.x - numberW / 2, y: rail.y - half - 14 - numberH, w: numberW, h: numberH };

    return {
      center,
      scale,
      enter,
      ping: { scale: 1 + phase * 0.16, opacity: (1 - phase) * 0.3 * pingFade * enter },
      badge: {
        count: Math.min(9, 1 + Math.floor(Math.max(0, frame - index * 9) / 26)),
        lost,
        opacity: enter * (1 - ramp(frame, 2 * B, 2 * B + 16)),
        box: { x: center.x + half * scale + tile * 0.12 - badgeSize, y: center.y - half * scale - tile * 0.12, w: badgeSize, h: badgeSize },
      },
      iconDim: ramp(frame, 2 * B + 96, 2 * B + 124),
      glow,
      toolLabel: {
        text: toolText,
        opacity: enter * toolLabelOut,
        box: { x: center.x - toolW / 2, y: center.y + half * scale + spec.toolLabel.gap, w: toolW, h: toolH },
      },
      title: { text: titleText, opacity: titlesIn(index), box: titleBox },
      number: { text: numberText, opacity: titlesIn(index), box: numberBox },
      chip: { text: chipText, opacity: ramp(frame, PACKET_ARRIVALS[index], PACKET_ARRIVALS[index] + 12), box: chipBox },
    };
  });

  // Beat 2: el lead salta Instagram → Formulario → Planilla y cae en la grieta.
  const perches = centers.map((center) => perch(center, spec));
  const crackTop = { x: spec.crack.x, y: spec.crack.top + 6 };
  let lead = perches[0];
  const hops = [
    { from: perches[0], to: perches[1], start: B + 12, end: B + 50 },
    { from: perches[1], to: perches[2], start: B + 58, end: B + 96 },
    { from: perches[2], to: crackTop, start: B + 104, end: B + 124 },
  ];
  for (const item of hops) if (frame >= item.start) lead = hop(item.from, item.to, ramp(frame, item.start, item.end, EASE_IN_OUT_FN), spec.lift);
  if (frame >= B + 124) {
    const fall = ramp(frame, B + 124, B + 148, EASE_IN_OUT_FN);
    lead = { x: crackTop.x, y: lerp(crackTop.y, spec.crack.bottom - 70, fall) };
  }
  const leadOpacity = ramp(frame, B, B + 10) * (1 - ramp(frame, B + 132, B + 146));

  const crackOut = 1 - ramp(frame, 2 * B, 2 * B + 16);
  const pillText = LOST_LABEL[language].toUpperCase();
  const pillW = pillWidth(pillText, spec);
  const pill: TextItem = {
    text: pillText,
    opacity: ramp(frame, B + 128, B + 142) * crackOut,
    box: { x: spec.crack.x + spec.lead.size / 2 + spec.lead.halo + 16, y: spec.pill.y, w: pillW, h: pillHeight(spec) },
  };

  return {
    spec,
    tools,
    lead: { point: lead, opacity: leadOpacity },
    crack: { draw: ramp(frame, B + 112, B + 134), opacity: ramp(frame, B + 112, B + 120) * crackOut },
    pill,
    cables,
    packet,
  };
}
