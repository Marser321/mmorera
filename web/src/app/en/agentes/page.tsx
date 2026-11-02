import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AgentesDocument } from "@/app/agentes/_components/AgentesDocument";

export const metadata: Metadata = pageMetadata("agentes", "en");
export default function EnglishAgentesPage() { return <AgentesDocument language="en" />; }
