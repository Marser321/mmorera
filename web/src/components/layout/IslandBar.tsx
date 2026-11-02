"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";
import { EASE_OUT } from "@/lib/motion";

/** Una misma cápsula de contacto, con destino y visibilidad según la página. */
export function IslandBar({ href = "#contacto" }: { href?: string }) {
  const { language } = useLanguage();
  const reducedMotion = useReducedMotionSafe();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contact = document.getElementById("contacto");
    const footer = document.querySelector("footer");
    const isHome = href === "#contacto";
    if (isHome && (!hero || !contact)) return;

    const updateVisibility = () => {
      // Direction keeps it hidden after contact, including at the footer
      // and when restoring a deep scroll position.
      setVisible(isHome
        ? Boolean(hero && contact && hero.getBoundingClientRect().bottom <= 0 && contact.getBoundingClientRect().top >= window.innerHeight)
        : !footer || footer.getBoundingClientRect().top >= window.innerHeight);

    };
    const observer = new IntersectionObserver(updateVisibility);
    if (isHome) {
      if (hero) observer.observe(hero);
      if (contact) observer.observe(contact);
    } else if (footer) observer.observe(footer);
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
  }, [href]);

  return (
    <div
      data-contact-shortcut
      aria-hidden={!visible}
      inert={!visible}
      className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-5 pb-[env(safe-area-inset-bottom)] transition-opacity sm:bottom-6"
      style={{ opacity: visible ? 1 : 0, transitionDuration: reducedMotion ? "0ms" : "200ms", transitionTimingFunction: `cubic-bezier(${EASE_OUT.join(",")})` }}
    >
      <a
        href={href}
        tabIndex={visible ? 0 : -1}
        onClick={() => {
          const contact = href === "#contacto" ? document.getElementById("contacto") : null;
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
