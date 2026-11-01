"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { EASE_OUT } from "@/lib/motion";

/** One contact shortcut, only between the hero and the contact section. */
export function IslandBar() {
  const { language } = useLanguage();
  const reducedMotion = useReducedMotionSafe();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contacto");
    if (!hero || !contact) return;

    const updateVisibility = () => {
      // Direction keeps it hidden after contact, including at the footer
      // and when restoring a deep scroll position.
      setVisible(hero.getBoundingClientRect().bottom <= 0 && contact.getBoundingClientRect().top >= window.innerHeight);
    };
    const observer = new IntersectionObserver(updateVisibility);
    observer.observe(hero);
    observer.observe(contact);
    // Also handle a restored scroll position and viewport resizing without
    // waiting for either section to cross an intersection threshold.
    let frame = requestAnimationFrame(updateVisibility);
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateVisibility);
    };
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div
      data-contact-shortcut
      aria-hidden={!visible}
      inert={!visible}
      className="pointer-events-none fixed inset-x-0 bottom-3 z-50 flex justify-center px-5 pb-[env(safe-area-inset-bottom)] transition-opacity sm:bottom-6"
      style={{ opacity: visible ? 1 : 0, transitionDuration: reducedMotion ? "0ms" : "200ms", transitionTimingFunction: `cubic-bezier(${EASE_OUT.join(",")})` }}
    >
      <a
        href="#contacto"
        tabIndex={visible ? 0 : -1}
        onClick={() => {
          const contact = document.getElementById("contacto");
          if (contact) {
            contact.tabIndex = -1;
            contact.focus({ preventScroll: true });
          }
        }}
        className={`${visible ? "pointer-events-auto" : "pointer-events-none"} inline-flex min-h-12 items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background hover:bg-signal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal`}
      >
        {language === "es" ? "Hablemos" : "Let's talk"}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
      </a>
    </div>
  );
}
