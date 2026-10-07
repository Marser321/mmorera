# Films de marca · traspaso (2026-10-06)

Estado y reglas del sistema de "films de lanzamiento" del portfolio, para seguir desde otra sesión.

## Qué existe
- **/sistemas:**
  - Film de apertura con scroll (`ScrollFilm`).
  - Sala de casos de uso (`UseCaseFilmRoom`): New Brothers como caso real; IA y CRM como ejemplos rotulados.
- **Casos de éxito (`/casos-de-exito/[slug]`):** `CaseFilmSection` elige el film:
  - **Insignia** si el slug está en `web/src/data/films/flagships/index.ts` (datos) y en `FLAGSHIP_LOADERS` de `FilmCanvas.tsx` (composición, cargada de forma diferida con `lazyComponent`: cada página baja solo su film). Hoy: Fénix (`FenixFilm`) y New Brothers (`NewBrothersFilm`).
  - **Genérico** (`CaseFilm`) en los demás. Si el caso tiene marca en `caseBrands.ts`, se pinta con ella. Hoy: New Brothers, Fénix y AD Media. Detrás de los textos usa el sitio ya difuminado (`public/portfolio/backdrops/`), nunca la captura nítida.
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
    - `camera.tsx`: `BlurTravel`, `CameraReel`, `BrandTitle` (acepta `\n` para fijar el corte) y `Fade`.
      - `CameraReel`: una sola ventana; las capturas se empujan (nunca se superponen), el rótulo de cada nota va en la barra de la ventana y el zoom se limita a la resolución nativa (`lib/filmCamera.ts`).
    - `flat.tsx`: pantallas planas con la piel de la marca.
    - `ArchitectureScene`: recorre JSON de Archify con vistas guiadas. Dibuja las rutas y placas de etiqueta que calculó Archify (`*.layout.json`), recorta el diagrama a su área y pone la leyenda de cada vista en su propia banda.
- `web/src/data/brands/caseBrands.ts`: tokens reales por cliente. `brandCssVars()` redefine las variables CSS dentro del film.
- `web/src/data/films/`: guiones puros, sin Remotion.
  - `flagships/types.ts`: cada film insignia declara su lista de escenas con un tipo (`SceneKind`) y su línea de tiempo sale de `timelineFrom()`. `flagships.test.ts` exige 70–80 s, firma al final y que dos clientes nunca compartan estructura (subsecuencia común ≤ 0,6) ni escena protagonista.
  - `flagships/fenix.ts`: cifras con su línea del dossier (`FENIX_FACTS`), assets con su medida nativa (`FENIX_ASSETS`, el test la lee de las cabeceras con `lib/mediaSize.ts`) y copia ES/EN. `fenix.test.ts` prohíbe %, precios, testimonios, FENIX OS y números que no estén en `FENIX_FACTS`.
- `web/src/lib/videoSource.ts`: `playableAsset()` elige la versión AV1/WebM de un clip cuando el navegador la reproduce (el Chromium de código abierto de Playwright no trae H.264; Safari se queda con el MP4). `CinematicPlate` y `ScrollReel` lo aplican solos y, si el video igual falla, dejan el póster en lugar de romper el film.
- `web/src/lib/filmLayout.ts`: zona útil por formato, bandas, columnas y grillas. Las escenas nuevas calculan sus cajas ahí (texto en bandas propias, medios en placas propias) y cada una tiene un layout puro en `scenes/brand/layout/` con su test de "nada se pisa".
- **Laboratorio de escenas** (`/films-lab`, solo `next dev`): cada escena de la biblioteca aislada, con marca, formato e idioma por query string y `window.__films.lab` para recorrerla cuadro por cuadro.
- `web/src/data/architecture/`: diagramas de Archify por caso.
  - `<nombre>.json` (apaisado, español), `<nombre>.portrait.json` (mismo contenido para 4:5), `<nombre>.en.json` (traducción) y la geometría congelada de las cuatro variantes (`*.layout.json`).
  - `bundles/<slug>.ts` junta todo; `registry.ts` lo carga de forma diferida; `bundle.ts` resuelve idioma y orientación.
  - `archify.test.ts` falla si un layout quedó viejo, si una etiqueta toca una caja, otra etiqueta, el borde de un grupo o una ruta ajena, si la vertical no dice lo mismo que la apaisada o si falta una traducción.
