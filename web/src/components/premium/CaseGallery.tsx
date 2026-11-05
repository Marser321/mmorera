"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { CaseGallery as CaseGalleryData, GalleryDevice, GalleryShot, GalleryView } from "@/data/caseGallery";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

const ADVANCE_MS = 6500;

const COPY = {
  es: {
    eyebrow: "Galería · capturas del sitio en vivo",
    title: "El mismo sitio, en cada pantalla.",
    pages: "Páginas del sitio",
    open: "Abrir esta página",
    devices: { desktop: "Computadora", tablet: "Tablet", mobile: "Teléfono" },
  },
  en: {
    eyebrow: "Gallery · live site captures",
    title: "The same site, on every screen.",
    pages: "Site pages",
    open: "Open this page",
    devices: { desktop: "Computer", tablet: "Tablet", mobile: "Phone" },
  },
};

/** Las capturas de una pantalla, apiladas: solo se ve la de la página elegida. */
function Screens({ views, device, active, loaded, name, deviceName, language }: { views: GalleryView[]; device: GalleryDevice; active: number; loaded: Set<number>; name: string; deviceName: string; language: "es" | "en" }) {
  return (
    <>
      {views.map((view, index) => {
        const shot: GalleryShot | undefined = view[device];
        if (!shot || !loaded.has(index)) return null;
        return (
          // eslint-disable-next-line @next/next/no-img-element -- capturas ya optimizadas a su tamaño; se cargan a medida que se eligen
          <img
            key={view.id}
            src={shot.src}
            width={shot.width}
            height={shot.height}
            alt={index === active ? `${name} · ${view.label[language]} · ${deviceName}` : ""}
            aria-hidden={index === active ? undefined : true}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-500 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`}
          />
        );
      })}
    </>
  );
}

/**
 * Galería de un caso: cada página real del sitio, vista a la vez en computadora,
 * tablet y teléfono. Avanza sola mientras se ve, hasta que la persona elige una
 * página; con movimiento reducido queda quieta.
 */
export function CaseGallery({ gallery, name, language }: { gallery: CaseGalleryData; name: string; language: "es" | "en" }) {
  const t = COPY[language];
  const { views } = gallery;
  const reducedMotion = useReducedMotionSafe();
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(() => new Set([0, 1]));
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [chosen, setChosen] = useState(false);
  const view = views[active];
  const url = new URL(view.url);
  const hasTablet = views.some((item) => item.tablet);
  const hasMobile = views.some((item) => item.mobile);

  const show = (index: number) => {
    setActive(index);
    // La siguiente queda lista para que el cambio no muestre un marco vacío.
    setLoaded((current) => new Set(current).add(index).add((index + 1) % views.length));
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !visible || hovered || chosen || views.length < 2) return;
    const timer = window.setTimeout(() => {
      const next = (active + 1) % views.length;
      setActive(next);
      setLoaded((current) => new Set(current).add(next).add((next + 1) % views.length));
    }, ADVANCE_MS);
    return () => window.clearTimeout(timer);
  }, [active, chosen, hovered, reducedMotion, views.length, visible]);

  return (
    <section ref={sectionRef} className="mx-auto mt-24 max-w-[1480px] px-5 sm:px-8 lg:px-12" aria-labelledby="case-gallery">
      <p className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/60">{t.eyebrow}</p>
      <h2 id="case-gallery" className="mt-4 text-3xl font-medium tracking-[-0.04em] text-foreground sm:text-4xl">{t.title}</h2>

      <div role="group" aria-label={t.pages} className="-mx-5 mt-8 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {views.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={index === active}
            onClick={() => {
              setChosen(true);
              show(index);
            }}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${index === active ? "border-foreground bg-foreground font-medium text-background" : "border-foreground/15 text-foreground/75 hover:border-foreground/40 hover:text-foreground"}`}
          >
            {item.label[language]}
          </button>
        ))}
      </div>

      {/* Tres pantallas a escala real entre sí: la misma página, lado a lado. Si una
          falló en el sitio en vivo, su marco no se muestra vacío. */}
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} className="mt-8 grid items-end gap-x-[2%] gap-y-6 lg:grid-cols-[minmax(0,62fr)_minmax(0,23fr)_minmax(0,12fr)]">
        <figure className="min-w-0">
          <div className="overflow-hidden rounded-xl border border-foreground/15 bg-card shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-3 border-b border-foreground/10 px-4 py-2.5">
              <span aria-hidden="true" className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-foreground/20" />
                <span className="h-2 w-2 rounded-full bg-foreground/20" />
                <span className="h-2 w-2 rounded-full bg-foreground/20" />
              </span>
              <span className="min-w-0 truncate rounded-full bg-foreground/5 px-3 py-1 font-mono text-[10px] text-foreground/65">{url.host}{url.pathname === "/" ? "" : url.pathname}</span>
            </div>
            <div className="relative aspect-[1440/900] bg-card">
              <Screens views={views} device="desktop" active={active} loaded={loaded} name={name} deviceName={t.devices.desktop} language={language} />
            </div>
          </div>
          <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-foreground/55">{t.devices.desktop}</figcaption>
        </figure>

        <div className="flex items-end justify-center gap-[6%] lg:contents">
          {hasTablet ? (
            <figure className={`w-[60%] min-w-0 lg:w-auto ${view.tablet ? "" : "invisible"}`}>
              <div className="overflow-hidden rounded-[1.25rem] border-[7px] border-[#1b1b19] bg-[#1b1b19] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[820/1180] overflow-hidden rounded-[.6rem] bg-card">
                  <Screens views={views} device="tablet" active={active} loaded={loaded} name={name} deviceName={t.devices.tablet} language={language} />
                </div>
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-foreground/55">{t.devices.tablet}</figcaption>
            </figure>
          ) : null}
          {hasMobile ? (
            <figure className={`w-[32%] min-w-0 lg:w-auto ${view.mobile ? "" : "invisible"}`}>
              <div className="relative overflow-hidden rounded-[1.5rem] border-[5px] border-[#1b1b19] bg-[#1b1b19] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.8)]">
                <div className="relative aspect-[390/844] overflow-hidden rounded-[1.1rem] bg-card">
                  <Screens views={views} device="mobile" active={active} loaded={loaded} name={name} deviceName={t.devices.mobile} language={language} />
                </div>
                <span aria-hidden="true" className="absolute left-1/2 top-1.5 h-1.5 w-9 -translate-x-1/2 rounded-full bg-[#1b1b19]" />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[.14em] text-foreground/55">{t.devices.mobile}</figcaption>
            </figure>
          ) : null}
        </div>
      </div>

      <a href={view.url} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm text-foreground/75 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {t.open}: {view.label[language]}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </section>
  );
}
