import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

/**
 * Input atómico — estilizado Dark Mode.
 * Soporta aria-invalid y aria-describedby para accesibilidad.
 *
 * @example
 * <label htmlFor="email">Email</label>
 * <Input id="email" type="email" placeholder="tu@email.com" />
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-lg border border-input bg-card/40 px-4 py-2 text-sm text-foreground shadow-sm transition-colors",
                    "placeholder:text-muted-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/30",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Input.displayName = "Input";

export { Input };
