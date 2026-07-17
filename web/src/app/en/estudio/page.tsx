import type { Metadata } from "next";
import { StudioExperience } from "@/components/premium/StudioExperience";
export const metadata: Metadata = { title: "Studio", description: "Visual direction, web experiences, motion and creative technology.", alternates: { canonical: "/en/estudio", languages: { "es-UY": "/estudio", en: "/en/estudio" } } };
export default function EnglishStudioPage() { return <StudioExperience />; }
