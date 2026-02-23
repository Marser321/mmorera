import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina clases de Tailwind CSS de forma segura.
 * Usa clsx para condicionales y tailwind-merge para resolver conflictos.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
