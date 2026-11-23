"use client";

import { useVisitaDemo } from "./useVisitaDemo";

/** Registra la visita de un enlace personal en una página que no es de /demos. */
export function RegistroVisita({ pagina, de }: { pagina: string; de: string }) {
  useVisitaDemo(pagina, de);
  return null;
}
