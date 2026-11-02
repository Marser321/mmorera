# T09 · Galería «Video y contenido con IA»

Documento de inventario y selección de piezas para la galería vertical de `/fabricas` (decisión **D11**).

- **Dueño:** Gemini
- **Fecha:** 1 de noviembre de 2026
- **Voz:** Español neutro con tuteo, sin voseo.
- **Regla:** Sin datos de clientes, sin copiar archivos MP4 pesados a `public/`. Los pósters se alojan en `web/public/portfolio/video-ia/`.

---

## 1. Criterio de selección

Se seleccionaron **8 piezas verticales y cortas** (relación 9:16, 1080×1920 px), con una duración de entre 8 y 24 segundos. 
Las piezas cubren los dos grandes motores de producción del estudio:
1. **Sistema de contenido propio:** Piezas didácticas y metodológicas producidas con texto de Claude, placas sin texto de ChatGPT y composición/render headless por código.
2. **Cinemáticas con código (Remotion):** Pieza de concepto comercial animada íntegramente mediante código React/Remotion y generación de imagen base por IA.

Todas las piezas fueron verificadas contra la exposición de datos de clientes: **0% de datos privados, 0 marcas comerciales reales ajenas, 0 métricas engañosas**.

---

## 2. Inventario de piezas seleccionadas

| # | Slug / Título | Origen del archivo | Duración | Peso original | Herramientas declaradas | Póster en `public/portfolio/video-ia/` | Estado de cliente |
|---|---|---|---|---|---|---|---|
| 01 | **encuesta-automatizar**<br>«¿Qué tarea repetís más a mano?» | `contenido/piezas/2026-10-16-encuesta-automatizar/salida/reel.mp4` | 15.8 s | 3.73 MB *(< 4 MB)* | Sistema de contenido MMORERA · Texto de Claude · Render headless HTML | `encuesta-automatizar-poster.webp`<br>`encuesta-automatizar-poster.jpg` | Verificado limpio (encuesta comunitaria) |
| 02 | **tres-preguntas-landing**<br>«Landing: primero, qué necesita saber la persona» | `contenido/piezas/2026-10-17-tres-preguntas-landing/salida/reel.mp4` | 19.6 s | 5.23 MB *(> 4 MB)* | Sistema de contenido MMORERA · Guion de Claude · Render headless HTML | `tres-preguntas-landing-poster.webp`<br>`tres-preguntas-landing-poster.jpg` | Verificado limpio (criterio metodológico) |
| 03 | **deja-de-pedir-una-web**<br>«La web quedó publicada. ¿Quién la cuida después?» | `contenido/piezas/2026-10-19-deja-de-pedir-una-web/salida/reel.mp4` | 17.0 s | 4.19 MB *(> 4 MB)* | Sistema de contenido MMORERA · Placas de ChatGPT · Texto y revisiones de Claude | `deja-de-pedir-una-web-poster.webp`<br>`deja-de-pedir-una-web-poster.jpg` | Verificado limpio (escenario de mantenimiento) |
| 04 | **lead-23-45**<br>«Una consulta llega a las 23:45» | `contenido/piezas/2026-10-14-lead-23-45/salida/reel.mp4` | 22.4 s | 5.98 MB *(> 4 MB)* | Sistema de contenido MMORERA · Placa fotográfica de ChatGPT · Guion de Claude | `lead-23-45-poster.webp`<br>`lead-23-45-poster.jpg` | Verificado limpio (simulación con datos de ejemplo) |
| 05 | **agente-sin-tests**<br>«El mensaje salió. ¿Usó el dato correcto?» | `contenido/piezas/2026-10-12-agente-sin-tests/salida/reel.mp4` | 22.6 s | 6.09 MB *(> 4 MB)* | Sistema de contenido MMORERA · Placas de ChatGPT · Texto de Claude | `agente-sin-tests-poster.webp`<br>`agente-sin-tests-poster.jpg` | Verificado limpio (escenario técnico ilustrativo) |
| 06 | **films-con-codigo**<br>«Captura, recorrido o diagrama: ¿qué querés explicar?» | `contenido/piezas/2026-10-22-films-con-codigo/salida/reel.mp4` | 23.1 s | 5.73 MB *(> 4 MB)* | Sistema de contenido MMORERA · Placas de ChatGPT · Texto editorial de Claude | `films-con-codigo-poster.webp`<br>`films-con-codigo-poster.jpg` | Verificado limpio (criterio de formatos motion) |
| 07 | **formulario-medico**<br>«¿Este dato hace falta ahora?» | `contenido/piezas/2026-10-21-formulario-medico/salida/reel.mp4` | 21.4 s | 7.42 MB *(> 4 MB)* | Sistema de contenido MMORERA · Placas de ChatGPT · Copy de Claude | `formulario-medico-poster.webp`<br>`formulario-medico-poster.jpg` | Verificado limpio (caso didáctico de fricción) |
| 08 | **ai-pizza-spec**<br>«Luna Forno · Fictional AI Spec Ad» | `output/services/ai-pizza-spec-v1/ai-pizza-spec-ad-v1.mp4` | 8.0 s | 4.93 MB *(> 4 MB)* | Remotion (`AiPizzaConcept.tsx`) · OpenAI ImageGen · FFmpeg | `ai-pizza-spec-poster.webp`<br>`ai-pizza-spec-poster.jpg` | Verificado limpio (rotulado explícito: *Fictional spec ad · Not client work*) |

