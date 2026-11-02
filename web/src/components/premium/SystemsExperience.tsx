"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { localePath } from "@/config/site";
import { useLanguage } from "@/context/LanguageContext";
import { useActiveTech } from "@/context/ActiveTechContext";
import { ServicePage } from "@/components/service/ServicePage";
import type { ServicePageContent } from "@/types/servicePage";

const ScrollFilm = dynamic(() => import("@/components/films/ScrollFilm").then(m => m.ScrollFilm));
const UseCaseFilmRoom = dynamic(() => import("@/components/films/UseCaseFilmRoom").then(m => m.UseCaseFilmRoom));

export function SystemsExperience({ content }: { content: ServicePageContent }) {
  const { language } = useLanguage();
  const { setActiveFamilies, setHeroVisible } = useActiveTech();
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    setActiveFamilies(["CRM", "Automation", "Backend", "Infrastructure", "AI"]);
    return () => setActiveFamilies([]);
  }, [setActiveFamilies]);
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { threshold: 0.12 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [setHeroVisible]);
  return <ServicePage content={content} language={language} heroRef={heroRef} howItWorks={<><ScrollFilm /><UseCaseFilmRoom allHref={localePath(language, "/casos-de-uso")} /></>} />;
}
