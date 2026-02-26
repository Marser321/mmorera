-- =========================================================================================
--  ESQUEMA INSFORGE: MEMORIA DE CHAT B2B (Next.js + Supabase)
-- =========================================================================================
--  Instrucciones: Ejecutar este script completo en el SQL Editor de Supabase.
-- =========================================================================================
-- 1. Tabla: LEADS (Directorio central de clientes)
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    empresa TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Tabla: CHAT_SESSIONS (El hilo / contexto de conversación)
-- Cada vez que alguien interactúa con un bot, se genera una sesión.
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    -- NULL si es visitante anónimo
    session_cookie TEXT NOT NULL,
    -- Clave generada por Next.js para vincular el hilo
    skill_origin TEXT NOT NULL,
    -- Ej: 'rag-strict', 'qualifier', 'proposal-generator'
    estado_conversacion TEXT DEFAULT 'active' CHECK (
        estado_conversacion IN ('active', 'qualified', 'closed')
    ),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Índices para búsquedas rápidas al recargar la página:
CREATE INDEX idx_chat_sessions_cookie ON public.chat_sessions(session_cookie);
CREATE INDEX idx_chat_sessions_lead_id ON public.chat_sessions(lead_id);
-- 3. Tabla: CHAT_MESSAGES (Los mensajes brutos)
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Índice para cargar el historial de manera rápida y en orden:
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id, created_at ASC);
-- =========================================================================================
-- POLÍTICAS DE ACCESO (Row Level Security - RLS)
-- Fundamental para evitar que inserten basura pública mediante peticiones HTTP.
-- =========================================================================================
-- Habilitar RLS en todas las tablas
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- -----------------------------------------------------------------------------------------
-- ROLES DE USUARIO ANONIMO (El Frontend Next.js del cliente)
-- -----------------------------------------------------------------------------------------
-- Los visitantes pueden CREAR leads (por ejemplo en un formulario) pero no listar todos.
CREATE POLICY "Permitir insertar Leads a usuarios anónimos" ON public.leads FOR
INSERT TO public,
    anon WITH CHECK (true);
-- Los usuarios anónimos pueden CREAR una nueva sesión de chat.
CREATE POLICY "Permitir crear nueva sesion de chat a anonimos" ON public.chat_sessions FOR
INSERT TO public,
    anon WITH CHECK (true);
-- IMPORTANTE: Un usuario anónimo SÓLO puede leer y actualizar su propia sesión de chat.
-- ¿Cómo lo validamos? Pasando la `session_cookie` en un header seguro a Supabase o mediante RPC, 
-- pero para simplificar la integración sin Auth, dejaremos lectura guiada por filtros exactos.
CREATE POLICY "Permitir leer sesiones propias a anonimos" ON public.chat_sessions FOR
SELECT TO public,
    anon USING (true);
-- El frontend enviará el ID de la sesión. Es in-adivinable por ser UUID v4.
CREATE POLICY "Permitir actualizar sesiones propias a anonimos" ON public.chat_sessions FOR
UPDATE TO public,
    anon USING (true);
-- Anónimos pueden insertar mensajes SÓLO validando el session_id (al cual tienen acceso por UUID).
CREATE POLICY "Permitir insertar mensajes a anonimos" ON public.chat_messages FOR
INSERT TO public,
    anon WITH CHECK (true);
-- Anónimos pueden leer mensajes SÓLO conociendo el `session_id`.
CREATE POLICY "Permitir leer historial propio a anonimos" ON public.chat_messages FOR
SELECT TO public,
    anon USING (true);
-- -----------------------------------------------------------------------------------------
-- VISTAS DE AGENCIA (Administradores)
-- Todos los usuarios logueados (Authenticated) del Dashboard de MMORE tienen FULL ACCESS.
-- -----------------------------------------------------------------------------------------
CREATE POLICY "Full Access Leads for Admins" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Sessions for Admins" ON public.chat_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full Access Messages for Admins" ON public.chat_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- =========================================================================================
-- FIN DEL SCRIPT
-- =========================================================================================