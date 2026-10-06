import type { Metadata } from "next";
import { TechRadarBackstageStudio } from "@/components/premium/systems/TechRadarBackstageStudio";
import { MotionBackdrop } from "@/components/shared/MotionBackdrop";
import { MOTION_ASSETS } from "@/data/motionAssets";

export const metadata: Metadata = {
  title: "Tech Intelligence Radar & Backstage Studio | Mario Morera",
  description:
    "Live ecosystem intelligence for WhatsApp API, LLMs (Claude, GPT-4o, Gemini, DeepSeek), CRMs, and anti-dispersion video recording blueprints.",
  // Herramienta interna (solo `next dev`): nunca indexable.
  robots: { index: false, follow: false },
};

export default function EnglishRadarPage() {
  return (
    <main
      id="contenido-principal"
      className="relative isolate min-h-screen overflow-hidden bg-transparent px-5 pb-24 pt-36 sm:px-8 sm:pt-44 lg:px-12"
    >
      <MotionBackdrop asset={MOTION_ASSETS.pulse} intensity={0.25} scrim="form" priority />
      <div className="relative z-10 mx-auto max-w-[1480px]">
        <TechRadarBackstageStudio />
      </div>
    </main>
  );
}
