import type { ContactFormData } from '@/types';

let _supabase: ReturnType<typeof import('@supabase/ssr').createBrowserClient> | null = null;
let _initialized = false;

/**
 * Obtener la instancia de Supabase de forma lazy.
 * Solo carga @supabase/ssr cuando realmente se necesita, evitando
 * side-effects de importación que crashean si las env vars no están.
 */
export function getSupabase() {
    if (_initialized) return _supabase;
    _initialized = true;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
        console.warn('Supabase no configurado (faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY).');
        _supabase = null;
        return null;
    }

    try {
        // Importación dinámica síncrona — safe porque solo se llama cuando hay env vars
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { createBrowserClient } = require('@supabase/ssr');
        _supabase = createBrowserClient(supabaseUrl, supabaseKey);
    } catch (err) {
        console.error('Error al inicializar Supabase:', err);
        _supabase = null;
    }

    return _supabase;
}

// Mantener compatibilidad: export const supabase (getter lazy)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = new Proxy({} as any, {
    get(_, prop) {
        const client = getSupabase();
        if (!client) return undefined;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (client as any)[prop];
    }
});

// Backend helper: agregar un nuevo lead a Supabase
export async function addLead(lead: ContactFormData) {
    const client = getSupabase();
    if (!client) {
        console.warn('Supabase no configurado. Lead no guardado.');
        return { data: null, error: null };
    }
    const { data, error } = await client.from('leads').insert([lead]);
    return { data, error };
}

