# Arranque de Codex · sesión 3 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

Muy buen trabajo con T22, T24, T13 y T25: ya están integradas en `triada/web`. Al integrarlas:
- cerré el contrato del `stack` bilingüe con tu diff (tipos, film, JSON-LD y datos);
- el lint quedó en 0 avisos;
- la altura de T22 está bien. El umbral de 12.000 px fue una estimación mía; el criterio real se mide después de T21.

Ahora siguen las tarjetas que usan los textos de **`web/docs/triada/briefs/T20-recorrido.md`**. Copia los textos tal cual.

**Orden y ramas:**
- T21, T23, T04 y T30 tocan `HomeExperience.tsx`. Para no generar choques, **encadénalas**: T21 sale de `triada/web` y cada una de las siguientes sale de la rama de la anterior.
  ```bash
  git worktree add ../mmorera-T21 -b triada/codex/T21 triada/web
  git worktree add ../mmorera-T23 -b triada/codex/T23 triada/codex/T21
  ```
  Y así con T04 y T30.
- T29 toca otros archivos y sale de `triada/web` cuando quieras.
- Yo integro en el mismo orden.

**Reglas de siempre:** `src/data/**` y `src/config/site.ts` son míos. Si necesitas un cambio ahí, anótalo en la entrega. Lo que no esté en el brief va como `TODO(Claude)`.

## 1. T21 · Tramo «Cómo trabajo» (brief §4)

- **Fusiona `#perfil` y `#metodo` en un tramo nuevo** (`src/components/premium/home/HowIWorkSection.tsx`), con `id="perfil"` para que no se rompan los enlaces existentes:
  - eyebrow, título y cuerpo;
  - los 3 pasos;
  - el `proofLink` va oculto hasta que exista el caso de T10.
- **Los textos van en un objeto `copy` del componente,** como en `HomeExperience`. `WORKFLOW_STAGES` queda sin uso: anótalo en la entrega y yo lo borro.
- **La entrada del monograma (`LogoOvertureSection`)** dura una pantalla como máximo, o se reemplaza por el monograma quieto (`MonogramaFundido`) a un costado del texto. Elige lo que mejor se lea y explícalo.
- **Sin foto por ahora:** D13 está pendiente.
- **`HomeExperience.tsx`:** deja de montar `AuthorManifestoScene` y `WorkflowSection`. No los borres; si quedan sin importar, anótalo.
- **Listo cuando:**
  - el tramo mide 1.800 px o menos a 1440 px;
  - el home mide **9.000 px o menos a 1440 px** (hoy 12.901);
  - con movimiento reducido, el monograma está quieto;
  - ES y EN a 390 px, sin desborde.

## 2. T23 · Caminos claros: héroe, servicios, menú y pie (brief §1, §2, §6 y §7)

- **Héroe (`HomeExperience.tsx`, `copy`):**
  - la `intro` nueva;
  - el enlace de texto `cvLink` bajo los botones. Lleva a `#contacto` mientras no exista `/cv`: déjalo en una constante fácil de cambiar.
- **`ServicesSection.tsx`:**
  - el `title` y la `intro`;
  - en cada servicio, «Ver cómo funciona →» solo donde hay página (Webs → `/estudio`, Automatización y CRM → `/sistemas`). En Agentes y Contenido no se muestra hasta que existan sus páginas;
  - los 4 «Hablemos de esto» se reemplazan por **un solo CTA** al final del tramo, «Hablemos de tu caso», que lleva a `#contacto`.
- **`navbar.tsx` (D10):**
  - el menú pasa a «Servicios ▾ · Casos · Sobre mí · CV · Hablemos»;
  - «Servicios» abre un menú con 4 entradas y los destinos del brief §6;
  - se maneja con teclado (Enter, Esc y flechas) y con `aria-expanded`;
  - en el teléfono, las 4 entradas van dentro del menú móvil.
