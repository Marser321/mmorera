import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { CAPABILITIES_PAGE, CAPABILITY_SERVICE, CAPABILITY_SLUGS } from "@/data/branchPages";
import { SKILL_ORBIT, techsForFamily } from "@/data/skillOrbit";
import type { Family } from "@/data/techStack";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { FamilyParticles } from "@/components/branches/FamilyParticles";
import { CapabilityFilmPanel } from "@/components/premium/estudio/CapabilityFilmPanel";

const heading = "text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-.03em] text-foreground";

/** /capacidades/<familia>: su film (con los casos que la prueban), herramientas, servicio y familias conectadas. */
export function FamilyDocument({ family, language }: { family: Family; language: "es" | "en" }) {
  const node = SKILL_ORBIT.find((item) => item.id === family)!;
  const f = CAPABILITIES_PAGE.family;
  const service = CAPABILITY_SERVICE[family];
  const related = node.related.flatMap((id) => SKILL_ORBIT.filter((item) => item.id === id));
  const techs = techsForFamily(family);
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <FamilyParticles families={[family]} />
      <BranchHeader
        eyebrow={CAPABILITIES_PAGE.eyebrow[language]}
        title={node.label[language]}
        body={node.blurb[language]}
        back={{ href: localePath(language, "/capacidades"), label: f.back[language] }}
      />
      <section aria-label={f.film[language]} className="mx-auto w-full max-w-5xl px-5 sm:px-8 lg:px-12">
        <CapabilityFilmPanel family={family} language={language} showHint={false} />
      </section>
      <div className="mx-auto mt-16 grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
        <section aria-labelledby="familia-herramientas">
          <h2 id="familia-herramientas" className={heading}>{f.tools[language]}</h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {techs.map((tech) => (
              <li key={tech.name} className="rounded-full border border-foreground/15 px-3 py-1.5 text-sm text-foreground/80">{tech.label?.[language] ?? tech.name}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="familia-servicio">
          <h2 id="familia-servicio" className={heading}>{f.service[language]}</h2>
          <Link href={localePath(language, service.path)} className="mt-5 inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            {service.label[language]}
            <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </section>
        <section aria-labelledby="familia-conexiones">
          <h2 id="familia-conexiones" className={heading}>{f.related[language]}</h2>
          <ul className="mt-5 grid gap-2">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={localePath(language, `/capacidades/${CAPABILITY_SLUGS[item.id]}`)} className="inline-flex min-h-11 items-center gap-3 text-base text-foreground/85 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.label[language]}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
