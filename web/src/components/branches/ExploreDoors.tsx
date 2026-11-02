import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { localePath } from "@/config/site";
import { EXPLORE_DOORS, type ExploreDoor } from "@/data/branchPages";

/** Franja corta con una puerta por rama (capacidades, casos de uso, Lab). */
export function ExploreDoors({ language, doors, as: Heading = "h2", className = "" }: { language: "es" | "en"; doors: ExploreDoor[]; as?: "h2" | "h3"; className?: string }) {
  const id = `explora-${doors.join("-")}`;
  return (
    <section aria-labelledby={id} data-explore-doors className={`mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12 ${className}`}>
      <Heading id={id} className="font-mono text-[10px] uppercase tracking-[.18em] text-foreground/60">{EXPLORE_DOORS.title[language]}</Heading>
      <ul className={`mt-4 grid gap-3 ${doors.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {doors.map((key) => {
          const door = EXPLORE_DOORS.doors[key];
          return (
            <li key={key}>
              <Link href={localePath(language, door.path)} className="group flex h-full min-h-12 items-start justify-between gap-4 rounded-2xl border border-foreground/15 bg-background/70 p-5 transition-colors hover:border-signal/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span>
                  <span className="block text-lg font-medium text-foreground">{door.title[language]}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-foreground/70">{door.body[language]}</span>
                </span>
                <ArrowUpRight aria-hidden="true" className="mt-1.5 h-4 w-4 shrink-0 text-foreground/50 transition-colors group-hover:text-signal" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
