# Manual Maestro de Animación de Films Insignia (Claude Playbook)

> **Destinatario:** Claude / Modelos potentes de animación y dirección de arte.  
> **Objetivo:** Tomar proyectos con su infraestructura lista (dossier, Archify, assets, tipos) y elevar la cinemática al estándar premium de **Fénix Medical Center** y **New Brothers**, evitando errores de runtime en Remotion y maquetas planas de baja fidelidad.

---

## 1. El Estándar Visual "Nivel Fénix" (Qué hace que un Film impacte)

Un film de marca en este portfolio **no es una demo genérica ni un wireframe con cajas de colores planos**. Es un cortometraje de producto de alta gama (70–80 segundos, 60 fps).

### La diferencia entre un film plano y un film premium:

| Elemento | ❌ Lo que parece un borrador plano (evitar) | ✅ El estándar Fénix / New Brothers (aplicar) |
|---|---|---|
| **Fondos** | Divs con fondo sólido liso `#0D1423` | `<CinematicPlate>` con fotos reales oscurecidas, velo radial, grano y `<DustField>` con partículas tenues. |
| **Sitio web** | Mockups inventados con CSS puro | Capturas reales del sitio con `<ScrollReel>` recorriendo la página o `<ShotStack>` pasando pasos reales. |
| **Arquitectura** | Diagramas estáticos o tablas | `<ArchitectureScene>` guiado con cámara dinámica, pulso de luz SVG sobre las conexiones y vistas enfocadas. |
| **Hardware / Campo** | Rectángulos simulando una pantalla | `<PhoneFrame>` con reflejo sutil, o placas cinemáticas fotográficas de las camionetas/equipos reales. |
| **Tipografía** | Textos apiñados en una sola columna | Bandas calculadas con `stackBands()`, rótulos `SceneTitle` con tracking ancho (`0.2em`) y `ManifestoBeats`. |
| **Cierre** | Un botón de fin | Monograma en partículas con `<ParticleLogo>`, números certificados con `<FactWall>` y firma de marca con `<SignatureScene>`. |

---

## 2. Reglas Técnicas Estrictas de Remotion (Zero Crashes)

1. **Monotonía en interpolaciones:**
   - `interpolate(frame, inputRange, outputRange)` **exige** que `inputRange` sea estrictamente monótono creciente: `[0, 15, 60, 75]`.
   - **NUNCA** pasar valores donde el segundo sea menor que el primero (ej. `[0, duration, 20, 20]`).
   - Para transiciones de entrada y salida de escenas completas, usar siempre el componente probado (entra en 16 frames y sale en los últimos 20):
     ```tsx
     <Fade duration={duration}>
       {/* Contenido de la escena */}
     </Fade>
     ```
2. **Derivar todo del frame:**
   - Cero clases CSS `transition-*`, `animate-*` o animaciones de Framer Motion dentro de Remotion. Todo se calcula desde `const frame = useCurrentFrame();`.
   - Usar `progress(frame, from, to)` para avances de 0 a 1 con la curva de aceleración oficial `EASE_OUT`.
3. **Props con `type`:**
   - Remotion rechaza `interface` en las composiciones; usar siempre `type Props = { ... }`.
4. **Geometría respetada:**
   - Toda escena debe medir y colocar sus elementos dentro de `safeArea(format)`.
   - Para dividir pantallas usar `stackBands(area, bands, gap)` verticalmente o `splitColumns(area, ratios, gap)` horizontalmente. Jamás hardcodear `top: 450px` al azar.

---

## 3. Catálogo de Componentes Cinematográficos Disponibles

Todos residen en `@/components/films/scenes/brand/` y `@/components/films/scenes/case/`:

### A. `<CinematicPlate>` (`camera.tsx`)
Muestra una imagen o video de fondo a pantalla completa o dentro de una caja, con recorte cinematográfico, empuje suave de zoom y velo de opacidad configurable.
```tsx
<CinematicPlate
  box={layout.plateBox}
  asset={ASSETS.heroImage}
  duration={duration}
  veilOpacity={0.45}
  push={0.05}
  align="center"
>
  {/* Capas superpuestas opcionales */}
</CinematicPlate>
```

