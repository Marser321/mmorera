# T33 · Piezas para «Del brief a la pieza» (M3)

Documento de desglose etapa por etapa para el componente interactivo de `/fabricas` (decisión **D11**).

- **Dueño:** Gemini
- **Fecha:** 1 de noviembre de 2026 (Rehecho según `ARRANQUE-6.md`)
- **Voz:** Español neutro con tuteo estricto, sin voseo (tanto en el documento como en el texto dentro de cada imagen).
- **Regla:** Sin datos de clientes, sin jerga interna («Freno 2…», «lector-de-audiencia.md», «Autolectura de Codex») y con activos WebP (< 250 KB por imagen, máx. 1080 px de ancho) en `web/public/portfolio/fabrica/<pieza>/`.
- **Diferenciación visual:** La etapa «Arte» se presenta visualmente distinta de la «Pieza final» (composición previa de layout o placa fotográfica sin texto).

---

## 1. Resumen de las 2 piezas elegidas (del 29/10 en adelante)

Se seleccionaron dos piezas reales de las tandas del 29/10, contrastadas lámina por lámina para garantizar total ausencia de voseo y cero datos de clientes:

1. **Pieza 1 · Definición de alcance web:** `del-pedido-a-la-pieza` (`contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/`)
   - **Idea central:** Pasar de una frase abierta («necesito una web») a saber con exactitud qué construir a partir de una acción concreta.
   - **Diferencial de arte:** Composición previa basada en la matriz oficial 4:5 con el monograma macro fragmentado sobre fondo negro mate `#0B0B0A`.

2. **Pieza 2 · Entrega y mantenimiento de piezas:** `cambiar-menu-archivo-editable` (`contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/`)
   - **Idea central:** Cuándo un cambio operativo requiere un archivo editable acordado y no solo una imagen fija exportada.
   - **Diferencial de arte:** Placa fotográfica original de taller sin texto, generada para la escena conceptual.

---

## 2. Desglose detallado pieza por pieza

---

### Pieza 1 · «De «necesito una web» a saber qué construir» (`del-pedido-a-la-pieza`)

- **Tipo:** Producto digital, alcance y desarrollo web.
- **Formato:** Carrusel de 3 láminas (4:5, 1080×1350 px).
- **Directorio de origen:** `contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/`
- **Directorio de activos públicos:** [`web/public/portfolio/fabrica/del-pedido-a-la-pieza/`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/del-pedido-a-la-pieza/)
- **Confirmación de privacidad y voz:** Sin datos de clientes. Rótulo explícito *«Ejemplo recreado · datos de ejemplo»*. Texto 100% en español neutro con tuteo («contigo», «podemos», «necesita», «empecemos»).

#### Etapa 1: Brief
- **Archivo de origen:** `contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/brief.md`
- **Enfoque para clientes:**
  - *Objetivo:* Pasar de una frase abierta («necesito una web») a una acción concreta que la persona pueda hacer al llegar.
  - *Situación inicial:* El cliente siente que necesita una web, pero todavía falta definir qué interacción o consulta busca resolver.
  - *Propuesta de solución:* Acordar primero la acción principal del usuario antes de diseñar pantallas, formularios o integraciones.
  - *Primer entregable:* Definir qué necesita contar la persona, qué recibe de inmediato y quién continúa la consulta.
- **Quién lo hizo:** **Persona** (Mario Morera formuló el insight y la estructura inicial del alcance).
- **Imagen representativa:** [`01-brief.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/del-pedido-a-la-pieza/01-brief.webp) (60.7 KB).

#### Etapa 2: Guion y Copy
- **Archivo de origen:** `contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/copy.md` y `diseno.html`.
- **Contenido exacto:**
  - *01 Gancho:* «De «necesito una web» a saber qué construir. La conversación se vuelve un pedido que podemos revisar.»
  - *02 Giro:* «Todavía falta una frase: «Quiero que una persona pueda contarnos qué necesita sin tener que llamarnos.»»
  - *03 Caso didáctico:* «Ejemplo recreado de cómo acotar un pedido sin inventar complejidad innecesaria.»
  - *04 Cierre & Oferta:* «Qué necesita contar. Qué recibe después. Quién continúa la consulta. Diseño y desarrollo esa parte contigo.»
- **Quién lo hizo:** **IA asistida** (Redacción estructurada en 3 láminas directas con tuteo).
- **Imagen representativa:** [`02-guion.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/del-pedido-a-la-pieza/02-guion.webp) (59.8 KB).

