import type { Localized } from "./films/filmTypes";
import type { Family } from "./techStack";

/**
 * Qué caso demuestra cada familia de capacidades de /estudio, y en qué
 * capítulo de su film se ve (para enlazar a `#film-<capítulo>`). Solo lo que
 * los films y sus dossiers sostienen: si una capacidad la prueba un solo caso
 * (IA aplicada: Fénix), se usan momentos distintos de ese caso, nunca casos
 * que no la tienen.
 *
 * La usan el panel de cada familia en /estudio, los films cortos por
 * capacidad y los "Casos parecidos" de cada página de caso.
 */
export type CapabilityCase = {
  slug: string;
  chapter: string;
  /** Cuadro fijo del film que lo ilustra (public/portfolio/films/<slug>/<still>-<idioma>.jpg). */
  still: "og" | "hero";
  line: Localized;
};

export const CAPABILITY_CASES: Record<Family, CapabilityCase[]> = {
  AI: [
    { slug: "fenix-medical-center", chapter: "brain", still: "hero", line: { es: "Fénix: 1.096 videos médicos públicos indexados para escribir guiones con revisión de cumplimiento.", en: "Fénix: 1,096 public medical videos indexed to write scripts with compliance review." } },
    { slug: "fenix-medical-center", chapter: "engineering", still: "og", line: { es: "Fénix: QA hecho por agentes, con revisión humana antes de producción.", en: "Fénix: QA run by agents, with human review before production." } },
  ],
  Automation: [
    { slug: "ad-media-solution", chapter: "speed-to-lead", still: "hero", line: { es: "AD Media: del formulario al CRM, SMS y WhatsApp sin tareas manuales (datos de ejemplo).", en: "AD Media: from form to CRM, SMS and WhatsApp with no manual tasks (sample data)." } },
    { slug: "lb-elite-wash-detail", chapter: "cuadrilla", still: "hero", line: { es: "L&B: un toque de la cuadrilla en campo actualiza la cita en el calendario.", en: "L&B: one tap from the crew in the field updates the booking in the calendar." } },
    { slug: "fenix-medical-center", chapter: "site", still: "og", line: { es: "Fénix: reserva en 3 pasos contra la agenda real del CRM.", en: "Fénix: a 3-step booking against the CRM's real calendar." } },
  ],
  Backend: [
    { slug: "new-brothers-barberia", chapter: "constraints", still: "hero", line: { es: "New Brothers: 26 tablas con seguridad por fila y 4 roles.", en: "New Brothers: 26 tables with row-level security and 4 roles." } },
    { slug: "lb-elite-wash-detail", chapter: "arquitectura", still: "og", line: { es: "L&B: cero Postgres; el CRM es la base de datos y las funciones viven en serverless.", en: "L&B: zero Postgres; the CRM is the database and the logic runs serverless." } },
    { slug: "fenix-medical-center", chapter: "architecture", still: "og", line: { es: "Fénix: WAF, llave fail-closed y validación de 7 campos antes del CRM.", en: "Fénix: a WAF, a fail-closed switch and 7-field validation before the CRM." } },
  ],
  Web: [
    { slug: "truckers-choice", chapter: "bilingual", still: "hero", line: { es: "Truckers Choice: el mismo sitio en inglés y en español, con rutas espejo.", en: "Truckers Choice: the same site in English and Spanish, with mirrored routes." } },
    { slug: "evowrap", chapter: "selector", still: "hero", line: { es: "EvoWrap: configurador 3D de acabados sobre el vehículo.", en: "EvoWrap: a 3D finish configurator on the vehicle." } },
    { slug: "autohub-360", chapter: "tour", still: "hero", line: { es: "AutoHub 360: el interior del auto en 360°, con puntos para explorar.", en: "AutoHub 360: the car's interior in 360°, with points to explore." } },
    { slug: "america-tramites", chapter: "staged", still: "hero", line: { es: "América Trámites: un recorrido por etapas que aclara el alcance antes de pedir ayuda.", en: "América Trámites: a staged journey that clarifies scope before asking for help." } },
  ],
  Commerce: [
    { slug: "lnb-saas", chapter: "builder", still: "hero", line: { es: "La Nueva Brasil: tortas por capas, pedidos express y la suscripción LNB Pass.", en: "La Nueva Brasil: layered cakes, express orders and the LNB Pass subscription." } },
    { slug: "doge-sm", chapter: "tiers", still: "hero", line: { es: "DOGE.S.M: membresías en 3 niveles y una tienda de insumos.", en: "DOGE.S.M: 3-tier memberships and a supplies store." } },
    { slug: "punta-360", chapter: "workflow", still: "hero", line: { es: "Punta 360: planes de suscripción para agentes y agencias.", en: "Punta 360: subscription plans for agents and agencies." } },
  ],
  Marketing: [
    { slug: "ad-media-solution", chapter: "funnel", still: "og", line: { es: "AD Media: funnels de captación con un pipeline de 5 etapas.", en: "AD Media: acquisition funnels with a 5-stage pipeline." } },
    { slug: "fenix-medical-center", chapter: "positioning", still: "og", line: { es: "Fénix: 109 afirmaciones con redacción permitida y prohibida para comunicar sin prometer de más.", en: "Fénix: 109 claims with allowed and forbidden wording, so nothing overpromises." } },
    { slug: "punta-360", chapter: "comparison", still: "og", line: { es: "Punta 360: el comparador de foto de celular frente a producción editorial.", en: "Punta 360: a phone-photo versus editorial-production comparator." } },
  ],
  CRM: [
    { slug: "new-brothers-barberia", chapter: "product", still: "hero", line: { es: "New Brothers: agenda, clientes, caja y liquidaciones en un solo panel.", en: "New Brothers: schedule, clients, cash and payouts in one panel." } },
    { slug: "ad-media-solution", chapter: "speed-to-lead", still: "hero", line: { es: "AD Media: Speed-to-Lead y un pipeline de 5 etapas (datos de ejemplo).", en: "AD Media: Speed-to-Lead and a 5-stage pipeline (sample data)." } },
    { slug: "lb-elite-wash-detail", chapter: "cuadrilla", still: "hero", line: { es: "L&B: la app de la cuadrilla escribe en la cita del CRM.", en: "L&B: the crew app writes straight to the CRM booking." } },
  ],
  Media: [
    { slug: "mr-studio-tattoo", chapter: "body", still: "hero", line: { es: "Mr. Studio Tattoo: el cuerpo como formulario, con la estética del estudio.", en: "Mr. Studio Tattoo: the body as the form, in the studio's look." } },
    { slug: "rangel-oviedo-group", chapter: "identity", still: "og", line: { es: "Rangel Oviedo: una presencia editorial para una asesoría privada.", en: "Rangel Oviedo: an editorial presence for a private advisory." } },
    { slug: "hub-profesional-ai", chapter: "switcher", still: "hero", line: { es: "Hub Profesional: seis rubros, cada uno con su paleta y sus titulares.", en: "Hub Profesional: six fields, each with its own palette and headlines." } },
  ],
  Infrastructure: [
    { slug: "fenix-medical-center", chapter: "architecture", still: "hero", line: { es: "Fénix: el lead pasa por WAF y una validación estricta; los datos de salud quedan afuera.", en: "Fénix: the lead goes through a WAF and strict validation; health data stays out." } },
    { slug: "lb-elite-wash-detail", chapter: "arquitectura", still: "og", line: { es: "L&B: arquitectura sin base propia, con idempotencia en cada cita.", en: "L&B: an architecture with no database of its own and idempotent bookings." } },
    { slug: "new-brothers-barberia", chapter: "constraints", still: "og", line: { es: "New Brothers: Next.js y Supabase con seguridad por fila.", en: "New Brothers: Next.js and Supabase with row-level security." } },
  ],
};