- **`footer.tsx`:** la frase nueva y los enlaces del brief §7.
- **Listo cuando:** el menú pasa una revisión de teclado y lector de pantalla, ningún enlace queda roto y ES y EN se ven a 390 px.

## 3. T04 · Tramo «Pruébalo tú» (brief §3)

- **Reemplaza `ProjectIndex` en `#proyectos`** por 3 tarjetas: Fenix, L&B y New Brothers, en ese orden. Componente nuevo: `home/TryItCards.tsx`.
- **Cada tarjeta lleva:**
  - el título;
  - el `summary`;
  - los botones de `project.tryIt` (los datos ya están, tipo `TryItLink`). Cada botón muestra un rótulo «Demo» cuando `kind === "demo"` y, debajo, la `note` si existe;
  - «Ver el film · {duración}», que lleva a `/casos-de-exito/<slug>#film` (usa `flagshipRuntime`);
  - un enlace al caso.
- **Los enlaces externos** abren en una pestaña nueva, con `rel="noopener noreferrer"` y un aviso accesible de que salen del sitio.
- **El encabezado del tramo** usa los textos del brief (`archiveTitle`, `archiveBody` y `archiveCta`).
- **No borres `ProjectIndex.tsx`.** Anota si queda sin uso.
- **Listo cuando:** las 3 tarjetas se ven a 390 px y a 1440 px, en ES y EN, se recorren con teclado y el tramo mide 1.400 px o menos en escritorio.

## 4. T30 · Contacto revelado (brief §5)

- **Primero se ven los dos caminos.** El brief (`AplicarOS`) queda plegado y se abre al elegir «Consultar por un proyecto»:
  - con un disclosure accesible;
  - el foco va al primer campo al abrirlo;
  - si alguien llega con `#brief` en la URL, el brief se abre solo.
- **«Consultar por un puesto»** suma «Copiar correo», con su aviso «Correo copiado» en `aria-live`. «Ver CV» queda oculto hasta que exista `/cv`.
- **Debajo de los dos caminos,** la línea de WhatsApp (`quickLine`).
- **Opción nueva del brief:** `agency` en `teamContexts` (`AplicarOS.tsx`) y en `TEAM_CONTEXT_VALUES` (`lib/leadValidation.ts`), con su test.
- **Listo cuando:**
  - ningún camino depende solo de `mailto:`;
  - el brief no ocupa espacio hasta que alguien lo pide;
  - con teclado y movimiento reducido todo funciona;
  - **no se envía ningún formulario en las pruebas.**

## 5. T29 · Página de caso en tres niveles (independiente, desde `triada/web`)

- **`CaseStudy.tsx`:** después del encabezado, un bloque «Pruébalo tú», con los mismos botones y rótulos de T04 (comparte el componente si conviene). Solo aparece cuando el caso tiene `tryIt`.
- **Después, el film.**
- **«Bajo el capó» (`UnderTheHood.tsx`)** queda plegado detrás de «Ver arquitectura» / «See the architecture», con un disclosure accesible y `aria-expanded`. Con movimiento reducido, se despliega sin animación.
- **Listo cuando:** Fenix, L&B y New Brothers muestran el bloque; los demás casos no cambian; ES y EN se ven a 390 px; y los e2e de casos pasan.

## Al terminar cada tarjeta

- Desde `web/`: `npm run lint` (hoy 0 avisos), `npm test` (hoy 1135/1135), `npm run build`, y los e2e que toquen lo que cambiaste.
- Prueba a 390 px y en escritorio, ES y EN, con teclado y con `prefers-reduced-motion`.
- Commit en `triada/codex/<ID>`, nota en `web/docs/triada/entregas/<ID>.md` y estado `para revisar` en el tablero (solo el de tus tarjetas).
- **No sincronices el tablero en mi worktree (`mmorera-T19`).** Con el de tu rama alcanza: los cambios sueltos en mi worktree frenan las fusiones.

**Marca:** tokens de `globals.css`, sin colores nuevos. Ante la duda, menos efecto y mejor terminado.
