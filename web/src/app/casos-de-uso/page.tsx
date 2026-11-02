import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CasosDeUsoDocument } from "@/app/casos-de-uso/_components/CasosDeUsoDocument";

export const metadata: Metadata = pageMetadata("casosDeUso", "es");
export default function CasosDeUsoPage() { return <CasosDeUsoDocument language="es" />; }
