"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { ServicePage } from "@/components/service/ServicePage";
import { ExploreDoors } from "@/components/branches/ExploreDoors";
import { getProjectCase } from "@/data/projectCases";
import { getCaseMedia } from "@/data/caseMedia";
import { getCaseMetrics } from "@/data/caseMetrics";
import { buildCaseFilm } from "@/data/films/caseFilms";
import type { ServicePageContent } from "@/types/servicePage";

const CaseFilmSection = dynamic(() => import("@/components/films/CaseFilmSection").then(m => m.CaseFilmSection));
const WEB_FILM_SLUGS = ["mr-studio-tattoo", "truckers-choice", "lb-elite-wash-detail"];
const projects = WEB_FILM_SLUGS.flatMap(slug => { const project = getProjectCase(slug); return project ? [project] : []; });

const FILM_EVENT = "studio-film-change";
function subscribeFilm(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILM_EVENT, onChange);
  return () => { window.removeEventListener("popstate", onChange); window.removeEventListener(FILM_EVENT, onChange); };
}
function currentFilm() {
  const slug = new URLSearchParams(window.location.search).get("film");
  return Math.max(0, projects.findIndex(item => item.slug === slug));
}

function WebCaseFilms({ label }: { label?: string }) {
  const { language } = useLanguage();
  const active = useSyncExternalStore(subscribeFilm, currentFilm, () => 0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const project = projects[active];
  const script = useMemo(() => project ? buildCaseFilm(project, getCaseMedia(project.slug), getCaseMetrics(project.slug)) : null, [project]);
  if (!project || !script) return null;
  function select(index: number) {
    // El enlace de compartir de CaseFilmSection conserva el caso elegido al recargar.
    const url = new URL(window.location.href);
    url.searchParams.set("film", projects[index].slug);
    if (url.hash.startsWith("#film")) url.hash = "";
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(FILM_EVENT));
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("button")[index]?.focus();
  }
  return <>
    <div ref={tabsRef} role="tablist" aria-label={label} className="mx-auto flex max-w-[1480px] flex-wrap gap-2 px-5 sm:px-8 lg:px-12" onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      select(event.key === "Home" ? 0 : event.key === "End" ? projects.length - 1 : (active + (event.key === "ArrowRight" ? 1 : -1) + projects.length) % projects.length);
    }}>
      {projects.map((item, index) => <button key={item.slug} id={`web-film-tab-${item.slug}`} type="button" role="tab" tabIndex={active === index ? 0 : -1} aria-selected={active === index} aria-controls="web-film-panel" onClick={() => select(index)} className={`min-h-12 rounded-full border px-5 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active === index ? "border-signal/40 bg-signal/10 text-signal" : "border-foreground/20 text-foreground/75 hover:text-foreground"}`}>{item.title[language]}</button>)}
    </div>
    <div id="web-film-panel" role="tabpanel" aria-labelledby={`web-film-tab-${project.slug}`}>
      <CaseFilmSection key={project.slug} script={script} language={language} />
    </div>
  </>;
}

export function StudioExperience({ content }: { content: ServicePageContent }) {
  const { language } = useLanguage();
  const { setActiveFamilies, setHeroVisible } = useActiveTech();
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setActiveFamilies(["Media", "Marketing", "Web"]);
    return () => setActiveFamilies([]);
  }, [setActiveFamilies]);
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [setHeroVisible]);
  return <ServicePage content={content} language={language} heroRef={heroRef} howItWorks={<><WebCaseFilms label={content.howItWorks?.title?.[language]} /><ExploreDoors language={language} doors={["capacidades", "lab"]} as="h3" className="mt-12" /></>} />;
}
