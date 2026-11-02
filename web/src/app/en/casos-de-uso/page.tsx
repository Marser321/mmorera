import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CasosDeUsoDocument } from "@/app/casos-de-uso/_components/CasosDeUsoDocument";

export const metadata: Metadata = pageMetadata("casosDeUso", "en");
export default function EnglishCasosDeUsoPage() { return <CasosDeUsoDocument language="en" />; }
