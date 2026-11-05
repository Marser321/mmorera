import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { USE_CASES_PAGE } from "@/data/branchPages";
import { RECORRIDOS_PAGE } from "@/data/recorridos";
import { BranchHeader } from "@/components/branches/BranchHeader";
import { EmbedFacade } from "@/components/branches/EmbedFacade";

const container = "mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12";
const heading = "mt-3 text-[clamp(1.8rem,3vw,3rem)] font-medium leading-tight tracking-[-.03em] text-foreground";
const kicker = "font-mono text-[10px] uppercase tracking-[.16em] text-signal";
const label = "font-mono text-[10px] uppercase tracking-[.16em]";
// Un visor 360 usa el giroscopio del teléfono para mirar alrededor.
const VIEWER_PERMISSIONS = "xr-spatial-tracking; gyroscope; accelerometer; fullscreen";

/**
 * Un ambiente dibujado en línea, de fondo de las referencias: sus imágenes son de
 * terceros y no se copian al sitio. El punteado lo acerca a una nube de puntos.
 */
function RoomSketch({ dotted = false }: { dotted?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth={dotted ? 2 : 1} strokeDasharray={dotted ? "0.5 8" : undefined} className="absolute inset-0 h-full w-full text-foreground/25">
      <path d="M220 96h200v150H220zM0 0l220 96M640 0L420 96M0 360l220-114M640 360L420 246" />
      <path d="M268 122h104v96H268zM320 122v96M268 170h104" />
      <path d="M120 360l150-114M250 360l50-114M390 360l-50-114M520 360L370 246M126 280h388M58 316h524" />
    </svg>
  );
}

/** /casos-de-uso/recorridos-inmobiliarios: lo real primero y, después, la referencia de terceros con su fuente. */
export function RecorridosDocument({ language }: { language: "es" | "en" }) {
  const p = RECORRIDOS_PAGE;
  const { real, generated } = p;
  return (
    <main id="contenido-principal" lang={language} tabIndex={-1} className="bg-transparent pb-28 focus:outline-none">
      <BranchHeader
        eyebrow={p.eyebrow[language]}
        title={p.title[language]}
        body={p.body[language]}
        back={{ href: localePath(language, "/casos-de-uso"), label: USE_CASES_PAGE.labels.back[language] }}
      />

      <section aria-labelledby="recorrido-real" className={`${container} border-t border-foreground/15 py-12 sm:py-16`}>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
          <div>
            <p className={kicker}>{real.kicker[language]}</p>
            <h2 id="recorrido-real" className={heading}>{real.title[language]}</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">{real.body[language]}</p>
            <p className={`${label} mt-6 leading-relaxed text-signal`}>{real.label[language]}</p>
            <Link href={localePath(language, "/aplicar")} className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {real.cta[language]}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <EmbedFacade
            src={real.tour.src}
            href={real.tour.src}
            title={real.tour.title[language]}
            openLabel={real.tour.open[language]}
            newTabLabel={real.tour.newTab[language]}
            hint={real.tour.hint[language]}
            poster={{ src: real.tour.poster.src, alt: real.tour.poster.alt[language] }}
            allow={VIEWER_PERMISSIONS}
          />
        </div>
      </section>

      <section aria-labelledby="recorrido-generado" className={`${container} border-t border-foreground/15 py-12 sm:py-16`}>
        <div className="max-w-3xl">
          <p className={kicker}>{generated.kicker[language]}</p>
          <h2 id="recorrido-generado" className={heading}>{generated.title[language]}</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/75 sm:text-lg">{generated.body[language]}</p>
        </div>
        <ul className="mt-8 grid gap-8 lg:grid-cols-2">
          {generated.references.map((reference) => (
            <li key={reference.id} className="min-w-0">
              <p className={`${label} mb-3 text-accent`}>{generated.label[language]}</p>
              <EmbedFacade
                src={reference.embed}
                title={reference.title[language]}
                openLabel={reference.open[language]}
                hint={reference.hint[language]}
                allow={reference.allow}
                frameClassName="aspect-video"
              >
                <RoomSketch dotted={reference.id === "project-genie-sala"} />
              </EmbedFacade>
              <h3 className="mt-5 text-xl font-medium leading-snug text-foreground">{reference.title[language]}</h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground/75">{reference.body[language]}</p>
              <p className="mt-3 text-sm text-foreground/70">
                {generated.sourceLabel[language]}:{" "}
                <a href={reference.source.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{reference.source.name}</a>
                {reference.source.detail && `, ${reference.source.detail[language]}`}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-14">
          <p className="border-l-2 border-accent/60 pl-5 text-sm leading-relaxed text-foreground/80">{generated.note[language]}</p>
          <div>
            <p className={`${label} text-foreground/60`}>{generated.readMore.label[language]}</p>
            <ul className="mt-3 grid gap-1">
              {generated.readMore.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground/80 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {link.label[language]}
                    <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