- `web/docs/films/dossiers/`: datos verificados de cada cliente (sus repos locales no están en la nube).
- **Scripts:**
  - `capture-case-reels.ts`: reels y capturas del sitio en vivo.
  - `capture-panel-shots.ts`: paneles por acceso demo público.
  - `build-film-backdrops.ts`: fondos pre-difuminados con sharp.
  - `build-archify-layouts.ts` (`npx tsx`): valida las cuatro variantes de cada diagrama con Archify (`showcase`) y congela sus rutas. Correrlo después de tocar un JSON de arquitectura o su traducción.
  - `analyze-live-site.ts <slug>`: recorrido en vivo (rutas, formularios, integraciones como GoHighLevel, fuentes y colores servidos) → `docs/films/dossiers/live/<slug>.{json,md}`. No envía formularios ni inicia sesión.
  - `measure-cases.ts`: Lighthouse.

## Reglas (no negociables)
1. **Honestidad:**
   - Solo datos verificables del código o del sitio del cliente.
   - Los ejemplos se rotulan "datos de ejemplo"; nada de % de conversión ni métricas inventadas.
   - Cada número lleva su fuente en un comentario y un test que lo ate.
2. **Métricas Lighthouse:** solo si las 4 notas son ≥ 90 (`isShowcaseWorthy`).
3. **Prohibido escribir "Uru" + "guay"** en el código público (`publicContent.test.ts`).
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
  - `npm run test` corre todos los `src/**/*.test.ts` (el glob va entre comillas para que lo expanda Node; antes `sh` salteaba los tests anidados, como los de `data/films/`).
- **En dev**, cada Player queda en `window.__films[kind]`. Por ejemplo, `window.__films.flagship.seekTo(900)` permite revisar cuadro por cuadro. Kinds: `opening`, `use-case`, `case`, `flagship`, `logo`.
- **e2e:** `PLAYWRIGHT_BASE_URL=http://localhost:3000 npx playwright test --project chromium --grep "caso profundo|monograma|films interactivos|no fija el scroll"`
- **Skills de Remotion:** no están en el repo (`.claude/` está en `.gitignore`). Se instalan con `npx skills add remotion-dev/skills --skill '*' --agent claude-code --copy -y` (`skills-lock.json` lista las versiones).
- **Archify:** `npx skills add tt-a1i/archify`. Valida con `node <archify>/bin/archify.mjs validate architecture <json> --quality showcase --json`.

## Feedback de Mario sobre New Brothers
- **Solapes (resuelto):**
  - Notas de cámara: el rótulo vive en la barra de la ventana; sobre la captura solo queda el marco de la zona.
  - Diagrama: rutas y placas de Archify; columnas separadas para que ninguna placa cruce un grupo; recorte con bordes suaves; leyenda fuera del dibujo.
  - Chat del problema: las burbujas se achican en su lugar (dos líneas, sin cortar texto) y viajan de derecha a izquierda por columnas vacías.
  - Asistente de reserva: la línea de progreso pasa por detrás de los pasos.
  - Entre capturas del panel, empuje en vez de fundido (dos pantallas con texto nunca se superponen). Cada escena termina antes de que entre la siguiente.
  - Títulos con aire respecto de las barras de cine; resultado en una sola columna (el dominio ya no pisa las cifras en 4:5).
- **Resolución (parcial):**
  - Hecho: `CameraReel` nunca amplía más allá de la resolución nativa; `NB_PANEL_CAPTURE` declara el tamaño real y un test lo compara con los JPEG.
  - Hecho: `capture-panel-shots.ts` ya captura a `deviceScaleFactor: 2` y JPEG 92.
  - **Pendiente:** recapturar. La red del entorno en la nube bloquea `nb-barber.vercel.app`. Correr localmente `npx tsx scripts/capture-panel-shots.ts new-brothers-barberia`, después `npx tsx scripts/build-film-backdrops.ts`, y subir `NB_PANEL_CAPTURE` a 2880×1800. El mismo guion de cámara se acerca más solo.
