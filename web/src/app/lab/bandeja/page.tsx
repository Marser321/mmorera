import type { Metadata } from "next";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { branchMetadata } from "@/lib/seo";
import { LabDemoDocument } from "@/app/lab/_components/LabDemoDocument";

export const metadata: Metadata = branchMetadata(`/lab/${LAB_SLUGS.inbox}`, "es", `${LAB_PAGE.demos.inbox.title.es} — Lab`, LAB_PAGE.demos.inbox.body.es);
export default function LabInboxPage() { return <LabDemoDocument demo="inbox" language="es" />; }
