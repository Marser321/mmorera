# Dossier · Punta360

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://punta-360.vercel.app/`.
> - Lectura del HTML servido, de su CSS compilado (`_next/static/chunks/*.css`), clases de Tailwind y paquetes JavaScript públicos.
> - Recorrido en solo lectura: el navegador bloqueó todo pedido que no fuera GET. No se enviaron formularios ni se iniciaron sesiones.
>
> **Cliente:** Punta360: plataforma de producción de marketing visual y servicios multimedia para bienes raíces premium en Punta del Este y Costa Atlántica.
>
> **Fuente local y notas:** sin repositorio local disponible. Se verificó contra el despliegue publicado en Vercel.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (CSS servido en `:root` y clases compiladas de Tailwind):
  - Fondo Midnight Slate `#020617` (`bg-slate-950` y fondo principal en home, `/owners` y `/enterprise`).
  - Superficie oscura `#0B1120` (paneles, tarjetas de visualización con `backdrop-blur` y bordes translúcidos).
  - Superficie elevada `#131D31` (tarjetas interactivas y contenedores de planes).
  - Líneas y separadores `#1E293B` (`border-white/10` y bordes de acento).
  - Texto principal `#F8FAFC` (`text-white` y `text-slate-100`).
  - Texto secundario `#94A3B8` (`text-slate-400` y `text-white/80`).
  - Acento ámbar dorado `#F59E0B` (`text-amber-500` en wordmark y detalles clave).
  - Acento suave `#FBBF24` (`#FBBF24` en degradé del isotipo y badges ámbar).
  - Acento profundo `#D97706` (`#D97706` extremo del degradé del isotipo y botones).
  - Texto sobre acento `#020617` (botones de acción principal en contraste alto).
- **Tipografía:** Geist (`--font-geist-sans`, `--font-geist-mono`, `Geist`, `sans-serif`) para titulares, métricas y cuerpo técnico.
- **Logo:**
  - Isotipo (`mark.png`): 512×512 px, PNG con canal alfa (tipo 6), prisma cúbico isométrico 3D dorado (`#FBBF24` a `#D97706`) rodeado de anillo orbital de 360 grados.
  - Wordmark (`wordmark.png`): 600×160 px, composición con "Punta" en blanco y "360" en ámbar dorado `#FBBF24`.

---

## 2. Lo que muestra el sitio en vivo

- **Home (`/`):**
  - Selector de perfiles de acceso:
    1. `Propietarios` (`/owners`): "Eleva el Valor de Tu Inversión. Transformamos propiedades en experiencias irresistibles."
    2. `Agencias y Agentes` (`/enterprise`): "Vende como los Grandes. El mismo marketing que usan las inmobiliarias de lujo."
    3. `Equipo Interno` (`/dashboard`): portal interno de coordinación y control operativo.
- **Página de Propietarios (`/owners`):**
  - **4 métricas de impacto comercial:**
    1. `98%` — Efectividad comercial en posicionamiento.
    2. `45` — Días Promedio de comercialización.
    3. `+850` — Propiedades y producciones gestionadas.
    4. `24h` — Soporte y coordinación operativa.
  - **4 disciplinas de marketing visual:**
    1. `Fotografía Editorial` — Capturamos la esencia de tu propiedad con calidad de revista internacional.
    2. `Tour Inmersivo 3D` — Permite que compradores internacionales caminen por la casa a distancia.
    3. `Cinematografía Aérea` — Perspectivas de drone 4K que destacan el entorno y la ubicación privilegiada.
    4. `Estrategia de Redes` — Contenido vertical viral diseñado para alcanzar audiencias de alto valor.
  - **Flujo de trabajo en 4 pasos ("Simple & Transparente"):**
    1. `01 Agenda tu Visita` — Coordinación de tasación y relevamiento inicial.
    2. `02 Producción Visual` — Sesión integral en locación (fotos, 3D y vuelo).
    3. `03 Lanzamiento Global` — Publicación multicanal en portales de lujo.
    4. `04 Cierre Exitoso` — Gestión comercial acelerada con compradores calificados.
- **Página de Agencias y Agentes (`/enterprise`):**
  - **Comparador interactivo:** HDR Profesional (Enterprise) vs Foto Celular (Amateur).
  - **Catálogo de 3 planes de suscripción para agentes:**
    1. `Agente Solo` — USD $99/mes (Hasta 5 propiedades, 1 Tour 360°/mes, fotografía profesional básica, página personal, WhatsApp direct).
    2. `Agencia Growth` — USD $399/mes (Hasta 25 propiedades, Tours 360° ilimitados, 2 videos drone 4K/mes, pack de redes sociales, dashboard de equipo 5 usuarios, IA Lead Scoring, WhatsApp Business, soporte 24/7).
    3. `Scale` — USD $899/mes (Propiedades ilimitadas, Tours 360° y drones 4K ilimitados, automatizaciones IA, API CRM, usuarios ilimitados, soporte dedicado).

---

## 3. Catálogo y cifras verificadas

