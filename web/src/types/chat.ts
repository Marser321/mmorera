// types/chat.ts
export type Lead = {
    id: string; // UUID
    email: string;
    nombre?: string;
    empresa?: string;
    created_at: string;
};

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
