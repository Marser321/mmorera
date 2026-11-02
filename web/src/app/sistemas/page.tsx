import type { Metadata } from "next";
import { SERVICE_PAGES } from "@/data/servicePages";
import { pageMetadata } from "@/lib/seo";
import { SystemsExperience } from "@/components/premium/SystemsExperience";

export const metadata: Metadata = pageMetadata("sistemas", "es");
export default function SystemsPage() { return <SystemsExperience content={SERVICE_PAGES.sistemas} />; }
