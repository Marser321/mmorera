import type { Metadata } from "next";
import { jsonLdHtml, listaCasosJsonLd, pageMetadata } from "@/lib/seo";
import { ARCHIVE_CASES, FEATURED_CASES } from "@/data/projectCases";
import { WorkExperience } from "@/components/premium/WorkExperience";

export const metadata: Metadata = pageMetadata("trabajo", "es");

// El archivo como lista para los buscadores, en el mismo orden que se ve.
const casosJsonLd = jsonLdHtml(listaCasosJsonLd([...FEATURED_CASES, ...ARCHIVE_CASES], "es"));

export default function WorkPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: casosJsonLd }} />
      <WorkExperience />
    </>
  );
}
