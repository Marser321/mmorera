import type { Metadata } from "next";
import { WorkExperience } from "@/components/premium/WorkExperience";
export const metadata: Metadata = { title: "Work", description: "Real, deployed demos of the projects Mario Morera can build: web, product, AI and automation.", alternates: { canonical: "/en/casos-de-exito", languages: { "es-UY": "/casos-de-exito", en: "/en/casos-de-exito" } } };
export default function EnglishWorkPage() { return <WorkExperience />; }