/** Familias que demuestra un caso. */
export function capabilitiesOf(slug: string): Family[] {
  return (Object.keys(CAPABILITY_CASES) as Family[]).filter((family) => CAPABILITY_CASES[family].some((entry) => entry.slug === slug));
}

/** Casos que comparten familias con `slug`, los que más comparten primero. */
export function relatedCases(slug: string, limit = 3): Array<{ slug: string; shared: Family[] }> {
  const own = new Set(capabilitiesOf(slug));
  const scores = new Map<string, Family[]>();
  for (const family of own) {
    for (const entry of CAPABILITY_CASES[family]) {
      if (entry.slug === slug) continue;
      const shared = scores.get(entry.slug) ?? [];
      if (!shared.includes(family)) shared.push(family);
      scores.set(entry.slug, shared);
    }
  }
  const related = [...scores.entries()].map(([other, shared]) => ({ slug: other, shared })).sort((a, b) => b.shared.length - a.shared.length);
  // Si comparte poco, se completa con casos de otras familias (sin repetir).
  if (related.length < limit) {
    for (const family of Object.keys(CAPABILITY_CASES) as Family[]) {
      for (const entry of CAPABILITY_CASES[family]) {
        if (entry.slug !== slug && !related.some((item) => item.slug === entry.slug)) related.push({ slug: entry.slug, shared: [family] });
      }
    }
  }
  return related.slice(0, limit);
}