- **Menos ruido (resuelto):** `DustField` con 56 motas y opacidad 0,2; el logo en partículas baja su brillo y su titileo una vez formado.
- **Personalidad por caso:** sigue en pie para los próximos films (ver abajo).
- **Diagrama en 4:5 (resuelto):** `new-brothers-architecture.portrait.json` reordena el mismo contenido en filas; la escala de lectura pasa de ~0,68 a ~0,99.

## Verificación adversarial y correcciones (Fase 0/1)
- **Diagrama de arquitectura (`ArchitectureScene` & Bajo el capó):**
  - Creado modelo puro compartido `diagramModel.ts` (`visibleTag`, `boundaryTitles`, `cardTextSizes`/`fitSize`, `roleColors`, `DANGER`).
  - `archify.ts` y `underTheHoodModel.ts` re-exportan el modelo compartido; eliminada duplicación de lógica de tamaños y etiquetas.
  - Títulos de capas renderizados vía `boundaryTitles` por encima de rutas sin colisión; etiquetas garantizan ajuste (`projectedFontPx >= 6.0px`); aristas y cajas recortadas a bordes suaves.
  - Vistas guiadas de arquitectura en New Brothers y Fénix adaptadas a safe area en 16:9 y 4:5.
  - Bajo el capó: accesibilidad mejorada (`id` con prefijo, `tabIndex={0}` en tabpanel, roles ARIA) y soporte táctil de arrastre + botón Restablecer en móviles.
  - 25 tests dedicados en `ArchitectureScene.test.ts`.
- **Datos y honestidad de métricas:**
  - Ajustado subrótulo `send-reminders` en `new-brothers-architecture*.json` para garantizar legibilidad en Archify Showcase. Regenerados los 8 archivos de layout.
  - Reemplazadas métricas no verificadas en `transformationDiffData.ts` (AD Media y L&B) por capacidades reales y verificadas ("datos de ejemplo" explícitos).
  - `mediaSamples.ts` consume directamente `FENIX_ASSETS` desde `@/data/films/flagships/fenix`.
  - Eliminado archivo muerto `fenix-visitor-journey.json` y export huérfano `FORMAT_SIZE`.
  - Props de `ProblemVisuals` convertidas a `type`.
  - Dependencia `sharp` fijada en `devDependencies`.
- **Fénix Film y Dossier:**
  - `FactWall`: fuentes de ingeniería visibles y localizadas ("repositorio del proyecto" / "sitio en producción").
  - Copia sin cronología en `fenix.ts` y `projectCases.ts`.
  - Fragmentos neutros de Cerebro rotulados explícitamente como ejemplos de archivo.
  - FenixFilm migrado a safe areas, helper compartido `windowed`, token de partículas `palette.accentDeep`, y layout puro extraído a `fenixFilmLayout.ts` con 11 tests.
  - `fenix.test.ts` robustecido con límites de palabra (`\b${num}\b`) e inspección recursiva de JSONs de arquitectura.
  - Dossier de Fénix (`docs/films/dossiers/fenix.md`) actualizado con la confirmación de Mario sobre las láminas del mecanismo ("Difusión en el tejido", "Angiogénesis").
- **Deuda técnica conocida:**
  - Se mantienen por ahora 4 tablas paralelas de medición de ancho de caracteres (`charWidths`) entre diagramModel, archify, fenixFilmLayout y ProblemVisuals debido a diferencias de renderizado por fuente (`GeistMono` vs `system-ui` vs proporcional). Se unificará en una fase posterior.

