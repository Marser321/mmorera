import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { StudioExperience } from "@/components/premium/StudioExperience";
export const metadata: Metadata = pageMetadata("estudio", "en");
export default function EnglishStudioPage() { return <StudioExperience />; }