---

## 3. Detalle individual de cada pieza

### 01 · `encuesta-automatizar`
- **Archivo de origen:** `contenido/piezas/2026-10-16-encuesta-automatizar/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 15.8 segundos
- **Peso:** 3.73 MB (no requiere compresión inmediata, cumple el umbral < 4 MB)
- **Herramientas:** Sistema de contenido MMORERA; copy generado por Claude (revisión triple de claridad en `REVISION-LECTOR-*.md`); composición sobre `diseno/kit.css` y render automatizado.
- **Póster generado:** [`web/public/portfolio/video-ia/encuesta-automatizar-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/encuesta-automatizar-poster.webp) (41.2 KB) y `.jpg` (98.4 KB).
- **Verificación de clientes:** Sin datos de clientes. El texto plantea una consulta abierta sobre qué tarea manual quita más tiempo en un equipo.

### 02 · `tres-preguntas-landing`
- **Archivo de origen:** `contenido/piezas/2026-10-17-tres-preguntas-landing/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 19.6 segundos
- **Peso:** 5.23 MB (anotado para que Codex lo comprima por debajo de 3 MB)
- **Herramientas:** Claude Opus (copywriter con verificación en `REVISION-LECTOR-2026-10-12-CLARIDAD.md`); maquetación tipográfica de alto contraste; render headless.
- **Póster generado:** [`web/public/portfolio/video-ia/tres-preguntas-landing-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/tres-preguntas-landing-poster.webp) (37.5 KB) y `.jpg` (87.4 KB).
- **Verificación de clientes:** Declarado formalmente en `pieza.json` como capacidad metodológica sin cliente ni resultado atribuido.

### 03 · `deja-de-pedir-una-web`
- **Archivo de origen:** `contenido/piezas/2026-10-19-deja-de-pedir-una-web/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 17.0 segundos
- **Peso:** 4.19 MB (levemente superior a 4 MB; Codex puede optimizar la tasa de bits)
- **Herramientas:** ChatGPT (placas fotográficas de taller sin texto, especificadas en `chatgpt.md`); Claude (redacción de copy y control de tono en 3 rondas); render HTML a video.
- **Póster generado:** [`web/public/portfolio/video-ia/deja-de-pedir-una-web-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/deja-de-pedir-una-web-poster.webp) (24.1 KB) y `.jpg` (63.3 KB).
- **Verificación de clientes:** Sin referencias a clientes reales. Escenario hipotético sobre traspaso de responsabilidades técnicas.

