# Auditoría de diseño con Impeccable (2026-10-08)

Pasada de pulido sobre el sitio tal como está: sin rediseño, solo puntos flojos. Se usó la skill **Impeccable** (`pbakaus/impeccable` v4.5.0, Apache 2.0) con sus guías `audit` y `polish`.

## Cómo quedó instalada

- **Ubicación:** `.claude/skills/impeccable/`, instalada con `npx skills add pbakaus/impeccable --skill impeccable --agent claude-code`.
- **Registro:** `skills-lock.json`. La carpeta `.claude/` no está en git.
- **Qué se usa:** las guías en Markdown (`SKILL.md` y `reference/*.md`). Se invoca con `/impeccable audit`, `/impeccable polish`, `/impeccable critique`, etc.
- **Qué no se activó:**
  - **El "motor"** (`scripts/impeccable`): la primera vez baja un binario de GitHub Releases a `~/.impeccable/`, fuera del proyecto, y lo ejecuta. El instalador marcó la skill como riesgo medio por eso.
  - **Los hooks** que el repo trae en su propio `.claude/settings.json`, que corren ese binario en cada edición. No se instalaron.
  - Sin el motor, la skill sigue el camino previsto para ese caso: lee el contexto del proyecto directamente.
  - **Si Mario quiere el detector automático:** puede correr `.claude/skills/impeccable/scripts/impeccable.cmd engine-probe` en su terminal (baja y verifica el binario) y después `/impeccable hooks on`.
- **No hay `PRODUCT.md` ni `DESIGN.md`:** la referencia fue el sistema actual (tokens de `globals.css`, componentes compartidos). `/impeccable init` y `/impeccable document` los generan si se quieren.

## Método

1. Las cinco dimensiones de `audit`: accesibilidad, rendimiento, temas, responsive e integridad.
2. Un escaneo en navegador (Playwright) de seis páginas, en escritorio (1440×900) y teléfono (390×844), antes y después de los cambios:
   - home, `/casos-de-exito`, un caso (Fénix), `/sistemas`, `/estudio` y `/aplicar`;
   - mide contraste real (color, opacidad y fondo), textos menores a 11 px, áreas táctiles, orden de encabezados, imágenes sin `alt`, desborde horizontal y errores de consola.
3. Revisión visual de capturas y del código de los componentes señalados.

## Puntaje

| # | Dimensión | Antes | Después | Hallazgo principal |
|---|---|---|---|---|
| 1 | Accesibilidad | 2 | 3 | Rótulos en mono de 9 px al 30–40 % de opacidad (contraste de 2,4 a 3,4:1) en todo el sitio |
| 2 | Rendimiento | 3 | 3 | Films y videos con montaje diferido; sin hallazgos nuevos |
| 3 | Temas | 3 | 3 | Tokens y modo claro consistentes; quedan colores fijos `#F3F0E8` con su variante `light:` |
| 4 | Responsive | 1 | 3 | `/casos-de-exito` se veía alejada en el teléfono (la página medía 1560 px de ancho) |
| 5 | Integridad | 2 | 3 | Demos con cifras sin rotular (18 s, 40 %, 0 %, "99 PageSpeed", "12.4x") |
| **Total** | | **11/20** | **15/20** | De "aceptable" a "bueno" |

## Corregido

| Severidad | Qué | Dónde | Por qué importa |
|---|---|---|---|
| **P0** | `/casos-de-exito` medía 1560 px en el teléfono, en producción también. Los textos `sr-only` (posición absoluta) de los chips del índice se ubicaban contra un contenedor de afuera de la tira desplazable y no quedaban recortados. | `WorkExperience.tsx`: la tira es `relative` | El navegador del teléfono alejaba toda la página para que entrara: texto diminuto y desplazamiento lateral. |
| **P1** | Rótulos de 8 y 9 px con opacidad del 28 al 45 %. Ahora son de 9 y 10 px al 55 %, en 32 archivos. Se mantiene la jerarquía: el texto principal sigue más fuerte. | Capítulos de films, telemetría, órbita, reel, pie, inbox, etc. | WCAG AA pide 4,5:1 para texto chico; estaban en 2,4–3,4:1. |
| **P1** | Etiquetas del brief (Nombre, Email, pasos) en `zinc-500` (3,9:1). Ahora `zinc-400`. | `AplicarOS.tsx` | Son las etiquetas del formulario que cierra la venta. |
| **P1** | Cifras de demo presentadas como hechos | `OmnichannelInboxSimulator`, `omnichannelInboxData`, `InteractiveDesignTokenStudio`, telemetría de `/sistemas` | Regla del sitio: nada de %, ROI ni métricas que no sean verificables. |
| **P2** | Saltos de encabezado (h1→h3, h2→h4) | `WorkReel` (h2 oculto), inbox (h3), tarjeta de muestra de tokens (deja de ser encabezado) | Lectores de pantalla navegan por encabezados. |
| **P2** | Enlaces "Visto en" de 20 px de alto. Ahora miden 40 px. | `ServicesSection`, `UseCaseFilmRoom` | Área táctil mínima en el teléfono. |
| **P3** | Imágenes de las placas de los films sin `alt` | `CinematicPlate`: `alt=""` (decorativas) | Lectores de pantalla. |
| **P3** | Imports sin uso | `OmnichannelInboxSimulator`, `InteractiveDesignTokenStudio` | Limpieza. |
| **P3** | Texto secundario de la barra (idioma y tema) al 48 %. Ahora al 60 %. | `navbar.tsx`, `/aplicar` | Contraste. |

