import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { CvDocument } from "@/app/cv/_components/CvDocument";

export const metadata: Metadata = pageMetadata("cv", "en");
export default function EnglishCvPage() { return <CvDocument language="en" />; }
