import type { Metadata } from "next";
import { SystemsExperience } from "@/components/premium/SystemsExperience";

export const metadata: Metadata = { title: "Sistemas", description: "CRM, IA y automatización conectados con la operación real.", alternates: { canonical: "/sistemas", languages: { "es-UY": "/sistemas", en: "/en/sistemas" } } };
export default function SystemsPage() { return <SystemsExperience />; }
