# Arranque de Gemini · sesión 5 (1/11/2026)

Pegar en Antigravity, con la carpeta MMORERA abierta, **después** del prompt fijo `web/docs/triada/PROMPT-gemini.md`.

---

T38 quedó integrada: Mr. Studio, Truckers y Rangel ya muestran «Pruébalo tú» en sus páginas de caso. Tu crítica de la versión actual sirvió para compactar el tramo de servicios del home (T39), que pasó de 3.282 a unos 1.550 px.

Mario decidió que **`/fabricas` sale con su propio sistema de contenido como primera prueba** (D11), antes de tener las apps. Tus dos tarjetas preparan el material de esa página.

**Voz:** español neutro con tuteo, sin voseo.

## 1. T33 · Piezas para «Del brief a la pieza»

La página va a mostrar cómo una pieza pasa de un brief a la publicación: **brief → guion → arte → revisión humana → pieza final**. Usa material real de `contenido/piezas/*`.

- **Elige 2 o 3 piezas** que tengan las etapas completas: `brief.md`, `copy.md`, `diseno.html` o placas, y la pieza final renderizada o aprobada. Prefiere piezas distintas entre sí: un carrusel, una pieza de caso y una de opinión.
- **Para cada etapa,** indica:
  - el archivo de origen;
  - un extracto corto (el brief y el guion, resumidos en 2 o 3 líneas);
  - la imagen que la representa. Exporta capturas del `diseno.html` y de la pieza final a 1080 px de ancho como máximo, en `web/public/portfolio/fabrica/<pieza>/`.
- **Verifica que no haya datos de clientes:** nombres, teléfonos, emails, montos ni capturas de clientes. Si una pieza los tiene, descártala.
- **Marca qué parte hizo la IA y qué parte una persona,** según lo que diga cada archivo (por ejemplo, las placas sin texto de ChatGPT, el texto de Claude y la aprobación de Mario). No inventes etapas que no figuren.

**Salida:** `web/docs/triada/gemini/T33-piezas.md` (pieza por pieza y etapa por etapa), los assets en `web/public/portfolio/fabrica/` y la nota en `entregas/T33.md`.

## 2. T09 · Galería «Video y contenido con IA»

Elige de 6 a 9 piezas **verticales y cortas** ya producidas: reels del sistema de contenido o renders de Remotion de `contenido/` o de `output/`. Para cada una:
- el archivo de origen;
- la duración;
- la herramienta con la que se hizo (Remotion, ChatGPT para las placas, Claude para el texto), solo si figura en sus archivos;
- un póster (primer cuadro), en `web/public/portfolio/video-ia/`;
- la confirmación de que no hay datos de clientes.

Si un video pesa más de 4 MB, anótalo: Codex lo comprime después.

**Salida:** `web/docs/triada/gemini/T09-galeria.md`, los pósters y la nota en `entregas/T09.md`. **No copies los MP4 grandes** a `public/`: lista las rutas de origen.

## 3. Crítica en frío de `/sistemas` y `/estudio`

Las dos páginas pasaron a ser páginas de servicio: «Automatización y CRM» y «Webs y landings». Recórrelas en `http://localhost:3012`, a 1440 y 390 px, en ES y EN, sin leer los briefs. Marca:
- si en la primera pantalla queda claro qué se contrata y para quién;
- qué sobra o falta;
- si «Para quién no» filtra bien o espanta.

**Salida:** `web/docs/triada/gemini/critica-servicios.md`.

**Recordatorios:** no toques `web/src/`, no hagas commits en `main` y no inventes cifras ni etapas. En el tablero, cambia solo el estado de tus tarjetas.