## Siguiente trabajo
1. ~~Refinar New Brothers~~ (hecho, salvo recapturar a 2×: necesita red).
2. ~~Film insignia de Fénix~~ (`FenixFilm`, 79,5 s): hecho y verificado (PR #17).
3. ~~Film insignia y arquitectura de L&B Elite Wash & Detail~~ (`LbWashFilm`, 73,0 s):
   - Dossier exhaustivo en `docs/films/dossiers/lb-wash.md` extraído de `../LyB Elite Wash Details/`.
   - Topología Archify database-less compilada en 4 variantes (landscape/portrait, ES/EN) sin colisiones ni desbordes.
   - Visor "Bajo el capó" activo en `/casos-de-exito/lb-elite-wash-detail`.
   - Remotion `LbWashFilm.tsx` con apertura ParticleLogo, regla de flota ("Una visita es una camioneta en una casa"), cotizador dinámico por carrocería, arquitectura guiada de 3 vistas, app móvil de cuadrilla con feed de HighLevel CRM en vivo, y muro de verificación de ingeniería.
   - Cero desbordes probados en `lbWashFilmLayout.test.ts` y 874/874 tests pasando.
   - Verificado con Playwright e2e en producción.
4. **AD Media:** ya no hay métricas sin fuente en `caseTopologyData.ts`. Con red: `npx tsx scripts/analyze-live-site.ts ad-media-solution`, dossier, JSON de Archify (+ vertical + EN) y `AdMediaFilm`.
   - El reel y las capturas guardadas de AD Media muestran solo el popup "Diagnóstico gratis" (tapa todo el sitio). `capture-case-reels.ts` ahora cierra ese tipo de modal ("×", "No, gracias…") y, si alguno sigue tapando la página o aparece durante el reel, no graba ese caso (queda el material anterior).
5. **LNB:** esperar la carpeta de Mario y corregir la descripción del caso.
   - **Hub Profesional AI** tiene el mismo problema: el reel guardado de `profecionalcv.vercel.app` muestra un taller ("Mecánica Premium"), no una herramienta de CV con IA. Confirmar con Mario qué hay hoy en esa URL antes de armar su film.
6. **Resto de los casos (requiere red):** análisis en vivo, marca real del CSS, JSON de Archify si hay sistema y film insignia con estructura propia (el test de estructura distinta los cubre a todos).
7. **Red del entorno:** los `liveUrl` responden 000 desde la nube. Hace falta Network access "Full", o "Custom" con `fenixmedicalcenters.com`, `www.mrstudiotattoo.com`, `*.vercel.app`, `fonts.googleapis.com` y `fonts.gstatic.com`.

### Propuesta de estructura por caso (a confirmar con el análisis en vivo)
Sale de lo que muestran los reels guardados en `public/portfolio/reels/` (1280×800, 6,2 s). Cada film necesita una escena protagonista propia (`flagships.test.ts`); varias son tipos nuevos de escena.

| Caso | Lo que muestra el reel | Escena protagonista | Estado |
|---|---|---|---|
| AD Media Solution | (tapado por el popup; recapturar) | `pipeline-board` (datos de ejemplo) | Pendiente (red) |
| L&B Elite Wash & Detail | "Detailing móvil que llega a ti", "Arma tu cotización", grilla por tipo de vehículo | cotizador por tipo de vehículo (`vehicle-quote`) | **Completado (PR #17)** |
| Truckers Choice | "Insurance + Permits. One roof.", sitio bilingüe | cambio de idioma lado a lado (nuevo) | Pendiente |
| Rangel Oviedo Group | "Invierte, compra o múdate a Texas…", tono editorial | recorridos por objetivo: comprar, invertir, vender, mudarse (nuevo) | Pendiente |
| Mr. Studio Tattoo | portfolio oscuro, "Perforaciones exclusivas" | muro de piezas por artista (nuevo) | Pendiente |
| AutoHub 360 | "Tu próximo auto te espera acá", inventario | giro 360° del vehículo (nuevo; necesita los cuadros del sitio) | Pendiente |
| EvoWrap | "Reinventa tu vehículo": cerámico, PPF, interior | selector de acabados sobre el vehículo (nuevo) | Pendiente |
| Punta 360 | "Bienvenido a Punta360": propietarios, agencias, equipo | paneo panorámico (nuevo; necesita la imagen 360°) | Pendiente |
| América Trámites | formularios guiados, "¿Qué necesita lograr hoy?" | formulario por etapas con validación (nuevo) | Pendiente |
| DOGE.S.M | "Limpieza de élite Miami", oferta por servicios | oferta por niveles (nuevo) | Pendiente |
| Hub Profesional AI | taller "Mecánica Premium" (no coincide con el caso) | en espera de confirmar | Bloqueado |
| LNB | La Nueva Brasil (no coincide con el caso) | en espera de la carpeta | Bloqueado |

