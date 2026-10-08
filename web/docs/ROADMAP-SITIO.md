# Hoja de ruta del sitio · films para todos los casos y mejoras (2026-10-07)

Plan de trabajo después de los films insignia de L&B y AD Media. Las reglas de honestidad y de Remotion siguen siendo las de `docs/films/HANDOFF.md` y del playbook.

## 1. Hecho en esta tanda

- **Acceso a los casos:**
  - `/casos-de-exito` tiene un índice "Ir directo a un caso" con los 14 casos. Los que tienen film insignia llevan un punto verde.
  - El reel de destacados ahora lleva a la página del caso: "Ver el caso" es el botón principal y el título también es enlace. Antes solo ofrecía la demo y el sitio externo.
  - El índice de proyectos del home marca los casos con "Film insignia".
  - `FLAGSHIP_SLUGS` (`data/films/flagships/slugs.ts`) es la lista liviana para la navegación; un test la ata a `FLAGSHIP_FILMS`.
- **Accesibilidad, bug de hidratación en todo el sitio:** con "reducir movimiento" activado, todas las rutas fallaban al hidratar.
  - Causa: `useReducedMotion` de framer-motion lee la preferencia ya en el primer render del cliente.
  - Arreglo: `hooks/useReducedMotionSafe.ts`, que devuelve `false` en el servidor y en la hidratación. Reemplaza al de framer en 23 componentes.
  - Un e2e lo cubre ("con movimiento reducido · las páginas hidratan…").
- **Limpieza técnica:** se borraron 27 componentes sin uso (home, estudio, aplicación, sistemas, trabajo) y 18 archivos de datos huérfanos con sus tests. Lint queda en 0 errores.
- **Kit de escenas** (`components/films/compositions/kit/`): las escenas que se repiten entre films, con layouts puros testeados. Un film nuevo escribe solo su protagonista.
- **Mr. Studio Tattoo:** film insignia de 71,5 s sobre la versión azul en producción. Caso y dossier corregidos con lo que el sitio muestra hoy.
- **Truckers Choice:** film insignia de 75,5 s con los clips y las capturas del sitio en los dos idiomas. Caso corregido (acento ámbar, cifras del catálogo).
- **e2e de films insignia:** una tabla (`FLAGSHIP_CASES` en `e2e/site.spec.ts`); cada film nuevo suma una fila.
- **Films compartibles:**
  - Enlace directo a un capítulo: `/casos-de-exito/<caso>#film-<capítulo>` baja hasta el film y salta a ese capítulo. Elegir un capítulo actualiza la URL sin sumar historial.
  - Botón "Compartir este capítulo": hoja del sistema en el teléfono y portapapeles en escritorio. Si el navegador niega el portapapeles, avisa que el enlace quedó en la barra.
  - `#film` sola lleva al film desde cualquier enlace.
- **SEO por caso** (`lib/caseSeo.ts`, ES y EN):
  - Canónica, `hreflang` y Open Graph de tipo `article`. La imagen OG es un cuadro del film (1200×630); sin film, la portada.
  - JSON-LD por caso: `CreativeWork` con autor, rubro, año y cliente, más `BreadcrumbList`.
- **Cuadros fijos de los films** (`scripts/build-film-stills.ts`, cuadros en `FLAGSHIP_STILLS`): `og` (la apertura) y `hero` (la protagonista), en ES y EN, en `public/portfolio/films/<caso>/`. Un test exige que existan y midan lo declarado.
- **Films en el home:** riel "Cada caso, contado como un film" al tope de Proyectos. Cada tarjeta muestra la apertura, pasa a la protagonista al pasar el mouse y lleva directo al film del caso.

## 2. Films para todos los casos

Proceso por caso (el mismo de L&B y AD Media):
1. Leer el repo local y analizar el sitio en vivo (`scripts/analyze-live-site.ts`).
2. Escribir un dossier con cada cifra y su fuente.
3. Sacar la marca del CSS servido y cargarla en `caseBrands.ts`.
4. Capturar con `capture-film-flows.ts`, sumando un objetivo por caso.
5. Escribir datos y test, layout puro y test, y la composición.
6. Revisar cuadro por cuadro en 16:9 y 4:5, en español e inglés, y sumar el e2e.

Cada film necesita una escena protagonista propia: `flagships.test.ts` impide repetirlas.

