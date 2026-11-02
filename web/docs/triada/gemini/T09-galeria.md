# T09 · Galería «Video y contenido con IA» · Versión rehecha

Documento de inventario y selección de piezas para la galería vertical de `/fabricas` (decisión **D11**).

- **Dueño:** Gemini
- **Fecha:** 1 de noviembre de 2026 (Rehecho según `ARRANQUE-6.md`)
- **Voz:** Español neutro con tuteo, sin voseo (auditoría cuadro por cuadro en cada video y póster).
- **Regla:** Sin datos de clientes, sin copiar archivos MP4 pesados a `public/`. Los pósters se alojan en `web/public/portfolio/video-ia/`.

---

## 1. Auditoría de voseo y descarte de reels

En cumplimiento estricto de las directivas de `ARRANQUE-6.md`, se auditaron los 7 reels de entre el 12 y el 25/10 previamente seleccionados. Se confirmó la presencia de voseo visible en pantalla (títulos, subtítulos y llamadas a la acción):

- `encuesta-automatizar`: *«¿Qué tarea repetís más a mano?»*, *«¿Cuál de estas seguís haciendo…?»*
- `tres-preguntas-landing`: *«Tenés abierta una plantilla…»*, *«definí qué necesita…»*, *«Si querés que pida…»*, *«qué ofrecés…»*, *«No necesitás llenar…»*
- `deja-de-pedir-una-web`: *«Imaginá esto…»*
- `lead-23-45`: *«Vos ya cerraste el día…»*, *«mientras dormís…»*
- `agente-sin-tests`: *«Imaginá que una reserva…»*, *«probá tres caminos…»*, *«revisá cuatro cosas…»*
- `films-con-codigo`: *«¿qué querés explicar?»*, *«Cuando mostrás un proyecto…»*
- `formulario-medico`: *«preguntá…»*, *«no lo pidas…»*, *«podés solicitarlo…»*

**Acción ejecutada:** Los 7 reels quedan descartados para la galería pública actual, y se eliminaron los 14 pósters asociados (`.webp` y `.jpg`) de `web/public/portfolio/video-ia/`.

---

## 2. Piezas verticales verificadas sin voseo (Inspección de 3 cuadros)

Se exploraron todas las piezas verticales disponibles en el repositorio (desde el 29/10 y en `output/`), revisando minuciosamente 3 cuadros clave (inicio, mitad y final) de cada una para verificar que no contengan voseo ni datos de clientes:

### Pieza 01 · `ai-pizza-spec` (Luna Forno)
- **Archivo de origen:** `output/services/ai-pizza-spec-v1/ai-pizza-spec-ad-v1.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical) · **Duración:** 8.0 s · **Peso:** 4.93 MB
- **Inspección de cuadros:**
  - *Cuadro 1 (1.0 s):* Logo y tipografía inglesa «Luna Forno · Wood-Fired Craft».
  - *Cuadro 2 (4.0 s):* Toma macro de pizza horneada con animación de vapor generada por IA.
  - *Cuadro 3 (7.0 s):* Rótulo legal transparente: *«FICTIONAL SPEC AD · AI-GENERATED CONCEPT · NOT CLIENT WORK»*.
- **Voz y datos:** 100% en inglés, 0% datos de clientes (marca ficticia declarada).
- **Póster en `public/portfolio/video-ia/`:** [`ai-pizza-spec-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/ai-pizza-spec-poster.webp) (219 KB) y `.jpg` (334 KB).

### Pieza 02 · `short-form-motion-v3` (Showcase de edición y ritmo)
- **Archivo de origen:** `output/services/gallery-v3/short-form-v3/short-form-motion-v3.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical) · **Duración:** 13.4 s · **Peso:** 5.18 MB
- **Inspección de cuadros:**
  - *Cuadro 1 (1.5 s):* «MMORERA / MOTION EDIT · 01 / THE OPENING: Make the first second count.» / Rótulo: *«Original edit / AI-generated source footage»*.
  - *Cuadro 2 (6.7 s):* «02 / THE CUT: Change the pace. Keep the focus.»
  - *Cuadro 3 (12.0 s):* «03 / THE FINISH: Clear type. Room to breathe.»
- **Voz y datos:** 100% en inglés técnico/cinemático, 0% datos de clientes, sin voseo.
- **Póster en `public/portfolio/video-ia/`:** [`short-form-motion-v3-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/short-form-motion-v3-poster.webp) (34.7 KB) y `.jpg` (86.2 KB).

