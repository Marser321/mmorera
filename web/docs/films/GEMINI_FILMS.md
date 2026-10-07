# Cómo construir y exportar un film insignia (fases B y C para Gemini)

**Requisito:** el kit del caso pasa `npx tsx scripts/check-case-kit.ts <slug>` (fase A, `GEMINI_PREP.md`). El film sale del kit: no se investiga ni se captura de nuevo.

**Modelo a copiar:** Truckers Choice.
- `src/data/films/flagships/truckersChoice.ts` y su `.test.ts`
- `src/components/films/compositions/TruckersFilm.tsx`
- `src/components/films/compositions/truckersFilmLayout.ts` y su `.test.ts`

Leé también la sección "Reglas" de `docs/films/HANDOFF.md`.

## 1. Archivos nuevos del caso

Para el nombre en camelCase usá el del caso; por ejemplo, `rangelOviedo`.

1. **`src/data/films/flagships/<camel>.ts`** (solo datos, sin React):
   - `XX_SCENES`: el `storyboard` del kit (`id`, `kind`, `seconds`). Su línea de tiempo sale de `timelineFrom()`.
   - `XX_FACTS`: las `facts` del kit (`value` y `source`).
   - `XX_ASSETS`: `media` y `captures` con sus medidas (`w`, `h`, `seconds` y `webm` en los videos).
   - `XX_CHAPTERS`: 4 o 5 capítulos contiguos que cubren el film entero, con `label` y `caption` en `es` y `en`.
   - `XX_COPY`: `Record<FilmLanguage, XxCopy>`, con toda la copia en los dos idiomas. Las props y los modelos son `type`, nunca `interface`.
2. **`src/data/films/flagships/<camel>.test.ts`:** copiá `truckersChoice.test.ts`. Usa `assertStructure`, `assertChapters`, `assertFactsInDossier`, `assertAssets` y `assertHonestCopy`.
3. **`src/components/films/compositions/<Nombre>Film.tsx`:** `KitFrame` con una `<Sequence premountFor={fps}>` por escena.
   - Las escenas comunes salen del kit (`compositions/kit/KitScenes.tsx`): `PlateOpening`, `PlateManifesto` (con `plates`, una placa por frase), `SiteTour`, `ReelBeat` (capturas con notas), `ShotsBeat`, `ArchitectureBeat`, `FactsBeat`, y `SignatureScene` al final.
   - Solo la **protagonista** se escribe a mano.
4. **`src/components/films/compositions/<camel>FilmLayout.ts`** y su **`.test.ts`:** la geometría pura de la protagonista (sin React), con `kitBands`, `stackBands`, `splitColumns`, `textBlock` y `fitUniform`. El test usa `assertBlocks` y `assertInside` en 16:9 y 4:5, `es` y `en`: nada sale de su marco, ningún texto pisa a otro y todo entra en sus líneas.
5. **`src/data/films/flagships/types.ts`:** sumá el `SceneKind` nuevo de la protagonista.

## 2. Registro (archivos compartidos: solo la línea del caso)

| Archivo | Qué se suma |
|---|---|
| `src/data/brands/caseBrands.ts` | La marca del kit. Las fuentes van como `"var(--ff-brand-manrope), Manrope, sans-serif"`. |
| `src/components/films/brandFonts.ts` y `src/remotion/filmsRoot.tsx` (`FONTS`) | Solo si la fuente es nueva. |
| `src/data/films/flagships/index.ts` | La entrada en `FLAGSHIP_FILMS`. |
| `src/data/films/flagships/slugs.ts` | El slug en `FLAGSHIP_SLUGS`, los cuadros en `FLAGSHIP_STILLS` (`og`: la apertura con la marca; `hero`: la protagonista) y la duración en `FLAGSHIP_SECONDS`. |
| `src/components/films/FilmCanvas.tsx` | El loader en `FLAGSHIP_LOADERS`. |
| `src/remotion/filmsRoot.tsx` | El componente en `FILMS`. |
| `e2e/site.spec.ts` | La fila en `FLAGSHIP_CASES`: primer capítulo y uno con la protagonista. |
| `src/data/projectCases.ts` | La corrección del caso según el dossier: acento, resumen, stack y decisiones. |

## 3. Reglas de Remotion (las que rompen films si se olvidan)

- **Movimiento:** todo sale de `useCurrentFrame()`, con `progress()`, `windowed()` y las curvas de `scenes/theme.ts`. Nada de `transition` ni `animation` de CSS.
- **`<Fade duration={duration}>`** envuelve cada escena.
- **Imágenes:** las `<Img>` que desbordan llevan `maxWidth: "none"`. La cámara nunca amplía una captura más allá de su tamaño nativo (escala ≤ 1 sobre la medida del asset).
- **Texto:** va en `BoxText` con un bloque que calculó el layout, nunca con tamaños a ojo. Mínimos: 15 px en 16:9 y 20 px en 4:5.
- **Datos de ejemplo:** se rotulan (`SampleTag` o el rótulo de la nota).
- **Ritmo lento:** frases que se sostienen, entradas escalonadas, una idea por momento.

## 4. Bucle de verificación

```bash
npx tsx --test src/data/films/flagships/<camel>.test.ts src/components/films/compositions/<camel>FilmLayout.test.ts
npm test
npx tsc --noEmit
npx eslint <archivos que tocaste>
```

Con `npm run dev` corriendo (puerto 3000):

```bash
npx tsx scripts/film-frames.ts <slug> landscape <cuadros,separados,por,coma> es .film-frames/<slug>
npx tsx scripts/film-frames.ts <slug> portrait <cuadros> en .film-frames/<slug>
```

Sacá 1 o 2 cuadros por escena en los 4 casos (16:9 y 4:5, `es` y `en`) y **miralos**:
- Nada cortado, encimado ni diminuto.
- Las notas caen sobre lo que señalan.
- Las fuentes son las de la marca.

Corregí y repetí. Dejá los PNG en `.film-frames/<slug>/` (no se suben): Claude los revisa ahí.

Después:

```bash
PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test e2e/site.spec.ts -g "caso insignia" --project=chromium
npx tsx scripts/build-film-stills.ts <slug>
```

El primero corre los e2e de los films insignia; el segundo genera los cuadros fijos (OG y home).

## 5. Lo que no se toca

- Los films de otros casos.
- El kit de escenas: si hace falta algo nuevo en `KitScenes.tsx`, proponelo en el reporte.
- Los tests existentes.
- `package.json`.
- Los commits y el deploy.

## 6. Fase C · Exportar a MP4 (portfolio y redes)

```bash
npx tsx scripts/render-films.ts <slug>
```

Deja `renders/<slug>/<slug>-landscape-es.mp4`, `-landscape-en`, `-portrait-es` y `-portrait-en` (fuera de git):
- 16:9 a 1920×1080.
- 4:5 a 1080×1350.

Tarda unos 4 minutos por versión. En esta máquina (Windows ARM64) el script baja solo el compositor x64 de Remotion a `.remotion-bin/` la primera vez.

Comprobá cada archivo:

```bash
ffprobe -v error -show_entries stream=width,height,nb_frames -of csv=p=0 renders/<slug>/<slug>-landscape-es.mp4
```

Además, extraé 3 cuadros (inicio, protagonista y firma) y miralos.

## 7. Reporte al terminar un film

1. La salida de los tests y del lint.
2. La lista de cuadros revisados en `.film-frames/<slug>/`.
3. Las decisiones de copia que conviene que Claude o Mario miren.
4. Los MP4 generados, con medidas y duración.
