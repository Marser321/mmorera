import type { Metadata } from "next";
import { HomeExperience } from "@/components/premium/HomeExperience";
import { isTrackMode, resolveTrackMode } from "@/data/trackModes";
export const metadata: Metadata = { title: "Creative Technologist & Systems Builder", description: "I design and build experiences, products and systems across creative technology, development, AI, automation and CRM.", alternates: { canonical: "/en", languages: { "es-UY": "/", en: "/en" } } };
export default async function EnglishHomePage({ searchParams }: { searchParams: Promise<{ modo?: string }> }) { const { modo } = await searchParams; return <HomeExperience initialTrack={resolveTrackMode(modo)} initialModeSelected={isTrackMode(modo)} />; }