### B. `<ScrollReel>` (`ScrollReel.tsx`)
Simula la navegación fluida y real por una página web capturada, con barra de navegador estilizada y paradas exactas en las secciones clave.
```tsx
<ScrollReel
  box={mainBox}
  asset={ASSETS.siteCapture}
  host="lb-elite.com"
  path="/cotizador"
  duration={duration}
  stops={[0, 0.45, 0.85]}
/>
```

### C. `<ShotStack>` (`ShotStack.tsx`)
Pila de capturas de pantalla de una aplicación que avanzan con un suave efecto de empuje lateral o vertical entre pasos.
```tsx
<ShotStack
  box={mainBox}
  shots={[
    { ...ASSETS.step1, label: "Paso 1: Selección" },
    { ...ASSETS.step2, label: "Paso 2: Fecha y Turno" },
    { ...ASSETS.step3, label: "Paso 3: Confirmación" },
  ]}
  duration={duration}
  frame="card"
  startAt={16}
/>
```

### D. `<ArchitectureScene>` (`ArchitectureScene.tsx`)
Renderiza el diagrama oficial de Archify compilado, animando la aparición de nodos y enfocando vistas guiadas con zoom de cámara suave y pulsos de datos.
```tsx
<ArchitectureScene
  diagram={architecture.diagram}
  layout={architecture.layout}
  area={parts.diagram}
  caption={{ x: parts.caption.x, y: parts.caption.y, w: parts.caption.w, size: portrait ? 28 : 20 }}
  maxZoom={1.6}
  buildFrames={75}
  viewFrames={Math.floor((duration - 75) / viewsCount)}
/>
```

### E. `<ParticleLogo>` (`ParticleLogo.tsx`)
El efecto insignia donde partículas dispersas convergen matemáticamente para dibujar el monograma o isotipo de la marca del cliente.
```tsx
<ParticleLogo
  src={brand.logo.mark}
  mode={brand.logo.particleMode}
  colors={[brand.palette.accentSoft, brand.palette.accent, brand.palette.accentDeep]}
  size={layout.logoSize}
  center={{ x: centerX, y: centerY }}
  formFrom={8}
  formTo={70}
  dissolveAt={duration - 20}
  count={2400}
  restAlpha={0.95}
/>
```

### F. `<FactWall>` (`FactWall.tsx`) & `<ChecklistGrid>` (`flat.tsx`)
Presentación de credenciales técnicas y métricas verificadas con fuentes de código.
```tsx
<FactWall
  box={factsBox}
  duration={duration}
  language={language}
  facts={copy.engineeringFacts}
/>
```

---

## 4. Estado del Portfolio y Qué Está Listo para Animar

| Proyecto | Slug | Dossier Técnico | Archify (4 layouts) | Assets de Marca | Cinemática Remotion | Tarea Pendiente para Claude |
|---|---|---|---|---|---|---|
| **Fénix Medical Center** | `fenix-medical-center` | ✅ Completo | ✅ Compilado | ✅ Completos | ✅ Nivel Maestro (79.5s) | **Modelo de referencia terminado**. |
| **New Brothers Barbería** | `new-brothers-barberia` | ✅ Completo | ✅ Compilado | ✅ Completos | ✅ Pulido (72.0s) | Terminado. |
| **L&B Elite Wash & Detail** | `lb-elite-wash-detail` | ✅ Completo (`lb-wash.md`) | ✅ Compilado (`lb-wash-architecture*`) | ✅ `van-real.jpg`, `van.webp`, `mark.png` + capturas del cotizador y de la cuadrilla (`shots/`) | ✅ Nivel Fénix (74,5 s) | Terminado: camioneta real + monograma en partículas, `ScrollReel` del cotizador real con el webhook de la cita, app real de la cuadrilla en `PhoneFrame`. |
| **AD Media Solution** | `ad-media-solution` | ✅ Completo (`ad-media.md`) | ✅ Compilado (`ad-media-architecture*`) | ✅ `brand-grid.jpg` (de `banner.jpg`), `ceo.jpg`, `logo-crm.png`, `mark.png`, `wordmark.png`, `shots/site-recorrido.jpg` | ✅ Nivel Fénix (72,5 s) | Terminado: isotipo sobre su grilla, la alianza con el CEO, el sitio en `ScrollReel` y la protagonista `pipeline-board` (Speed-to-Lead + 5 etapas, datos de ejemplo). |
| **Truckers Choice** | `truckers-choice` | ✅ Completo (`truckers-choice.md`, sitio en vivo) | — (sin sistema propio verificable) | ✅ 4 clips del sitio (mp4 + webm), `mark.png` y `wordmark.png` del logo, capturas EN/ES (`shots/`) | ✅ Nivel Fénix (75,5 s) | Terminado: protagonista `bilingual-split` (cortina EN/ES) y `one-roof` (6 líneas, 30 trámites, 4 pasos). El formulario está en vista previa: no afirmar envíos. |
| **Rangel Oviedo Group** | `rangel-oviedo-group` | 🟡 En carpeta | ⏳ Pendiente | ✅ `rangel-oviedo-cover.jpg` | ⏳ Pendiente | Recorrido editorial de asesoría inmobiliaria. |
| **Mr. Studio Tattoo** | `mr-studio-tattoo` | ✅ Reescrito con el sitio en vivo (`mr-studio.md`) | — (sin arquitectura propia verificable) | ✅ `hero-rosa.mp4/.webm` + póster, `mark.png`, `artistas.jpg`, 8 capturas de la reserva a 2× (`shots/live-*`) | ✅ Nivel Fénix (71,5 s) | Terminado: protagonista `body-selector` (figura real, zoom al antebrazo, vista de espalda, brief de ejemplo) y `consent-split`. |

