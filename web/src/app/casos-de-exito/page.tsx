import type { Metadata } from "next";
import { WorkExperience } from "@/components/premium/WorkExperience";

export const metadata: Metadata = {
  title: "Trabajo",
  description: "Casos y demos reales de experiencias, productos y sistemas.",
  alternates: { canonical: "/casos-de-exito", languages: { es: "/casos-de-exito", en: "/en/casos-de-exito" } },
};

export default function WorkPage() { return <WorkExperience />; }
