import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SystemsExperience } from "@/components/premium/SystemsExperience";
export const metadata: Metadata = pageMetadata("sistemas", "en");
export default function EnglishSystemsPage() { return <SystemsExperience />; }
