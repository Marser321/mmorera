# T25 · Pasada de texto: voseo, calcos y cifras

**Dueño:** Claude escribe este brief y los datos → **Codex** aplica en los componentes.
**Voz:** español neutro con tuteo (sin voseo) e inglés claro. Codex copia los textos tal cual, sin reescribirlos.

## Ya hecho por Claude (en `src/data/**`)

| Archivo | Cambio |
|---|---|
| `data/solutionsData.ts` | 5 frases con voseo en la comparación de CRM pasan a tuteo |
| `data/seo/paginas.ts` | `/aplicar`: título «Cuéntame tu proyecto», descripción con «quieres» y portada «Cuéntame qué quieres construir o automatizar.» / «Tell me what you want to build or automate.» |
| `data/projectCases.ts` | Fenix: el registro de 109 afirmaciones y la base de 1.096 videos se rotulan «herramienta de trabajo; no se ve en el sitio». «40 páginas» **no se cambió**: el film de Fenix valida esa cifra contra `FENIX_FACTS` (dossier). El sitemap verificado en T03 da 22 páginas por idioma; hay que conciliar el dossier, el registro de hechos y el film juntos |

`data/techRadarData.ts` tiene voseo, pero solo lo usa `/radar`, que es una página de desarrollo (`page.dev.tsx`). Queda fuera.

## 1. Voseo en componentes (Codex)

| Archivo:línea | Antes | Después (ES) |
|---|---|---|
| `app/aplicar/page.tsx:23` | Contame qué querés mover. | Cuéntame qué quieres construir o automatizar. |
| `components/premium/CaseStudy.tsx:97` | Verificalo vos mismo | Compruébalo tú mismo |
| `components/premium/CaseStudy.tsx:254` | ¿Querés algo así para tu negocio? | ¿Quieres algo así para tu negocio? |
| `components/premium/CaseStudy.tsx:259` | Contame tu proyecto | Cuéntame tu proyecto |
| `components/premium/WorkExperience.tsx:78` | ¿Qué querés hacer posible? | ¿Qué quieres hacer posible? |
| `components/premium/WorkReel.tsx:342` | Deslizá → | Desliza → |
| `components/premium/WorkReel.tsx:367` | Scrolleá ↓ | Desplázate ↓ |
| `components/premium/UnderTheHood.tsx:19` | …elegí un recorrido o abrí un componente. | …elige un recorrido o abre un componente. |
| `components/premium/ArchitectureExplorerMount.tsx:48` | Abrí un componente para ver… | Abre un componente para ver… |
| `components/films/UseCaseFilmRoom.tsx:201` | Tocá un nodo para inspeccionarlo | Toca un nodo para inspeccionarlo |
| `components/premium/estudio/CapabilitiesOrbit.tsx:41` | …Abrí una para ver qué resuelve… | …Abre una para ver qué resuelve… |
| `components/premium/estudio/CapabilitiesOrbit.tsx:44` | Tocá un nodo para abrirlo · Esc para cerrar | Toca un nodo para abrirlo · Esc para cerrar |
| `components/premium/estudio/CapabilityFilmPanel.tsx:22` | Abrí otra familia en la órbita… | Abre otra familia en la órbita… |
| `components/premium/estudio/InteractiveDesignTokenStudio.tsx:123` | Sintetizá la identidad visual… | Sintetiza la identidad visual… |
| `components/premium/estudio/InteractiveDesignTokenStudio.tsx:128` | Explorá cómo… Exportá la configuración… | Explora cómo… Exporta la configuración… |
| `components/premium/estudio/InteractiveDesignTokenStudio.tsx:446` | ¿Querés esta estética «…» en tu propio sistema? | ¿Quieres esta estética «…» en tu propio sistema? |
| `components/premium/home/OrchestrationWheelSection.tsx:136` y `:194` | Tocá… | Toca… |
| `components/premium/systems/TechRadarBackstageStudio.tsx:906` | O ingresá un tema libre… | O escribe un tema libre… |
| `components/portfolio-isolated/AplicarOS.tsx:118-119` | Ingresá tu nombre. / Ingresá un email válido. | Escribe tu nombre. / Escribe un email válido. |
| `lib/leadValidation.ts:45-50` | Ingresá… / Contame un poco más: usá… / Elegí… | Escribe un nombre de al menos 2 caracteres. / Escribe un email válido. / Cuéntame un poco más: usa al menos 20 caracteres. / Elige el momento actual del proyecto. / Elige cómo está compuesto el equipo. / Elige un momento estimado de inicio. |
| `actions/submit-lead.ts:111` | …Probá nuevamente o escribime por email. | …Prueba de nuevo o escríbeme por email. |
| `components/films/scenes/brand/layout/mediaSamples.ts:56` | Elegí el día / Elegí la hora | Elige el día / Elige la hora |

