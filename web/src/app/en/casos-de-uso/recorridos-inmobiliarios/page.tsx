import type { Metadata } from "next";
import { RECORRIDOS_PAGE, RECORRIDOS_PATH } from "@/data/recorridos";
import { branchMetadata } from "@/lib/seo";
import { RecorridosDocument } from "@/app/casos-de-uso/_components/RecorridosDocument";

const p = RECORRIDOS_PAGE;
export const metadata: Metadata = branchMetadata(RECORRIDOS_PATH, "en", `${p.metaTitle.en} — ${p.metaSuffix.en}`, p.metaDescription.en);

export default function EnglishRecorridosPage() { return <RecorridosDocument language="en" />; }
