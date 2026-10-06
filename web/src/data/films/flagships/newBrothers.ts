import type { CameraShotSpec } from "@/lib/filmCamera";
import { FILM_FPS, type FilmLanguage, type Localized } from "../filmTypes";
import type { CaseFilmChapter } from "../caseFilms";

/**
 * Film insignia de New Brothers: "Un CRM propio, sin depender de ningún CRM".
 * Todo dato sale del código del cliente (D:\Barberia, nb-barber):
 * - Reserva: STEPS en src/app/(main)/reservar/page.tsx (6 pasos).
 * - Servicios y precios: src/lib/static-data.ts (Corte Clásico $450,
 *   Corte + Barba $750, Diseño de Barba $350; barberos de demo Carlos y Miguel).
 * - Productos: catálogo del panel demo público (Beard Elixir - Sandalwood $600).
 * - 26 tablas con RLS y 4 roles: supabase/migrations/999_FULL_SETUP.sql.
 * - 14 secciones del panel: src/app/admin/layout.tsx.
 * Los montos de caja y liquidaciones son de ejemplo y se rotulan así.
 */

const s = (seconds: number) => Math.round(seconds * FILM_FPS);

export const NB_TIMELINE = {
  opening: { from: 0, duration: s(8) },
  problem: { from: s(8), duration: s(9.5) },
  booking: { from: s(17.5), duration: s(14) },
  panel: { from: s(31.5), duration: s(21) },
  architecture: { from: s(52.5), duration: s(14) },
  outcome: { from: s(66.5), duration: s(6) },
  signature: { from: s(72.5), duration: s(4.5) },
} as const;

export const NB_DURATION = NB_TIMELINE.signature.from + NB_TIMELINE.signature.duration;

export const NB_FACTS = {
  bookingSteps: 6,
  tables: 26,
  roles: 4,
  panelSections: 14,
} as const;

/**
 * Capturas del panel demo público (scripts/capture-panel-shots.ts). El test
 * del guion compara estas medidas con los JPEG reales: la cámara nunca amplía
 * más allá de este ancho nativo.
 */
export const NB_PANEL_CAPTURE = { width: 1440, height: 900 } as const;

/**
 * Recorrido de cámara por el panel (frames relativos a la escena "El panel").
 * Rectángulos en fracciones de la captura de 1440×900, medidos sobre los JPEG.
 * Las escalas piden un acercamiento; CameraReel las limita a la resolución
 * nativa, así que con capturas a 2× el mismo guion se acerca más.
 */
export const NB_PANEL_SHOTS: CameraShotSpec[] = [
  {
    name: "dashboard",
    path: "/admin/dashboard",
    from: 0,
    duration: 150,
    keys: [
      { at: 0, scale: 1, fx: 0.5, fy: 0.3 },
      { at: 70, scale: 1.35, fx: 0.6, fy: 0.3 },
      { at: 150, scale: 1.2, fx: 0.2, fy: 0.5 },
    ],
    notes: [
      // Fila de indicadores: "Citas hoy", "Barberos", "Sucursales" (x 330–1132, y 234–324).
      { key: "kpis", from: 30, to: 92, rect: [0.225, 0.253, 0.566, 0.114] },
      // Navegación lateral del panel (x 10–280, y 98–770).
      { key: "sections", from: 100, to: 146, rect: [0.007, 0.105, 0.19, 0.75] },
    ],
  },
  {
    name: "citas",
    path: "/admin/citas",
    from: 150,
    duration: 120,
    keys: [
      { at: 0, scale: 1.1, fx: 0.55, fy: 0.3 },
      { at: 120, scale: 1.4, fx: 0.62, fy: 0.38 },
    ],
    // Indicadores de la agenda del día (x 337–1391, y 290–408).
    notes: [{ key: "agenda", from: 26, to: 112, rect: [0.226, 0.312, 0.744, 0.144] }],
  },
  {
    name: "pos",
    path: "/admin/pos",
    from: 270,
    duration: 150,
    keys: [
      { at: 0, scale: 1.15, fx: 0.45, fy: 0.55 },
      { at: 80, scale: 1.3, fx: 0.45, fy: 0.6 },
      { at: 150, scale: 1.35, fx: 0.84, fy: 0.55 },
    ],
    notes: [
      // Selector de sucursal + catálogo con stock (x 312–1012, y 271–718).
      { key: "catalog", from: 20, to: 78, rect: [0.212, 0.295, 0.49, 0.505] },
      // Columna "Venta actual" (x 1036–1416, y 272–800).
      { key: "checkout", from: 90, to: 146, rect: [0.716, 0.296, 0.268, 0.59] },
    ],
  },
];

const L = (es: string, en: string): Localized => ({ es, en });

