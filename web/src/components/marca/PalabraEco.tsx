import { cn } from "@/lib/utils";

/**
 * PalabraEco — una palabra gigante en contorno fino, recortada contra el borde.
 * Es eco del título, no contenido: va fuera del árbol de accesibilidad y la
 * sección que la aloja recorta con `overflow-x-clip`.
 */
export function PalabraEco({ children, className }: { children: string; className?: string }) {
  return (
    <span aria-hidden="true" className={cn("palabra-eco block text-[clamp(6.5rem,21vw,21rem)]", className)}>
      {children}
    </span>
  );
}