### 04 · `lead-23-45`
- **Archivo de origen:** `contenido/piezas/2026-10-14-lead-23-45/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 22.4 segundos
- **Peso:** 5.98 MB (anotado para compresión de Codex)
- **Herramientas:** ChatGPT (still life oscuro sin texto); Claude (copywriting de flujo automatizado de atención nocturna); motor de renderizado de reels.
- **Póster generado:** [`web/public/portfolio/video-ia/lead-23-45-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/lead-23-45-poster.webp) (34.0 KB) y `.jpg` (82.7 KB).
- **Verificación de clientes:** Simulación didáctica identificada expresamente en `pieza.json` como escenario recreado con datos sintéticos.

### 05 · `agente-sin-tests`
- **Archivo de origen:** `contenido/piezas/2026-10-12-agente-sin-tests/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 22.6 segundos
- **Peso:** 6.09 MB (anotado para compresión de Codex)
- **Herramientas:** ChatGPT (placa still life); Claude (guion con advertencia de control de calidad en automatizaciones); render HTML sobre `kit.css`.
- **Póster generado:** [`web/public/portfolio/video-ia/agente-sin-tests-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/agente-sin-tests-poster.webp) (34.2 KB) y `.jpg` (85.1 KB).
- **Verificación de clientes:** Sin datos personales, números de contacto ni nombres de empresas cliente.

### 06 · `films-con-codigo`
- **Archivo de origen:** `contenido/piezas/2026-10-22-films-con-codigo/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 23.1 segundos
- **Peso:** 5.73 MB (anotado para compresión de Codex)
- **Herramientas:** ChatGPT (placas sin texto); Claude (guion técnico sobre cinemáticas con Remotion y código); render headless.
- **Póster generado:** [`web/public/portfolio/video-ia/films-con-codigo-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/films-con-codigo-poster.webp) (34.8 KB) y `.jpg` (85.1 KB).
- **Verificación de clientes:** Criterio didáctico sobre diseño de cinemáticas para interfaces web.

### 07 · `formulario-medico`
- **Archivo de origen:** `contenido/piezas/2026-10-21-formulario-medico/salida/reel.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 21.4 segundos
- **Peso:** 7.42 MB (anotado para compresión de Codex)
- **Herramientas:** ChatGPT (placa de still life); Claude (copy sobre reducción de fricción en formularios); render HTML a video.
- **Póster generado:** [`web/public/portfolio/video-ia/formulario-medico-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/formulario-medico-poster.webp) (41.7 KB) y `.jpg` (92.2 KB).
- **Verificación de clientes:** Sin nombres de clínicas reales ni pacientes. Escenario conceptual de simplificación de campos.

### 08 · `ai-pizza-spec`
- **Archivo de origen:** `output/services/ai-pizza-spec-v1/ai-pizza-spec-ad-v1.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical)
- **Duración:** 8.0 segundos
- **Peso:** 4.93 MB (anotado para compresión de Codex)
- **Herramientas:** Remotion (`output/services/website-showreel/src/AiPizzaConcept.tsx`); OpenAI ImageGen (imagen fotográfica de la pizza horneada); FFmpeg (renderizado y codificación H.264).
- **Póster generado:** [`web/public/portfolio/video-ia/ai-pizza-spec-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/ai-pizza-spec-poster.webp) (214.2 KB) y `.jpg` (326.8 KB).
- **Verificación de clientes:** Expresamente rotulado en pantalla: *«FICTIONAL SPEC AD · AI-GENERATED CONCEPT · NOT CLIENT WORK»*. Marca ficticia «Luna Forno» sin datos de clientes.

---

## 4. Notas para la implementación de Codex

1. **Compresión pendiente:** 7 de los 8 videos superan los 4 MB (entre 4.19 y 7.42 MB). Cuando Codex prepare la galería para producción, se sugiere comprimir los videos con H.264 / CRF 26 o AV1 para dejarlos en torno a 1.5–2.5 MB por pieza.
2. **Carga diferida:** Los pósters en `web/public/portfolio/video-ia/` pesan entre 24 KB y 41 KB (a excepción del visual complejo de pizza en 214 KB), lo cual permite una carga instantánea con `<video poster="..." preload="none">`.
3. **Respeto a movimiento reducido:** En dispositivos con `prefers-reduced-motion: reduce`, el componente de la galería debe mostrar los pósters estáticos y requerir un clic o interacción explícita para reproducir el video.
