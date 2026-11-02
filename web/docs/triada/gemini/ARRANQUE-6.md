# Arranque de Gemini · sesión 6 (1/11/2026)

Pegar en Antigravity, con la carpeta MMORERA abierta, **después** del prompt fijo `web/docs/triada/PROMPT-gemini.md`.

---

Gracias por la crítica de las páginas de servicio: ya apliqué lo que correspondía.
- **Duplicado de New Brothers en `/sistemas`:** en la prueba, New Brothers pasa a AD Media.
- **«Para quién no» de `/estudio`:** queda «Si tu web ya te trae consultas y solo quieres cambiar algunos textos, no hace falta rehacerla.»
- **El «Demo» pegado al texto:** quedó con su espacio, y el botón ahora dice «Entra al CRM».
- **No se aplica:** los plazos («1 a 2 semanas») y lo de los costos de Vercel, porque son promesas sin fuente. Mario decidió no prometer plazos (D15).

**T33 y T09 vuelven, por la voz.** Las piezas que elegiste son anteriores al 29/10, cuando el contenido todavía se escribía con voseo. Ese voseo está **dentro de las imágenes y los videos**: «Me contás el pedido», «Deslizá», «Hablás conmigo», «¿Qué tarea repetís más a mano?», «¿qué querés explicar?». La web usa español neutro con tuteo, así que no pueden ir.

**Voz:** español neutro con tuteo, sin voseo, también en lo que se ve dentro de cada imagen y video.

## 1. T33 (rehacer) · Piezas para «Del brief a la pieza»

- **Elige solo entre las tandas del 29/10 en adelante:** `contenido/piezas/2026-10-29-fundacion-*` y `2026-10-29-loop-*`. Hay una que encaja justo: **`2026-10-29-fundacion-06-del-pedido-a-la-pieza`**. Una pieza alcanza; dos, si son bien distintas.
- **Lee cada lámina final, una por una,** y confirma que no tenga voseo: ni «Deslizá», ni «querés», ni «contás», ni «vos». Si una lámina lo tiene, descarta la pieza.
- **La etapa «Arte» tiene que verse distinta de la «Pieza final».** Usa la placa sin texto (la de `imagenes/`) o la composición previa, no la misma lámina terminada.
- **Las tarjetas de brief, guion y revisión son para clientes:**
  - nada de puntajes internos («Freno 2 · Curiosidad 2…»);
  - nada de nombres de archivos internos («lector-de-audiencia.md»);
  - nada de «Autolectura de Codex».

  La revisión humana se cuenta con palabras simples, por ejemplo: «Mario revisó el texto, sacó una promesa que no se podía probar y aprobó la versión final». Si no hay fuente para un hecho, no lo escribas.
- **Formato:** exporta en WebP, 1080 px de ancho como máximo y unos 250 KB por imagen como tope, en `web/public/portfolio/fabrica/<pieza>/`. **Borra** las carpetas de las 3 piezas anteriores.

**Salida:** actualiza `T33-piezas.md` y `entregas/T33.md`.

## 2. T09 (rehacer) · Galería de video

- **Lo que sirve:** el spec de Luna Forno (`ai-pizza-spec`). Está en inglés y rotulado como trabajo no hecho para un cliente.
- **Lo que no sirve:** los 7 reels del 12 al 25/10, por el voseo en pantalla.
- **Busca otras piezas verticales sin voseo,** del 29/10 en adelante o de `output/`. Para cada una, mira 3 cuadros (inicio, mitad y final) y confirma que no haya voseo ni datos de clientes.
- **Si quedan menos de 6,** lista qué reels viejos convendría volver a renderizar en tuteo: slug, la frase con voseo y cómo quedaría en tuteo. Claude decide y los renderiza.

**Salida:** actualiza `T09-galeria.md` y `entregas/T09.md`. Borra los pósters de los reels descartados.

## 3. T34, cuando Mario te pase las respuestas

Igual que antes.

**Recordatorios:** no toques `web/src/`, no hagas commits en `main` y no inventes cifras ni etapas. En el tablero, cambia solo el estado de tus tarjetas.
