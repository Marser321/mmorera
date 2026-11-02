import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { USE_CASES_PAGE, USE_CASE_SLUGS } from "@/data/branchPages";
import { USE_CASE_FILMS } from "@/data/films/systemsFilms";
import { BranchHeader } from "@/components/branches/BranchHeader";

/** /casos-de-uso: una puerta por film, con el problema como portada y el rótulo real/ejemplo. */
export function CasosDeUsoDocument({ language }: { language: "es" | "en" }) {
  const p = USE_CASES_PAGE;
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader eyebrow={p.eyebrow[language]} title={p.title[language]} body={p.body[language]} />
      <ul className="mx-auto grid w-full max-w-[1480px] gap-4 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
        {USE_CASE_FILMS.map((film) => (
          <li key={film.id}>
            <Link href={localePath(language, `/casos-de-uso/${USE_CASE_SLUGS[film.id]}`)} className="group flex h-full flex-col rounded-2xl lg:min-h-[20rem] border border-foreground/15 bg-card p-6 transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:p-8">
              <span className="flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[.16em]">
                <span className="text-foreground/60">{film.category[language]}</span>
                <span className={film.kind === "real" ? "text-signal" : "text-accent"}>{film.kind === "real" ? p.labels.real[language] : p.labels.example[language]}</span>
              </span>
              <span className="mt-10 block flex-1 text-2xl font-medium leading-tight tracking-[-.03em] text-foreground sm:text-3xl">{film.problem.headline[language]}</span>
              <span className="mt-8 flex items-center justify-between gap-3 border-t border-foreground/10 pt-4 text-sm text-foreground/80">
                <span>{film.title[language]}</span>
                <span className="inline-flex shrink-0 items-center gap-1 font-semibold text-foreground group-hover:text-signal">
                  {p.labels.watch[language]}
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