export const NB_CHAPTERS: CaseFilmChapter[] = [
  {
    id: "challenge",
    label: L("El problema", "The problem"),
    caption: L(
      "Reservas, cobros y clientes se resolvían por mensajes sueltos: agenda, caja y clientes vivían en lugares distintos.",
      "Bookings, payments and clients were handled through loose messages: schedule, cash and clients lived apart.",
    ),
    from: 0,
    durationInFrames: NB_TIMELINE.booking.from,
  },
  {
    id: "decisions",
    label: L("La reserva", "Booking"),
    caption: L(
      "Seis pasos, una decisión por paso: sucursal, servicio, referencia, barbero, fecha y hora, confirmar. La base no deja tomar un turno ocupado.",
      "Six steps, one decision each: branch, service, reference, barber, date and time, confirm. The database won't let anyone take a booked slot.",
    ),
    from: NB_TIMELINE.booking.from,
    durationInFrames: NB_TIMELINE.booking.duration,
  },
  {
    id: "product",
    label: L("El panel", "The panel"),
    caption: L(
      "Un centro de mando propio: dashboard, agenda, clientes, punto de venta, caja con cierre diario y liquidación por barbero.",
      "Its own command center: dashboard, schedule, clients, point of sale, cash with daily close and payouts per barber.",
    ),
    from: NB_TIMELINE.panel.from,
    durationInFrames: NB_TIMELINE.panel.duration,
  },
  {
    id: "constraints",
    label: L("Arquitectura", "Architecture"),
    caption: L(
      "Next.js 16 sobre Supabase: 26 tablas con seguridad por fila, 4 roles con permisos y las reglas del negocio como funciones de la base.",
      "Next.js 16 on Supabase: 26 tables with row-level security, 4 roles with permissions and business rules as database functions.",
    ),
    from: NB_TIMELINE.architecture.from,
    durationInFrames: NB_TIMELINE.architecture.duration,
  },
  {
    id: "outcome",
    label: L("Resultado", "Outcome"),
    caption: L(
      "La reserva se vuelve autoservicio y la barbería se gestiona desde su propio panel, sin depender de un CRM externo.",
      "Booking becomes self-service and the barbershop runs from its own panel, without depending on an external CRM.",
    ),
    from: NB_TIMELINE.outcome.from,
    durationInFrames: NB_DURATION - NB_TIMELINE.outcome.from,
  },
];

export interface NewBrothersCopy {
  tagline: string;
  problemKicker: string;
  problemTitle: string;
  problemSignals: string[];
  problemBreakpoint: string;
  lanes: string[];
  bookingKicker: string;
  bookingTitle: string;
  /** Rótulo del paso actual; {n} y {total} se reemplazan. */
  stepOf: string;
  steps: string[];
  branch: string;
  branchMeta: string;
  services: Array<{ title: string; meta: string }>;
  references: Array<{ title: string; meta: string }>;
  barbers: Array<{ title: string; meta: string }>;
  slots: string[];
  busy: string;
  confirmTitle: string;
  confirmLine: string;
  confirmed: string;
  sample: string;
  panelKicker: string;
  panelTitle: string;
  notes: { kpis: string; sections: string; agenda: string; catalog: string; checkout: string };
  counter: { kicker: string; title: string };
  cash: { kicker: string; title: string; rows: Array<{ label: string; meta: string; value: number }> };
  payouts: { kicker: string; title: string; rows: Array<{ label: string; meta: string; value: number }> };
  ticket: { total: string; methods: string[]; charge: string; charged: string; items: Array<{ name: string; price: number }> };
  archKicker: string;
  archTitle: string;
  outcomeKicker: string;
  outcomeTitle: string;
  facts: Array<{ value: string; label: string }>;
}

