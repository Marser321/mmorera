import * as React from "react";
import { cn } from "@/lib/utils";

type ContainerElement = "div" | "section" | "main" | "article" | "aside";

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
    /** Elemento HTML a renderizar. Default: "div" */
    as?: ContainerElement;
    /** Ancho máximo: "default" (7xl) | "narrow" (4xl) | "wide" (full) */
    maxWidth?: "default" | "narrow" | "wide";
}

/**
 * Container — wrapper de layout responsivo centrado.
 *
 * @example
 * <Container as="section" className="py-20">
 *   <h2>Sección</h2>
 * </Container>
 */
const Container = React.forwardRef<HTMLElement, ContainerProps>(
    ({ className, as: Tag = "div", maxWidth = "default", ...props }, ref) => {
        const widthClasses = {
            default: "max-w-7xl",
            narrow: "max-w-4xl",
            wide: "max-w-full",
        };

        return (
            <Tag
                ref={ref as React.Ref<HTMLDivElement>}
                className={cn(
                    "mx-auto w-full px-4 sm:px-6 lg:px-8",
                    widthClasses[maxWidth],
                    className
                )}
                {...props}
            />
        );
    }
);
Container.displayName = "Container";

export { Container };
