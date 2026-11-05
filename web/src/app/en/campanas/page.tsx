import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CampanasDocument } from "@/app/campanas/_components/CampanasDocument";

export const metadata: Metadata = pageMetadata("campanas", "en");
export default function EnglishCampanasPage() { return <CampanasDocument language="en" />; }
