import Link from "next/link";
import { ArrowUpRight, Inbox, Palette } from "lucide-react";
import { localePath } from "@/config/site";
import { LAB_PAGE, LAB_SLUGS } from "@/data/branchPages";
import { BranchHeader } from "@/components/branches/BranchHeader";

const ICONS = { tokens: Palette, inbox: Inbox } as const;

/** /lab: una puerta por demo interactiva. */
export function LabDocument({ language }: { language: "es" | "en" }) {
  const p = LAB_PAGE;
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader eyebrow={p.eyebrow[language]} title={p.title[language]} body={p.body[language]} />
      <ul className="mx-auto grid w-full max-w-[1480px] gap-4 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
        {(Object.keys(LAB_SLUGS) as Array<keyof typeof LAB_SLUGS>).map((demo) => {
          const Icon = ICONS[demo];
          return (
            <li key={demo}>
              <Link href={localePath(language, `/lab/${LAB_SLUGS[demo]}`)} className="group flex h-full flex-col rounded-2xl border border-foreground/15 bg-card p-6 transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8">
                <Icon aria-hidden="true" className="h-6 w-6 text-signal" />
                <span className="mt-8 block text-2xl font-medium leading-tight tracking-[-.03em] text-foreground sm:text-3xl">{p.demos[demo].title[language]}</span>
                <span className="mt-3 block flex-1 text-base leading-relaxed text-foreground/70">{p.demos[demo].body[language]}</span>
                <span className="mt-8 inline-flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-signal">
                  {p.try[language]}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
