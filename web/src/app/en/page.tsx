import type { Metadata } from "next";
import { HomeExperience } from "@/components/premium/HomeExperience";
export const metadata: Metadata = { title: "Creative Technologist & Systems Builder", description: "I design and build experiences, products and systems, from concept to operations.", alternates: { canonical: "/en", languages: { es: "/", en: "/en" } } };
export default function EnglishHomePage() { return <HomeExperience />; }
