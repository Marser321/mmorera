# Films de marca · traspaso (2026-10-06)

Estado y reglas del sistema de "films de lanzamiento" del portfolio, para seguir desde otra sesión.

## Qué existe
- **/sistemas:**
  - Film de apertura con scroll (`ScrollFilm`).
  - Sala de casos de uso (`UseCaseFilmRoom`): New Brothers como caso real; IA y CRM como ejemplos rotulados.
- **Casos de éxito (`/casos-de-exito/[slug]`):** `CaseFilmSection` elige el film:
  - **Insignia** si el slug está en `web/src/data/films/flagships/index.ts`. Hoy solo New Brothers: `NewBrothersFilm`.
  - **Genérico** (`CaseFilm`) en los demás. Si el caso tiene marca en `caseBrands.ts`, se pinta con ella. Hoy: New Brothers, Fénix y AD Media.
- **Home:** entrada del monograma (`LogoOvertureSection`) dentro de `#perfil`. Las flechas ">" y "Σ" se unen y giran hasta formar la M; la misma firma cierra cada film.

## Dónde está cada cosa
- `web/src/components/films/`
  - `FilmStage`: monta el Player con carga diferida, sin precarga.
  - `FilmCanvas`: registro de composiciones.
  - `FilmChapters`: capítulos y subtítulos HTML reales.
  - `compositions/`
  - `scenes/brand/`: motor de marca.
    - `ParticleLogo`: partículas que forman el logo del cliente.
    - `DustField`
    - `camera.tsx`: `BlurTravel`, `CameraShot` con notas, `BrandTitle` y `Fade`.
    - `flat.tsx`: pantallas planas con la piel de la marca.
    - `ArchitectureScene`: recorre JSON de Archify con vistas guiadas.
- `web/src/data/brands/caseBrands.ts`: tokens reales por cliente. `brandCssVars()` redefine las variables CSS dentro del film.
- `web/src/data/films/`: guiones puros, sin Remotion.
- `web/src/data/architecture/`: JSON de Archify (New Brothers, Fénix) y `archify.ts` (tipos y geometría).
- `web/docs/films/dossiers/`: datos verificados de cada cliente (sus repos locales no están en la nube).
- **Scripts:**
  - `capture-case-reels.ts`: reels y capturas del sitio en vivo.
  - `capture-panel-shots.ts`: paneles por acceso demo público.
  - `build-film-backdrops.ts`: fondos pre-difuminados con sharp.
  - `measure-cases.ts`: Lighthouse.

## Reglas (no negociables)
1. **Honestidad:**
   - Solo datos verificables del código o del sitio del cliente.
   - Los ejemplos se rotulan "datos de ejemplo"; nada de % de conversión ni métricas inventadas.
   - Cada número lleva su fuente en un comentario y un test que lo ate.
2. **Métricas Lighthouse:** solo si las 4 notas son ≥ 90 (`isShowcaseWorthy`).
3. **Prohibido escribir "Uruguay"** en el código público (`publicContent.test.ts`).
4. **Fénix:** sin testimonios, sin datos de pacientes, sin contenido de FENIX OS ni costos. Claims médicos con la redacción permitida (ver dossier).
5. **Remotion:**
   - Todo movimiento sale de `useCurrentFrame()`. Nada de `transition`/`animate` de CSS dentro de una composición.
   - Las `<Img>` que desbordan necesitan `maxWidth: "none"` por el reset de Tailwind.
   - Las props de composición son `type`, no `interface`.
6. **Rendimiento:**
   - Remotion fuera del HTML inicial.
   - Sin `filter: blur` en vivo sobre capas grandes: usar `build-film-backdrops`.
   - Lighthouse local da números ruidosos (OneDrive + CPU): medir intercalado o en PageSpeed.
7. **Deploy:** push a `main` = producción en Vercel. Pedir OK a Mario antes.

## Cómo verificar
- `cd web && npm run test && npm run lint && npx tsc --noEmit && npm run build`
- **En dev**, cada Player queda en `window.__films[kind]`. Por ejemplo, `window.__films.flagship.seekTo(900)` permite revisar cuadro por cuadro. Kinds: `opening`, `use-case`, `case`, `flagship`, `logo`.
- **e2e:** `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test --project chromium --grep "caso profundo|monograma|films interactivos|no fija el scroll"`
- **Skills de Remotion:** no están en el repo (`.claude/` está en `.gitignore`). Se instalan con `npx skills add remotion-dev/skills --skill '*' --agent claude-code --copy -y` (`skills-lock.json` lista las versiones).
- **Archify:** `npx skills add tt-a1i/archify`. Valida con `node <archify>/bin/archify.mjs validate architecture <json> --quality showcase --json`.

## Feedback de Mario sobre New Brothers (a resolver)
- **Solapes:** las líneas y los efectos no se pueden pisar entre sí ni con los textos (revisar notas de cámara, etiquetas del diagrama, carriles del chat y títulos sobre ventanas).
- **Resolución:**
  - Recapturar paneles con `deviceScaleFactor: 2` y JPEG de mayor calidad.
  - Evitar zooms de cámara que amplíen la captura más allá de su resolución nativa (escala máxima ≈ resolución de captura / ancho de ventana).
- **Menos ruido:** bajar la opacidad y la cantidad de `DustField` y reducir el brillo de las partículas una vez formado el logo.
- **Personalidad por caso:** los films se parecen demasiado. Cada caso necesita un análisis profundo, estilo Archify (flujos, arquitectura, decisiones), y una estructura de escenas propia, no solo otra paleta.

## Siguiente trabajo
1. **Refinar New Brothers** según el feedback de arriba.
2. **Film insignia de Fénix** con `docs/films/dossiers/fenix.md` y el kit en `public/portfolio/brands/fenix-medical-center/`:
   - partículas del fénix sobre el corredor cinemático;
   - investigación (mecanismo HBOT, "la dosis es el claim");
   - posicionamiento;
   - sitio y reserva en 3 pasos;
   - arquitectura de Archify (3 vistas);
   - Cerebro y fábrica de contenido;
   - ingeniería (221 ADR, 98/98);
   - firma.

   Además, agregar Fénix a `projectCases.ts` como **primer destacado**, capturar su reel y sumar la sección "Bajo el capó" con un diagrama interactivo (`@xyflow/react` ya está instalado).
3. **AD Media** a fondo: análisis del sitio en vivo, JSON de Archify y film propio.
4. **LNB:** esperar la carpeta de Mario y corregir la descripción del caso.
5. **Resto de los casos:** análisis desde el sitio en vivo; marca + film propio.
