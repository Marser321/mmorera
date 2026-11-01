"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { localePath } from "@/config/site";
import { IslandBar } from "@/components/layout/IslandBar";

/** Nombre conservado por compatibilidad con layout; ahora es la cápsula común. */
export function WhatsAppFab() {
  const pathname = usePathname();
  const { language } = useLanguage();
  if (["/", "/en", "/aplicar", "/en/aplicar"].includes(pathname)) return null;
  return <IslandBar href={localePath(language, "/aplicar")} />;
}
