// types/chat.ts — Tipos sincronizados con nexo_unified_schema.sql

// ═══════════════════════════════════════════════════
// CRM — Agencia
// ═══════════════════════════════════════════════════

export type AgencyUser = {
    id: string; // UUID
    email: string;
    nombre?: string;
    role: 'Admin' | 'User';
    created_at: string;
};

export type Module = {
    id: string; // UUID
    user_id: string;
    name: string;
    is_active: boolean;
    created_at: string;
};

export type Interaction = {
    id: string; // UUID
    user_id?: string;
    lead_id?: string;
    ai_action: string;
    metadata?: Record<string, unknown>;
    created_at: string;
};

// ═══════════════════════════════════════════════════
// LEADS — Directorio Central Unificado
// ═══════════════════════════════════════════════════

export type Lead = {
    id: string; // UUID
    email: string;
    nombre?: string;
    empresa?: string;
    source: 'web' | 'chatbot' | 'NotebookLM' | 'referido';
    status: 'Nuevo' | 'Contactado' | 'Convertido' | 'Descartado';
    created_at: string;
};

// ═══════════════════════════════════════════════════
// CHAT — Memoria de Chatbots
// ═══════════════════════════════════════════════════

export type ChatSession = {
    id: string; // UUID
    lead_id?: string;
    session_cookie: string;
    skill_origin: string;
    estado_conversacion: 'active' | 'qualified' | 'closed';
    last_active: string;
    created_at: string;
};

export type ChatMessage = {
    id: string; // UUID
    session_id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
};
