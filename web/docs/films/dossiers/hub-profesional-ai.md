# Dossier del Film Insignia: Hub Profesional

## 1. Resumen ejecutivo y contexto del negocio

**Hub Profesional** es una plataforma de plantillas de alta gama y herramientas de autoridad digital diseñadas para profesionales independientes y firmas de servicios que buscan transformar visitas en clientes calificados. En lugar de sitios web genéricos, la plataforma implementa una arquitectura Dark Mode de alto impacto visual, optimizada para conversión y estructurada por rubros especializados.

El portal en producción presenta:
- **Showcase Live (`/showcase`)**: Galería interactiva con el estándar profesional que expone las 6 especialidades diseñadas a medida (Mecánico, Abogado, Psicólogo, Odontólogo, Arquitecto y Centro de Estética), destacando tres pilares de ingeniería: Diseño Premium Dark Mode, enfoque Mobile First y Velocidad Extrema sobre Next.js 15.
- **Mecánica Premium (`/`)**: La especialidad insignia desplegada por defecto en el portal, diseñada para talleres mecánicos de alta gama. Incorpora diagnóstico computarizado Bosch, protocolo de servicio en 4 fases, portafolio de activos verificados y sistema de turnos digital.
- **Selector Dinámico Multirrubro (`/`)**: Navegación en tiempo real que permite alternar instantáneamente entre las 6 especialidades profesionales, reconfigurando la paleta cromática, los titulares de autoridad y los módulos de servicio específicos de cada industria.

---

## 2. Relevamiento técnico del sitio en producción

- **URL en producción:** `https://profecionalcv.vercel.app/`
- **Fecha de relevamiento:** 2026-10-07
- **Modo:** Solo lectura estricto (GET HTTP).
- **Stack tecnológico detectado:**
  - Framework: Next.js 15 (App Router) + React 19
  - Estilos: Tailwind CSS compilado con estética noir / Dark Mode de alta fidelidad
  - Tipografía: Geist (titulares y etiquetas técnicas) e Inter (cuerpo y datos de lectura)
  - Iconografía y micro-interacciones: Lucide Icons / CSS transitions
- **Tokens de color verificados:**
  - Fondo (`bg`): `#050505` (noir profundo base del portal)
  - Superficie (`surface`): `#121212` (tarjetas y contenedores de servicios)
  - Elevado (`raised`): `#1C1C1C` (elementos interactivos y estados elevados)
  - Línea (`line`): `#2E2E2E` (bordes sutiles de precisión)
  - Texto principal (`text`): `#F5F5F5` (blanco óptico de alta legibilidad)
  - Texto atenuado (`muted`): `#B0B0B0` (gris técnico secundario)
  - Acento automotriz (`accent`): `#FF3B30` (rojo de precisión / Apple red)
  - Acento suave (`accentSoft`): `#FF6961` (rojo luminoso para highlights)
  - Acento profundo (`accentDeep`): `#CC2F26` (rojo oscuro para contrastes de marca)
  - Sobre acento (`onAccent`): `#050505`

---

## 3. Cifras y métricas verificadas en producción

Todas las cifras provienen directamente de los textos y datos renderizados en el sitio web publicado:
1. `6` — 6 especialidades profesionales y plantillas de autoridad disponibles en el portal (`/showcase` y selector).
2. `1200` — +1200 vehículos atendidos en el historial del taller Mecánica Premium (`/`).
3. `4.9` — 4.9/5 de puntaje promedio en Google verificado en el portal (`/`).
4. `8` — 8 activos verificados en el portafolio de excelencia técnica (`/`).
5. `4` — 4 pasos del protocolo de servicio de alta precisión: Ingreso, Diagnóstico, Presupuesto y Control Final (`/`).
6. `40` — 40 puntos críticos de seguridad inspeccionados mediante check-list digital (`/`).
7. `20` — Más de 20 años de experiencia y pasión técnica acreditada en el taller (`/`).

---

## 4. Arquitectura de sistemas

- `architecture.bundle: null`
- **Razón:** Portal de plantillas estáticas Next.js 15 con renderizado estático y componentes cliente interactivos, sin backend persistente ni base de datos dedicada.

---

## 5. Lo que el film NO debe afirmar (`doNotClaim`)

1. No prometer facturación automatizada ni cobro integrado con pasarelas de pago.
2. No prometer garantías de facturación, retornos de inversión (ROI) ni porcentajes de conversión garantizados.
3. No afirmar que el sistema incluye CRM multi-tenant activo con bases de datos SQL en producción.
4. No mencionar bajo ninguna circunstancia el nombre del país prohibido (utilizar "Montevideo", "Cono Sur").
5. Aclarar que las plantillas y flujos son demostradores interactivos de autoridad profesional para independientes.

