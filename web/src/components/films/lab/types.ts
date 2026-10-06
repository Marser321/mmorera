import type { ReactNode } from "react";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";

/** Contexto que recibe cada demo del laboratorio de escenas. */
export interface LabContext {
  language: FilmLanguage;
  format: FilmFormatName;
  portrait: boolean;
  width: number;
  height: number;
}

/** Una escena aislada para revisar cuadro por cuadro en /films-lab (solo dev). */
export interface LabDemo {
  /** Duración de la demo en frames (30 fps). */
  duration: number;
  /** Marca con la que se muestra por defecto. */
  brand?: string;
  render: (context: LabContext) => ReactNode;
}
