import { createBrowserClient } from '@supabase/ssr';
import type { Lead } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseKey
    ? createBrowserClient(supabaseUrl, supabaseKey)
    : null;

// Backend helper: agregar un nuevo lead a Supabase
export async function addLead(lead: Lead) {
    if (!supabase) {
        console.warn('Supabase no configurado. Lead no guardado.');
        return { data: null, error: null };
    }
    const { data, error } = await supabase.from('leads').insert([lead]);
    return { data, error };
}
