# Preparación de casos para los films insignia (encargo para Gemini)

**Objetivo:** dejar cada caso listo para animar. Claude toma el kit y escribe el film en Remotion: no tiene que investigar, capturar ni diagramar.

**Cuándo está terminado un caso:** cuando este comando da ✔ sin fallas (los ⚠ se pueden dejar):

```bash
npx tsx scripts/check-case-kit.ts <slug>
```

Trabajá en bucle: corré el checker, corregí lo que marca y volvé a correrlo.

El ejemplo completo y verificado es Truckers Choice:
- `docs/films/kits/truckers-choice.json` (el kit).
- `docs/films/dossiers/truckers-choice.md` (el dossier).
- `scripts/capture-film-flows.ts`, función `tcSite` (las capturas).

Copiá su forma.

---

## 1. Casos y orden

| # | Caso (slug) | Sitio en vivo | Protagonista propuesta (`protagonist.kind`) |
|---|---|---|---|
| 1 | `america-tramites` | https://atreact.vercel.app/ | `staged-form`: formulario por etapas con validación |
| 2 | `evowrap` | https://evowrap.vercel.app/ | `finish-selector`: cerámico, PPF e interior sobre el vehículo |
| 3 | `autohub-360` | https://auto-indol-five.vercel.app/ | `spin-360`: los cuadros del giro del vehículo que use el sitio |
| 4 | `doge-sm` | https://doge-27dp.vercel.app/ | `tier-offer`: la oferta por niveles |
| 5 | `punta-360` | https://punta-360.vercel.app/ | `pano-pan`: la imagen 360° del sitio |
| 6 | `lnb-saas` | https://lnb-saass.vercel.app/ | A definir con lo que muestre el sitio. Hoy es La Nueva Brasil (panadería), no un "SaaS de inventario". |
| 7 | `hub-profesional-ai` | https://profecionalcv.vercel.app/ | A definir con lo que muestre el sitio. El reel guardado muestra un taller ("Mecánica Premium"), no una herramienta de CV. |

- **Rangel Oviedo Group lo hace Claude:** no lo toques.
- **Si la protagonista propuesta no se sostiene** con lo que hay en el sitio, proponé otra. Debe ser un `kind` nuevo, en kebab-case, y el checker comprueba que no sea la protagonista de otro film.
- **Notas previas de cada caso:** `C:\Users\morer\OneDrive\Desktop\MMorera-Freelance-KB\projects\<slug>.md`. Son afirmaciones del portfolio "pendientes de verificar": úsalas como pista, nunca como fuente.
- **Repos locales:** si existe uno del cliente (por ejemplo `Desktop\temp_atreact` para América Trámites), podés leerlo, pero el film cuenta **lo publicado**. Si el repo y el sitio difieren, manda el sitio y anotalo en el dossier, como en `mr-studio.md` § 0.

## 2. Qué podés tocar y qué no

**Podés crear o editar, por caso:**
- `docs/films/dossiers/<slug>.md`
- `docs/films/kits/<slug>.json`
- `public/portfolio/brands/<slug>/` (logo, clips, imágenes y `shots/`)
- `scripts/capture-targets/<slug>.ts`
- `src/data/architecture/<nombre>*.json` y `src/data/architecture/bundles/<slug>.ts` (solo si el caso tiene arquitectura; ver § 6)

**No toques** (los edita Claude al animar, y tocarlos genera conflictos):
- `src/data/brands/caseBrands.ts`
- `src/components/films/**`
- `src/data/films/**`
- `src/data/projectCases.ts`
- `src/data/architecture/registry.ts`
- `scripts/capture-film-flows.ts`
- `package.json` y `package-lock.json`
- `e2e/**`

**Sin commits ni deploy.** Dejá los archivos en el árbol; Claude los revisa y los sube.

## 3. Reglas (no negociables)

1. **Solo datos verificables** del sitio publicado (o del código del cliente). Cada cifra del kit va al dossier con su fuente: la URL y cómo se contó.
   - Ejemplo: "/services: 4 + 5 + 6 + 6 + 4 + 5 'confirmed filings'".
   - Nada de porcentajes de conversión, ROI, "garantizado", "duplicá" ni métricas inventadas. El checker los rechaza en la copia.
2. **Solo lectura en producción.**
   - Todo recorrido usa `readOnly(context)` de `scripts/lib/capture.ts`.
   - Nunca envíes un formulario, inicies sesión, crees cuentas ni escribas datos personales.
   - En un formulario, avanzá con **datos de ejemplo** solo hasta antes del paso de contacto. El paso de contacto se captura **vacío**.
   - Si el sitio dice que algo está en "vista previa" o "demo", anotalo en el dossier y en `doNotClaim`.
3. **Los ejemplos se rotulan.** Un highlight sobre datos de ejemplo lo dice ("(ejemplo)" / "(sample)").
4. **Nunca escribas la palabra "Uru" + "guay"** en ningún archivo del repo (`publicContent.test.ts` falla).
5. **Copia en dos idiomas:** cada rótulo y cada línea del guion llevan `es` y `en`. Español rioplatense neutro, sin voseo forzado.

## 4. Marca (del CSS servido, no del gusto)

