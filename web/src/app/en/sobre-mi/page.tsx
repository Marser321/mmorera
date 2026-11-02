import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { SobreMiDocument } from "@/app/sobre-mi/_components/SobreMiDocument";

export const metadata: Metadata = pageMetadata("sobreMi", "en");
export default function EnglishSobreMiPage() { return <SobreMiDocument language="en" />; }
