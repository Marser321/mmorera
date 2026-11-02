import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CapacidadesDocument } from "@/app/capacidades/_components/CapacidadesDocument";

export const metadata: Metadata = pageMetadata("capacidades", "es");
export default function CapacidadesPage() { return <CapacidadesDocument language="es" />; }
