import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CvDocument } from "./_components/CvDocument";

export const metadata: Metadata = pageMetadata("cv", "es");
export default function CvPage() { return <CvDocument language="es" />; }
