import type { ReactNode } from "react";
import { MonogramaFundido } from "@/components/marca/MonogramaFundido";

/** Pantalla corta para cuando la propuesta no está o no cargó: misma voz y marca que la propuesta. */
export function AvisoPropuesta({ rotulo, titulo, texto, ingles, children }: { rotulo: string; titulo: string; texto: string; ingles: string; children: ReactNode }) {
  return (
    <main id="contenido-principal" className="relative flex min-h-[88svh] items-center overflow-x-clip bg-background pb-20 pt-32 sm:pt-40">
      <MonogramaFundido intensidad="marca" fundido="diagonal" className="pointer-events-none absolute -right-[18vw] top-24 w-[min(80vw,620px)] [--monograma-opacidad:0.12] sm:-right-24" />
      <div className="relative mx-auto w-full max-w-[1240px] px-5 sm:px-8 lg:px-12">
        <p className="font-mono text-[10px] uppercase tracking-[.2em] text-foreground/60">{rotulo}</p>
        <span aria-hidden="true" className="mt-5 block h-px w-12 bg-foreground/30" />
        <h1 className="mt-8 max-w-[16ch] text-balance text-[clamp(2.4rem,6vw,5rem)] font-medium leading-[1] tracking-[-.045em] text-foreground">{titulo}</h1>
        <p className="mt-7 max-w-[52ch] text-pretty text-lg leading-relaxed text-foreground/72 sm:text-xl">{texto}</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>
        <p lang="en" className="mt-12 max-w-[52ch] text-sm leading-relaxed text-foreground/50">{ingles}</p>
      </div>
    </main>
  );
}
