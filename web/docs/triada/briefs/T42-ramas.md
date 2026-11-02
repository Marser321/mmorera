# T42–T46 · Las ramas: recuperar lo que se sacó, en más páginas cortas

**Decisión de Mario (1/11, al ver la preview):** la simplificación le gusta, pero se perdieron piezas de calidad que quería reorganizar, no quitar.
- **Páginas:** cortas, pero **más páginas**, con más ramas para entrar a ver capacidades y casos de uso.
- **Lo que vuelve:**
  - las partículas como antes (D8, revertida);
  - la barra de abajo como antes (D9, revertida);
  - la película de autor, en una página «Sobre mí»;
  - el film completo de `/sistemas`;
  - y nacen `/capacidades`, `/casos-de-uso` y `/lab`.

**Ya hecho por Claude** (en `triada/web`):
- **Partículas:** `TechParticleField` y `particleSequence` vuelven a la versión anterior a T24. Desfilan los logos en reposo y responden a `setActiveFamilies` y al foco.
- **Barra de abajo:** `IslandBar` vuelve con las secciones del home actual (Inicio · Servicios · Casos · Cómo trabajo · Contacto), WhatsApp y el tema. En las páginas internas, `WhatsAppFab` vuelve a ser el botón de WhatsApp.
- **`ScrollFilm`:** vuelve a `h-[520vh]`.
- **Datos y textos:** `src/data/branchPages.ts` (slugs, servicio de cada capacidad y de cada caso de uso, y los textos de cada página) y el SEO en `paginas.ts` (`capacidades`, `casosDeUso`, `sobreMi` y `lab`).

**Voz:** español neutro con tuteo e inglés claro. Los textos salen de `branchPages.ts` y de los datos de films que ya existen. Lo que falte va como `TODO(Claude)`.

## T42 · «Sobre mí»: la película de autor y el CV

- **Recuperar de git** (`git show 9078194^:web/src/components/...`):
  - `premium/AuthorManifestoScene.tsx`;
  - `films/LogoOvertureSection.tsx`.

  Se borraron en T36; los videos siguen en `public/profile/author-film/`.
- **Rutas:** `src/app/sobre-mi/page.tsx` y `src/app/en/sobre-mi/page.tsx`, con `pageMetadata("sobreMi", …)`.
- **Orden de la página:**
  1. la entrada del monograma (`LogoOvertureSection`);
  2. la película de autor (`AuthorManifestoScene`, con `ABOUT_MANIFESTO`);
  3. una sección `id="cv"` con el contenido de `CvDocument` (datos rápidos, PDF, con qué trabajo y casos) y `ABOUT_PAGE.cvTitle`.
- **`/cv` y `/en/cv`:** redirigen a `/sobre-mi#cv` y `/en/sobre-mi#cv` (`redirect()` en la página). El sitemap pasa a `/sobre-mi`.
- **Enlaces:**
  - en el menú, «Sobre mí · CV» → `/sobre-mi`;
  - el `cvLink` del héroe y «Ver CV» del contacto → `/sobre-mi#cv`;
  - en «Cómo trabajo» del home, un enlace «Ver la película completa →» / «Watch the full film →» a `/sobre-mi`.
- **Listo cuando:** la película se ve completa en escritorio y en el teléfono, con su recuperación de póster si falla y su versión quieta con movimiento reducido (como antes de T21), y `/cv` lleva al CV.

## T43 · `/capacidades` y una página por familia

- **`/capacidades`** (y `/en/capacidades`), con `CAPABILITIES_PAGE`:
  - monta el menú de capacidades: `estudio/CapabilitiesOrbit.tsx` con su `CapabilityFilmPanel`;
  - al tocar una familia, las partículas dibujan sus herramientas (`setActiveFamilies`, que vuelve a funcionar) y al lado corre su film. **Es el efecto que Mario extrañaba.**
  - cada familia del menú enlaza a su página.
- **`/capacidades/[familia]`** (9 páginas, `generateStaticParams` desde `CAPABILITY_SLUGS`; `familyFromSlug`):
  - **H1:** la etiqueta de la familia (`SKILL_ORBIT`); **bajada:** su `blurb`;
  - **su film** (`CapabilityFilm`, el mismo del panel);
  - **«Con qué la trabajo»:** `techsForFamily`;
  - **«Casos que la demuestran»:** `CAPABILITY_CASES[familia]`, con el cuadro fijo y el enlace a `/casos-de-exito/<slug>#film-<capítulo>`;
  - **«El servicio que la usa»:** `CAPABILITY_SERVICE`;
  - **«Se conecta con»:** sus familias `related`, con enlace;
  - al entrar, `setActiveFamilies([familia])` para que el fondo dibuje sus herramientas.
