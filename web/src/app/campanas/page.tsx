import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CampanasDocument } from "./_components/CampanasDocument";

export const metadata: Metadata = pageMetadata("campanas", "es");
export default function CampanasPage() { return <CampanasDocument language="es" />; }