---

## 5. Cómo Animar un Proyecto Paso a Paso (Flujo para Claude)

1. **Revisar el Dossier:** Leer `docs/films/dossiers/<slug>.md` para no inventar métricas ni claims fuera de evidencia.
2. **Importar la Arquitectura:** Usar `resolveArchitecture(bundle, language, format)` conectado a su bundle en `src/data/architecture/bundles/<slug>.ts`.
3. **Estructurar el Film:** En `src/data/films/flagships/<slug>.ts`:
   - Definir los 5 capítulos y sus frames de inicio/duración.
   - Definir la escena protagonista única (`types.ts`).
4. **Construir el Layout en `src/components/films/compositions/<slug>FilmLayout.ts`:**
   - Crear funciones puras para calcular cajas (`OpeningLayout`, `HeroLayout`, etc.).
   - Crear un test unitario que valide que no hay desbordes fuera de `safeArea()`.
5. **Componer en `src/components/films/compositions/<Nombre>Film.tsx`:**
   - Seguir la estructura de `FenixFilm.tsx`: `<BrandProvider>`, `<Sequence>` por capítulo con `premountFor={fps}`, `<Letterbox>` y `<ChapterTicks>`.
   - Utilizar medios fotográficos reales con `<CinematicPlate>` en lugar de cajas monocromáticas.
   - Envolver cada escena en `<Fade duration={duration}>`.

---

## 6. Prompt Modelo para Despachar la Animación a Claude

Para pedirle a Claude (3.7 Sonnet / Opus) que anime un caso puntual con cero fricción, copiale este prompt:

```markdown
Actuá como Director Creativo y Desarrollador Senior de Remotion para mmorera.agency.
Tu tarea es construir/elevar la animación cinematográfica de: [NOMBRE DEL PROYECTO] (slug: [SLUG]).

Tenés toda la infraestructura ya servida y compilada:
- Manual de Estándar y Componentes: `docs/films/CLAUDE_ANIMATION_PLAYBOOK.md`
- Dossier técnico verificado: `docs/films/dossiers/[SLUG].md`
- Arquitectura Archify (4 variantes compiladas): `src/data/architecture/bundles/[SLUG].ts`
- Assets fotográficos y marcas reales: `public/portfolio/brands/[SLUG]/` y `public/portfolio/shots/`
- Componentes reutilizables: `@/components/films/scenes/brand/` y `@/components/films/scenes/case/`

Requisitos innegociables:
1. Nivel Fénix: Usa `<CinematicPlate>` con fotos reales oscurecidas, `<ScrollReel>` para recorrer la web, pulsos de datos SVG y `<DustField>`. Cero cajas grises o maquetas planas.
2. Remotion estricto: Todo derivado de `useCurrentFrame()`, sin clases CSS `transition-*`, interpolaciones monótonas y transiciones con `<Fade duration={duration}>`.
3. Geometría: Todo dentro de `safeArea(format)`, respetando bandas y márgenes.
4. Ejecutá `npm test` al terminar y asegurate de que 917/917 tests pasen.
```

---

## 7. Superpoderes Técnicos y Narrativa Profunda por Caso (Ficha Creativa)

