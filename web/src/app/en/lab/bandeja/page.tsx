import type { Metadata } from "next";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { branchMetadata } from "@/lib/seo";
import { LabDemoDocument } from "@/app/lab/_components/LabDemoDocument";

export const metadata: Metadata = branchMetadata(`/lab/${LAB_SLUGS.inbox}`, "en", `${LAB_PAGE.demos.inbox.title.en} — Lab`, LAB_PAGE.demos.inbox.body.en);
export default function EnglishLabInboxPage() { return <LabDemoDocument demo="inbox" language="en" />; }
