import type { Metadata } from "next";
import { HomeExperience } from "@/components/premium/HomeExperience";
export const metadata: Metadata = { title: "AI Automation & Operations", description: "I orchestrate technology for businesses and teams: websites, automations, AI agents and AI content. You work directly with me, remotely.", alternates: { canonical: "/en", languages: { es: "/", en: "/en" } } };
export default function EnglishHomePage() { return <HomeExperience />; }
