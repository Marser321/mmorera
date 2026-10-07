import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/premium/CaseStudy";
import { UnderTheHood } from "@/components/premium/UnderTheHood";
import { hasArchitecture } from "@/data/architecture/registry";
import { getProjectCase, PROJECT_CASES } from "@/data/projectCases";
import { caseJsonLd, caseMetadata, jsonLdHtml } from "@/lib/caseSeo";

export function generateStaticParams() { return PROJECT_CASES.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCase(slug);
  return project ? caseMetadata(project, "en") : {};
}

export default async function EnglishCasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectCase(slug);
  if (!project) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(caseJsonLd(project, "en")) }} />
      <CaseStudy project={project} underTheHood={hasArchitecture(slug) ? <UnderTheHood slug={slug} language="en" brandSlug={slug} /> : null} />
    </>
  );
}
