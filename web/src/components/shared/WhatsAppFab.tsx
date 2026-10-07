"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SiWhatsapp } from "react-icons/si";
import { useLanguage } from "@/context/LanguageContext";
import { SITE_IDENTITY } from "@/config/site";
import { useReducedMotionSafe } from "@/hooks/useReducedMotionSafe";

/**
 * Acceso directo flotante a WhatsApp — el canal humano del sitio.
 * Reemplaza al antiguo asistente: sin intermediarios, conversación real.
 */
export function WhatsAppFab() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const reduceMotion = useReducedMotionSafe();
  const label = language === "es" ? "Escribir por WhatsApp" : "Chat on WhatsApp";

  // En la home opera IslandBar con su propio acceso a WhatsApp para no duplicar ni solapar en mobile
  const isHome = pathname === "/" || pathname === "/en";
  if (isHome) return null;

  return (
    <motion.a
      href={SITE_IDENTITY.contact.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      title={label}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-5 right-5 z-[90] flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-card text-[#71F3A2] shadow-[0_8px_30px_rgb(0_0_0/0.45)] transition-colors hover:border-[#71F3A2]/60 hover:text-[#8ff7b8] light:border-[rgb(var(--ink-rgb)/0.15)] light:text-[#0E7A46] light:shadow-[0_8px_30px_rgb(20_23_26/0.15)] light:hover:border-[#0E7A46]/50 sm:bottom-6 sm:right-6"
    >
      <SiWhatsapp aria-hidden="true" className="h-5 w-5" />
    </motion.a>
  );
}
