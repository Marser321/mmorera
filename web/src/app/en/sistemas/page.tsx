import type { Metadata } from "next";
import { SystemsExperience } from "@/components/premium/SystemsExperience";
export const metadata: Metadata = { title: "Systems", description: "CRM, automation and AI connected to real operations.", alternates: { canonical: "/en/sistemas", languages: { es: "/sistemas", en: "/en/sistemas" } } };
export default function EnglishSystemsPage() { return <SystemsExperience />; }
