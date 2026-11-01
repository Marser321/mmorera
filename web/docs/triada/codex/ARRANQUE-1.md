# Arranque de Codex · sesión 1 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

Vas a trabajar **en paralelo con Claude**: él está en el héroe, los proyectos y los textos (`HomeExperience.tsx`, `src/data/**`, `src/config/site.ts`). Esos archivos **no los toques**. Partí siempre de la rama `triada/web` (hoy en 9512a53), cada tarea en su worktree:

```bash
git worktree add ../mmorera-<ID> -b triada/codex/<ID> triada/web
```

En el worktree, `web/node_modules` no existe. Instalá con `npm ci` dentro de `web/`, o enlazalo al del repo principal. Si usás un enlace, levantá el servidor con `next dev --webpack`, porque Turbopack rechaza el enlace.

**El principio de esta web** (Mario): *es una muestra viva de lo que puede construir para el cliente. No tiene que abrumar: tiene que transmitir, con buen estilo y efectos con intención, lo que haría por él.* Ante la duda, menos efecto y mejor terminado.

## Tus tarjetas, en este orden

### 1. T17 · Páginas legales (la más importante: la web tiene más exposición)
- **Textos exactos:** `web/docs/triada/briefs/T17-legal.md` (ES) y `T17-legal-en.md` (EN). No los reescribas.
- **Páginas:**
  - `/privacidad` (reemplaza la actual), `/terminos` y `/cookies`.
  - Sus pares `/en/privacidad`, `/en/terminos` y `/en/cookies`.
  - Diseño: el mismo de la `/privacidad` actual, con un índice de anclas y la fecha de «Última actualización».
- **Metadata:** title, description y `alternates` con `hreflang` ES/EN en cada página.
- **Pie:** enlaces Privacidad · Términos · Cookies en `src/components/sections/footer.tsx`, ES y EN.
- **Formulario:** en `AplicarOS.tsx`, **solo** la línea «Al enviar, aceptas la política de privacidad» junto al botón de enviar.
- **Sitemap:** sumar las 6 rutas en `src/app/sitemap.ts`.
- **Ley aplicable (D7, decidida):** Uruguay, nombrado **solo** en las 3 páginas legales. Ajustá `src/data/publicContent.test.ts` para excluir **solo** `src/app/{privacidad,terminos,cookies}/**` y sus pares en `src/app/en/**`. El resto del sitio sigue sin nombrar el país, y el test lo sigue controlando. `[fecha de publicación]` queda como `TODO(Mario)`.
- **Verificá lo real:** buscá analítica, píxeles o scripts de terceros, y qué se guarda en `localStorage` o en cookies (tema, idioma). Anotá en la entrega todo lo que el texto de cookies no mencione.

### 2. T13 · Deuda técnica
- Llevá a 0 los avisos de lint (eran 29, casi todos importaciones sin usar).
- Revisá los 17 e2e de `e2e/site.spec.ts` que ya fallaban desde `b184b16`. Arreglá los que sean del test o de la app sin cambiar textos. Los que necesiten decisión, explicalos en la entrega.

### 3. T18 · Pulido de «muestra viva»
- **Inventario** en la entrega: cada efecto o animación del sitio, dónde está, qué hace y tu propuesta (queda, se baja o se va). Claude decide antes de que borres algo grande.
- **Lo que sí podés hacer directo:**
  - unificar curvas y duraciones de movimiento en un solo lugar;
  - estados de hover y `focus-visible` en todo lo interactivo;
  - una `not-found.tsx` con el estilo de la marca y un camino de vuelta;
  - evitar saltos de diseño al cargar;
  - aligerar en el teléfono lo pesado;
  - `prefers-reduced-motion` en todo, con `hooks/useReducedMotionSafe.ts`.
- **No toques `HomeExperience.tsx`.** Lo que haya que cambiar ahí, anotalo en la entrega.

### 4. T11 · Lab de demos (si te sobra tiempo)
`/lab`: 3 o 4 demos de motion enlazables (scroll, hover, texto animado), cada una con su URL, en ES y EN, respetando el movimiento reducido.

## Al terminar cada tarjeta
- Desde `web/`: `npm run lint`, `npm test` (hoy 1041/1041) y `npm run build`.
- Probá a 390 px y en escritorio, ES y EN, con teclado.
- Commit en tu rama `triada/codex/<ID>`. Nunca en `main` ni en `triada/web`.
- `web/docs/triada/entregas/<ID>.md` y el estado → `para revisar` en el tablero.

**Marca:** tokens de `src/app/globals.css` (pared `#0B0B0A`, marfil `#ECE7DD`, una sola señal `#71F3A2`). Sin colores nuevos.
**Voz:** cualquier texto que falte va como `TODO(Claude)`; no inventes copy.
