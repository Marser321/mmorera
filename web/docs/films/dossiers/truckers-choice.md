# Dossier · Truckers Choice

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://truckers-choice-web-site.vercel.app` (`/en` y `/es`).
> - Lectura del HTML servido, de su CSS y de sus paquetes JavaScript públicos.
> - El formulario de cotización se recorrió en solo lectura: el navegador bloqueó todo pedido que no fuera GET. Ver § 5.
>
> **Cliente:** Truckers Choice Insurance & Permits: seguros, permisos y cumplimiento para transportistas, con oficinas en Florida y Nueva Jersey.
>
> **Fuente local:** no hay repo local del sitio. `Desktop/tramite insurance` es otro proyecto ("Trámites Insurance USA, Ciudadanía Española") y no se usa.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (clases de Tailwind compiladas):
  - Fondo `#050810` y `#070B14`.
  - Superficies `#0F1626` y `#0C1322`.
  - Texto `#F2F5FA`; secundario `#9CA3AF`.
  - Acento ámbar `#FFB020` (`bg-accent`, `text-accent`).
- **Tokens del sistema** (HSL en `:root`):
  - `--primitive-amber` 38 100% 56%.
  - `--primitive-navy-950` 224 48% 5%, `--primitive-navy-900` 222 44% 10% y `--primitive-navy-850` 221 41% 14%.
  - `--primitive-steel` 223 13% 60%.
  - Borde 220 15% 15%.
- **Tipografía:** Manrope (`--font-display`, títulos) e Inter (`--font-body`, texto).
- **Logo:** `public/images/logo-white.png` (720×426, blanco con alfa): un camión delante del mapa de EE. UU. y el texto "Trucker's Choice Insurance & Permits." El film separa el dibujo (`mark.png`) del texto (`wordmark.png`).

## 2. Lo que dice el sitio (`/en` y `/es`)

- **Hero:** "Insurance + Permits. One roof." / "Seguros + Permisos. Todo en un solo lugar."
  - Etiqueta "Insurance · Permits · Compliance" / "Seguros · Permisos · Cumplimiento".
  - Fondo: clip `media/hero-loop.mp4`.
- **Fila de datos del hero:** "30 confirmed services", "3 offices in FL & NJ", "EN / ES bilingual support", "One roof: insurance + permits + compliance".
- **"One night on the road" / "Una noche en la ruta":** relato en 4 capítulos, cada uno con su clip o imagen y su llamado a la acción:
  1. "The storm doesn't ask if you're covered." / "La tormenta no pregunta si estás cubierto." Clip `story-night-risk.mp4`. Lleva a seguros.
  2. "The paperwork rides with you. Until someone takes it." / "El papeleo viaja contigo. Hasta que alguien te lo quita." Imagen `story-cab-paperwork.webp`. Lleva a permisos e impuestos de combustible.
  3. "Behind every mile, an office that answers." / "Detrás de cada milla, una oficina que contesta." Clip `story-network.mp4`. Lleva a las oficinas.
  4. "And the road opens again." / "Y la carretera vuelve a abrirse." Clip `story-sunrise.mp4`. Lleva a la cotización.
- **"Everything under one roof" / "Todo bajo un mismo techo":** seguro, autoridad DOT, placas, permisos y cumplimiento "in one connected workflow".

## 3. Catálogo

**6 líneas de servicio, 30 trámites confirmados.** Los cuenta `/en/services`, donde cada línea dice "N confirmed filings":

| # | Línea (EN / ES) | Trámites | Qué incluye (texto del sitio) |
|---|---|---|---|
| 1 | Corporations & LLCs / Corporaciones y LLC | 4 | Formación de la empresa y Tax ID/EIN |
| 2 | DOT & MC Authority / Autoridad DOT y MC | 5 | DOT, MC, BOC-3, UCR y Letter of Authority |
| 3 | IRP, Plates & Titles / IRP, Placas y Títulos | 6 | Placas prorrateadas y comerciales, registros, transferencias, títulos y Form 2290 |
| 4 | Permits & Fuel Tax / Permisos e Impuestos de Combustible | 6 | IFTA, impuestos trimestrales de combustible, permisos estatales y temporales |
| 5 | Truck Insurance / Seguro de Camiones | 4 | Responsabilidad primaria, carga, bobtail y daño físico |
| 6 | DOT Compliance & Audits / Cumplimiento DOT y Auditorías | 5 | Informes MVR, solicitudes de conductores, programas de pruebas y auditorías DOT |

4 + 5 + 6 + 6 + 4 + 5 = **30**, la misma cifra del hero ("30 confirmed services").

- **Hoja de ruta, 4 pasos:**
  1. "Form your business" / "Forma tu empresa".
  2. "Get your authority" / "Obtén tu autoridad".
  3. "Insurance & Permits" / "Seguro y Permisos".
  4. "Stay in compliance" / "Mantente en cumplimiento".
- **3 paquetes**, cada uno con su enlace "Quote this plan" a `/contact?package=…`:
  - "Start the Business" / "Inicia el Negocio": corporaciones y autoridad.
  - "Prepare to Operate" / "Prepárate para Operar": placas, permisos y seguro.
  - "Keep Records Ready" / "Mantén Registros Listos": permisos y cumplimiento.
- **3 guías** en `/resources`: lista de arranque (6 min), IRP vs IFTA (5 min) y auditoría DOT (7 min).

## 4. Oficinas e idiomas

- **3 oficinas:** Medley (FL), Jersey City (NJ) y Elizabeth (NJ), cada una con su página en `/locations/…`.
- **2 idiomas con rutas espejo:**
  - `/en/…` y `/es/…` con los mismos segmentos (`/es/services/truck-insurance`, `/es/packages`…).
  - El selector EN/ES está en la barra.
  - El contenido sale del mismo esquema de textos: el HTML lleva las claves (`cta_quote`, `trust_text`…) traducidas.

## 5. Formulario de cotización (`/contact`)

Se recorrió en solo lectura con datos de ejemplo. El navegador no dejó salir ningún pedido que no fuera GET, y en el paso 3 no se escribió nada.

- **Encabezado:** "Tell us what is holding you back." / "A short form to organize the next step. You can also call any of our offices directly."
- **Paso 1:** "What do you need to solve?" / "¿Qué necesitas resolver?". Las 6 líneas del catálogo como opciones.
- **Paso 2:** "Tell us about the operation." / "Cuéntanos sobre la operación."
  - Tipo de operación: New operation, Existing operation o Renewal / correction.
  - Estado base.
  - Número de unidades.
- **Paso 3:** "How can we reach you?" / "¿Cómo podemos contactarte?". Nombre, teléfono y email (opcional).
- **Modo vista previa.** El sitio dice "Preview mode: this form does not store or transmit information." y el botón final es "Test submission" / "Probar envío".
  - El film lo muestra tal cual.
  - No afirmar que el formulario envía solicitudes, crea contactos ni avisa a nadie.
- **Paquetes:** el enlace "Quote this plan" agrega `?package=…` a la URL, pero el formulario no muestra el plan elegido. El film solo dice que cada paquete enlaza a la cotización.

## 6. Qué no afirmar

- Años en el rubro, cantidad de clientes, tiempos de respuesta, ahorros ni porcentajes: el sitio no los publica con fuente.
- Integraciones (CRM, email): no se afirman sin verlas en el código servido.
- Los teléfonos de las oficinas son públicos, pero el film no los necesita: muestra ciudades.