#### Etapa 3: Arte y Diseño (Distinta de la pieza final)
- **Archivo de origen:** `contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/diseno.html` y `contenido/tandas/2026-10-29-serie-fundacional/macro.svg`.
- **Diferenciación visual:**
  - Se muestra la **composición previa** con la geometría del monograma macro escalado sobre el lienzo negro mate `#0B0B0A`.
  - Guías visuales de maquetación: delimitación de zona de serie, zona de titular editorial en proporción 4:5 y márgenes de resguardo antes de aplicar la tipografía final.
- **Quién lo hizo:** **Código y Sistema** (Plantilla geométrica en HTML/CSS estructurada sobre `kit.css`).
- **Imagen representativa:** [`03-arte-diseno.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/del-pedido-a-la-pieza/03-arte-diseno.webp) (23.3 KB).

#### Etapa 4: Revisión Humana
- **Archivo de origen:** `contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/brief.md`.
- **Enfoque para clientes (sin códigos ni puntajes internos):**
  - *Revisión de Mario:* Mario revisó la redacción para asegurar que la propuesta fuera directa y no asumiera herramientas antes de tiempo.
  - *Filtro de claridad:* Se eliminaron términos técnicos abstractos para que cualquier cliente entienda el valor del primer paso.
  - *Transparencia comercial:* Se incluyó el rótulo obligatorio *«Ejemplo recreado · datos de ejemplo»* para no presentarlo como un caso de cliente real.
  - *Aprobación final:* Mario aprobó la versión definitiva en español neutro con tuteo antes de pasar a maquetación y render.
- **Quién lo hizo:** **Persona** (Mario Morera: control de veracidad y filtro editorial).
- **Imagen representativa:** [`04-revision-humana.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/del-pedido-a-la-pieza/04-revision-humana.webp) (64.0 KB).

#### Etapa 5: Pieza Final
- **Archivo de origen:** `contenido/piezas/2026-10-29-fundacion-06-del-pedido-a-la-pieza/salida/lamina-01.png`.
- **Contenido visible:** Portada editorial oficial de alta definición, tipografía Helvetica Now Display / Neue sobre fondo oscuro, con monograma, folio y paginado (`01/03`).
- **Quién lo hizo:** **Sistema** (Renderizado headless automatizado).
- **Imagen representativa:** [`05-pieza-final.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/del-pedido-a-la-pieza/05-pieza-final.webp) (37.6 KB).

---

### Pieza 2 · «Solo cambió un precio. El menú es una foto.» (`cambiar-menu-archivo-editable`)

- **Tipo:** Operaciones, mantenimiento de contenido y criterio de entrega.
- **Formato:** Carrusel de 3 láminas (4:5, 1080×1350 px).
- **Directorio de origen:** `contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/`
- **Directorio de activos públicos:** [`web/public/portfolio/fabrica/cambiar-menu-archivo-editable/`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/cambiar-menu-archivo-editable/)
- **Confirmación de privacidad y voz:** Sin datos de clientes. Rótulo explícito *«Ejemplo recreado · datos de ejemplo / Imagen generada · escena conceptual»*. Texto 100% en español neutro con tuteo («podrás», «acordemos», «necesitas», «hará», «contigo»).

#### Etapa 1: Brief
- **Archivo de origen:** `contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/brief.md`
- **Enfoque para clientes:**
  - *Objetivo:* Aclarar cómo se actualiza una pieza antes de entregar solo una imagen estática sin editable.
  - *Situación inicial:* El cliente necesita actualizar un precio de su carta, pero solo dispone de la foto exportada.
  - *Propuesta de solución:* Pensar en el próximo cambio desde el inicio: acordar qué archivo editable se entrega y quién lo mantiene.
  - *Primer entregable:* Diseñar la entrega técnica con los archivos fuente y el procedimiento de actualización claro.
- **Quién lo hizo:** **Persona** (Mario Morera planteó la escena operativa de mantenimiento).
- **Imagen representativa:** [`01-brief.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/cambiar-menu-archivo-editable/01-brief.webp) (58.3 KB).

