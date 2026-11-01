import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/data/servicePages";
import { pageMetadata } from "@/lib/seo";
import { StudioExperience } from "@/components/premium/StudioExperience";
export const metadata: Metadata = pageMetadata("estudio", "en");
export default function EnglishStudioPage() { return <StudioExperience content={SERVICE_PAGES.estudio} />; }
