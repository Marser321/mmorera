import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Inbox, Palette } from "lucide-react";
import { localePath } from "@/config/site";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { branchPreview } from "@/data/branchPreviews";
import { getCaseMedia } from "@/data/caseMedia";
import { getProjectCase } from "@/data/projectCases";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { HoverReel } from "@/components/shared/HoverReel";
import { TryItButtons } from "@/components/shared/TryItButtons";

const ICONS = { tokens: Palette, inbox: Inbox } as const;

/**
 * /lab: una puerta por demo interactiva del sitio, con su captura, y debajo
 * las demos completas que viven fuera (el CRM de la barbería, Oficio y Vespera).
 */
export function LabDocument({ language }: { language: "es" | "en" }) {
  const p = LAB_PAGE;
  const full = p.full.slugs.flatMap((slug) => {
    const project = getProjectCase(slug);
    const demos = project?.tryIt?.filter((link) => link.kind === "demo") ?? [];
    return project && demos.length ? [{ project, demos, reel: getCaseMedia(slug)?.reel }] : [];
  });
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader eyebrow={p.eyebrow[language]} title={p.title[language]} body={p.body[language]} />
      <ul className="mx-auto grid w-full max-w-[1480px] gap-4 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
        {(Object.keys(LAB_SLUGS) as Array<keyof typeof LAB_SLUGS>).map((demo) => {
          const Icon = ICONS[demo];
          return (
            <li key={demo}>
              <Link href={localePath(language, `/lab/${LAB_SLUGS[demo]}`)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                {/* La demo misma, capturada del sitio. */}
                <span data-lab-preview className="relative block aspect-[2/1] overflow-hidden border-b border-foreground/10 bg-[#0B0B0A]">
                  <Image src={branchPreview("lab", demo, language)} alt="" fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
                </span>
                <span className="flex flex-1 flex-col p-6 sm:p-8">
                  <span className="flex items-center gap-3 text-2xl font-medium leading-tight tracking-[-.03em] text-foreground sm:text-3xl">
                    <Icon aria-hidden="true" className="h-6 w-6 shrink-0 text-signal" />
                    {p.demos[demo].title[language]}
                  </span>
                  <span className="mt-3 block flex-1 text-base leading-relaxed text-foreground/70">{p.demos[demo].body[language]}</span>
                  <span className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-signal">
                    {p.try[language]}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Demos completas: productos enteros, fuera de este sitio. Cada botón dice qué datos usa. */}
      {full.length > 0 && (
        <section data-lab-full aria-labelledby="lab-completas" className="mx-auto mt-16 w-full max-w-[1480px] px-5 sm:mt-20 sm:px-8 lg:px-12">
          <h2 id="lab-completas" className="text-3xl font-medium leading-tight tracking-[-.03em] text-foreground">{p.full.title[language]}</h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-foreground/75">{p.full.body[language]}</p>
          <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {full.map(({ project, demos, reel }) => (
              <li key={project.slug} className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-card">
                {reel && <HoverReel reel={reel} name={project.title[language]} language={language} className="aspect-[16/10] border-b border-foreground/10 bg-[#0B0B0A]" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />}
                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  {project.kind && <p className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/60">{project.kind[language]}</p>}
                  <h3 className="mt-3 text-2xl font-medium leading-tight tracking-[-.03em] text-foreground">
                    <Link href={localePath(language, `/casos-de-exito/${project.slug}`)} className="hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{project.title[language]}</Link>
                  </h3>
                  <p className="my-4 flex-1 text-sm leading-relaxed text-foreground/75">{project.proof?.now[language] ?? project.summary[language]}</p>
                  <TryItButtons links={demos} language={language} idPrefix={`lab-${project.slug}`} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
