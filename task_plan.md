# Task Plan (BLAST Framework)

## Fases y Objetivos

### Fase 1: Blueprint (Planificación y Diseño)
- [x] **Estrella Polar:** Ser una agencia de marketing integral y diferenciada (fotografía, video, páginas web, landing pages, formularios, bots, etc.), logrando la excelencia en cada rubro.
- [x] **Integraciones MCP:** Uso de las ya instaladas, priorizando **InsForge** para la gestión de la base de datos y entidades de negocio mediante IA.
- [x] **Fuente de la Verdad:** Todos los documentos Markdown en la raíz del proyecto (e.g., `brain.md`, `Ancla.md`, `Plan.md`).
- [x] **Reglas de Comportamiento:** Continuar el desarrollo basándose estrictamente en la información documentada en los planes y markdowns existentes.

### Fase 2: Link (Conexiones y APIs)
- [ ] Configurar esquema de base de datos dinámica con **InsForge** y Supabase.
- [ ] Integrar Markdown/MDX parser para consumir contenido dinámico de sistemas y casos.
- [ ] Integrar sistema de agendamiento (Cal.com o Calendly) en la landing de auditoría.

### Fase 3: Architect (Estructura y Lógica)
- [ ] Inicializar/configurar el proyecto Next.js 15 (App Router) con TypeScript.
- [ ] Crear estructura de rutas principales (`/`, `/sistemas`, `/agentes`, `/auditoria`).
- [ ] Configurar lógica de enrutamiento del embudo B2B (Calificación -> Agenda -> Sprint).

### Fase 4: Stylize (Diseño e Interfaz)
- [ ] Implementar sistema de diseño Tailwind CSS + Shadcn UI con tema "Dark Mode" (Deep Space).
- [ ] Construir layout principal y navegación orientada a conversión B2B.
- [ ] Desarrollar Hero, grids de prueba social y cards de servicios en el Home.
- [ ] Implementar flujos y diagramas interactivos (React Flow / Mermaid).

### Fase 5: Trigger (Despliegue y Automatización)
- [ ] Configurar pipeline de Vercel para CI/CD continuo.
- [ ] Testear performance web y Accesibilidad (WCAG 2.2).
- [ ] Realizar Quality Assurance (QA) de los formularios y captura de leads.
