import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SystemsExperience } from "@/components/premium/SystemsExperience";

export const metadata: Metadata = pageMetadata("sistemas", "es");
export default function SystemsPage() { return <SystemsExperience />; }
