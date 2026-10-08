# Dossier · Rangel Oviedo Group

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://rangeloviedo-tor8.vercel.app/`.
> - Lectura del HTML servido, de su CSS y de sus componentes interactivos.
> - El sitio opera en modo bilingüe en el cliente con selector interactivo EN/ES.
> - Recorrido en solo lectura estricta: sin envío de formularios ni captura de datos personales.
>
> **Cliente:** Rangel Oviedo Group: asesoría inmobiliaria de lujo, inversión residencial y relocation estratégico en Texas (Houston y The Woodlands). Proyecto desarrollado en marca blanca para AD Media Solution.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (CSS compilado `_next/static/css/*.css` y variables de `:root`):
  - Fondo tinta oscura: `#0B0A08` (`--ro-ink`).
  - Superficie oscura: `#1A1612` (`--ro-surface`).
  - Capa elevada: `#2D2421` (`--ro-raised`).
  - Línea y borde: `#2D2421` (`--ro-line`).
  - Texto principal marfil/papel: `#F5F1E8` (`--ro-paper`).
  - Texto secundario y muted: `#A8A29E` (`--ro-muted`).
  - Acento cobre/oro principal: `#C9A864` (`--ro-accent` / `text-ro-accent`).
  - Acento cobre suave: `#D4B16F` (`--ro-accent-soft`).
  - Acento cobre profundo / terracota: `#9A3412` (`--ro-accent-deep`).
  - Contraste sobre acento: `#0B0A08`.
- **Tipografía:**
  - Display: `Playfair Display` (`font-display`, serif refinada para titulares de lujo).
  - Body: `Inter` (`font-sans`, lectura nítida para descripción técnica y método).
- **Logo:**
  - `mark.png`: isotipo monograma ROG extraído con fondo transparente (canal alfa tipo 6, 600×600 px).
  - `wordmark.png`: texto tipográfico "RANGEL OVIEDO GROUP" recortado con fondo transparente (363×59 px).

---

## 2. Lo que dice el sitio

- **Hero:**
  - Titular en español: "Bienes Raíces de Lujo en Texas" / "Invierte, compra o múdate a Texas — con un asesor que habla tu idioma."
  - Titular en inglés: "Invest, buy, or move to Texas — with an advisor who speaks your language."
  - Eyebrow: "Asesoría inmobiliaria bilingüe · Texas".
- **Franja de métricas del hero:**
  - 86 propiedades vendidas.
  - 55 propiedades rentadas.
  - 45 reseñas Google.
- **El Método Rangel (5 pasos estructurados):**
  1. Diagnóstico de decisión: capital, familia, movilidad y timing definen la ruta antes de abrir un listado.
  2. Lectura de mercado: filtramos Texas por riesgo, escasez, contexto fiscal, estilo de vida y reventa.
  3. Selección privada: acceso a oportunidades fuera de mercado y catálogo curado.
  4. Negociación de oficio: protección de valor y estrategia contractual en cierres residenciales.
  5. Continuidad: acompañamiento patrimonial post-cierre y administración patrimonial.
- **Diagnóstico por perfil (4 perfiles de cliente):**
  1. Inversor internacional: diversificación patrimonial en activos tangibles en Texas.
  2. Compra familiar: comunidades de primer nivel escolar y residencial en The Woodlands y Houston.
  3. Vendedor premium: posicionamiento estratégico de propiedades residenciales.
  4. Relocation a Texas: acompañamiento integral en la relocalización residencial y fiscal.
- **El Equipo Consultor (4 pilares especializados):**
  1. Concierge & Relocation.
  2. Acceso Off-Market.
  3. Viabilidad & underwriting.
  4. Escrow & legal bilingüe.

---

## 3. Cifras verificadas (Facts)

1. **86** propiedades vendidas: franja de datos de la Home ("86 propiedades vendidas").
2. **55** propiedades rentadas: franja de datos de la Home ("55 rentadas").
3. **45** reseñas en Google: franja de datos de la Home ("45 reseñas Google").
4. **5** pasos en El Método Rangel: sección `#metodo` con 5 tarjetas (Diagnóstico, Lectura de mercado, Selección privada, Negociación de oficio, Continuidad).
5. **4** perfiles en el diagnóstico guiado: sección `#perfiles` con 4 perfiles (Inversor internacional, Compra familiar, Vendedor premium, Relocation a Texas).
6. **4** pilares del equipo consultor: sección "El Equipo Consultor" con 4 pilares de especialidad.

---

## 4. Estado técnico y de integración

- **Bilingüe:** selector EN/ES montado en cliente que conmuta todos los textos de forma instantánea sin recarga ni rutas secundarias.
- **Scrollytelling:** clips de fondo en video `/rog/scrolly_1_facade.mp4`, `scrolly_3_livingroom.mp4`, `scrolly_4_kitchen.mp4` y `scrolly_5_terrace.mp4`.
- **Integraciones preparadas sin conectar:**
  - Widgets MLS de HAR: variables de entorno `NEXT_PUBLIC_HAR_*` preparadas en código.
  - WhatsApp: botón con variable de enlace vacía.
  - Agenda: enlaces llevan a ancla `#contacto` informativa sin backend ni formulario activo.
- **Datos de muestra:** las propiedades destacadas en catálogo utilizan identificador `sample-` y número MLS `00000000`.

---

## 5. Arquitectura

- `architecture.bundle: null`.
- **Motivo:** Sitio informativo bilingüe enfocado en presentación residencial, scrollytelling visual y llamada a contacto directo; no cuenta con backend, base de datos ni integraciones transaccionales verificables que diagramar.

---

## 6. Reporte de verificación

1. **Salida del checker:** pendiente de ejecución en bucle (`npx tsx scripts/check-case-kit.ts rangel-oviedo-group`).
2. **Verificado en vivo:**
   - Paleta exacta compilada en CSS servido con acento cobre `#C9A864`.
   - Tipografía Playfair Display + Inter.
   - 6 capturas reales con highlights medidos.
   - 6 cifras cuantitativas verificadas textualmente en la Home.
   - Clips de video de arquitectura y residencias descargados y recodificados a estándares Remotion (H.264 + AV1/WebM <= 3 MB).
3. **Diferencias con `projectCases.ts`:**
   - El caso en el portfolio tenía acento violeta heredado; el acento real del sitio publicado es cobre refinado (`#C9A864` / `#D4B16F`).
   - "CRM" debe removerse del stack porque no hay CRM conectado en producción.
4. **Protagonista:** `goal-paths`, mostrando los 4 perfiles de clientes ingresando al método de 5 etapas estructuradas para representar la propuesta de valor consultiva.