| Orden | Caso | Estado | Material disponible | Escena protagonista propuesta |
|---|---|---|---|---|
| 1 | Mr. Studio Tattoo | **Hecho** | Sitio en vivo (versión azul); la roja de `Desktop/MrTatto` no está publicada | `body-selector` y `consent-split`. |
| 2 | Truckers Choice | **Hecho** | Sitio en vivo (`/en` y `/es`) | `bilingual-split` y `one-roof`. |
| 3 | Rangel Oviedo Group | Destacado | Sitio en vivo, notas en el KB | `goal-paths`: comprar, invertir, vender y mudarse, cada recorrido por separado. |
| 4 | América Trámites | Archivo | Repo local `Desktop/temp_atreact` (a confirmar), sitio en vivo | `staged-form`: formulario por etapas con validación. |
| 5 | EvoWrap | Archivo | Sitio en vivo | `finish-selector`: cerámico, PPF e interior sobre el vehículo. |
| 6 | AutoHub 360 | Archivo | Sitio en vivo | `spin-360`: necesita los cuadros del giro desde el sitio. |
| 7 | DOGE.S.M | Archivo | Sitio en vivo | `tier-offer`: la oferta por niveles. |
| 8 | Punta 360 | Archivo | Sitio en vivo | `pano-pan`: necesita la imagen 360°. |
| 9 | LNB | Desde el sitio en vivo | El caso dice "SaaS de inventario"; el sitio es La Nueva Brasil (panadería) | Rehacer el caso y el film con lo que muestra el sitio. |
| 10 | Hub Profesional AI | Desde el sitio en vivo | El sitio en vivo muestra un taller ("Mecánica Premium") | Rehacer el caso y el film con lo que muestra el sitio. |

## 3. Mejoras del sitio más allá de los films

Ordenadas por impacto y esfuerzo:

1. **Encontrar casos por rubro.**
   - Filtros en `/casos-de-exito`: salud, automotor, agencias y CRM, inmobiliario, trámites, belleza.
   - "Casos parecidos" al final de cada caso, además del "Siguiente proyecto".
2. **Los films, protagonistas del home.** El riel ya está (sección 1). Falta acortar el home, que mide 14.200 px en escritorio. Alturas medidas el 2026-10-07 a 1440 px:
   - perfil (entrada del monograma + manifiesto): 4.600
   - servicios: 3.300
   - proyectos: 1.600
   - orquestación: 1.450
   - contacto: 1.250
   - hero: 830
   - método: 850

   El perfil solo es un tercio del home. Recortarlo o fusionar orquestación con método lo dejaría cerca de 10.000 px. **No se toca sin el OK de Mario.**
3. ~~Films compartibles~~: hecho (sección 1).
4. ~~SEO por caso~~: hecho (sección 1).
5. **Prueba social real.** Hay testimonios en video en el escritorio. Para usarlos hace falta permiso de cada cliente, y se rotulan como testimonios: nunca métricas.
6. **Deuda técnica:**
   - ~~Componentes sin uso y errores de lint~~: hecho.
   - Quedan 29 avisos de lint (importaciones sin usar).
   - **17 e2e de `site.spec.ts` que ya fallaban en `b184b16`.** Se midió el 2026-10-07 corriendo el mismo spec contra esa versión y contra la actual, las dos con `next dev --webpack`. Ninguna falla es nueva:
     - la cabecera
     - el rail de servicios (flechas y cuatro viewports)
     - las capacidades del home
     - las secuencias de tecnología
     - el cambio de idioma
     - la composición en tablet
     - el caso profundo (intermitente)
     - el fallback táctil y los pósters con movimiento reducido
     - el manifiesto con movimiento reducido
     - el modo claro
     - los MP4 locales y su póster
     - el fondo abstracto
     - la pausa fuera del viewport
     - la cámara de la apertura móvil

     Varios buscan piezas que el home ya no monta: `nucleo-decision` solo lo usaba `MethodTimeline`, que ningún archivo importaba. Hay que rehacerlos contra el home actual.
   - Con Turbopack (`npm run dev`) fallan además, por tiempos, la navegación compacta y el menú móvil: el clic llega antes de hidratar. Con webpack pasan.
   - **2026-10-08:** la suite completa contra `next start` da 34 OK y 17 fallas, las mismas de esta lista. "Cuatro viewports" y "la apertura móvil" ahora pasan. Entran en su lugar la navegación compacta y el menú móvil, que también fallan contra mmorera.agency sin los cambios del día: no las causó esta tanda. Las e2e nuevas (botones del trabajo, casos parecidos, films de Estudio, "Visto en") pasan.
