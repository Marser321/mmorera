import type { ReactNode } from "react";

type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalDocumentProps = {
  language: "es" | "en";
  label: string;
  title: string;
  intro: string;
  sections: LegalSection[];
};

// Server-rendered reading surface: native anchors work without JavaScript,
// and no new animation is introduced for reduced-motion visitors.
export function LegalDocument({ language, label, title, intro, sections }: LegalDocumentProps) {
  return (
    <main id="contenido-principal" lang={language} className="min-h-screen bg-background px-5 pb-28 pt-36 sm:px-8 lg:px-12 lg:pt-44">
      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-balance text-[clamp(2.75rem,6.5vw,5rem)] font-medium leading-[1.04] tracking-[-0.04em] text-foreground">{title}</h1>
          <p className="mt-6 max-w-prose text-lg leading-8 text-foreground/75">{intro}</p>
          <p className="mt-5 text-sm leading-6 text-foreground/75">
            {language === "es" ? "Última actualización: 1 de noviembre de 2026" : "Last updated: November 1, 2026"}
          </p>
        </header>
        <nav aria-label={label} className="mt-10 border-y border-foreground/15 py-5">
          <ul className="grid gap-x-8 sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="inline-flex min-h-11 items-center py-2 text-sm leading-6 text-foreground/75 underline decoration-foreground/30 underline-offset-4 hover:text-foreground focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 space-y-12 text-base leading-8 text-foreground/75 sm:text-lg [&_a]:text-foreground [&_a]:underline [&_a]:decoration-foreground/30 [&_a]:underline-offset-4 [&_a:hover]:decoration-foreground [&_a:focus-visible]:outline [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-signal [&_strong]:font-semibold [&_strong]:text-foreground">
          {sections.map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id} tabIndex={-1} className="scroll-mt-32 text-2xl font-medium leading-8 tracking-[-0.02em] text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal">{section.title}</h2>
              <div className="mt-4 space-y-4 [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-6">{section.content}</div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
