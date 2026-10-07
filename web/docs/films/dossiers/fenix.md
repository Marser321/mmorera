# Dossier · Fenix Medical Center (caso insignia pendiente)

Fuente: repo del cliente `D:\fenix group` (no disponible en la nube). Todo lo de abajo fue verificado leyendo ese repo el 2026-10-06. El kit visual publicable ya está copiado en este repo (ver "Assets").

## Qué es
- **Fenix Medical Center** (Fenix Medical Group Inc), en **Duluth, Gwinnett County, Georgia (EE. UU.)**.
- Combina atención primaria (con seguro o cash), longevidad y recuperación, y estética médica. Todo bajo supervisión médica.
- **Servicios:** cámara hiperbárica (HBOT), luz roja, sauna infrarroja, frío / crioterapia, IV drips / NAD+, GLP-1 (solo como servicio), botox/fillers y faciales.
- **Sitio en vivo:** https://fenixmedicalcenters.com (Next.js 16, bilingüe ES/EN).
- **Audiencias:** atletas, pacientes diabéticos o con heridas, post-quirúrgicos, longevidad 40+, pacientes hispanos (sitio bilingüe) y un programa corporativo B2B.

## Qué se puede publicar (autorizado por Mario)
Sitio + arquitectura + GHL · Investigación y evidencia · Fábrica de contenido · Proceso de ingeniería.

**Nunca:**
- testimonios de pacientes, datos personales ni fotos reales con modelos o staff;
- el contenido de FENIX OS (solo nombrarlo como hub interno);
- costos, nómina, contratos ni pitch decks.

## Sitio y CRM (GoHighLevel)
- **Stack:** Next.js 16 (App Router) y React 19, Tailwind v4, next-intl (ES/EN), next-themes (temas "obsidiana" y "hueso"), framer-motion, GSAP y Lenis, Playwright + axe. Sin WebGL: usa video pre-renderizado y CSS.
- **Rutas:** home, `/tratamientos` más 8 páginas de tratamiento (`camara-hiperbarica`…), `/edad-biologica`, `/recuperacion`, `/el-metodo`, `/membresias`, `/contacto` y otras. Son 20 destinos × 2 idiomas = 40 páginas.
- **Lead:**
  1. El navegador envía `POST /api/lead` (fail-closed con `isLeadCaptureEnabled`).
  2. Se validan **exactamente 7 campos**, sin texto libre, para mantener los datos de salud afuera (ADR-058/189).
  3. Se reenvía al **GHL Inbound Webhook**.
- **Reserva:** `ghl.ts` usa la REST API de GHL para traer slots libres, hacer upsert del contacto y crear la cita.
- **En GHL:** 6 campos custom; pipeline "Fenix | Website Leads" (New → Scheduled); workflow "Website Intake" (upsert → tags `source/locale/interest/consent` → oportunidad sin duplicados).
- **Seguridad:** WAF de Vercel en `/api/lead` (5 req / 10 min por IP). El Conversions API de Meta va **sin datos personales**.
- **Embudo:**
  1. Anuncio o contenido.
  2. Sitio.
  3. `/api/lead` → GHL (New).
  4. Agenda (Scheduled).
  5. Pre-calificación telefónica.
  6. Consulta médica.
- **Escalera de oferta:** contenido → panel de edad biológica ($199–$299) → consulta de resultados → membresía → revisión a 90 días.

## Investigación y evidencia
- 25 prompts de investigación profunda en 6 líneas (evidencia, mercado, tipos de paciente, B2B, web/3D, compliance), corridos en Gemini y GPT. Resultado: unos 46 informes y **unas 224k palabras**.
- **Registro de afirmaciones: 109 claims**, cada uno con redacción permitida y prohibida en ES/EN (14 de HBOT, 16 de edad biológica, 18 de GLP-1…).
- **HBOT:**
  - Mecanismo: el oxígeno se disuelve en plasma bajo presión (ley de Henry).
  - Aprobado (FDA 510(k) / UHMS) para heridas crónicas seleccionadas e injertos comprometidos.
  - Solo "señal" (protocolos de 40–60 sesiones): post-quirúrgico, recuperación deportiva, cognición, piel.
  - No establecido: energía general, longevidad.
  - **Prohibido:** autismo, COVID agudo.
