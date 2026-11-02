import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Encabezado común de las ramas: vuelta opcional, rótulo, H1 y bajada. */
export function BranchHeader({ eyebrow, title, body, back }: { eyebrow: string; title: string; body?: string; back?: { href: string; label: string } }) {
  return (
    <header className="mx-auto w-full max-w-[1480px] px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40 lg:px-12">
      {back && (
        <Link href={back.href} className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-foreground/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {back.label}
        </Link>
      )}
      <p className="text-xs font-medium uppercase tracking-[.16em] text-signal">{eyebrow}</p>
      <h1 className="mt-4 max-w-5xl text-balance text-[clamp(2.4rem,5.5vw,5rem)] font-medium leading-[1.02] tracking-[-.04em] text-foreground">{title}</h1>
      {body && <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/75 sm:text-xl">{body}</p>}
    </header>
  );
}
