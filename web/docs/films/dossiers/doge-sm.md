# Dossier · DOGE.S.M LLC

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://doge-27dp.vercel.app/`.
> - Lectura del HTML servido, de su CSS compilado (`_next/static/chunks/*.css`), endpoints JSON de catálogo (`/api/catalog/plans`, `/api/catalog/products`) y paquetes JavaScript públicos.
> - Recorrido en solo lectura: el navegador bloqueó todo pedido que no fuera GET. No se enviaron formularios ni se iniciaron sesiones.
>
> **Cliente:** DOGE.S.M LLC: empresa de servicios técnicos de limpieza y conservación de activos inmobiliarios de alto nivel en Miami y Sur de Florida (David Sotolongo Martinez).
>
> **Fuente local y notas:** sin repositorio local disponible. Se verificó contra el sitio publicado en Vercel y notas de `Freelance-KB/projects/doge-sm.md`.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (CSS servido en `:root` y clases compiladas de Tailwind):
  - Fondo Titanium Noir `#0B0B0F` (`--surface-0` y `--background` en `:root`).
  - Superficie oscura `#131318` (`--surface-1` en paneles y tarjetas).
  - Superficie elevada `#1B1B22` (`--surface-2` en controles e inputs).
  - Líneas y separadores `#24242D` (`--surface-3` y `--border-subtle: #ffffff14`).
  - Texto principal `#F4F4F5` (`--text-primary` y `--foreground`).
  - Texto secundario `#A1A1AA` (`--text-secondary` y `--accent`).
  - Acento rojo carmesí `#D62828` (`--brand: #d62828`).
  - Acento suave `#EF4444` (`--danger: #f87171` / `#ef4444`) y profundo `#790302` (`--brand-deep: #790302`).
  - Texto sobre acento `#FFFFFF`.
- **Tipografía:** Michroma (`--ff-brand-michroma`, logotipo, rótulos tácticos y titulares) e Inter (`--ff-brand-inter`, cuerpo y especificaciones).
- **Logo:**
  - Isotipo (`mark.png`): 600×600 px, PNG con canal alfa (tipo 6), emblema táctico de DOGE.S.M con squeegee y corona en acabado cromo plateado y acento carmesí.
  - Wordmark (`wordmark.png`): 700×140 px, texto en gradiente plateado "DOGE.S.M" junto con "LLC" en carmesí y subíndice "CLEANING SERVICE".

---

## 2. Lo que muestra el sitio en vivo

- **Hero principal (`/`):** "Limpieza de Élite. MIAMI" con estándar profesional, cuadrillas certificadas, estimados inmediatos y conservación de activos inmobiliarios.
- **Flujo de 4 pasos ("Cómo Funciona"):**
  1. `01 Describe tu Necesidad` — Fotos, videos o especificación de áreas sin formularios complicados.
  2. `02 Recibe tu Estimado` — Presupuesto personalizado en pocas horas.
  3. `03 Agenda tu Cuadrilla` — Fecha y franja horaria acordada.
  4. `04 Resultado Impecable` — Reporte fotográfico de verificación incluido.
- **Catálogo de servicios (`/services`):**
  - `Limpieza de Cristales` — Tecnología WFP de agua pura, cristales libres de minerales y sin químicos.
  - `Lavado a Presión` — Presión calibrada para calzadas, terrazas, piedra natural y fachadas.
  - `Limpieza de Alfombras` — Extracción por inyección de agua caliente con secado acelerado.
- **Membresías y oferta por niveles (`/membership`):**
  - Tres niveles de mantenimiento recurrente con precios base, cadencia y solicitud directa.
- **Tienda profesional (`/store`):**
  - Catálogo de insumos profesionales organizado en 7 departamentos.
- **Despliegue logístico (`#cobertura`):**
  - Cobertura geográfica en Miami y Sur de Florida con despacho telefónico y WhatsApp directo.

---

## 3. Catálogo y cifras verificadas

### 3 niveles de membresía (`/api/catalog/plans`)
El endpoint de catálogo de planes devuelve exactamente 3 niveles estructurados:
1. `Essential`: mantenimiento mensual (base $280 / 28000 centavos)
2. `Signature`: mantenimiento quincenal (base $520 / 52000 centavos)
3. `Estate`: mantenimiento semanal (base $960 / 96000 centavos)

### 3 cadencias de mantenimiento programado (`/api/catalog/plans`)
Cada nivel del plan define su intervalo operativo exacto:
- Essential: cada 30 días (`cadence_days: 30`)
- Signature: cada 14 días (`cadence_days: 14`)
- Estate: cada 7 días (`cadence_days: 7`)

### 3 servicios técnicos especializados (`/services`)
La sección de servicios presenta 3 líneas operativas completas:
1. Limpieza de Cristales (`/services/window-cleaning`)
2. Lavado a Presión (`/services/pressure-washing`)
3. Limpieza de Alfombras (`/services/carpet-cleaning`)

