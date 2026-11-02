import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { USE_CASE_SLUGS, findUseCaseBySlug } from "@/data/branchPages";
import { USE_CASE_FILMS } from "@/data/films/systemsFilms";
import { branchMetadata } from "@/lib/seo";
import { UseCaseDocument } from "@/app/casos-de-uso/_components/UseCaseDocument";

const SUFFIX = "Use cases";

export function generateStaticParams() { return Object.values(USE_CASE_SLUGS).map((caso) => ({ caso })); }

export async function generateMetadata({ params }: { params: Promise<{ caso: string }> }): Promise<Metadata> {
  const id = findUseCaseBySlug((await params).caso);
  const film = id ? USE_CASE_FILMS.find((item) => item.id === id) : undefined;
  if (!id || !film) return {};
  return branchMetadata(`/casos-de-uso/${USE_CASE_SLUGS[id]}`, "en", `${film.title.en} — ${SUFFIX}`, `${film.problem.headline.en} ${film.result.headline.en}`);
}

export default async function EnglishUseCasePage({ params }: { params: Promise<{ caso: string }> }) {
  const id = findUseCaseBySlug((await params).caso);
  if (!id) notFound();
  return <UseCaseDocument id={id} language="en" />;
}
