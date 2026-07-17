import type { Metadata } from "next";
import { WorkExperience } from "@/components/premium/WorkExperience";

export const metadata: Metadata = {
  title: "Trabajo",
  description: "Demos reales y desplegadas de los proyectos que Mario Morera puede construir: web, producto, IA y automatización.",
  alternates: { canonical: "/casos-de-exito", languages: { "es-UY": "/casos-de-exito", en: "/en/casos-de-exito" } },
};

export default function WorkPage() { return <WorkExperience />; }
