/**
 * Film del hero «El equipo» (guion en docs/films/HERO-EQUIPO.md). Dos cortes:
 * uno ancho para pantallas grandes y uno alto para teléfono. Los genera
 * `npx tsx scripts/render-hero-montaje.ts`.
 *
 * `poster` es el primer cuadro, para que el video arranque sin salto.
 * `still` es el plano que cuenta la historia: lo que ve quien pidió
 * movimiento reducido, que nunca ve el film.
 */
export interface HeroFilmCut {
  mp4: string;
  webm: string;
  poster: string;
  still: string;
  width: number;
  height: number;
}

function cut(name: string, width: number, height: number): HeroFilmCut {
  const base = `/portfolio/hero/equipo-${name}`;
  return { mp4: `${base}.mp4`, webm: `${base}.webm`, poster: `${base}-poster.jpg`, still: `${base}-quieto.jpg`, width, height };
}

export const HERO_FILM = {
  wide: cut("ancho", 1920, 1080),
  tall: cut("alto", 1080, 1350),
} as const;

/** Por debajo de este ancho el film va en su propia ventana, con el corte alto. */
export const HERO_FILM_PHONE_QUERY = "(max-width: 639px)";

export const HERO_FILM_ALT = {
  es: "Cinco robots de escritorio, uno por servicio, discuten por un pedido hasta que una mano los ordena y lo resuelven juntos.",
  en: "Five desk robots, one per service, argue over a request until a hand brings order and they solve it together.",
} as const;