- **Razonamiento de posicionamiento (beats para el film):**
  1. **"La dosis es el claim":** los beneficios vienen de protocolos largos, así que la membresía es un requisito clínico.
  2. **Combinación única** en 30 minutos a la redonda: atención primaria con seguro + longevidad. Titular: "Tu médico de cabecera, que también conoce tu plan de longevidad".
  3. **"Normal es un rango. Tu salud necesita contexto."** Reemplazó "te hacemos óptimo", por ética.
  4. **Precios transparentes:** las quejas contra competidores eran comerciales, no médicas.
  5. **Sitio bilingüe y precios claros** para pacientes hispanos.
  6. **El compliance define la tecnología:** sin píxel en páginas de tratamiento y CAPI sin datos personales.

## Fábrica de contenido ("Cerebro Fénix")
- **Ingesta:** transcripciones de **6 canales médicos públicos** de YouTube.
- **Base:** SQLite FTS5 con **1.096 videos, 8.034 fragmentos y 4,33 M de palabras** (no 4,4 M). Presentarlo como recuperación por palabras clave (BM25), **no** como búsqueda vectorial.
- **Servidor MCP con 5 herramientas:** consultar, sintetizar, generar guion, transcripción y estadísticas. El generador de guiones usa plantillas: hook 0–4 s → biología → error común → micro-hábito → solución Fénix → CTA, con checklist de compliance.
- **Producción:**
  - **28 guiones** (8 reels, 5 educativos, 3 VSL, 12 ads) con revisión de cumplimiento contra el registro de claims.
  - Banco de **53 hooks**.
  - 16 paquetes de producción cinematográfica (8 terminados).

## Ingeniería
- Trabajo con agentes: Gemini implementa y agentes Claude hacen QA visual y de backend. Contrato de ciclo de auditoría.
- **221 ADR** (decisiones documentadas).
- **QA de producción (2026-10-03): 98 de 98 chequeos** (headers, 44 rutas, SEO, redirects, endpoint de lead, calendario GHL).
- **Repo:** 407 commits entre el 2026-08-09 y el 2026-10-02; 224 archivos y 37.720 líneas; 79 specs de Playwright.
- **Entrega del 24-09:** 40 páginas, 131 recursos visuales y 1.572 variantes; unas 140 h (115 de agentes + 25 de revisión humana).

## Marca
- **Logo:** fénix dorado en un círculo abierto. Oro del logo `#e3b556`.
- **Paleta "obsidiana":** char `#04070c`, midnight `#050b16`, navy `#0b1422`, línea `#1b2638`, latón `#8a5d1d` / `#cb9334` / `#f0cf7a`, hueso `#f8f6f0`, niebla `#c9bfb2`.
- **Tipografía:** Fraunces (títulos), Manrope (texto).
- **Tono:** médico, calmo y concreto, nunca eufórico. El oro va en la luz y la interfaz, nunca sobre estructuras biológicas.
- **Taglines:** "Donde tu salud renace", "Normal es un rango. Tu salud necesita contexto.", "El tiempo no se detiene. Se optimiza."
- Tokens ya cargados en `web/src/data/brands/caseBrands.ts` (`fenix-medical-center`).

## Assets en este repo
- **Logos:** `web/public/portfolio/brands/fenix-medical-center/{mark,wordmark}.png`
- **Escenas propias** (renders cinemáticos, sin personas reales): `.../scenes/`
  - `amb-00-umbral-apertura-v2--16x9.mp4` (corredor a la recepción)
  - `hdr-v1-tratamientos-camara-hiperbarica--16x9.mp4` (cámara hiperbárica)
  - `svc-v12-hbot-consulta--16x9.mp4`
  - estudios de mecanismo `mec-hbot-02/05/08.webp` (Mario confirmó retener las láminas de mecanismo: "Difusión en el tejido" y "Angiogénesis").
- **Capturas:** `.../shots/booking-{1-dia,2-hora,3-datos}.png` (reserva en 3 pasos, formulario vacío) y `site-hbot.jpg` (página HBOT en producción).
- **Fondos difuminados:** `web/public/portfolio/backdrops/*-blur.jpg`
- **Diagramas Archify:** `web/src/data/architecture/fenix-system-architecture.json` (lead, reserva y frontera de compliance, con 3 vistas).
- **Reel y capturas del sitio en vivo:** generar con `npx tsx scripts/capture-case-reels.ts fenix-medical-center` después de agregar el caso a `projectCases.ts` con `liveUrl`.