#### Etapa 2: Guion y Copy
- **Archivo de origen:** `contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/copy.md` y `diseno.html`.
- **Contenido exacto:**
  - *01 Gancho:* «Solo cambió un precio. El menú es una foto. Antes de prometer que podrás actualizarlo, acordemos qué archivo necesitas.»
  - *02 Giro:* «La imagen final no dice con qué se edita. Entrega: imagen del menú. Pendiente: archivo para editar y quién lo actualiza.»
  - *03 Caso didáctico:* «Escena conceptual sobre la diferencia entre recibir un entregable visual y tener control de su mantenimiento.»
  - *04 Cierre & Oferta:* «Diseñamos la entrega pensando en el próximo cambio. Lo trabajo directamente contigo.»
- **Quién lo hizo:** **IA asistida** (Estructura de guion directo en tuteo).
- **Imagen representativa:** [`02-guion.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/cambiar-menu-archivo-editable/02-guion.webp) (62.2 KB).

#### Etapa 3: Arte y Diseño (Distinta de la pieza final)
- **Archivo de origen:** `contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/imagenes/portada.png`.
- **Diferenciación visual:**
  - Placa fotográfica original generada por IA sin texto alguno: retrato sobrio de taller con Mario trabajando frente a dos monitores y mesa de trabajo oscura.
  - Representa el activo visual puro antes de cualquier sobreimpresión gráfica o tipográfica.
- **Quién lo hizo:** **IA visual** (Generación de placa fotográfica limpia sin texto).
- **Imagen representativa:** [`03-arte-diseno.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/cambiar-menu-archivo-editable/03-arte-diseno.webp) (50.7 KB).

#### Etapa 4: Revisión Humana
- **Archivo de origen:** `contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/brief.md`.
- **Enfoque para clientes (sin códigos ni puntajes internos):**
  - *Revisión de Mario:* Mario revisó la escena para reflejar un problema cotidiano de gestión y mantenimiento de contenido.
  - *Filtro de claridad:* Se descartaron soluciones mágicas de automatización para enfocarse en la entrega del formato correcto.
  - *Transparencia comercial:* Se rotuló expresamente como *«Ejemplo recreado · datos de ejemplo»* e *«Imagen generada · escena conceptual»*.
  - *Aprobación final:* Mario validó los textos finales en español neutro con tuteo antes de su exportación y renderizado.
- **Quién lo hizo:** **Persona** (Mario Morera: verificación de promesa y tono de servicio).
- **Imagen representativa:** [`04-revision-humana.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/cambiar-menu-archivo-editable/04-revision-humana.webp) (62.2 KB).

#### Etapa 5: Pieza Final
- **Archivo de origen:** `contenido/piezas/2026-10-29-loop-06-49-cambiar-menu-archivo-editable/salida/lamina-01.png`.
- **Contenido visible:** Lámina compuesta terminada: titular contrastado, bajada con acento verde de señal, encuadre de la foto con pie explicativo, rótulo de escena conceptual y folio (`01/03`).
- **Quién lo hizo:** **Sistema** (Renderizado y ensamblado final).
- **Imagen representativa:** [`05-pieza-final.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/cambiar-menu-archivo-editable/05-pieza-final.webp) (156.8 KB).

---

## 3. Estado de activos y limpieza

1. **Carpetas anteriores borradas:** Se eliminaron íntegramente las carpetas anteriores en `web/public/portfolio/fabrica/`:
   - `tres-ias-y-yo/` (eliminada).
   - `agencias-landing-entrega/` (eliminada).
   - `hablas-conmigo/` (eliminada).

2. **Nuevos activos verificados:**
   - `del-pedido-a-la-pieza/`: 5 archivos `.webp` (entre 19 KB y 64 KB).
   - `cambiar-menu-archivo-editable/`: 5 archivos `.webp` (entre 50 KB y 157 KB).
   - Todos cumplen estrictamente con formato WebP, ancho máx. 1080 px y límite inferior a 250 KB por imagen.

---

## 4. Guía de integración para Claude y Codex

- **Estructura para `briefToPiece.ts` (Claude):**
  Claude puede cargar ambas piezas o priorizar `del-pedido-a-la-pieza` como la pieza insignia de M3 (con `cambiar-menu-archivo-editable` como variante de operaciones/mantenimiento).
- **Componente `BriefToPiece.tsx` (Codex):**
  - Implementar navegación de 5 pasos (`brief` → `guion` → `arte` → `revision` → `final`).
  - Etiquetas de rol accesibles: *«Propuesta humana»*, *«Redacción asistida»*, *«Composición de arte»*, *«Revisión y filtro de Mario»*, *«Pieza terminada»*.
  - Las imágenes cargan de forma diferida (`loading="lazy"`).
