# Arranque de Codex · sesión 2 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

Mario aprobó el plan de experiencia (`web/docs/triada/PLAN-experiencia.md`). Ese plan baja el home de unos 14.700 px a unos 8.500, quitando lo que repite. Tienes 4 tarjetas, en este orden. Están en `web/docs/triada/TABLERO.md`.

**Antes de empezar:**
- **Partir siempre de `triada/web`** (su punta actual). Desde T19 contiene lo que está en producción: marca «pared», SEO por página y rótulos «Ejemplo». La rama está solo en local, así que trabajas sobre este mismo repo, cada tarea en su worktree:
  ```bash
  git worktree add ../mmorera-<ID> -b triada/codex/<ID> triada/web
  ```
- **`node_modules`:** el worktree no lo trae. Corre `npm ci` dentro de `web/`, o enlázalo al del repo principal y levanta el servidor con `next dev --webpack`.
- **Archivos de Claude, no los toques:** `src/data/**` y `src/config/site.ts`. Si necesitas un cambio ahí, anótalo en la entrega.
- **Textos:** no escribas textos nuevos. Lo que falte va como `TODO(Claude)`.

## 1. T22 · Sacar del home la órbita y el riel de films, y la barra flotante según D9

- **`HomeExperience.tsx`:**
  - dejar de montar `OrchestrationWheelSection` (`#orquestacion`) y `FilmRail`;
  - el `ProjectIndex` de `#proyectos` se queda por ahora (lo reemplaza T04).
- **`WorkExperience.tsx` (`/casos-de-exito`):** montar `FilmRail` entre el reel de destacados y el «Archivo completo».
- **`IslandBar.tsx` (D9):** se convierte en **un solo botón «Hablemos» / «Let's talk»**.
  - Aparece cuando el héroe sale de la vista y lleva a `#contacto`.
  - Desaparece cuando `#contacto` está en pantalla, para no taparlo.
  - Fuera quedan las 6 anclas, el WhatsApp y el cambio de tema; el tema sigue en el menú de utilidades del navbar.
  - Con movimiento reducido, aparece sin animación.
  - En el teléfono no tapa contenido ni el pie.
- **No borres** `OrchestrationWheelSection.tsx`: T06 lo va a reutilizar en `/cv`. Si queda sin importar, anótalo en la entrega.
- **e2e:** actualiza en `e2e/site.spec.ts` solo los tests que buscaban lo que sacaste.
- **Listo cuando:**
  - el home mide **12.000 px o menos a 1440 px**, medido con `document.documentElement.scrollHeight` (hoy mide 14.743);
  - `/casos-de-exito` muestra el riel;
  - el botón funciona con teclado (foco visible);
  - no hay desborde a 390 px, ni en ES ni en EN.

## 2. T24 · Partículas sin desfile de logos (D8)

- **`src/components/shared/TechParticleField.tsx` y `src/lib/particleSequence.ts`:**
  - **en reposo**, el campo queda quieto y sin forma, sin ciclar logos de herramientas;
  - **al enfocar un chip del héroe** (hover o foco), se sigue dibujando el glifo del servicio, como hoy (`SERVICE_GLYPHS`);
  - la dispersión al hacer scroll fuera del héroe se queda.
- **`setActiveFamilies`** (`/sistemas`, `/estudio`, `CapabilitiesOrbit`) deja de disparar el desfile.
- **Rótulo «Tecnología contextual»:** en `SystemsExperience.tsx` y `StudioExperience.tsx` se muestra `activeTechName`. Si queda en `null`, se oculta el rótulo. Toca solo esa línea.
- **Tests:** ajusta los de `particleSequence` y `particleScenes` que dependan del ciclo. Si hace falta tocar `src/data/particleSceneConfig.ts`, pídelo en la entrega.
- **Listo cuando:**
  - en `/`, `/sistemas` y `/estudio` no desfila ningún logo;
  - los 4 chips del héroe siguen dibujando su glifo;
  - con movimiento reducido, el campo está quieto;
  - el rendimiento en el teléfono es igual o mejor. Mide intercalado: OneDrive y la CPU distorsionan Lighthouse.

## 3. T13 · Deuda técnica

- Lleva a 0 los **17 avisos de lint**.
- Arregla el aviso de React **«Each child in a list should have a unique "key" prop» en `OuterLayoutRouter`**: aparece en la consola en desarrollo y ya estaba en producción.
- Revisa los e2e de `e2e/site.spec.ts` que fallen:
  - si el problema es del test o de la app, arréglalo sin cambiar textos;
  - si hace falta decidir algo, explícalo en la entrega.
- **No toques** los archivos de T22 y T24 (`HomeExperience.tsx`, `WorkExperience.tsx`, `IslandBar.tsx`, `TechParticleField.tsx` y `particleSequence.ts`). Si tienen avisos, anótalos en la entrega.

## 4. T25 · Pasada de texto: voseo, calcos y cifras

- Brief con los textos exactos y los archivos: `web/docs/triada/briefs/T25-texto.md`. Copia los textos tal cual.
- Incluye cambiar el tipo de `stack` a `(string | LocalizedText)[]`. Cuando el tipo esté listo, avisa en la entrega: Claude carga los valores en inglés.
- Arranca después de T13, desde la punta de `triada/web`, para no chocar con T22 y T24.

## Al terminar cada tarjeta

- Desde `web/`: `npm run lint`, `npm test` (hoy 1133/1133) y `npm run build`.
- Prueba a 390 px y en escritorio, ES y EN, con teclado y con `prefers-reduced-motion`.
- Commit en tu rama `triada/codex/<ID>`. Nunca en `main` ni en `triada/web`.
- Deja tu nota en `web/docs/triada/entregas/<ID>.md` y cambia el estado a `para revisar` en el tablero (solo el de tus tarjetas).

**Marca:** tokens de `src/app/globals.css`. Sin colores nuevos. Ante la duda, menos efecto y mejor terminado.
