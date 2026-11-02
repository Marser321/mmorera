import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CAPABILITY_SLUGS, familyFromSlug } from "@/data/branchPages";
import { SKILL_ORBIT } from "@/data/skillOrbit";
import { branchMetadata } from "@/lib/seo";
import { FamilyDocument } from "@/app/capacidades/_components/FamilyDocument";

const SUFFIX = "Capacidades";

export function generateStaticParams() { return Object.values(CAPABILITY_SLUGS).map((familia) => ({ familia })); }

export async function generateMetadata({ params }: { params: Promise<{ familia: string }> }): Promise<Metadata> {
  const family = familyFromSlug((await params).familia);
  const node = family ? SKILL_ORBIT.find((item) => item.id === family) : undefined;
  if (!family || !node) return {};
  return branchMetadata(`/capacidades/${CAPABILITY_SLUGS[family]}`, "es", `${node.label.es} — ${SUFFIX}`, node.blurb.es);
}

export default async function FamilyPage({ params }: { params: Promise<{ familia: string }> }) {
  const family = familyFromSlug((await params).familia);
  if (!family) notFound();
  return <FamilyDocument family={family} language="es" />;
}
