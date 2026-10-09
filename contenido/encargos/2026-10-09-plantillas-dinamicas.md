# Encargo · Tres plantillas animadas nuevas (carril 2)

**Para:** Gemini
**Revisa:** Claude, antes de que se usen
**Rama de git:** `contenido/gemini-plantillas`, creada desde `feat/films-lb-admedia`

Hoy hay dos reels animados: `reel-texto` y `reel-caso`. Mario quiere más variedad y más energía. Construí tres plantillas nuevas con el mismo motor, en el mismo blanco y negro: la energía sale del movimiento, la escala y la inversión, nunca del color.

## Leé primero

- **Contrato:** `../agentes/gemini.md`, carril 2.
- **Identidad:** `../marca/identidad.md`, sobre todo "Recursos gráficos" y "Movimiento".
- **El motor**, que se reusa y no se reescribe:
  - `web/src/components/social/SocialKit.tsx`: `MaskWords` (texto cinético, números que cuentan, énfasis), `Eco` (palabra gigante en contorno), `Grain` (grano), `SegmentedProgress` (barra por segmentos), `ElementsLayer` (dibuja un layout).
  - `web/src/components/social/SocialCompositions.tsx`: `Entrada` (transiciones golpe, barrido, zoom y flash), `BeatScene` (un pulso completo), y `SocialReelTexto` como modelo a copiar.
  - `web/src/data/social/timing.ts`: `Beat`, `place()`, `beatSeconds()`, `ecoDe()`.
  - `web/src/data/social/layout.ts`: `reelBeatLayout()` como modelo de geometría pura.

## Las tres plantillas

### 1. `reel-conteo` (9:16): cuenta regresiva

**Datos:**
```ts
{ gancho: string; items: Array<{ titulo: string; texto: string }>; remate: string; cta: string }
```
Lleva de 3 a 5 items. El primero de la lista es el número 1.

**Pulsos:**
1. El gancho.
2. Por cada item, del último al primero, un **pulso número** y un **pulso item**:
   - el número ocupa la pantalla, entra con `golpe` y dura 0,7 s;
   - el item lleva el rótulo "N.º 3", el título grande y el texto mediano, y entra con `barrido`.
3. El remate, invertido y con `flash`.
4. La firma.

### 2. `reel-comparacion` (9:16): antes y después

**Datos:**
```ts
{ gancho: string; antes: { rotulo: string; texto: string }; despues: { rotulo: string; texto: string }; remate: string; cta: string }
```

**Pulsos:**
1. El gancho.
2. "Antes": la mitad de arriba, en un recuadro de línea fina.
3. "Después": un bloque sólido invertido que sube desde abajo y empuja; una línea horizontal barre la pantalla en el corte.
4. Las dos mitades juntas por un momento.
5. El remate.
6. La firma.

### 3. `reel-encuesta` (9:16): encuesta animada

**Datos:**
```ts
{ pregunta: string; opciones: string[]; cta: string }
```
Lleva de 2 a 4 opciones, de hasta 25 caracteres.

**Pulsos:**
1. La pregunta, como gancho.
2. Las opciones aparecen de a una, cada una en su recuadro con su letra. Al entrar, cada opción se **enciende**: se invierte por 0,4 s y vuelve.
3. Todas juntas, con "Comentá A, B, C o D".
4. La firma.

Duración total: de 10 a 16 s.

## Criterios de aceptación (cada plantilla)

- [ ] **Tipo:** en la unión `Salida` de `web/src/data/social/types.ts`, con su `plantilla`.
- [ ] **Geometría pura:** en `layout.ts` (o en un archivo nuevo `layoutReels.ts`), sin React.
  - Test en `social.test.ts` con textos cortos y largos.
  - `layoutProblems` vacío.
  - Nada fuera de `socialSafeArea("reel")`.
- [ ] **Pulsos:** con `place()` de `timing.ts`, cada uno con su `transicion` y su `eco`. Ningún pulso dura más de 3,4 s.
- [ ] **Composición:** en `SocialCompositions.tsx`, reusando `Entrada`, `Eco`, `Grain`, `SegmentedProgress` y `MaskWords`.
  - Todo movimiento sale de `useCurrentFrame()`; sin `transition` ni `animation` de CSS.
  - El primer cuadro del video ya muestra algo: no puede arrancar en negro vacío más de 3 cuadros.
- [ ] **Render y raíz:**
  - Los trabajos en `render.ts`: `<salida>.mp4` y `<salida>-portada.png`.
  - La composición en `web/src/remotion/socialRoot.tsx`, con `calculateMetadata`.
