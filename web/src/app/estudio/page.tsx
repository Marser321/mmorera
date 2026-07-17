import type { Metadata } from "next";
import { StudioExperience } from "@/components/premium/StudioExperience";

export const metadata: Metadata = { title: "Estudio", description: "Dirección visual, experiencias web, motion y tecnología creativa.", alternates: { canonical: "/estudio", languages: { "es-UY": "/estudio", en: "/en/estudio" } } };
export default function StudioPage() { return <StudioExperience />; }
