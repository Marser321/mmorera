import { createClient } from '@insforge/sdk';

let _insforge: ReturnType<typeof createClient> | null = null;
let _initialized = false;

/**
 * Obtener la instancia de InsForge de forma lazy.
 * Solo se inicializa si las variables de entorno están presentes,
 * evitando que el build o la ejecución crasheen prematuramente.
 */
export function getInsForge() {
    if (_initialized) return _insforge;
    _initialized = true;

    const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || '';
    const insforgeKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || '';

    if (!insforgeUrl || !insforgeKey) {
        console.warn('InsForge no configurado (faltan NEXT_PUBLIC_INSFORGE_URL o NEXT_PUBLIC_INSFORGE_ANON_KEY).');
        _insforge = null;
        return null;
    }

    try {
        _insforge = createClient({
            baseUrl: insforgeUrl,
            anonKey: insforgeKey
        });
    } catch (err) {
        console.error('Error al inicializar InsForge:', err);
        _insforge = null;
    }

    return _insforge;
}

// Mantener compatibilidad exportando una variable lazy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const insforge = new Proxy({} as any, {
    get(_, prop) {
        const client = getInsForge();
        if (!client) return undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (client as any)[prop];
    }
});
