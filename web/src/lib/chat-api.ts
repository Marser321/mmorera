import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

/**
 * Función para crear o recuperar una Cookie de Sesión de Chat Anónima (Device ID)
 */
export const getOrCreateSessionCookie = (): string => {
    if (typeof window === 'undefined') return '';

    let cookie = localStorage.getItem('nexo_chat_session_cookie');
    if (!cookie) {
        cookie = uuidv4();
        localStorage.setItem('nexo_chat_session_cookie', cookie);
    }
    return cookie;
};

/**
 * Crea una nueva sesión de chat en Supabase o devuelve una existente (si está activa)
 */
export const startOrResumeChatSession = async (skillOrigin: string) => {
    if (!supabase) throw new Error("Supabase client not initialized.");

    const sessionCookie = getOrCreateSessionCookie();

    // 1. Check if there's an active session for this cookie & skill
    const { data: existingSession, error: fetchError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('session_cookie', sessionCookie)
        .eq('skill_origin', skillOrigin)
        .eq('estado_conversacion', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (existingSession && !fetchError) {
        return existingSession.id;
    }

    // 2. If no active session, create a new one
    const { data: newSession, error: insertError } = await supabase
        .from('chat_sessions')
        .insert([{
            session_cookie: sessionCookie,
            skill_origin: skillOrigin,
            estado_conversacion: 'active'
        }])
        .select()
        .single();

    if (insertError) {
        console.error("Error creating chat session:", insertError);
        throw insertError;
    }

    return newSession.id;
};

/**
 * Guarda un mensaje en el historial
 */
export const saveChatMessage = async (sessionId: string, role: 'user' | 'assistant' | 'system', content: string) => {
    if (!supabase) return null;

    const { error } = await supabase
        .from('chat_messages')
        .insert([{
            session_id: sessionId,
            role,
            content
        }]);

    if (error) {
        console.error("Error saving message:", error);
    }
};

/**
 * Recupera el historial de un chat
 */
export const getChatHistory = async (sessionId: string) => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error("Error fetching chat history:", error);
        return [];
    }
    return data;
};