1. `98%` de efectividad comercial reportada en la plataforma.
2. `45` días promedio de ciclo de venta frente al estándar tradicional.
3. `+850` propiedades producidas en catálogo.
4. `24h` de tiempo de respuesta y soporte operativo.
5. `USD $99/mes` — Plan Agente Solo.
6. `USD $399/mes` — Plan Agencia Growth.
7. `USD $899/mes` — Plan Scale.
8. `4` disciplinas visuales integradas (Editorial, 3D, Drone 4K, Redes).
9. `4` pasos del flujo de producción (Agenda, Producción, Lanzamiento, Cierre).

---

## 4. Arquitectura de sistemas

- `architecture.bundle: null`
- **Razón:** Plataforma comercial de presentación y catálogo multimedia para el sector inmobiliario de lujo con selector de perfiles y comparador HDR en frontend, sin backend de microservicios ni base de datos distribuida expuesta que justifique diagrama Archify.

---

## 5. Lo que el film NO debe afirmar (`doNotClaim`)

1. No afirmar automatización de transacciones notariales o escrituración remota inmediata sin intermediación humana.
2. No afirmar que Punta360 es una aseguradora o entidad financiera.
3. No prometer ventas garantizadas en menos de 24 horas ni asegurar rentabilidades fijas de inversión.
4. No mencionar el nombre del país prohibido bajo ninguna circunstancia (utilizar "Punta del Este", "Costa Atlántica", "Costa Este").

---

## 6. Correcciones en datos del portfolio (`src/data/projectCases.ts`)

- Se enriqueció la ficha de `punta-360` con las 4 disciplinas de producción, el proceso en 4 pasos y la estructura de suscripciones para agentes.
- Se fijó el color de acento `#F59E0B` coherente con la paleta ámbar del sitio.

---

## 7. Reporte final de ejecución (Fases A, B y C)

### Fase A · Kit y Preparación
- **Checker kit:** `npx tsx scripts/check-case-kit.ts punta-360` → **✔ Todo en orden** (452 checks ok, 0 errores, 0 advertencias).
- **Verificado en vivo:** Catálogo de 4 disciplinas visuales integradas, recorrido 3D inmersivo espacial, comparativa HDR editorial vs fotografía celular, planes de suscripción para agentes y agencias ($99, $399, $899/mes), flujo de producción en 4 fases, métricas comerciales (98 de cada 100 de efectividad, 45 días promedio, +850 propiedades, 24h respuesta), paleta slate-950 con acento ámbar (`#F59E0B`), tipografía Geist.
- **Sin verificar:** Pagos automatizados de suscripción o pasarelas financieras dentro del frontend.
- **Prohibición país:** Cumplida estrictamente al 100% en todo el código y assets ("Punta del Este", "Costa Este").

### Fase B · Film Insignia y Control de Calidad
- **Tests unitarios:** 1020/1020 tests pasando (`npm test`), incluyendo `punta360.test.ts` y `punta360FilmLayout.test.ts`.
- **TypeScript:** `npx tsc --noEmit` limpio (0 errores).
- **ESLint:** Limpio (0 errores).
- **E2E Playwright:** Pasó en 12.1s (`site.spec.ts -g "Punta 360"`).
- **Cuadros inspeccionados en `.film-frames/`:**
  - `00-particle-open` (f0, f150) — Monograma cúbico isométrico y arco orbital 360 en partículas ámbar sobre placa cinemática.
  - `01-comparison` (f300) — Comparativa HDR editorial vs fotografía de celular.
  - `02-virtual-tour` (f700) — Escena protagonista (24.0 s / 720 frames) con visor espacial 3D, retícula de escaneo, hotspots y telemetría activa.
  - `03-workflow` (f1300) — 4 fases operativas (Agenda, Producción, Lanzamiento, Cierre).
  - `04-plans` (f1600) — Planes comerciales Agente Solo ($99), Agencia Growth ($399, badge "Más vendido") y Scale ($899).
  - `05-signature` (f2000) — Firma cinemática centrada con anillo y monograma.
- **Stills fijos generados:** `og-es.jpg`, `og-en.jpg`, `hero-es.jpg`, `hero-en.jpg`.

### Fase C · Renders MP4
- `renders/punta-360/punta-360-landscape-es.mp4` — 1920×1080, 71.50 s (2145 cuadros), 21.99 MB
- `renders/punta-360/punta-360-landscape-en.mp4` — 1920×1080, 71.50 s (2145 cuadros), 21.94 MB
- `renders/punta-360/punta-360-portrait-es.mp4` — 1080×1350, 71.50 s (2145 cuadros), 17.59 MB
- `renders/punta-360/punta-360-portrait-en.mp4` — 1080×1350, 71.50 s (2145 cuadros), 17.63 MB
- **Inspección de cuadros de video extraídos:**
  - Apertura (`sample-open.jpg`, t=3.5s): Isotipo cúbico y arco orbital 360 formándose en partículas.
  - Protagonista (`sample-tour.jpg`, t=25.0s): Recorrido virtual inmersivo con retícula, hotspot y telemetría.
  - Firma (`sample-sign.jpg`, t=68.0s): Logomark vectorial blanco nítido centrado sobre fondo profundo.

