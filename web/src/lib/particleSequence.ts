export const PARTICLE_IDENTIFIABLE_PROGRESS = 0.58;

export type ParticleSequencePhase = "idle" | "assemble" | "hold" | "dissolve";

export interface ParticleSequenceTarget<T> {
  name: string;
  index: number;
  cacheKey: string;
  payload: T;
}

export interface ParticleSequenceState<T> {
  current: ParticleSequenceTarget<T> | null;
  incoming: ParticleSequenceTarget<T> | null;
  confirmedName: string | null;
  phase: ParticleSequencePhase;
}

export type ParticleSequenceEvent<T> =
  | { type: "mount"; target: ParticleSequenceTarget<T> }
  | { type: "align-current"; target: ParticleSequenceTarget<T> }
  | { type: "queue"; target: ParticleSequenceTarget<T> }
  | { type: "begin-dissolve" }
  | { type: "promote" }
  | { type: "confirm" }
  | { type: "hold" }
  | { type: "discard-incoming" }
  | { type: "retain-current" }
  | { type: "clear" };

export function createParticleSequenceState<T>(): ParticleSequenceState<T> {
  return {
    current: null,
    incoming: null,
    confirmedName: null,
    phase: "idle",
  };
}

/**
 * Pure transition controller for the global particle canvas. It deliberately
 * exposes only a current and an incoming target, keeping the GPU-side working
 * set bounded while sampling remains globally cached outside this state.
 */
export function reduceParticleSequence<T>(
  state: ParticleSequenceState<T>,
  event: ParticleSequenceEvent<T>,
): ParticleSequenceState<T> {
  switch (event.type) {
    case "mount":
      return {
        current: event.target,
        incoming: null,
        confirmedName: state.confirmedName,
        phase: "assemble",
      };
    case "align-current":
      if (state.current?.cacheKey !== event.target.cacheKey) return state;
      return { ...state, current: event.target, incoming: null };
    case "queue":
      if (state.current?.cacheKey === event.target.cacheKey) {
        return { ...state, incoming: null };
      }
      return { ...state, incoming: event.target };
    case "begin-dissolve":
      return state.current ? { ...state, phase: "dissolve" } : state;
    case "promote":
      if (!state.incoming) return state;
      return {
        current: state.incoming,
        incoming: null,
        confirmedName: state.confirmedName,
        phase: "assemble",
      };
    case "confirm":
      return state.current
        ? { ...state, confirmedName: state.current.name }
        : state;
    case "hold":
      return state.current ? { ...state, phase: "hold" } : state;
    case "discard-incoming":
      return { ...state, incoming: null };
    case "retain-current":
      return {
        ...state,
        incoming: null,
        phase: state.current ? "hold" : "idle",
      };
    case "clear":
      return createParticleSequenceState<T>();
  }
}

export function nextParticleSequenceIndex(index: number, length: number): number {
  return length > 0 ? (index + 1) % length : 0;
}
