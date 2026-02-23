import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Variantes del botón — sistema Deep Space.
 * El variant "default" incluye efecto shimmer animado.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background cursor-pointer",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:brightness-110 active:scale-[0.98]",
                shimmer:
                    "relative overflow-hidden bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/50 active:scale-[0.98]",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]",
                ghost:
                    "hover:bg-secondary/60 hover:text-foreground active:scale-[0.98]",
                outline:
                    "border border-border bg-transparent hover:bg-secondary/40 hover:text-foreground active:scale-[0.98]",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-[0.98]",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-11 px-6 py-2",
                sm: "h-9 rounded-md px-4 text-xs",
                lg: "h-12 rounded-xl px-8 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    /** Renderiza el botón como un Slot (para composición con <a>, <Link>, etc.) */
    asChild?: boolean;
}

/**
 * Componente Button atómico.
 * Soporta múltiples variantes visuales y tamaños.
 *
 * @example
 * <Button variant="shimmer" size="lg">Solicitar Auditoría</Button>
 * <Button variant="ghost" size="icon" aria-label="Cerrar"><X /></Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot.Root : "button";
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
