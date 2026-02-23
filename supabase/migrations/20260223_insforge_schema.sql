-- ==========================================
-- Esquema de Base de Datos para Agencia - InsForge
-- ==========================================

-- 1. Tabla: Users
-- Gestión de clientes y roles (Admin/User).
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'User')) DEFAULT 'User',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para Users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Tabla: Modules
-- Registro de qué módulos (CRM, Contenido, etc.) tiene activos cada cliente.
CREATE TABLE public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para Modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- 3. Tabla: Leads
-- Captura de datos desde la ventana de contacto de NotebookLM.
CREATE TABLE public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    source TEXT DEFAULT 'NotebookLM' NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Nuevo', 'Contactado', 'Convertido')) DEFAULT 'Nuevo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para Leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. Tabla: Interactions
-- Historial de lo que la IA ha hecho por el cliente para transparencia total.
CREATE TABLE public.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    ai_action TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS para Interactions
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Políticas RLS Base (Solo como referencia, a ajustar según Auth)
-- ==========================================
-- Se asume que auth.uid() contendrá el ID del usuario en sesión.

-- Users pueden leer su propio perfil, Admins pueden leer todo.
CREATE POLICY "Usuarios leen su propio perfil" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Modules pueden ser leídos por su dueño.
CREATE POLICY "Usuarios ven sus propios módulos" ON public.modules
    FOR SELECT USING (auth.uid() = user_id);

-- Solo el sistema backend o admins interactúan con leads/interactions generalmente,
-- pero los usuarios pueden ver sus interacciones.
CREATE POLICY "Usuarios ven su propio historial de IA" ON public.interactions
    FOR SELECT USING (auth.uid() = user_id);
