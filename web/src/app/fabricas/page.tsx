import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FabricasDocument } from "./_components/FabricasDocument";

export const metadata: Metadata = pageMetadata("fabricas", "es");
export default function FabricasPage() { return <FabricasDocument language="es" />; }