**Listo cuando:** esta búsqueda, fuera de tests, `remotion/`, `social/`, `translations.ts`, `HeroPortfolio` y páginas `*.dev.tsx`, no encuentra nada:

```
querés|tenés|podés|contame|tocá|abrí|elegí|ingresá|explorá|exportá|sintetizá|scrolleá|deslizá|probá|escribime|vos mismo
```

## 2. Inglés: calcos y fugas de español (de T12)

| Dónde | Antes | Después (EN) |
|---|---|---|
| `app/aplicar/page.tsx` (h1 EN) | Tell me what you want to move. | Tell me what you want to build or automate. |
| `app/aplicar/page.tsx` (bajada EN) | …and reply with judgment. | …and reply with a clear next step. |
| `app/layout.tsx` (vínculo para saltar al contenido) | «Saltar al contenido principal» también en `/en` | En `/en`: «Skip to main content». El layout es uno solo: usa el mismo truco del `themeInitScript` o un componente cliente con `usePathname` |
| `components/premium/SystemsExperience.tsx:57` | `… · CRM / IA / Automatización` fuera del ternario | ES «Sistemas · CRM / IA / Automatización», EN «Systems · CRM / AI / Automation» |
| `components/premium/estudio/InteractiveDesignTokenStudio.tsx` | Corner Curvature · Inquire on WhatsApp | Corner Radius · Chat on WhatsApp |
| `components/premium/systems/TechRadarBackstageStudio.tsx` | Mario Morera Thesis · Send to my WhatsApp · Quote this architecture | Mario's take · Send via WhatsApp · Get an estimate for this setup |
| `components/premium/HomeExperience.tsx` (`copy.en`) | Shall we work together? · Websites & landings · I'll share my CV and availability | Let's work together. · Websites & landing pages · I'll share my resume and availability |

## 3. El `stack` de los casos en dos idiomas

Hoy `stack` es `string[]` y en `/en` se ven 4 etiquetas en español. **Propuesta:** el tipo pasa a `(string | LocalizedText)[]`, y los componentes que lo pintan muestran `typeof item === "string" ? item : item[language]`. Codex cambia el tipo en `src/types/**` y en los componentes que lo pintan; Claude cambia estos valores en `projectCases.ts` cuando el tipo esté listo:

| Caso | ES | EN |
|---|---|---|
| mr-studio-tattoo | Reserva por pasos · Consentimiento digital | Multi-step booking · Digital consent |
| truckers-choice | Cotización por pasos | Multi-step quoting |
| america-tramites | Validación en cliente | Client-side validation |
| doge-sm | Catálogo de tienda | Store catalog |
| new-brothers-barberia | IA | AI |

## 4. Cifras que no ayudan a entender

| Dónde | Hoy | Qué hacer |
|---|---|---|
| `SystemsExperience.tsx`, telemetría | «24/7», «<5 min» y los demás números, que cuentan desde «00» con `TickerNumber` | Quitar los números animados. Quedan los 4 rótulos como texto: «Estados visibles del flujo», «Diseñado para operar sin pausa», «Objetivo de primera respuesta» e «Historia única del prospecto». Sin contador |
| `systems/OmnichannelInboxSimulator.tsx` | Montos («$2800 USD»), «Intención 96 %» y «Oportunidad … estimados», aunque están rotulados como ejemplo | Dejar de mostrar el monto y la intención. El rótulo «Datos de ejemplo» se queda. Los datos en `omnichannelInboxData.ts` se borran en una pasada posterior de Claude |

## Archivos permitidos (Codex)

Los de las tablas 1, 2 y 4, más el tipo de `stack` en `src/types/**` y los componentes que pintan `stack`. Con T22 y T24 en curso, **no tocar** `IslandBar.tsx`, `TechParticleField.tsx` ni la estructura de `HomeExperience.tsx`: en `HomeExperience.tsx`, solo los textos de `copy.en`.

## Listo cuando

- La búsqueda de voseo da vacío (sección 1).
- `/en` no muestra español en el vínculo para saltar al contenido, en el eyebrow de `/sistemas` ni en las etiquetas de `stack`.
- La telemetría de `/sistemas` ya no cuenta números y la demo no muestra montos.
- `npm test`, lint y build en verde, ES y EN a 390 px.
