import { ArrowUpRight } from "lucide-react";
import type { TryItLink } from "@/types/site";

/** Mismas rutas, rótulos y avisos en portada, servicios y páginas de caso. */
export function TryItButtons({ links, language, idPrefix, columns = false }: { links?: TryItLink[]; language: "es" | "en"; idPrefix: string; columns?: boolean }) {
  if (!links?.length) return null;
  return <ul className={`grid gap-4 ${columns ? "sm:grid-cols-2" : ""}`}>
    {links.map((link, index) => {
      const external = /^https?:\/\//.test(link.href[language]);
      const noticeId = `${idPrefix}-${index}-notice`;
      return <li key={link.href[language]}>
        <a href={link.href[language]} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-describedby={external ? noticeId : undefined} className="inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-signal/40 px-4 py-3 text-sm font-semibold text-signal hover:bg-signal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <span>{link.label[language]}{link.kind === "demo" && <span className="ml-2 inline-block rounded border border-current px-1.5 py-0.5 text-[10px]">Demo</span>}</span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
        </a>
        {external && <span id={noticeId} className="sr-only">{language === "es" ? "(se abre en otro sitio, en una pestaña nueva)" : "(opens another site in a new tab)"}</span>}
        {link.note && <p className="mt-2 text-xs leading-relaxed text-foreground/75">{link.note[language]}</p>}
      </li>;
    })}
  </ul>;
}
