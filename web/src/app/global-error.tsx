"use client";

import { useState } from "react";

/**
 * Global Error Boundary — captura errores client-side no manejados.
 * En producción solo expone el digest (seguro para correlación en logs);
 * los detalles internos (mensaje/stack) solo se muestran en desarrollo.
 */
const COPY = {
    es: {
        title: "Error de aplicación",
        body: "Se produjo un error inesperado. Puedes intentar recargar la vista.",
        reference: "Referencia",
        retry: "Intentar de nuevo",
    },
    en: {
        title: "Application error",
        body: "An unexpected error occurred. You can try reloading the view.",
        reference: "Reference",
        retry: "Try again",
    },
} as const;

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [lang] = useState<keyof typeof COPY>(() =>
        typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("en")
            ? "en"
            : "es",
    );

    const copy = COPY[lang];
    const isDev = process.env.NODE_ENV !== "production";

    return (
        <html lang={lang}>
            <body className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-8 text-[#f3f0e8]">
                <div className="w-full max-w-2xl space-y-6 text-center">
                    <h1 className="text-4xl font-medium tracking-tight">{copy.title}</h1>
                    <p className="text-lg text-[#f3f0e8]/60">{copy.body}</p>
                    {error.digest && (
                        <p className="font-mono text-xs text-[#f3f0e8]/40">
                            {copy.reference}: {error.digest}
                        </p>
                    )}
                    {isDev && (
                        <div className="overflow-auto rounded-xl border border-white/10 bg-white/5 p-6 text-left">
                            <p className="break-all font-mono text-sm text-red-300">
                                <strong>{error.name}:</strong> {error.message}
                            </p>
                            {error.stack && (
                                <pre className="mt-4 max-h-64 overflow-y-auto whitespace-pre-wrap font-mono text-xs text-white/50">
                                    {error.stack}
                                </pre>
                            )}
                        </div>
                    )}
                    <button
                        onClick={reset}
                        className="rounded-full bg-[#f3f0e8] px-8 py-3 font-medium text-[#0a0a0a] transition-opacity hover:opacity-85"
                    >
                        {copy.retry}
                    </button>
                </div>
            </body>
        </html>
    );
}
