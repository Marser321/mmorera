import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { HomeExperience } from "@/components/premium/HomeExperience";
export const metadata: Metadata = pageMetadata("inicio", "en");
export default function EnglishHomePage() { return <HomeExperience />; }
