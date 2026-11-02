# Arranque de Codex · sesión 6 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

T40, T06 y T08 están integradas en `triada/web`. Al integrar:
- en T08, cambié los fixtures por los datos reales (`BRIEF_TO_PIECE` y `VIDEO_GALLERY`) y unifiqué los tipos en `src/types/briefToPiece.ts`. Me quedé con tus nombres y agregué `VideoGalleryEntry` para los datos;
- `VideoGallery` admite un `note` por pieza, que muestra el rótulo honesto («Spec ficticio», «Muestra de edición») en lugar del «Demo» global;
- enlacé `/fabricas` desde el menú y desde el home;
- en el e2e del menú, el assert pasó a `/cv`.

Siguen 3 tarjetas, desde la punta de `triada/web`, cada una en su worktree. **No sincronices el tablero en mi worktree.**

## 1. T07 + T32 · Página `/agentes` con la demo guiada

**Ya están:**
- `SERVICE_PAGES.agentes` en `src/data/servicePages.ts`;
- `pageMetadata("agentes", …)`;
- el guion de la demo en `src/data/agentDemoScript.ts`, con su tipo en `src/types/agentDemo.ts`.

**Hay que hacer:**
- **Rutas:** `src/app/agentes/page.tsx` y `src/app/en/agentes/page.tsx`, con `ServicePage` y el slot de la demo. Sumarlas al sitemap. La ruta en inglés es `/en/agentes`, la misma convención de `localePath` que el resto.
- **Componente de la demo:** `premium/agentes/AgentDemo.tsx`. Reutiliza la interfaz de chat de `systems/OmnichannelInboxSimulator.tsx`, sin montos ni intención.
  - Muestra el saludo y las opciones como botones.
  - Al elegir una opción, aparece la pregunta como mensaje del visitante y después las respuestas del agente, en orden.
  - Si la opción tiene `handoff`, la demo termina con `handoffNotice` como mensaje del sistema, bien visible, y ofrece «Volver a empezar» / «Start over».
  - El `disclaimer` va siempre visible, arriba.
  - **Accesibilidad:** los mensajes nuevos se anuncian con `aria-live="polite"`, los botones se usan con teclado y, con movimiento reducido, no hay animación de escritura (cada mensaje aparece entero).
  - **Sin red:** el componente no hace ninguna llamada; todo sale del guion.
- **Enlaces:** el menú «Servicios ▾ → Agentes de IA» y el «Ver cómo funciona →» de ese servicio en el home (`ServicesSection`, `servicePath`) pasan a `/agentes`. Al tener página, ese servicio deja de mostrar sus entregables en el home, igual que los otros tres.
- **Listo cuando:** `/agentes` y `/en/agentes` se ven a 390 y 1440 px; la demo recorre las 5 opciones (2 terminan en traspaso a una persona) con teclado y lector de pantalla; con movimiento reducido no hay animación; y no hay solicitudes de red al usar la demo.

## 2. T14 · Filtro por servicio en `/casos-de-exito`

- Arriba del archivo, un filtro de 5 opciones: «Todos · Webs y landings · Agentes de IA · Automatización y CRM · Contenido con IA» (en EN: «All · Websites & landing pages · AI agents · Automation & CRM · AI content»).
- La pertenencia de cada caso sale de su `stack` y de sus capacidades. Si no se puede deducir bien, crea un campo opcional `services?: ServiceId[]` en `ProjectCase`, y yo lo cargo caso por caso: anótalo en la entrega.
- La URL guarda el filtro (`?servicio=agentes`), el filtro se maneja con teclado y, si no hay resultados, se dice en un texto (no se deja un vacío).
- **Listo cuando:** filtrar y compartir la URL funciona en ES y EN, a 390 px y en escritorio.

## 3. T11 · Lab de demos de motion

- **`/lab`** (y `/en/lab`): 3 o 4 demos enlazables, cada una con su URL (`/lab/<demo>`). Una de ellas es el estudio de *design tokens* que salió de `/estudio`, **sin cifras** («99 PageSpeed», «28ms» y similares) y con la marca «pared».
- Las otras, elígelas entre los efectos del sitio que comunican algo: el escenario fijo de servicios, el glifo de partículas al enfocar y los films con capítulos. Anota cuáles y por qué.
- Cada demo funciona con movimiento reducido (versión quieta) y se enlaza desde `/estudio` («Ver el Lab»). Los textos que falten van como `TODO(Claude)`.
- **Listo cuando:** cada demo tiene su URL, se ve en ES y EN y respeta el movimiento reducido.

## Al terminar cada tarjeta

- Desde `web/`: `npm run lint` (0 avisos), `npm test`, `npm run build` y la suite e2e completa contra `next start`.
- Commit en `triada/codex/<ID>`, nota en `web/docs/triada/entregas/<ID>.md` y estado `para revisar` en el tablero (solo el de tus tarjetas).
