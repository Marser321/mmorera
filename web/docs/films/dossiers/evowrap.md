# Dossier · EvoWrap

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://evowrap.vercel.app/`.
> - Lectura del HTML servido, de su CSS compilado (`_next/static/chunks/*.css`) y paquetes JavaScript públicos.
> - Recorrido en solo lectura: el navegador bloqueó todo pedido que no fuera GET. El formulario de agendamiento se capturó vacío.
>
> **Cliente:** EvoWrap: estética automotriz de lujo, personalización vehicular, vinilos de cambio de color (wrapping), protección cerámica y film protector de pintura (PPF).
>
> **Fuente local y notas:** sin repositorio local disponible. Se verificó contra el sitio publicado en Vercel y notas de `Freelance-KB/projects/evowrap.md`.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (CSS servido en `:root` y clases compiladas de Tailwind):
  - Fondo ultra oscuro `#050505` (`--background` en `:root`).
  - Superficie oscura `#0A0A0A` (`bg-neutral-950`).
  - Superficie elevada `#171717` (`bg-neutral-900` en tarjetas y paneles).
  - Líneas y separadores `#262626` (`border-neutral-800`).
  - Texto principal `#FFFFFF` (`--foreground: #fff`); secundario `#A3A3A3` (`text-neutral-400`).
  - Acento ámbar dorado `#F59E0B` (`text-amber-500` / `bg-amber-500`).
  - Acento suave `#FBBF24` (`text-amber-400`) y profundo `#D97706` (`text-amber-600`).
  - Texto sobre acento `#050505`.
- **Tipografía:** Orbitron (`--font-orbitron`, títulos con estética automotriz y deportiva) y Geist (`--font-geist-sans`, cuerpo y datos técnicos).
- **Logo:** `/images/branding/logo-correct.png` (500×500 px, PNG con alfa).
  - Isotipo (`mark.png`): 600×600 px, PNG con canal alfa (tipo 6), monograma angular con las iniciales EW enmarcadas en corchetes hexagonales.
  - Wordmark (`wordmark.png`): 371×92 px, texto "EVOWRAP" flanqueado por barras horizontales superior e inferior.

---

## 2. Lo que muestra el sitio en vivo

- **Hero principal:** "Automotive Luxury · REINVENTA TU VEHÍCULO · Cotizar Proyecto · Ver Resultados" con Porsche en estudio oscuro de iluminación técnica.
- **Sección de transformación (`#transformation`):** comparador visual interactivo que contrasta 2 estados sobre un superdeportivo Ferrari: estado estándar antes del tratamiento y acabado final después del vinilado y sellado.
- **Catálogo de servicios (`/services`):** 4 líneas de especialidad automotriz:
  1. **Tratamiento Cerámico:** protección 9H, sellado de nanopartículas y repelencia extrema.
  2. **Paint Protection Film:** film de poliuretano autorregenerable contra impactos de gravilla y rayas.
  3. **Color Change Wrap:** vinilos fundidos de cambio integral de color en acabados brillo, satinado y mate.
  4. **Interior Boutique:** detailing interior, acondicionamiento de cuero y protección ultravioleta.
- **Visualizador 3D interactivo (`/visualizer`):** configurador tridimensional con modelo vehicular rotable y 8 acabados seleccionables de color y textura: Original, Matte Stealth, Nardo Grey, Satin White, Midnight Purple, Race Red, Miami Blue y EVO Gold.
- **Formulario de agendamiento (`/booking`):** solicitud de visita con 5 campos de captura para datos del vehículo y contacto.
- **Pilares de posicionamiento:** 4 pilares destacados en footer: Protection, Ceramic, Detailing, Evolution.

---

## 3. Catálogo y cifras verificadas

### 8 acabados en el visualizador 3D (`/visualizer`)
El configurador interactivo permite explorar 8 acabados vehiculares sobre el modelo:
- Original
- Matte Stealth
- Nardo Grey
- Satin White
- Midnight Purple
- Race Red
- Miami Blue
- EVO Gold

### 4 líneas de servicio especializadas (`/services`)
- Tratamiento Cerámico
- Paint Protection Film (PPF)
- Color Change Wrap
- Interior Boutique

### 5 campos en el formulario de visita (`/booking`)
- Tu Nombre
- Teléfono (WhatsApp)
- Marca
- Modelo
- Año

### 4 pilares de marca
Pilares de posicionamiento reflejados en el sitio: Protection, Ceramic, Detailing y Evolution.

### 2 estados en el comparador antes/después
Deslizador interactivo en la sección de transformación que compara dos estados del vehículo (Antes y Después).

### 4 rutas técnicas dedicadas
Páginas individuales dedicadas para cada servicio:
- `/services/ceramic-coating`
- `/services/ppf`
- `/services/detailing`
- `/services/wrapping`

---

## 4. Formulario de agendamiento (`/booking`)

- Formulario de contacto directo para agendar visita presencial.
- Recorrido en solo lectura: capturado con todos los campos vacíos.
- No almacena datos personales ni procesa pagos en línea.

---

## 5. Qué no afirmar

- No afirmar tiempos de entrega específicos, garantías numéricas ni promesas absolutas no publicadas.
- No afirmar que el configurador 3D es una pasarela de compra directa: es una herramienta de previsualización visual.
- No afirmar métricas de satisfacción o volumen de clientes no respaldadas con fuentes públicas.

---

## 6. Reporte de verificación

1. **Salida del checker:** ✔ `evowrap: 380 comprobaciones bien, 0 fallas, 2 avisos (fuentes Orbitron y Geist a sumar en brandFonts.ts al animar)`.
2. **Verificado en vivo:**
   - Visualizador 3D rotable con 8 presets de acabado automotriz.
   - Comparador interactivo de 2 estados antes y después sobre Ferrari.
   - Catálogo de 4 especialidades automotrices y 4 rutas técnicas dedicadas.
   - Formulario de visita con 5 campos de captura en solo lectura.
   - Marca y paleta extraída del CSS compilado servido en Vercel.
3. **Diferencias con `projectCases.ts`:**
   - `projectCases.ts` lo describe adecuadamente como una experiencia visual de personalización vehicular con acabados como navegación. Se confirma la existencia del configurador tridimensional en `/visualizer` y del comparador antes/después.
4. **Protagonista elegida:** `finish-selector`.
   - Modela la interacción central del visualizador 3D: la transición y aplicación en vivo de los diferentes acabados (cerámico, vinilo satinado, PPF mate) sobre la carrocería del vehículo.
