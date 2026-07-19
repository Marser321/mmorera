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
  liveUrl?: string;
  demoUrl?: string;
  embeddable?: boolean;
  accent?: string;
  repoUrl?: string;
  status: "featured" | "archive";
  year?: string;
  client?: LocalizedText;
  kind?: LocalizedText;
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
