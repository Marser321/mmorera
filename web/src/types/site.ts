export type LocalizedText = {
  es: string;
  en: string;
};

export type TrackId = "create" | "build" | "scale";

export type ParticleSceneId = "identity" | TrackId | "crm" | "case";

export type ParticlePresentationMode = "sequence" | "locked" | "ambient";

export type ParticleAnchor = "hero-right" | "hero-center" | "ambient";

export interface ParticleSceneDefinition {
  id: ParticleSceneId;
  mode: ParticlePresentationMode;
  techNames: readonly string[];
  accent: string;
  anchor: ParticleAnchor;
  density: number;
  intensity: number;
  interaction: "repel-attract" | "ambient" | "static";
  timing: {
    assembleMs: number;
    holdMs: number;
    dissolveMs: number;
  };
  fallback: string;
}

/** Un enlace «Pruébalo tú»: una ruta verificada (T28) que cualquiera puede abrir. */
export interface TryItLink {
  href: LocalizedText;
  label: LocalizedText;
  /** "live": el sistema real del cliente; "demo": una instancia con datos de muestra. */
  kind: "live" | "demo";
  /** Aviso corto bajo el botón, por ejemplo que no hace falta enviar nada. */
  note?: LocalizedText;
}

export interface ProjectCase {
  slug: string;
  title: LocalizedText;
  summary: LocalizedText;
  tracks: TrackId[];
  role: LocalizedText;
  challenge: LocalizedText;
  constraints: LocalizedText[];
  decisions: LocalizedText[];
  result: LocalizedText;
  evidence: LocalizedText[];
  stack: string[];
  media: { src: string; alt: LocalizedText }[];
  /** Hold the generic Remotion case film until the owner supplies this case's cinematic. */
  cinematicPending?: boolean;
  liveUrl?: string;
  demoUrl?: string;
  embeddable?: boolean;
  accent?: string;
  repoUrl?: string;
  status: "featured" | "archive";
  year?: string;
  client?: LocalizedText;
  kind?: LocalizedText;
  /** Rutas para probar el sistema (verificadas por Gemini en T28). */
  tryIt?: TryItLink[];
}

export interface SiteIdentity {
  brand: string;
  role: LocalizedText;
  canonical: string;
  locale: { default: "es"; alternate: "en" };
  contact: {
    email: string;
    whatsapp: string;
  };
  metadata: {
    title: LocalizedText;
    description: LocalizedText;
  };
}
