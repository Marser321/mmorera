import type { Metadata } from "next";
import { HomeExperience } from "@/components/premium/HomeExperience";

// Página de prueba: la home de verdad con el escenario en el hero. No va al
// sitemap ni se indexa. Se borra cuando el hero pase a la home.
export const metadata: Metadata = {
  title: "Maqueta del hero con escenario",
  robots: { index: false, follow: false },
};

export default function HeroOrquestaPage() {
  return (
    <>
      <HomeExperience hero="orquesta" />
      <p data-maqueta className="pointer-events-none fixed right-4 top-[5.15rem] z-50 rounded-full border border-white/15 bg-black/70 px-3 py-1 sm:top-24 sm:px-3.5 sm:py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ECE7DD]/80 backdrop-blur-md">
        Maqueta<span className="hidden sm:inline"> del hero · todavía no está en la home</span>
      </p>
    </>
  );
}
