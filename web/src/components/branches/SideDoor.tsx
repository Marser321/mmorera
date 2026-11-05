import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/** Puerta discreta hacia una rama chica: una línea, sin competir con el contenido de la página. */
export function SideDoor({ eyebrow, title, href, className = "" }: { eyebrow: string; title: string; href: string; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12 ${className}`}>
      <Link href={href} className="group flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-foreground/15 px-6 py-4 transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-8">
        <span className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="font-mono text-[10px] uppercase tracking-[.16em] text-foreground/60">{eyebrow}</span>
          <span className="text-base text-foreground">{title}</span>
        </span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0 text-foreground/70 group-hover:text-signal" />
      </Link>
    </div>
  );
}
