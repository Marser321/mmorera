import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Textarea atómico — misma estética que Input.
 *
 * @example
 * <label htmlFor="mensaje">Mensaje</label>
 * <Textarea id="mensaje" placeholder="Contanos sobre tu proyecto..." />
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-[100px] w-full rounded-lg border border-input bg-card/40 px-4 py-3 text-sm text-foreground shadow-sm transition-colors resize-y",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };
