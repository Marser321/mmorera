import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badge atómico — sistema Deep Space.
 * Además de las variantes estándar de shadcn incorpora `signal`, `accent` y
 * `muted`, usadas para los estados de práctica de la órbita de capacidades.
 */
const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                destructive: "border-transparent bg-destructive text-destructive-foreground",
                outline: "border-border text-foreground",
                signal: "border-signal bg-white/[0.04] text-signal light:bg-[rgb(var(--ink-rgb)/0.04)]",
                accent: "border-accent bg-white/[0.04] text-accent light:bg-[rgb(var(--ink-rgb)/0.04)]",
                muted: "border-white/15 bg-white/[0.04] text-foreground/55 light:border-[rgb(var(--ink-rgb)/0.14)] light:bg-[rgb(var(--ink-rgb)/0.04)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
