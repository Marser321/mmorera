import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/premium/CaseStudy";
import { getProjectCase, PROJECT_CASES } from "@/data/projectCases";
export function generateStaticParams() { return PROJECT_CASES.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const { slug } = await params; const project = getProjectCase(slug); if (!project) return {}; return { title: project.title.en, description: project.summary.en, alternates: { canonical: `/en/casos-de-exito/${slug}`, languages: { es: `/casos-de-exito/${slug}`, en: `/en/casos-de-exito/${slug}` } }, openGraph: { images: [{ url: project.media[0].src, alt: project.media[0].alt.en }] } }; }
export default async function EnglishCasePage({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; const project = getProjectCase(slug); if (!project) notFound(); return <CaseStudy project={project} />; }
