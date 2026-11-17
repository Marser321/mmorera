import type { Metadata } from "next";
import { HeroEquipoMaqueta } from "./HeroEquipoMaqueta";

// Página de prueba: no va al sitemap ni se indexa. Se borra cuando el hero pase a la home.
export const metadata: Metadata = {
  title: "Maqueta del hero «El equipo»",
  robots: { index: false, follow: false },
};

export default function HeroEquipoPage() {
  return <HeroEquipoMaqueta />;
}
