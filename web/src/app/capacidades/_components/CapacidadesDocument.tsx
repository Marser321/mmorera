import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { CAPABILITIES_PAGE, CAPABILITY_SLUGS } from "@/data/branchPages";
import { SKILL_ORBIT } from "@/data/skillOrbit";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { CapabilitiesExplorer } from "@/components/branches/CapabilitiesExplorer";

const ALL = { es: "Las nueve capacidades", en: "All nine capabilities" };

/** /capacidades: el menú de capacidades (órbita + film) y una puerta a cada familia. */
export function CapacidadesDocument({ language }: { language: "es" | "en" }) {
  const p = CAPABILITIES_PAGE;
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader eyebrow={p.eyebrow[language]} title={p.title[language]} body={p.body[language]} />
      <CapabilitiesExplorer language={language} />
      <section aria-labelledby="capacidades-todas" className="mx-auto w-full max-w-[1480px] px-5 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <h2 id="capacidades-todas" className="text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground">{ALL[language]}</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_ORBIT.map((family) => (
            <li key={family.id}>
              <Link href={localePath(language, `/capacidades/${CAPABILITY_SLUGS[family.id]}`)} className="group flex h-full flex-col rounded-2xl border border-foreground/15 bg-background/70 p-5 transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="flex items-center justify-between gap-3 text-lg font-medium text-foreground">
                  <span className="flex items-center gap-3">
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: family.color }} />
                    {family.label[language]}
                  </span>
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground/50 transition-colors group-hover:text-signal" />
                </span>
                <span className="mt-3 text-sm leading-relaxed text-foreground/70">{family.blurb[language]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