7. **Coherencia de datos:**
   - `projectCases.ts` presenta "Speed-to-Lead en menos de 30 s" como restricción de AD Media. Es una meta, no una medición: reformularla.
   - Corregir las descripciones de LNB y Hub Profesional AI.

## 4. Hecho el 2026-10-08: todo conectado, films por capacidad e Impeccable

- **Acceso a los casos desde tres lugares:**
  - **Trabajo:** cada tarjeta del archivo (`magic-bento`) lleva un botón visible "Ver el caso y su film", con el acento de la tarjeta; antes era un rótulo de 9 px al 30 %. En el reel el botón principal dice "Ver el caso y su film · 1:15" (`flagshipRuntime` en `flagships/slugs.ts`).
  - **Estudio:** cada familia de la órbita muestra su film corto y "Casos que lo demuestran".
  - **Sistemas:** los casos de uso de ejemplo enlazan "Visto en" al caso real, en el capítulo de su film (`seenIn` en `systemsFilms.ts`).
  - **Dentro de cada caso:** "Casos parecidos", 3 casos que comparten capacidades, antes de "Siguiente proyecto".
- **Mapa capacidad → casos** (`data/capabilityCases.ts`, con test): qué caso demuestra cada familia y en qué capítulo de su film. Lo usan Estudio, los films por capacidad y "Casos parecidos" (`relatedCases`).
- **Films por capacidad** (9 films de 21,5 a 26 s, ES/EN, 16:9 y 4:5):
  - Escenas: la familia con su órbita y sus herramientas, el montaje de sus casos (cuadro protagonista de cada film insignia con su frase) y la firma.
  - Composición: `compositions/CapabilityFilm.tsx`.
  - Datos: `data/films/capabilityFilms.ts`.
  - Geometría y test: `capabilityFilmLayout.ts`.
  - En el sitio: `premium/estudio/CapabilityFilmPanel.tsx`, al lado de la órbita.
  - Export: `npx tsx scripts/render-films.ts --capabilities`.
- **Honestidad:**
  - Las demos con cifras quedan rotuladas como ejemplo (bandeja omnicanal, estudio de tokens).
  - La telemetría de `/sistemas` distingue objetivos de mediciones.
  - Los capítulos de films que decían "Métricas" o "Impacto" ahora dicen "Lo construido".
- **Impeccable** (skill de diseño): instalada y aplicada. Informe, puntaje antes/después y propuestas grandes pendientes en `docs/IMPECCABLE-AUDITORIA.md`. El arreglo principal: `/casos-de-exito` medía 1560 px de ancho en el teléfono, también en producción.

## 5. Sistema de contenido para redes (2026-10-08)

- **`contenido/` en la raíz:** la fuente de las redes.
  - Tiene marca, voz, reglas, ramas, calendario, piezas, manuales de agentes (publicador, imágenes, Gemini), encargos y métricas.
  - Decisiones de Mario: publicar solo lo aprobado, en LinkedIn, Instagram, TikTok, Shorts y X, en español, a diario.
- **Kit de animación para redes:**
  - `src/components/social/`, `src/data/social/` (layout, ritmo, render y validador, con tests) y `src/remotion/socialRoot.tsx`.
  - Plantillas: `reel-texto`, `reel-caso`, `carrusel` (también en video), `desafio` e `imagen` (tarjeta, encuesta, sorteo).
  - Estética: blanco y negro, Familjen Grotesk y Space Mono, "lento con pulso".
- **Scripts:**
  - `render-social.ts`, `check-pieza.ts` y `contenido.ts` (estados, aprobación, lista del día, revisión).
  - `scripts/lib/remotionBundle.ts`, compartido con `render-films.ts`.
- **Primeras 2 semanas producidas** (12 al 25 de octubre, 14 piezas). Las semanas 3 y 4 quedan encargadas a Gemini (`contenido/encargos/`).
- **`web/vercel.json`:** un commit que no toca `web/` no redespliega el sitio (compara contra el último despliegue).

## 6. Decisiones de Mario (2026-10-07)

- **Casos de archivo:** film insignia completo (70–80 s) para cada uno.
- **LNB y Hub Profesional AI:** film con lo que hay hoy en vivo, corrigiendo el caso.
- **Mejoras a encarar:** films en el home, films compartibles con SEO por caso y limpieza técnica.
- **Mr. Studio:** la versión azul (la que está en producción).