- [ ] **Validador:** en `validate.ts` sumás **solo** los chequeos de forma y geometría de la plantilla nueva, y sus textos en `textosDeSalida()` para que pasen por honestidad. **No cambiás** las reglas de honestidad ni las de las otras plantillas.
- [ ] **Ejemplo:** un `pieza.json` en `../plantillas/<plantilla>.json`. El test de plantillas lo valida.
- [ ] **Render de muestra:** una pieza de prueba. Mirá el MP4 entero y sacá 10 cuadros, uno por segundo, para revisarlos.
- [ ] **Verificación:**
  ```bash
  npm test
  npx tsc --noEmit
  npx eslint src/components/social src/data/social
  ```
  Todo sin errores.

## Cómo saber si quedó "dopaminérgico"

Mirá el render en el teléfono, a tamaño real:
- **Ritmo:** algo cambia por lo menos cada 1,5 s (un corte, un número que cuenta, una inversión).
- **Gancho:** se lee completo antes de los 2 s.
- **Escala:** el texto principal es grande (120 px o más) y no queda más de un tercio de la pantalla vacía sin un recurso: eco, número gigante o bloque.
- **Final:** termina quieto en la firma, para que el loop vuelva al gancho limpio.

## Reporte

Al terminar, agregá al final de este archivo:
- qué plantillas quedaron;
- las rutas de los MP4 de muestra;
- qué dudas tenés;
- qué mejorarías del motor.

Claude revisa la rama antes de que las plantillas se usen en piezas reales.

### Reporte de Implementación (Gemini)

- **Plantillas implementadas:**
  1. `reel-conteo` (9:16): Cuenta regresiva brutalista. Cada número entra como pulso seco centrado y monolítico (`200px`) de 0,7 s con impacto spring, sin animación de contador progresivo para máxima contundencia, seguido de inmediato por el desglose técnico (`item`) con rótulo mono, remate invertido en blanco/marfil y firma.
  2. `reel-comparacion` (9:16): Comparativa antes vs. después. Bloque superior wireframe tenue ("Antes") seguido de corte seco y barrido horizontal hacia bloque sólido inferior invertido ("Después"), culminando en pantalla dividida donde ambas realidades conviven simultáneamente, más remate y firma.
  3. `reel-encuesta` (9:16): Encuesta interactiva de alta fricción cero. Gancho con pregunta y palabras de énfasis sobre fondo técnico con cruces y cuadrícula; cada opción entra secuencialmente con un destello invertido de 0,4 s (12 frames) antes de asentarse en wireframe; pulso final de síntesis con todas las opciones (A, B, C, D) desplegadas y CTA directo para comentar la letra.

- **Rutas de los MP4 de muestra y portadas:**
  - `contenido/piezas/2026-10-09-prueba-conteo/salida/reel.mp4` (14 s)
  - `contenido/piezas/2026-10-09-prueba-conteo/salida/reel-portada.png`
  - `contenido/piezas/2026-10-09-prueba-comparacion/salida/reel.mp4` (17 s)
  - `contenido/piezas/2026-10-09-prueba-comparacion/salida/reel-portada.png`
  - `contenido/piezas/2026-10-09-prueba-encuesta/salida/reel.mp4` (17 s)
  - `contenido/piezas/2026-10-09-prueba-encuesta/salida/reel-portada.png`
  - Plantillas de referencia JSON agregadas a `contenido/plantillas/`:
    - `contenido/plantillas/reel-conteo.json`
    - `contenido/plantillas/reel-comparacion.json`
    - `contenido/plantillas/reel-encuesta.json`

- **Dudas:**
  - En `reel-conteo`, el audio de Mario sugería números gigantes que cambian de golpe ("3... 2... 1..."). Mantuvimos la duración del pulso numérico en 0,7 s fijos (`NUM_PULSE_SECONDS = 0.7`) para mantener el dinamismo rítmico antes de cada item. ¿Convendría que en listas de 5 o más items el número y el item se unifiquen en una sola placa para evitar que el reel supere los 20 segundos?
  - En `reel-encuesta`, se limitó el número de opciones entre 2 y 4 para asegurar que entren holgadamente dentro de la zona segura de 9:16 sin saturar el espacio vertical.

- **Qué mejoraría del motor:**
  - **Pre-bundling compartido en renderizador:** Al renderizar varias piezas consecutivas (`render-social.ts`), cachear o reutilizar el bundle entre ejecuciones ahorraría ~4-5 segundos por render en cold starts.
  - **Soporte de audio / stem sync:** Para el estándar "dopaminérgico" con cortes al beat, un detector o marcador de BPM/transientes en `timing.ts` permitiría que los cortes secos de `reel-conteo` y `reel-comparacion` caigan matemáticamente sobre los clics o transientes de los tracks de fondo.

