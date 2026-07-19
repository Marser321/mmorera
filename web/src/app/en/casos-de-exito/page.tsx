import type { Metadata } from "next";
import { WorkExperience } from "@/components/premium/WorkExperience";
export const metadata: Metadata = { title: "Work", description: "Real cases and demos of experiences, products and systems.", alternates: { canonical: "/en/casos-de-exito", languages: { es: "/casos-de-exito", en: "/en/casos-de-exito" } } };
export default function EnglishWorkPage() { return <WorkExperience />; }
