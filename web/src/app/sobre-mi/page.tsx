import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SobreMiDocument } from "./_components/SobreMiDocument";

export const metadata: Metadata = pageMetadata("sobreMi", "es");
export default function SobreMiPage() { return <SobreMiDocument language="es" />; }
