import { ArrowUpRight } from "lucide-react";
import { ServicePage } from "@/components/service/ServicePage";
import { CampanasFilmRoom } from "@/components/films/CampanasFilmRoom";
import { CAMPANAS_JOBS, CAMPANAS_PAGE, CAMPANAS_RADAR } from "@/data/campanas";
import { SERVICE_PAGES } from "@/data/servicePages";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const heading = "text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground";
const label = "font-mono text-[10px] uppercase tracking-[.16em]";

/** Seis trabajos de una cuenta: qué hace la máquina y qué queda en manos de una persona. */
function JobsLedger({ language }: { language: "es" | "en" }) {
  const p = CAMPANAS_PAGE.jobs;
  return (
    <section aria-labelledby="campanas-trabajos" className={`${container} mt-16 sm:mt-24`}>
      <h3 id="campanas-trabajos" className={`${heading} max-w-4xl`}>{p.title[language]}</h3>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75 sm:text-lg">{p.body[language]}</p>
      <div aria-hidden="true" className={`${label} mt-10 hidden gap-8 text-foreground/60 lg:grid lg:grid-cols-[minmax(0,.7fr)_minmax(0,1fr)_minmax(0,1fr)]`}>
        <span>{p.work[language]}</span>
        <span>{p.machine[language]}</span>
        <span className="text-signal">{p.person[language]}</span>
      </div>
      <ul className="mt-4 border-b border-foreground/15 lg:mt-3">
        {CAMPANAS_JOBS.map((job) => (
          <li key={job.id} className="grid gap-5 border-t border-foreground/15 py-7 lg:grid-cols-[minmax(0,.7fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:py-8">
            <h4 className="text-xl font-medium leading-snug text-foreground">{job.title[language]}</h4>
            <div>
              <p className={`${label} mb-2 text-foreground/60 lg:hidden`}>{p.machine[language]}</p>
              <p className="text-base leading-relaxed text-foreground/75">{job.machine[language]}</p>
              <ul aria-label={p.tools[language]} className="mt-3 flex flex-wrap gap-1.5">
                {job.tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-foreground/15 px-2.5 py-1 font-mono text-[10px] text-foreground/70">{tool}</li>
                ))}
              </ul>
            </div>
            <div className="border-l-2 border-signal/70 pl-5">
              <p className={`${label} mb-2 text-signal lg:hidden`}>{p.person[language]}</p>
              <p className="text-base leading-relaxed text-foreground">{job.person[language]}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Lo que la máquina todavía hace mal: es la razón de que haya una persona. */
function Limits({ language }: { language: "es" | "en" }) {
  const p = CAMPANAS_PAGE.limits;
  return (
    <section aria-labelledby="campanas-limites" className={`${container} mt-16 sm:mt-24`}>
      <h3 id="campanas-limites" className={`${heading} max-w-4xl`}>{p.title[language]}</h3>
      <ol className="mt-8 grid gap-8 md:grid-cols-3">
        {p.items.map((item, index) => (
          <li key={item.title.es}>
            <span aria-hidden="true" className="font-mono text-xs text-signal">{String(index + 1).padStart(2, "0")}</span>
            <h4 className="mt-3 text-xl font-medium text-foreground">{item.title[language]}</h4>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">{item.body[language]}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** Lo nuevo por plataforma, con su fuente: aquí todo envejece rápido y se dice cuándo se revisó. */
function Radar({ language }: { language: "es" | "en" }) {
  const p = CAMPANAS_PAGE.radar;
  return (
    <section aria-labelledby="campanas-radar" className={`${container} mt-16 sm:mt-24`}>
      <h3 id="campanas-radar" className={`${heading} max-w-4xl`}>{p.title[language]}</h3>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/75 sm:text-lg">{p.body[language]}</p>
      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-x-12">
        {CAMPANAS_RADAR.map((group) => (
          <div key={group.platform}>
            <h4 className={`${label} border-b border-foreground/15 pb-3 text-foreground/60`}>{group.platform === "Independientes" ? p.independent[language] : group.platform}</h4>
            <ul>
              {group.items.map((item) => (
                <li key={item.name} className="border-b border-foreground/10 py-5">
                  <p className="text-lg font-medium leading-snug text-foreground">{item.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/75">{item.body[language]}</p>
                  <a href={item.source.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-8 items-center gap-1.5 text-xs text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {p.source[language]}: {item.source.label}
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

/** /campanas: la cinemática arriba y, debajo, el detalle de cómo se reparte el trabajo. */
export function CampanasDocument({ language }: { language: "es" | "en" }) {
  return (
    <ServicePage
      content={SERVICE_PAGES.campanas}
      language={language}
      howItWorks={
        <>
          <CampanasFilmRoom language={language} />
          <JobsLedger language={language} />
          <Limits language={language} />
          <Radar language={language} />
        </>
      }
    />
  );
}
