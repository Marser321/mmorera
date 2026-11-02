import type { Metadata } from "next";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { branchMetadata } from "@/lib/seo";
import { LabDemoDocument } from "@/app/lab/_components/LabDemoDocument";

export const metadata: Metadata = branchMetadata(`/lab/${LAB_SLUGS.tokens}`, "en", `${LAB_PAGE.demos.tokens.title.en} — Lab`, LAB_PAGE.demos.tokens.body.en);
export default function EnglishLabTokensPage() { return <LabDemoDocument demo="tokens" language="en" />; }