- **Colores:** bajá el CSS que sirve el sitio (`/_next/static/css/*.css` o el `<link rel=stylesheet>` que corresponda). Usá los colores que **pinta** (clases compiladas, variables CSS) y anotá en `brand.source` de dónde sale cada uno.
- **Paleta:** son 10 claves, todas `#RRGGBB`. `accentSoft` y `accentDeep` son el acento aclarado y oscurecido si el sitio no los define; decilo en `source`.
- **Fuentes:** las de `--font-*` o `font-family`. Si no están en `src/components/films/brandFonts.ts`, el checker avisa (⚠) y Claude las suma.
- **Logo:**
  - `mark.png`: solo el isotipo, sin texto, PNG con alfa (tipo de color 6), lado mayor ≥ 512 px. Las partículas leen el alfa; si el logo no tiene transparencia, `particleMode: "dark"`.
  - `wordmark.png`: el texto del logo, si lo hay.
  - Si el logo trae dibujo y texto juntos, separalos por regiones, como se hizo con Truckers (dossier § 1).

## 5. Medios y capturas

**Clips del sitio.** Buscá los `.mp4`/`.webm` en el HTML y en los chunks JS (`grep -o '"/media/[^"]*"'`) y recodificalos. Cada uno pesa como máximo 3 MB:

```bash
FF="C:/Users/morer/AppData/Local/Microsoft/WinGet/Packages/yt-dlp.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-N-124716-g054dffd133-winarm64-gpl/bin/ffmpeg"
"$FF" -y -i in.mp4 -an -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -movflags +faststart out.mp4
"$FF" -y -i in.mp4 -an -c:v libsvtav1 -preset 6 -crf 36 -pix_fmt yuv420p out.webm
"$FF" -y -i out.mp4 -frames:v 1 -q:v 3 out-poster.jpg
```

**Imágenes del sitio:** el archivo original (no el de `/_next/image` reducido). Cada una pesa como máximo 1,5 MB.

**Capturas:** un objetivo por caso en `scripts/capture-targets/<slug>.ts`:

```ts
import type { Browser } from "playwright";
import { HIDE_FLOATING, JPEG, readOnly, shotsDir, type CaptureTarget } from "../lib/capture";

export const target: CaptureTarget = {
  name: "<slug>-site",
  async capture(browser: Browser) {
    const dir = shotsDir("<slug>");
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 4 / 3, colorScheme: "dark" });
    await readOnly(context);
    // … ver tcSite en scripts/capture-film-flows.ts
    await context.close();
    return [/* rutas de los archivos */];
  },
};
```

Se corre con `npx tsx scripts/capture-film-flows.ts <slug>-site` (los objetivos de esa carpeta se cargan solos).

- **Tamaños:** 1920×1200 (página) o 1920×1080 (recortes 16:9). Usá `deviceScaleFactor` para llegar a 1920 de ancho.
- **Sitio bilingüe:** las mismas paradas en los dos idiomas, con el mismo encuadre.
- **Sitios con scroll suavizado por JS:** recargá la página por parada y saltá con `window.scrollTo({ top, behavior: "instant" })`. Si recorrés la página con la rueda antes, el sitio pisa el salto.
- **Ocultá** las burbujas de chat (`HIDE_FLOATING`).
- **`highlights`:** marcan en cada captura lo que el film va a señalar. Son rectángulos en fracciones `[x, y, w, h]` de la imagen, medidos sobre la captura, no a ojo sobre una miniatura.

## 6. Arquitectura con Archify (solo si hay sistema)

- **Cuándo diagramar:** solo si el caso tiene un sistema verificable, es decir, backend, base de datos, integraciones o automatizaciones que se vean en el código o en el tráfico del sitio. Si es un sitio informativo, poné `architecture.bundle: null` y explicá por qué en `reason`.
- **Si hay sistema:**
  1. Escribí `src/data/architecture/<nombre>.json` (apaisado, español), `<nombre>.portrait.json` (mismo contenido para 4:5) y `<nombre>.en.json` (traducción). Copiá la forma de `lb-wash-architecture*.json`.
  2. Corré `npx tsx scripts/build-archify-layouts.ts`: congela las 4 variantes.
  3. Corré `npx tsx --test src/data/architecture/archify.test.ts` hasta que pase: nada se pisa y la vertical dice lo mismo que la apaisada.
  4. Creá `src/data/architecture/bundles/<slug>.ts`, igual a `bundles/ad-media-solution.ts`.
  5. **No** toques `registry.ts`: el checker solo avisa.

## 7. El kit (`docs/films/kits/<slug>.json`)

Partí de `docs/films/kits/_template.json`. Puntos clave:

- **`facts`:** al menos 5 cifras, cada una presente en el dossier y con su fuente.
- **`media` y `captures`:** las medidas reales. El checker mide los archivos y compara.
- **`storyboard`:**
  - Escenas que suman 70–80 s y terminan en `signature`.
  - La escena más larga es la protagonista.
  - La estructura (los `kind` del medio) no puede parecerse a la de otro film en más de 0,6. Para variar hay `kind` de sobra: `particle-open`, `manifesto`, `scroll-reel`, `camera-reel`, `shot-stack`, `architecture`, `fact-wall`, `checklist`, `before-after` y los nuevos que propongas.
  - `uses` nombra los `id` de `media` y `captures` que usa cada escena.
- **`doNotClaim`:** lo que el film no puede afirmar (lo que el sitio no sostiene).

## 8. Reporte al terminar cada caso

Una nota breve (en el chat o al final del dossier) con:
1. La salida del checker (✔).
2. Qué se verificó en vivo y qué quedó sin verificar.
3. Diferencias entre el caso publicado en el portfolio (`projectCases.ts`) y lo que muestra el sitio. Claude corrige el caso.
4. La protagonista elegida y por qué.