### Pieza 03 · `vertical-edit-sample` (Muestra de ritmo y resguardo móvil)
- **Archivo de origen:** `output/services/gallery-v3/vertical-edit-sample-v2.mp4`
- **Dimensiones:** 1080 × 1920 (9:16 vertical) · **Duración:** 9.0 s · **Peso:** 1.99 MB *(< 2 MB)*
- **Inspección de cuadros:**
  - *Cuadro 1 (1.5 s):* Visual 3D de escritorio de desarrollo con subtítulo inferior: «A clear hook.» / Rótulo: *«ORIGINAL EDITING SAMPLE»*.
  - *Cuadro 2 (4.5 s):* «Readable captions.» sobre la zona de lectura segura.
  - *Cuadro 3 (7.5 s):* «Intentional pacing.» con llamada visual de ritmo.
- **Voz y datos:** 100% en inglés, 0% datos de clientes, sin voseo.
- **Póster en `public/portfolio/video-ia/`:** [`vertical-edit-sample-poster.webp`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/video-ia/vertical-edit-sample-poster.webp) (41.0 KB) y `.jpg` (89.1 KB).

---

## 3. Lista para Claude: reels para re-renderizar en tuteo

Al quedar 3 piezas verificadas (menos de las 6 requeridas para una cuadrícula completa), se detalla la propuesta exacta para volver a renderizar los reels más valiosos en **tuteo neutro**. Claude decide la prioridad y los renderiza con su motor:

| Prioridad | Slug original | Frase con voseo en pantalla | Cómo queda en tuteo (propuesta exacta) | Motivo de valor para `/fabricas` |
|---|---|---|---|---|
| **1** | `encuesta-automatizar` | «¿Qué tarea repetís más a mano?»<br>«¿Cuál de estas seguís haciendo más a mano?» | «¿Qué tarea **repites** más a mano?»<br>«¿Cuál de estas **sigues** haciendo más a mano?» | Muestra cómo la fábrica produce contenido interactivo de consulta directa. |
| **2** | `tres-preguntas-landing` | «Tenés abierta una plantilla… definí qué necesita… Si querés que pida… qué ofrecés… No necesitás llenar…» | «**Tienes** abierta una plantilla… **define** qué necesita… Si **quieres** que pida… qué **ofreces**… No **necesitas** llenar…» | Demuestra criterio metodológico de conversión y diseño web. |
| **3** | `films-con-codigo` | «¿qué querés explicar?»<br>«Cuando mostrás un proyecto…» | «¿Qué **quieres** explicar?»<br>«Cuando **muestras** un proyecto…» | Explica directamente el servicio de cinemáticas y motion con código. |
| **4** | `lead-23-45` | «Vos ya cerraste el día…»<br>«mientras dormís…» | «**Tú ya cerraste** el día…» (o «Tu jornada ya terminó»)<br>«mientras **duermes**…» | Conecta la fábrica de contenido con la automatización de atención nocturna. |
| **5** | `agente-sin-tests` | «Imaginá que una reserva…»<br>«probá tres caminos…»<br>«revisá cuatro cosas…» | «**Imagina** que una reserva…»<br>«**prueba** tres caminos…»<br>«**revisa** cuatro cosas…» | Refuerza la seriedad técnica y el control de calidad en agentes. |
| **6** | `deja-de-pedir-una-web` | «Imaginá esto: hay que cambiar…» | «**Imagina** esto: hay que cambiar…» | Introduce el mantenimiento responsable tras el lanzamiento web. |
| **7** | `formulario-medico` | «preguntá… no lo pidas… podés solicitarlo…» | «**pregunta**… no lo pidas… **puedes** solicitarlo…» | Ilustra la reducción de fricción en formularios y experiencia de usuario. |

*Recomendación:* Con volver a renderizar los 3 primeros (`encuesta-automatizar`, `tres-preguntas-landing` y `films-con-codigo`), la galería alcanza las 6 piezas óptimas requeridas (3 cinemáticas en inglés + 3 reels didácticos en tuteo).

---

## 4. Estado de los activos en `web/public/portfolio/video-ia/`

Se encuentran generados y listos para carga diferida:
- `ai-pizza-spec-poster.webp` (219.3 KB) y `.jpg` (334.6 KB)
- `short-form-motion-v3-poster.webp` (34.7 KB) y `.jpg` (86.2 KB)
- `vertical-edit-sample-poster.webp` (41.0 KB) y `.jpg` (89.1 KB)

Todos los pósters de los reels descartados fueron borrados de `public/`.
