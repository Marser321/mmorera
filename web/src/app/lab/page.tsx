import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LabDocument } from "@/app/lab/_components/LabDocument";

export const metadata: Metadata = pageMetadata("lab", "es");
export default function LabPage() { return <LabDocument language="es" />; }
