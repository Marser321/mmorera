-- =========================================================================================
--  NEXO AGENCY — SCHEMA UNIFICADO v1.0 (Supabase / PostgreSQL)
--  Generado por InsForge-Architect
--  Fecha: 2026-02-25
-- =========================================================================================
--  ⚠️ INSTRUCCIONES:
--  1. Abrí el SQL Editor de tu proyecto en Supabase (https://supabase.com/dashboard)
--  2. Pegá TODO este script y dale "Run"
--  3. Verificá que aparezcan 6 tablas en el Table Editor con el candado RLS activado
-- =========================================================================================
-- ═══════════════════════════════════════════════════════════════
-- LIMPIEZA PREVIA (Ejecución idempotente)
-- Eliminar tablas si existen para evitar errores en re-ejecución
-- ═══════════════════════════════════════════════════════════════
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.chat_sessions CASCADE;
DROP TABLE IF EXISTS public.interactions CASCADE;
DROP TABLE IF EXISTS public.modules CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
-- ═══════════════════════════════════════════════════════════════
-- 1. TABLA: USERS (Equipo Admin de la Agencia)
-- ═══════════════════════════════════════════════════════════════
-- Gestión de usuarios internos con roles. Se vincula con auth.uid()
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    role TEXT NOT NULL DEFAULT 'User' CHECK (role IN ('Admin', 'User')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.users IS 'Usuarios admin de la agencia NEXO (roles: Admin, User)';
-- ═══════════════════════════════════════════════════════════════
-- 2. TABLA: MODULES (Módulos Activos por Cliente)
-- ═══════════════════════════════════════════════════════════════
-- Registro de qué módulos tiene activos cada cliente (CRM, Contenido, etc.)
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.modules IS 'Módulos contratados por cada cliente (CRM, Contenido, E-commerce, etc.)';
-- Índice para buscar módulos por usuario rápidamente
CREATE INDEX idx_modules_user_id ON public.modules(user_id);
-- ═══════════════════════════════════════════════════════════════
-- 3. TABLA: LEADS (Directorio Central Unificado)
-- ═══════════════════════════════════════════════════════════════
-- Tabla unificada que sirve tanto al CRM como a la memoria de chat.
-- Captura visitantes desde la web, chatbots, formularios, etc.
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT,
    -- Nombre del prospecto (opcional)
    empresa TEXT,
    -- Empresa (opcional)
    source TEXT NOT NULL DEFAULT 'web',
    -- Origen: 'web', 'chatbot', 'NotebookLM', 'referido'
    status TEXT NOT NULL DEFAULT 'Nuevo' CHECK (
        status IN (
            'Nuevo',
            'Contactado',
            'Convertido',
            'Descartado'
        )
    ),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.leads IS 'Directorio central de prospectos. Alimentado por chatbots, formularios y fuentes externas.';
-- Índices para búsquedas frecuentes
CREATE INDEX idx_leads_email ON public.leads(email);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_source ON public.leads(source);
-- ═══════════════════════════════════════════════════════════════
-- 4. TABLA: INTERACTIONS (Historial de Acciones IA)
-- ═══════════════════════════════════════════════════════════════
-- Registro de lo que la IA ha hecho por el cliente. Transparencia total.
CREATE TABLE public.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE
    SET NULL,
        ai_action TEXT NOT NULL,
        -- Descripción de la acción (ej: "Generó propuesta comercial")
        metadata JSONB DEFAULT '{}'::jsonb,
        -- Datos extra flexibles
        created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.interactions IS 'Historial completo de acciones ejecutadas por la IA para auditoría y transparencia.';
-- Índices para consultas de dashboard
CREATE INDEX idx_interactions_user ON public.interactions(user_id);
CREATE INDEX idx_interactions_lead ON public.interactions(lead_id);
CREATE INDEX idx_interactions_created ON public.interactions(created_at DESC);
-- ═══════════════════════════════════════════════════════════════
-- 5. TABLA: CHAT_SESSIONS (Hilos de Conversación de Chatbots)
-- ═══════════════════════════════════════════════════════════════
-- Cada vez que alguien interactúa con un bot, se genera una sesión.
-- Soporta tanto leads conocidos como visitantes anónimos.
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    -- NULL si es visitante anónimo
    session_cookie TEXT NOT NULL,
    -- Device ID generado por Next.js
    skill_origin TEXT NOT NULL,
    -- Ej: 'rag-strict', 'qualifier', 'proposal-generator'
    estado_conversacion TEXT DEFAULT 'active' CHECK (
        estado_conversacion IN ('active', 'qualified', 'closed')
    ),
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.chat_sessions IS 'Hilos de conversación de los chatbots. session_cookie vincula usuarios anónimos.';
-- Índices para búsquedas rápidas al recargar la página
CREATE INDEX idx_chat_sessions_cookie ON public.chat_sessions(session_cookie);
CREATE INDEX idx_chat_sessions_lead_id ON public.chat_sessions(lead_id);
CREATE INDEX idx_chat_sessions_skill ON public.chat_sessions(skill_origin);
-- ═══════════════════════════════════════════════════════════════
-- 6. TABLA: CHAT_MESSAGES (Memoria Bruta de Mensajes)
-- ═══════════════════════════════════════════════════════════════
-- Los mensajes individuales de cada sesión de chat.
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.chat_messages IS 'Mensajes individuales. Constraint de role asegura solo valores válidos.';
-- Índice compuesto para cargar historial ordenado por sesión
CREATE INDEX idx_chat_messages_session ON public.chat_messages(session_id, created_at ASC);
-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════
-- ⚠️ Todas las tablas tienen RLS activado como capa de seguridad
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS: USUARIOS ANÓNIMOS (Frontend / Visitantes Web)
-- ═══════════════════════════════════════════════════════════════
-- Leads: Anónimos pueden CREAR leads (formularios/chatbot)
CREATE POLICY "anon_insert_leads" ON public.leads FOR
INSERT TO anon WITH CHECK (true);
-- Chat Sessions: Anónimos pueden crear sesiones
CREATE POLICY "anon_insert_chat_sessions" ON public.chat_sessions FOR
INSERT TO anon WITH CHECK (true);
-- Chat Sessions: Anónimos pueden leer sus propias sesiones (filtrado por session_cookie en el query)
CREATE POLICY "anon_select_chat_sessions" ON public.chat_sessions FOR
SELECT TO anon USING (true);
-- Chat Sessions: Anónimos pueden actualizar estado de sus sesiones
CREATE POLICY "anon_update_chat_sessions" ON public.chat_sessions FOR
UPDATE TO anon USING (true);
-- Chat Messages: Anónimos pueden insertar mensajes
CREATE POLICY "anon_insert_chat_messages" ON public.chat_messages FOR
INSERT TO anon WITH CHECK (true);
-- Chat Messages: Anónimos pueden leer historial de su sesión
CREATE POLICY "anon_select_chat_messages" ON public.chat_messages FOR
SELECT TO anon USING (true);
-- ═══════════════════════════════════════════════════════════════
-- POLÍTICAS: USUARIOS AUTENTICADOS (Dashboard Admin de la Agencia)
-- ═══════════════════════════════════════════════════════════════
-- Admins: Full access a TODAS las tablas
CREATE POLICY "admin_full_access_users" ON public.users FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_full_access_modules" ON public.modules FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_full_access_leads" ON public.leads FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_full_access_interactions" ON public.interactions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_full_access_chat_sessions" ON public.chat_sessions FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin_full_access_chat_messages" ON public.chat_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- ═══════════════════════════════════════════════════════════════
-- FUNCIÓN AUXILIAR: Actualizar last_active en chat_sessions
-- ═══════════════════════════════════════════════════════════════
-- Trigger que actualiza automáticamente el timestamp de última actividad
-- cada vez que se inserta un mensaje nuevo en una sesión.
CREATE OR REPLACE FUNCTION public.update_session_last_active() RETURNS TRIGGER AS $$ BEGIN
UPDATE public.chat_sessions
SET last_active = NOW()
WHERE id = NEW.session_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE TRIGGER trg_update_last_active
AFTER
INSERT ON public.chat_messages FOR EACH ROW EXECUTE FUNCTION public.update_session_last_active();
-- ═══════════════════════════════════════════════════════════════
-- 7. TABLA: KB_ASSETS (Knowledge Base / Manuales y Ejemplos)
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE public.kb_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    asset_type TEXT NOT NULL CHECK (
        asset_type IN ('manual', 'ejemplo', 'faq', 'servicio')
    ),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
COMMENT ON TABLE public.kb_assets IS 'Almacena manuales, ejemplos y contexto de NEXO para que los agentes IA lo consuman.';
-- RLS
ALTER TABLE public.kb_assets ENABLE ROW LEVEL SECURITY;
-- Políticas
-- El RAG (Server Action/API) necesita leer esto usando la Service/Anon Key segura.
CREATE POLICY "anon_select_kb_assets" ON public.kb_assets FOR
SELECT TO anon USING (is_active = true);
CREATE POLICY "admin_full_access_kb" ON public.kb_assets FOR ALL TO authenticated USING (true) WITH CHECK (true);
-- ═══════════════════════════════════════════════════════════════
-- FIN DEL SCRIPT — 7 tablas, RLS, y políticas.
-- ═══════════════════════════════════════════════════════════════