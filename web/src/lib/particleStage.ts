/**
 * Escenario del hero: dónde está la ventana de cine y de qué color es el
 * servicio que se ve. Lo escribe la ventana (HeroStage) y lo lee el campo de
 * partículas en cada cuadro, para armar su marco alrededor y teñirse.
 *
 * Es un store mutable a propósito, igual que particleScatter: la posición
 * cambia con el scroll y pasarla por contexto de React re-renderizaría todo.
 *
 * Las medidas van en coordenadas de pantalla normalizadas: x e y de -1 a 1,
 * con el origen al centro y la y hacia arriba.
 */
export interface ParticleStageState {
  /** Con el escenario activo, las partículas dejan su lugar de siempre y rodean la ventana. */
  active: boolean;
  /** Centro de la ventana. */
  cx: number;
  cy: number;
  /** Escala del marco: ancho del marco en píxeles, dividido por el alto de la pantalla y por 0.48. */
  scale: number;
  /** Color del servicio que se ve, o null para el color de siempre. */
  tint: string | null;
  /** Con el recorrido del escenario andando, una forma pasa directo a la siguiente en vez de soltarse. */
  morph: boolean;
  /** Formas que van a venir: se preparan antes, para que el cambio no espere a que se muestreen. */
  warm: readonly string[];
}

const state: ParticleStageState = { active: false, cx: 0, cy: 0, scale: 1, tint: null, morph: false, warm: [] };

export const particleStage = {
  get: (): Readonly<ParticleStageState> => state,
  set: (patch: Partial<ParticleStageState>) => {
    Object.assign(state, patch);
  },
  reset: () => {
    Object.assign(state, { active: false, tint: null });
  },
};

/** Cuánto tarda una forma en transformarse en la siguiente, en segundos. */
export const STAGE_MORPH_SECONDS = 1.05;

/** El marco es un poco más grande que la ventana, para que las partículas la abracen por fuera. */
export const STAGE_OUTSET_PX = 16;

/** Nombre del glifo que dibuja el marco. */
export const STAGE_FRAME_NAME = "stage:frame";