- **Metadatos por familia:**
  - **título:** «<familia> — Capacidades» / «<family> — Capabilities»;
  - **descripción:** el `blurb`;
  - **canonical y alternates:** con `idiomasDe`.
- **Listo cuando:** las 10 rutas se ven en ES y EN a 390 y 1440 px; el menú responde con las partículas y el film; y con movimiento reducido no hay animación.

## T44 · `/casos-de-uso` y una página por caso

- **`/casos-de-uso`** (y `/en/casos-de-uso`), con `USE_CASES_PAGE`: 3 tarjetas, una por film de `USE_CASE_FILMS`, con su póster o su cuadro, título, problema en una línea y rótulo «Caso real» o «Ejemplo · datos de muestra» (el mismo criterio de `UseCaseFilmRoom`).
- **`/casos-de-uso/[slug]`** (`USE_CASE_SLUGS`, `useCaseFromSlug`):
  - **el film completo** (`UseCaseFilm`) con sus capítulos;
  - **los textos del film:** problema, diagnóstico, sistema y resultado;
  - **«Visto en»:** `seenIn`, con enlace al caso;
  - **«El servicio que lo resuelve»:** `USE_CASE_SERVICE`.
- **En `/sistemas`:** `UseCaseFilmRoom` se queda y suma «Ver todos los casos de uso →».
- **Listo cuando:** las 4 rutas se ven en ES y EN a 390 y 1440 px, y los films se controlan con teclado.

## T11 (ampliada) · `/lab`

- **`/lab`** (y `/en/lab`), con `LAB_PAGE`: una tarjeta por demo, cada una con su URL.
  - **`/lab/identidad-visual`:** `InteractiveDesignTokenStudio`, sin cifras inventadas («99 PageSpeed», «28ms», «12.4x») y con «Vista de ejemplo».
  - **`/lab/bandeja`:** `OmnichannelInboxSimulator`, con «Datos de ejemplo» y sin montos ni intención.
  - Una o dos demos de motion más, si alguna comunica algo (por ejemplo, el glifo de partículas al enfocar). Anota cuáles y por qué.
- **Enlaces:** desde `/estudio` («Ver el Lab») y desde el pie.

## T45 · Navegación, puertas y e2e

- **Menú:** «Servicios ▾ · Capacidades · Casos ▾ · Sobre mí · CV · [Hablemos]». «Casos ▾» abre «Casos de éxito» (`/casos-de-exito`) y «Casos de uso» (`/casos-de-uso`). En el teléfono, todo dentro del menú móvil.

  | Etiqueta | ES | EN |
  |---|---|---|
  | Capacidades | Capacidades | Capabilities |
  | Casos | Casos | Cases |
  | ↳ | Casos de éxito | Case studies |
  | ↳ | Casos de uso | Use cases |
  | Pie | Capacidades · Casos de uso · Lab · Sobre mí | Capabilities · Use cases · Lab · About |
- **Puertas en el home:** después de «Pruébalo tú», una franja corta (500 px o menos en escritorio) con 3 puertas: Capacidades, Casos de uso y Lab. Cada una lleva título, una línea e imagen o cuadro de film.

  | Puerta | Título ES | Línea ES | Título EN | Línea EN |
  |---|---|---|---|---|
  | Capacidades | Nueve capacidades | Toca una y mira cómo responde el sitio. | Nine capabilities | Tap one and watch the site respond. |
  | Casos de uso | Casos de uso | Problemas reales, contados como films. | Use cases | Real problems, told as films. |
  | Lab | Lab | Demos que puedes tocar. | Lab | Demos you can play with. |

  Título de la franja: «Explora más» / «Explore more».
- **e2e:** pruebas de las rutas nuevas (las 10 de capacidades, las 4 de casos de uso, `/sobre-mi` con la película, `/lab` y sus demos), de la barra de abajo con sus 5 secciones y de las partículas con `setActiveFamilies`. La suite completa en verde contra `next start`.