---

## 6. Correcciones en datos del portfolio (`src/data/projectCases.ts`)

- Se actualiza el título de "Hub Profesional AI" a "Hub Profesional" para reflejar con honestidad el producto real desplegado.
- Se actualiza el resumen para detallar el catálogo multirrubro de 6 plantillas de autoridad y la demostración insignia de Mecánica Premium.
- Se fija el color de acento `#FF3B30` representativo de la marca.
- Se actualiza el stack técnico: Next.js 15, Tailwind CSS, Dark Mode, Authority Templates.

---

## 7. Reporte de finalización del film insignia (Fases B y C)

### 1. Salida de tests, comprobaciones de tipo y linter
- **Kit check (`check-case-kit.ts hub-profesional-ai` y `--all`):**
  `✔ hub-profesional-ai: 434 comprobaciones bien, 0 fallas, 0 avisos` (todos los 9 kits pasan con 0 errores).
- **Unit tests del film y geometría (`hubProfesional.test.ts`, `hubProfesionalFilmLayout.test.ts`):**
  `✔ tests 9, pass 9, fail 0` (integridad de escenas, 71.5s / 2145 frames, 4 capítulos, 6 especialidades y geometría sin solapamiento).
- **Suite completa del proyecto (`npm test`):**
  `✔ tests 1041, pass 1041, fail 0` (suite completa en verde).
- **Typecheck (`npx tsc --noEmit`):**
  `Exit code 0` (0 errores de TypeScript).
- **Linter (`npx eslint`):**
  `Exit code 0` (0 errores; 38 advertencias previas de variables sin usar en otros archivos, ninguna en los archivos de Hub Profesional).
- **E2E Playwright (`e2e/site.spec.ts`):**
  `✔ el caso insignia de Hub Profesional reproduce su film sin errores (passed, 7.7s)`.

### 2. Cuadros revisados en `.film-frames/hub-profesional-ai/`
- `hub-profesional-ai-landscape-es-105.png` / `hub-profesional-ai-portrait-en-105.png`: Apertura con el logo HP en partículas sobre el hero loop.
- `hub-profesional-ai-landscape-es-750.png` / `hub-profesional-ai-portrait-en-750.png`: Selector multirrubro (protagonista) en Psicología Clínica.
- `hub-profesional-ai-landscape-es-1400.png` / `hub-profesional-ai-portrait-en-1400.png`: Tramo medio del film.
- Cuadros extraídos de los MP4 finales (ver punto 4): apertura (3,5 s), selector (25 s, 16:9 y 4:5) y firma MM (68,3 s).
- Pendiente: no se revisaron cuadro por cuadro las escenas de catálogo, protocolo y cifras; conviene una pasada con `scripts/film-frames.ts`.

### 3. Decisiones de copia para revisión de Mario o Claude
- **Términos de ubicación:** Se respetó estrictamente la prohibición del país vecino, utilizando exclusivamente "Montevideo", "Cono Sur" o sede central.
- **Sin garantías exageradas ni retornos de inversión inventados:** Únicamente se exhiben métricas fidedignas extraídas de la plataforma en producción: 6 especialidades profesionales, 1200 vehículos atendidos, 4.9 de valoración promedio, 8 activos verificados, 4 pasos de protocolo, 40 puntos de inspección y 20 años de experiencia.
- **Enfoque de producto:** Se posiciona como una factoría de plantillas de alta autoridad digital para independientes bajo Next.js 15 y Dark Mode, sin prometer CRM multi-tenant ni pasarelas de cobro no existentes.

### 4. Archivos MP4 generados (en `renders/hub-profesional-ai/`)
- `hub-profesional-ai-landscape-es.mp4`: 1920×1080, 71.50 s (2145 cuadros), 10.62 MB.
- `hub-profesional-ai-landscape-en.mp4`: 1920×1080, 71.50 s (2145 cuadros), 10.53 MB.
- `hub-profesional-ai-portrait-es.mp4`: 1080×1350, 71.50 s (2145 cuadros), 10.14 MB.
- `hub-profesional-ai-portrait-en.mp4`: 1080×1350, 71.50 s (2145 cuadros), 10.03 MB.
- Cuadros de muestra extraídos con FFmpeg: `sample-open.jpg`, `sample-switcher.jpg`, `sample-sign.jpg`, `sample-portrait.jpg`.
