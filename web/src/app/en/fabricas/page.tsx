import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { FabricasDocument } from "@/app/fabricas/_components/FabricasDocument";

export const metadata: Metadata = pageMetadata("fabricas", "en");
export default function EnglishFabricasPage() { return <FabricasDocument language="en" />; }
