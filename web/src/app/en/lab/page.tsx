import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LabDocument } from "@/app/lab/_components/LabDocument";

export const metadata: Metadata = pageMetadata("lab", "en");
export default function EnglishLabPage() { return <LabDocument language="en" />; }
