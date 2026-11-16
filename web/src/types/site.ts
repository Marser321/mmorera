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
  /** Formas que se dibujan una sola vez por sesión antes del desfile (la obertura del home). */
  intro?: readonly { name: string; holdMs: number; dissolveMs: number }[];
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
  /** Tecnologías y capacidades; las que se traducen van como `LocalizedText`. */
  stack: (string | LocalizedText)[];
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
  /** Ficha de prueba: lo primero que se lee en la página del caso. */
  proof?: CaseProof;
  /** Tráiler ya renderizado del caso: abre la página, antes de la ficha. */
  trailer?: CaseTrailer;
  /**
   * Quién vendió el proyecto. Con "ad-media" la página muestra al pie una sola
   * línea tenue; nunca va en títulos, fichas, tarjetas ni metadatos.
   */
  soldVia?: "ad-media";
}

/** Un tráiler en video (scripts/render-vespera.ts): AV1 primero, H.264 de respaldo y su póster. */
export interface CaseTrailer {
  mp4: string;
  webm: string;
  poster: string;
  seconds: number;
  /** Qué se ve, en una línea, para quien no lo reproduce. */
  caption: LocalizedText;
}

/**
 * Ficha de prueba de un caso. Todo sale de un dossier o del sitio en vivo:
 * nada de resultados de negocio sin confirmar.
 */
export interface CaseProof {
  /** El problema que había que resolver. */
  problem: LocalizedText;
  /** Lo que el sistema hace hoy. */
  now: LocalizedText;
  /** Un número del sistema. Si `verified` es falso, no se muestra. */
  metric: { value: string; label: LocalizedText; verified: boolean };
  /** Qué falló y cómo se resolvió, en una línea. */
  fixed?: LocalizedText;
  /** Qué falta, dicho tal cual. */
  pending?: LocalizedText;
  /** Dónde decide una persona. */
  humanStep?: LocalizedText;
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