Cada film tiene una tesis de ingeniería y un diferencial de negocio radicalmente diferente. Claude **debe resaltar el superpoder específico** de cada caso:

### 1. L&B Elite Wash & Detail (`lb-elite-wash-detail`)
* **Tesis Central:** Cero base de datos tradicional (cero Postgres). Orquestación 100% serverless mediante Webhooks hacia el CRM (GoHighLevel).
* **Superpoder en Pantalla:** 
  - El cotizador web interactivo por carrocería (88 productos, 142 precios) despacha un **Inbound Webhook** al CRM que desglosa en tiempo real: cantidad de vehículos, duraciones acumuladas y total estimado.
  - La cita nace con hold temporal de 15 minutos (`appointmentStatus: new`).
  - Al confirmarse el pago, la máquina de estados muta en GHL y rutea automáticamente hacia el calendario de la camioneta correspondiente entre las 4 unidades autónomas.
  - **Visuales clave:** Usar `<CinematicPlate>` con las fotos reales de las camionetas en calle (`van-real.jpg`, `van.webp`), capturas del cotizador con `<ScrollReel>` y el diagrama de Archify que ilustra la ausencia total de Postgres.

### 2. Mr. Studio Tattoo (`mr-studio-tattoo`)
* **Fuente:** la versión **azul** en producción (`mrstudiotattoo.com`, `#2A4DE8`, Anton + Inter). La versión roja de `Desktop/MrTatto` no está publicada: no se usa.
* **Tesis central:** una reserva guiada de 10 pasos, una pregunta por pantalla, que llega al artista con el brief completo.
* **Superpoder en pantalla:**
  - **Selector anatómico:** figura muscular de frente y espalda, 24 zonas tocables en la vista frontal (`path[id]` en SVG).
  - **Artista elegido:** 6 residentes, cada uno con años de oficio (5+ a 8+) y su propia agenda.
  - **Tamaño con tiempo de sesión:** chico (<8 cm, ~1 h), mediano (8–15 cm, 2–3 h), grande (>15 cm, 4 h+).
  - **Consentimiento según la edad:** adulto, digital y firmado con su nombre; menor, notariado y con tutor presente, queda pendiente de verificación.
  - **Depósito:** el sitio dice que se cobra al confirmar. El film lo nombra pero nunca da un monto.
* **No afirmar:** "elimina los no-shows", calendario o CRM concretos (no aparecen en el bundle) ni métricas de conversión.

### 3. AD Media Solution (`ad-media-solution`)
* **Tesis Central:** Trabajo de desarrollo frontend de alta conversión en funnels y sitios web. Alianza comercial estratégica donde AD Media Solution actuó como la agencia comercial que vendió y canalizó los proyectos, y **Mario Morera operó como el socio tecnológico exclusivo tercerizado (White-Label Tech Partner)**.
* **Superpoder en Pantalla:** 
  - **Funnels y Webapps de Alta Conversión:** Portada oficial con banners de la agencia, presencia del CEO (Danger Fernández) y logos completos (`logo-full-white.png`, `logo-crm.png`).
  - **Speed-to-Lead Instantáneo (<30 segundos):** Automatización omnicanal que conecta pauta de Meta/Google Ads con GoHighLevel.
  - **Pipeline Kanban Dinámico:** Simulación de oportunidades de venta avanzando por las 5 etapas del CRM hasta el cierre.
  - **Visuales clave:** Azul eléctrico (`#0066FF`), banners oficiales (`banner.jpg`, `ceo.jpg`), escáner diagnóstico de captación y flujo de marca blanca 100%.

### 4. Fénix Medical Center (`fenix-medical-center`) — *Gold Standard*
* **Tesis Central:** Plataforma médica hiper-especializada de medicina regenerativa y cámara hiperbárica.
* **Superpoder en Pantalla:** Mecanismos médicos certificados ("Difusión tisular", "Angiogénesis"), seguridad WAF de 7 campos en el formulario y sincronización bidireccional con agendas médicas privadas.

### 5. New Brothers Barbería (`new-brothers-barberia`)
* **Tesis Central:** Mini-CRM y POS propio desarrollado sobre Supabase con Row Level Security (RLS) y PostgreSQL nativo, sin CRM externo.
* **Superpoder en Pantalla:** 4 roles con permisos diferenciados, reserva en 6 pasos, cierre de caja diario y liquidación porcentual automática a cada barbero.