**Detalle de las demos rotuladas:**
- **Bandeja omnicanal:**
  - Pastilla "Datos de ejemplo" junto al rótulo.
  - Titular "Todos tus canales en un solo lugar.", sin "Respuesta en 18s con IA".
  - "LIVE SYNC" y "CRM LIVE" pasan a "Simulación" y "Ejemplo".
  - La intención se muestra como "Intención · ejemplo" sobre 100.
  - Fuera de los mensajes de muestra: "evita perder un 40 %" y "reduce caídas al 0 % y sub-100 ms".
  - Los textos que estaban solo en español ahora tienen su versión en inglés.
- **Estudio de tokens:**
  - El lienzo dice "Vista de ejemplo · componente en vivo" y la pastilla "Ejemplo".
  - "28ms" y "12.4x" se reemplazan por los valores reales del token elegido (radio y desenfoque).
- **Telemetría de `/sistemas`:** "24/7" pasa a "Diseñado para operar sin pausa" y "<5 min" a "Objetivo de primera respuesta". Son objetivos de diseño, no resultados medidos.
- **Capítulos de films** que decían "Métricas", "Impacto" o "Métricas técnicas" (Hub, LNB, Punta, Rangel, AutoHub, EvoWrap): ahora dicen "Lo construido". Esos muros muestran estructura del sitio, no resultados del negocio.

## Escaneo antes / después

| Página | Ancho en teléfono | Contraste bajo (escritorio) | Contraste bajo (teléfono) | Saltos de encabezado |
|---|---|---|---|---|
| Home | 390 → 390 | 53 → 41* | 13 → 5 | 0 → 0 |
| `/casos-de-exito` | **1560 → 390** | 75 → 65* | 38 → 7 | 1 → 0 |
| Caso (Fénix) | 390 → 390 | 9 → 1 | 9 → 1 | 0 → 0 |
| `/sistemas` | 390 → 390 | 31 → 5 | 31 → 5 | 1 → 0 |
| `/estudio` | 390 → 390 | 19 → 6 | 10 → 0 | 1 → 0 |
| `/aplicar` | 390 → 390 | 10 → 8 | 10 → 8 | 0 → 0 |

\* Lo que queda en la home y en el trabajo de escritorio son los paneles **inactivos** del reel y del carrusel de servicios. Están atenuados a propósito hasta que se activan y el escaneo los mide a mitad de estado. En `/aplicar`, el resto es el botón "Atrás" deshabilitado en el paso 1, que WCAG exime.

## Pendiente (propuestas grandes, para que decida Mario)

Impeccable marca como "defaults de categoría" varias decisiones que son parte del lenguaje actual del sitio. Cambiarlas sería rediseño, así que no se tocaron:

1. **Rótulos sobre los títulos** (el mono en mayúsculas encima de cada h1/h2). Impeccable los prohíbe: "el título carga su propio peso". En el sitio son la firma visual. Opción intermedia: dejarlos solo donde aportan dato (estado, cantidad, fuente).
2. **Numeración de secciones** ("01 · Capacidades", "02 · Casos de uso"). Aporta cuando la secuencia importa (el film, el brief); en las secciones del home, no.
3. **Mono como "disfraz técnico".** Está en etiquetas que no son código ni datos. Pasarlas a la sans del cuerpo en versalitas bajaría el ruido.
4. **Tamaño mínimo de 10 px.** Ya es legible y pasa contraste. Subir a 11–12 px en el teléfono cambiaría el ritmo de varias tarjetas.
5. **Resúmenes de AutoHub y EvoWrap en el archivo:** siguen siendo genéricos frente a lo que cuentan sus films.
6. **`triggeredAction`** en la bandeja omnicanal: estado que se escribe y nunca se lee. Se puede quitar al tocar esa demo.

Próximos comandos sugeridos: `/impeccable critique /` (revisión de UX de la home) y `/impeccable typeset` (si se decide el punto 3).
