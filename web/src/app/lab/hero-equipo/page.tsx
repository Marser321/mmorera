import type { Metadata } from "next";
import { HomeExperience } from "@/components/premium/HomeExperience";

// Página de prueba: la home de verdad con el hero del film. No va al sitemap
// ni se indexa. Se borra cuando el hero pase a la home.
export const metadata: Metadata = {
  title: "Maqueta del hero «El equipo»",
  robots: { index: false, follow: false },
};

export default function HeroEquipoPage() {
  return (
    <>
      <HomeExperience hero="equipo" />
      <p data-maqueta className="pointer-events-none fixed right-4 top-24 z-50 rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ECE7DD]/80 backdrop-blur-md">
        Maqueta del hero · todavía no está en la home
      </p>
    </>
  );
}
