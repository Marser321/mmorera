import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { AgentesDocument } from "./_components/AgentesDocument";

export const metadata: Metadata = pageMetadata("agentes", "es");
export default function AgentesPage() { return <AgentesDocument language="es" />; }
