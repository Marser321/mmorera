"use client";

/**
 * Global Error Boundary — captura errores client-side no manejados.
 * En producción, muestra el error real para diagnóstico.
 */
export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html lang="es">
            <body className="bg-black text-white min-h-screen flex items-center justify-center p-8">
                <div className="max-w-2xl w-full space-y-6 text-center">
                    <h1 className="text-4xl font-bold text-red-400">Error de Aplicación</h1>
                    <p className="text-lg text-gray-400">
                        Se produjo un error inesperado. Información de diagnóstico:
                    </p>
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-left overflow-auto">
                        <p className="text-sm text-red-300 font-mono break-all">
                            <strong>Nombre:</strong> {error.name}
                        </p>
                        <p className="text-sm text-red-300 font-mono break-all mt-2">
                            <strong>Mensaje:</strong> {error.message}
                        </p>
                        {error.digest && (
                            <p className="text-sm text-yellow-300 font-mono mt-2">
                                <strong>Digest:</strong> {error.digest}
                            </p>
                        )}
                        {error.stack && (
                            <pre className="text-xs text-gray-400 font-mono mt-4 whitespace-pre-wrap max-h-64 overflow-y-auto">
                                {error.stack}
                            </pre>
                        )}
                    </div>
                    <button
                        onClick={reset}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Intentar de Nuevo
                    </button>
                </div>
            </body>
        </html>
    );
}
