import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/data/servicePages";
import { pageMetadata } from "@/lib/seo";
import { StudioExperience } from "@/components/premium/StudioExperience";

export const metadata: Metadata = pageMetadata("estudio", "es");
export default function StudioPage() { return <StudioExperience content={SERVICE_PAGES.estudio} />; }
