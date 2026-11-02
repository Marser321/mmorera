import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { USE_CASES_PAGE, USE_CASE_SERVICE, USE_CASE_SLUGS } from "@/data/branchPages";
import { USE_CASE_FILMS } from "@/data/films/systemsFilms";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { UseCaseFilmRoom } from "@/components/films/UseCaseFilmRoom";

const heading = "text-[clamp(1.6rem,2.6vw,2.4rem)] font-medium leading-tight tracking-[-.03em] text-foreground";

/** /casos-de-uso/<caso>: su film, el caso contado en texto, el servicio que lo resuelve y los otros casos. */
export function UseCaseDocument({ id, language }: { id: string; language: "es" | "en" }) {
  const film = USE_CASE_FILMS.find((item) => item.id === id)!;
  const l = USE_CASES_PAGE.labels;
  const service = USE_CASE_SERVICE[id];
  const others = USE_CASE_FILMS.filter((item) => item.id !== id);
  const kind = film.kind === "real" ? `${l.real[language]} · ${film.caseTitle?.[language] ?? ""}` : l.example[language];
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader
        eyebrow={`${film.category[language]} · ${kind}`}
        title={film.title[language]}
        body={film.result.headline[language]}
        back={{ href: localePath(language, "/casos-de-uso"), label: l.back[language] }}
      />
      <UseCaseFilmRoom only={id} showHeader={false} />
      <div className="mx-auto mt-16 grid w-full max-w-[1480px] gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:px-12">
        {/* El subtítulo del film muestra un capítulo por vez: acá queda el caso entero, para leerlo sin reproducir. */}
        <section aria-labelledby="caso-texto">
          <h2 id="caso-texto" className={heading}>{l.story[language]}</h2>
          <ol className="mt-6 grid gap-6 sm:grid-cols-2">
            {film.chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <p className="font-mono text-[10px] uppercase tracking-[.16em] text-signal">0{index + 1} · {chapter.label[language]}</p>
                <p className="mt-2 text-base leading-relaxed text-foreground/80">{chapter.caption[language]}</p>
              </li>
            ))}
          </ol>
        </section>
        <div className="grid content-start gap-12">
          <section aria-labelledby="caso-servicio">
            <h2 id="caso-servicio" className={heading}>{l.service[language]}</h2>
            <Link href={localePath(language, service.path)} className="mt-5 inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {service.label[language]}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </section>
          <section aria-labelledby="caso-otros">
            <h2 id="caso-otros" className={heading}>{l.others[language]}</h2>
            <ul className="mt-5 grid gap-2">
              {others.map((item) => (
                <li key={item.id}>
                  <Link href={localePath(language, `/casos-de-uso/${USE_CASE_SLUGS[item.id]}`)} className="inline-flex min-h-11 items-center gap-2 text-base text-foreground/85 hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {item.title[language]}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
