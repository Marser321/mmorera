import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface SectionHeadingProps {
    /** Texto del overline/badge superior */
    overline?: string;
    /** Título principal de la sección */
    title: string;
    /** Descripción/subtítulo debajo del título */
    description?: string;
    /** Alineación: "center" | "left" */
    align?: "center" | "left";
    /** ID para aria-labelledby en la sección padre */
    id?: string;
    className?: string;
}

/**
 * SectionHeading — encabezado reutilizable para secciones.
 * Incluye overline badge, título h2, y descripción.
 *
 * @example
 * <SectionHeading
 *   overline="Nuestros Sistemas"
 *   title="Infraestructura que convierte"
 *   description="Cada sistema está diseñado para un objetivo medible"
 * />
 */
function SectionHeading({
    overline,
    title,
    description,
    align = "center",
    id,
    className,
}: SectionHeadingProps) {
    return (
        <div
            className={cn(
                "flex flex-col gap-3 mb-12",
                align === "center" && "items-center text-center",
                align === "left" && "items-start text-left",
                className
            )}
        >
            {overline && (
                <Badge variant="default" className="uppercase tracking-wider text-[0.65rem]">
                    {overline}
                </Badge>
            )}
            <h2
                id={id}
                className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl text-foreground"
            >
                {title}
            </h2>
            {description && (
                <p className="max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
                    {description}
                </p>
            )}
        </div>
    );
}

export { SectionHeading };
