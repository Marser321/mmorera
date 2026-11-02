import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { InteractiveDesignTokenStudio } from "@/components/premium/estudio/InteractiveDesignTokenStudio";
import { OmnichannelInboxSimulator } from "@/components/premium/systems/OmnichannelInboxSimulator";

type LabDemo = keyof typeof LAB_SLUGS;

/** /lab/<demo>: la demo sola, con su encabezado y el paso a la otra. */
export function LabDemoDocument({ demo, language }: { demo: LabDemo; language: "es" | "en" }) {
  const p = LAB_PAGE;
  const other: LabDemo = demo === "tokens" ? "inbox" : "tokens";
  const link = "inline-flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader
        eyebrow={p.eyebrow[language]}
        title={p.demos[demo].title[language]}
        body={p.demos[demo].body[language]}
        back={{ href: localePath(language, "/lab"), label: p.back[language] }}
      />
      {demo === "tokens" ? (
        <div className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <InteractiveDesignTokenStudio showHeader={false} />
        </div>
      ) : (
        <OmnichannelInboxSimulator showHeader={false} />
      )}
      <nav aria-label={p.eyebrow[language]} className="mx-auto mt-12 flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        <Link href={localePath(language, "/lab")} className={link}>
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          {p.back[language]}
        </Link>
        <Link href={localePath(language, `/lab/${LAB_SLUGS[other]}`)} className={link}>
          {p.demos[other].title[language]}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </nav>
    </main>
  );
}
