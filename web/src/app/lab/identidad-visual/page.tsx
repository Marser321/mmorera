import type { Metadata } from "next";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { branchMetadata } from "@/lib/seo";
import { LabDemoDocument } from "@/app/lab/_components/LabDemoDocument";

export const metadata: Metadata = branchMetadata(`/lab/${LAB_SLUGS.tokens}`, "es", `${LAB_PAGE.demos.tokens.title.es} — Lab`, LAB_PAGE.demos.tokens.body.es);
export default function LabTokensPage() { return <LabDemoDocument demo="tokens" language="es" />; }
