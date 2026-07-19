import type { Metadata } from "next";
import { SystemsExperience } from "@/components/premium/SystemsExperience";

export const metadata: Metadata = { title: "Sistemas", description: "CRM, automatización e IA conectados a la operación real.", alternates: { canonical: "/sistemas", languages: { es: "/sistemas", en: "/en/sistemas" } } };
export default function SystemsPage() { return <SystemsExperience />; }