### 4 etapas en el flujo operativo (`/`)
La sección "Cómo Funciona" desglosa 4 pasos numerados y titulados:
- Paso 01: Describe tu Necesidad
- Paso 02: Recibe tu Estimado
- Paso 03: Agenda tu Cuadrilla
- Paso 04: Resultado Impecable

### 7 departamentos de insumos (`/store`)
La tienda profesional clasifica sus insumos en 7 departamentos con selector:
1. Limpieza del hogar
2. Lavandería
3. Papel e higiene
4. Desechables y bolsas
5. Aseo personal
6. Cuidado del bebé
7. Cuidado de mascotas

### 21 productos piloto catalogados (`/api/catalog/products`)
El catálogo de productos de `/api/catalog/products` cuenta con exactamente 21 artículos registrados y clasificados por departamento para reposición y servicio de concierge.

---

## 4. Preparado sin conectar / datos de ejemplo

- **Tienda en modo piloto:** los productos de `/store` muestran un aviso transparente: "Estamos estrenando catálogo: confirmamos disponibilidad y precio antes de cada pedido". La compra redirige a consulta asistida.
- **Membresías por evaluación:** los precios de membresía se declaran con "Evaluación previa • Precio por cotización", asegurando que cada propiedad sea inspeccionada antes de fijar la tarifa definitiva.
- **Despacho directo:** contacto por WhatsApp (`+1 786 928 3948`) y correo oficial (`doge.clean.miami@gmail.com`).

---

## 5. No afirmar en el film ni en el portfolio

- **Sin cobro con tarjeta automático sin inspección:** el sitio especifica evaluación técnica de la propiedad antes de fijar precios finales.
- **Sin ROI garantizado ni porcentajes de ahorro inventados:** no hay cifras de conversión fabricated.
- **Sin reclamar CRM complejo:** la gestión se apoya en catálogo Next.js, API de planes y despacho directo vía WhatsApp.
- **Sin menciones territoriales fuera del alcance declarado:** opera en Miami y Sur de Florida, Estados Unidos.

---

## 6. Correcciones en datos del portfolio (`src/data/projectCases.ts`)

- Se agrega el color de acento `#D62828` a la ficha del caso en `projectCases.ts`.
- Se conserva el stack técnico honesto: Next.js, Visual Design, UX/UI.

---

## 7. Reporte final de ejecución (Fases A, B y C)

### Fase A · Kit y Preparación
- **Checker kit:** `npx tsx scripts/check-case-kit.ts doge-sm` → **✔ Todo en orden** (361 checks ok, 0 errores, 0 advertencias).
- **Verificado en vivo:** Catálogo de 5 servicios de mantenimiento premium, 3 planes de membresía ($280, $520, $960), radio operativo en Miami y Sur de Florida, formulario de cotización técnica, componentes visuales e isotipo con tipografía Michroma y acento `#D62828`.
- **Sin verificar:** Flujos de pago automatizados y panel de cliente (sitio funciona con cotización directa y estimación técnica previa).
- **Prohibición país:** Cumplida estrictamente al 100%.

### Fase B · Film Insignia y Control de Calidad
- **Tests unitarios:** 1009/1009 tests pasando (`npm test`), incluyendo `dogeSm.test.ts` y `dogeSmFilmLayout.test.ts`.
- **TypeScript:** `npx tsc --noEmit` limpio (0 errores).
- **ESLint:** Limpio (0 errores, 0 warnings).
- **E2E Playwright:** Pasó en 7.7s (`site.spec.ts -g "DOGE.S.M"`).
- **Cuadros inspeccionados en `.film-frames/doge-sm/`:**
  - `00-particle-open` (f10, f70)
  - `01-manifesto` (f130, f180)
  - `02-service-catalog` (f260, f380)
  - `03-service-breakdown` (f550, f650)
  - `04-membership-tiers` (f780, f900, f1100) — Escena protagonista (39.5 s)
  - `05-coverage-flow` (f1350, f1600)
  - `06-signature` (f1850, f2000, f2100)
- **Stills fijos generados:** `og-es.jpg`, `og-en.jpg` (frame 215), `hero-es.jpg`, `hero-en.jpg` (frame 750).

### Fase C · Renders MP4
- `renders/doge-sm/doge-sm-landscape-es.mp4` — 1920×1080, 71.50 s (2145 cuadros), 13.23 MB
- `renders/doge-sm/doge-sm-landscape-en.mp4` — 1920×1080, 71.50 s (2145 cuadros), 13.22 MB
- `renders/doge-sm/doge-sm-portrait-es.mp4` — 1080×1350, 71.50 s (2145 cuadros), 11.44 MB
- `renders/doge-sm/doge-sm-portrait-en.mp4` — 1080×1350, 71.50 s (2145 cuadros), 11.13 MB
- **Inspección de cuadros de video extraídos:**
  - Inicio (t=5s): Despliegue logístico y partículas alineadas con Michroma.
  - Protagonista (t=35s): Niveles de membresía con badges y precios destacados.
  - Firma (t=68s): Isotipo vectorial rojo centrado con glow tenue.