export const NB_COPY: Record<FilmLanguage, NewBrothersCopy> = {
  es: {
    tagline: "Salón de estética masculina",
    problemKicker: "El problema",
    problemTitle: "Toda la operación pasaba por mensajes sueltos.",
    problemSignals: ["¿Hay lugar el sábado?", "¿Con qué barbero?", "¿Cuánto se cobró hoy?", "¿Cuánto le toca a cada barbero?", "¿Cuándo vino por última vez?"],
    problemBreakpoint: "Nadie veía el negocio completo.",
    lanes: ["Agenda", "Caja", "Clientes"],
    bookingKicker: "La reserva",
    bookingTitle: "Seis pasos. Una decisión por paso.",
    stepOf: "Paso {n} de {total}",
    steps: ["Sucursal", "Servicio", "Referencia", "Barbero", "Fecha y hora", "Confirmar"],
    branch: "Casa Central",
    branchMeta: "Sucursal principal",
    services: [
      { title: "Corte Clásico", meta: "$ 450 · 30 min" },
      { title: "Corte + Barba", meta: "$ 750 · 60 min" },
      { title: "Diseño de Barba", meta: "$ 350 · 30 min" },
    ],
    references: [
      { title: "Fade degradado", meta: "Del lookbook" },
      { title: "Clásico", meta: "Del lookbook" },
      { title: "Sin referencia", meta: "Paso opcional" },
    ],
    barbers: [
      { title: "Carlos", meta: "Disponible" },
      { title: "Miguel", meta: "Disponible" },
      { title: "Sin preferencia", meta: "El primero libre" },
    ],
    slots: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"],
    busy: "Ocupado · sin solapes",
    confirmTitle: "Corte + Barba con Carlos",
    confirmLine: "Casa Central · sábado 11:30 · $ 750",
    confirmed: "Turno confirmado",
    sample: "Datos de ejemplo · servicios y precios del catálogo real",
    panelKicker: "Por dentro del panel",
    panelTitle: "Un centro de mando propio.",
    notes: { kpis: "Dashboard en tiempo real", sections: "14 secciones", agenda: "Agenda operativa", catalog: "Stock por sucursal", checkout: "Venta actual" },
    counter: { kicker: "Mostrador", title: "Venta" },
    cash: {
      kicker: "Caja",
      title: "Cierre del día",
      rows: [
        { label: "Efectivo", meta: "2 movimientos", value: 1350 },
        { label: "Tarjeta", meta: "1 movimiento", value: 750 },
        { label: "Transferencia", meta: "1 movimiento", value: 450 },
      ],
    },
    payouts: {
      kicker: "Liquidaciones",
      title: "Por barbero",
      rows: [
        { label: "Carlos", meta: "3 servicios", value: 1050 },
        { label: "Miguel", meta: "2 servicios", value: 600 },
      ],
    },
    ticket: { total: "Total", methods: ["Efectivo", "Tarjeta", "Transferencia"], charge: "Cobrar", charged: "Venta registrada en caja", items: [{ name: "Corte + Barba", price: 750 }, { name: "Beard Elixir - Sandalwood", price: 600 }] },
    archKicker: "Arquitectura",
    archTitle: "Las reglas del negocio viven en la base.",
    outcomeKicker: "Resultado",
    outcomeTitle: "Un CRM propio,\nsin depender de ningún CRM.",
    facts: [
      { value: "6", label: "pasos de reserva" },
      { value: "26", label: "tablas con RLS" },
      { value: "4", label: "roles con permisos" },
      { value: "14", label: "secciones de panel" },
    ],
  },
  en: {
    tagline: "Men's grooming salon",
    problemKicker: "The problem",
    problemTitle: "The whole operation ran on loose messages.",
    problemSignals: ["Any slot on Saturday?", "Which barber?", "How much came in today?", "What does each barber get?", "When did they last come in?"],
    problemBreakpoint: "Nobody saw the whole business.",
    lanes: ["Schedule", "Cash", "Clients"],
    bookingKicker: "Booking",
    bookingTitle: "Six steps. One decision per step.",
    stepOf: "Step {n} of {total}",
    steps: ["Branch", "Service", "Reference", "Barber", "Date & time", "Confirm"],
    branch: "Casa Central",
    branchMeta: "Main branch",
    services: [
      { title: "Classic Cut", meta: "$ 450 · 30 min" },
      { title: "Cut + Beard", meta: "$ 750 · 60 min" },
      { title: "Beard Design", meta: "$ 350 · 30 min" },
    ],
    references: [
      { title: "Fade", meta: "From the lookbook" },
      { title: "Classic", meta: "From the lookbook" },
      { title: "No reference", meta: "Optional step" },
    ],
    barbers: [
      { title: "Carlos", meta: "Available" },
      { title: "Miguel", meta: "Available" },
      { title: "No preference", meta: "First available" },
    ],
    slots: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30"],
    busy: "Booked · no double booking",
    confirmTitle: "Cut + Beard with Carlos",
    confirmLine: "Casa Central · Saturday 11:30 · $ 750",
    confirmed: "Booking confirmed",
    sample: "Sample data · services and prices from the real catalog",
    panelKicker: "Inside the panel",
    panelTitle: "Its own command center.",
    notes: { kpis: "Real-time dashboard", sections: "14 sections", agenda: "Operational schedule", catalog: "Stock per branch", checkout: "Current sale" },
    counter: { kicker: "Counter", title: "Sale" },
    cash: {
      kicker: "Cash",
      title: "Daily close",
      rows: [
        { label: "Cash", meta: "2 movements", value: 1350 },
        { label: "Card", meta: "1 movement", value: 750 },
        { label: "Transfer", meta: "1 movement", value: 450 },
      ],
    },
    payouts: {
      kicker: "Payouts",
      title: "Per barber",
      rows: [
        { label: "Carlos", meta: "3 services", value: 1050 },
        { label: "Miguel", meta: "2 services", value: 600 },
      ],
    },
    ticket: { total: "Total", methods: ["Cash", "Card", "Transfer"], charge: "Charge", charged: "Sale recorded in cash", items: [{ name: "Cut + Beard", price: 750 }, { name: "Beard Elixir - Sandalwood", price: 600 }] },
    archKicker: "Architecture",
    archTitle: "Business rules live in the database.",
    outcomeKicker: "Outcome",
    outcomeTitle: "Its own CRM,\nwithout depending on any CRM.",
    facts: [
      { value: "6", label: "booking steps" },
      { value: "26", label: "tables with RLS" },
      { value: "4", label: "roles with permissions" },
      { value: "14", label: "panel sections" },
    ],
  },
};
