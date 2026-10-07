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
   - Para transiciones de entrada y salida de escenas completas, usar siempre el componente probado:
     ```tsx
     <Fade duration={duration} lead={16} tail={16}>
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
| **L&B Elite Wash & Detail** | `lb-elite-wash-detail` | ✅ Completo (`lb-wash.md`) | ✅ Compilado (`lb-wash-architecture*`) | ✅ `banner.jpg`, `van-real.jpg`, `van.webp`, `mark.png` | ⚠️ Estructura lista, visuales planos | **Elevar visuales**: Usar las fotos reales de camionetas con `CinematicPlate`, capturas del cotizador con `ScrollReel`, y enmarcar la app de cuadrilla. |
| **AD Media Solution** | `ad-media-solution` | ✅ Completo (`ad-media.md`) | ✅ Compilado (`ad-media-architecture*`) | ✅ `banner.jpg`, `ceo.jpg`, `logo-crm.png`, `mark.png`, `wordmark.png` | ⏳ Estructura lista | **Crear composición `AdMediaFilm.tsx`** con escena protagonista `pipeline-board` (Speed-to-Lead <30s + Kanban de 5 etapas) siguiendo el patrón de `FenixFilm.tsx`. |
| **Truckers Choice** | `truckers-choice` | 🟡 En carpeta | ⏳ Pendiente | ✅ `truckers-cover.png` | ⏳ Pendiente | Escena bilingüe lado a lado. |
| **Rangel Oviedo Group** | `rangel-oviedo-group` | 🟡 En carpeta | ⏳ Pendiente | ✅ `rangel-oviedo-cover.jpg` | ⏳ Pendiente | Recorrido editorial de asesoría inmobiliaria. |
| **Mr. Studio Tattoo** | `mr-studio-tattoo` | 🟡 En carpeta | ⏳ Pendiente | ✅ Reels y capturas en carpeta | ⏳ Pendiente | Muro de piezas por artista sobre negro absoluto. |

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
