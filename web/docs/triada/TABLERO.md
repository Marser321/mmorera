# Tablero de la tríada · web mmorera.agency

Protocolo: [`README.md`](README.md). Evidencia del mercado: [`../MEJORAS-DESDE-EL-MERCADO.md`](../MEJORAS-DESDE-EL-MERCADO.md). Brief anterior (27/10): `../../../proposals/campana-laboral-2026-10-27/briefs/brief-web.md`.

**Estados:** `pendiente` · `bloqueada (D#)` · `en curso` · `para revisar` · `devuelta` · `integrada` · `publicada`.
Cada dueño cambia solo el estado de sus tarjetas. Claude escribe y ordena las tarjetas.

## Principio de la web (Mario, 1/11)

> **La web es una muestra viva de lo que puedo construir para el cliente.** No tiene que abrumar: tiene que transmitir, con buen estilo y efectos con intención, lo que haría por él. Cada efecto tiene que servir para entender algo; si solo decora, se baja o se quita. Con más exposición, también tiene que estar en regla: privacidad, términos y cookies.

## Decisiones de Mario (bloquean tareas)

| ID | Decisión | Opciones | Recomendación de Claude | Estado |
|---|---|---|---|---|
| **D1** | **Posicionamiento del héroe.** El brief del 27/10 decía «Desarrollador web»; la dirección del 1/11 es «orquestador de tecnologías y equipos», con fábricas de contenido e instalación de agentes | a) Desarrollador web · b) AI Automation & Operations, orquestador · c) Las dos: título de mercado y frase de orquestador | **c)** Eyebrow «Mario Morera · AI Automation & Operations». Título que diga lo que orquesta: web, automatización, agentes y contenido con IA. Es lo que el mercado busca y conserva tu diferencial | **decidida 1/11: c)** |
| **D2** | ¿Mostrar precios o rangos («desde»)? | Sí · No · Solo en servicios productizados | Solo para la instalación de agentes y el diagnóstico; el resto, a medida | pendiente |
| **D3** | Qué apps de fábrica de contenido se publican y con qué nombre | Depende del código que vas a compartir | — | pendiente (falta el código) |
| **D4** | Acortar el home (hoy unos 14.200 px; el perfil ocupa 4.600) | Recortar el perfil · Fusionar orquestación con método · Ambas | Ambas, después de D1 | pendiente |
| **D5** | Testimonios en video de clientes | Pedir permiso a cada cliente · No usar | Pedir permiso; se rotulan como testimonio, nunca como métrica | pendiente |
| **D7** | **Ley aplicable de los textos legales** y si se puede nombrar el país (hoy un test lo prohíbe en el código público) | Nombrar el país solo en las páginas legales · Usar un texto sin jurisdicción | Nombrarlo solo en las páginas legales, con una excepción en el test para `/privacidad`, `/terminos` y `/cookies`. Que lo revise un abogado | pendiente |
| **D6** | Demo en vivo de un agente (un número o un chat de prueba en la web) | Chat web · WhatsApp de prueba · Número de voz | Chat web primero: es lo más barato y lo que más vende el servicio | pendiente |

## Fase 1 · Que la web diga lo que vendes hoy

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T01** | Héroe y metadata con el posicionamiento de D1, en ES y EN | Claude escribe los textos → **Codex** implementa | Gemini critica la preview | `src/components/premium/HomeExperience.tsx`, `src/config/site.ts` (solo Claude) | La primera pantalla dice qué haces y para quién, en ES y EN, a 390 px y en escritorio. Sin «una sola persona» ni promesas sin fuente. Title, description y OG actualizados | D1 ✓ | **integrada** en `triada/web` (e47d3d7) · [entregas/T01-T05.md](entregas/T01-T05.md) |
| **T02** | Contacto con dos caminos: «Consultar por un puesto» y «Consultar por un proyecto» | **Codex** | Claude escribe los textos | componentes de `#contacto`, `src/app/aplicar/**` si hace falta | Cada camino abre un contacto que funciona. Sin cupos ni «4 a 5 proyectos por trimestre». Probado con teclado | — | **integrada** en `triada/web` (9512a53), hecha por Claude |
| **T03** | Verificar los 3 casos de portada (Fenix, L&B y New Brothers): qué está implementado, qué es demo y qué es concepto | **Gemini** | Claude corrige `projectCases.ts` | `docs/triada/gemini/T03-verificacion.md` y capturas en `docs/triada/gemini/T03/` | Cada capacidad de cada caso tiene su prueba (URL, captura, recorrido) o queda rotulada Demo o Concepto | — | pendiente |
| **T04** | Proyectos: tres tarjetas verificadas primero y después el riel de films | **Codex** | Claude escribe los textos; datos de T03 | componentes de `#proyectos` | La primera vista de proyectos muestra 3 tarjetas con su estado real y «Ver todos los casos» | T03 | bloqueada (T03) |
| **T05** | Sacar los claims sin prueba de servicios (95+ PageSpeed, «<5 minutos», «24/7», «proven live») | Claude reescribe `solutionsData.ts` → **Codex** ajusta los componentes | — | `src/data/solutionsData.ts` (Claude), `ServicesSection.tsx` (Codex) | `grep` sin esas promesas. Cada bloque enlaza a un caso | — | **integrada** junto con T01 |

## Fase 2 · Las páginas que pide el mercado

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T06** | Página **/cv** (ES y EN): rol, 6 años, inglés conversacional, Uruguay remoto, stack y PDF descargable | Claude escribe los textos → **Codex** arma la página | Gemini hace la QA visual | `src/app/cv/**`, `src/app/en/cv/**`, `public/cv/` | Se descarga el PDF en inglés y en español. Enlazada desde el menú o el pie y desde el contacto | D1 ✓ | pendiente |
| **T07** | Página de servicio **«Agentes de IA instalados para tu negocio»**: responde las 5 cosas que piden los clientes (que funcione simple, cuentas a su nombre, demo en vivo, traspaso a una persona, precio claro). OpenClaw y Hermes aparecen como herramientas, no como titular | Claude escribe los textos → **Codex** implementa | **Gemini:** investigación de competencia y visuales del flujo | `src/app/agentes/**`, `src/app/en/agents/**` | Página en ES y EN, con escalera diagnóstico → instalación → mantenimiento, y un espacio para la demo (D6) | D1 ✓, D2, D6 | bloqueada (D2, D6) |
| **T08** | **Fábricas de contenido**: una página por app (qué produce, para quién, demo en video y cómo se contrata) | **Gemini** estudia el código de cada app y arma su kit | Claude escribe los textos; **Codex** arma la plantilla de página | Gemini: `docs/triada/gemini/apps/<app>.md`. Codex: `src/app/fabricas/**` | Una plantilla y la primera app publicada con su demo | D3 + el código que comparte Mario | bloqueada (D3) |
| **T09** | Galería **«Video y contenido con IA»**: de 6 a 9 piezas verticales cortas, con su herramienta y su tiempo | **Gemini** elige y prepara las piezas y los posters | **Codex** hace el componente; Claude, los textos | Gemini: `public/portfolio/video-ia/**`. Codex: el componente nuevo | Se ven en el teléfono, cargan diferido y respetan el movimiento reducido | — | pendiente |
| **T10** | Caso **«Mi oficina de agentes»**: los números reales del 31/10 (27 tareas, 3,7 M tokens, 37 propuestas) y los frenos | **Claude** | Gemini critica | `src/data/` y la página del caso | Caso publicado, sin datos de clientes ni plataformas, con «sin contar al orquestador» | D1 ✓ | pendiente |
| **T11** | **Lab** de 3 o 4 demos de motion enlazables (scroll, hover, texto animado) | **Codex** | Claude elige qué mostrar | `src/app/lab/**` | Cada demo tiene su URL para pegar en propuestas y funciona con movimiento reducido | — | pendiente |

## Fase 3 · Calidad

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T12** | Auditoría de `/en`: cada página y caso tiene su versión en inglés completa | **Gemini** audita | **Codex** corrige rutas; Claude, los textos | Gemini: `docs/triada/gemini/T12-ingles.md` | Lista de faltantes resuelta | — | pendiente |
| **T13** | Deuda técnica: 29 avisos de lint y los 17 e2e de `site.spec.ts` que fallaban desde `b184b16` | **Codex** | — | los archivos señalados por lint y `e2e/site.spec.ts` | 0 avisos y e2e verdes, o cada fallo restante explicado | — | pendiente |
| **T14** | Filtros por rubro en `/casos-de-exito` y «Casos parecidos» al final de cada caso | **Codex** | Claude define los rubros | `WorkExperience.tsx` y la página del caso | Filtros con teclado; la URL guarda el filtro | — | pendiente |
| **T15** | Acortar el home según D4 | **Codex** | Claude decide qué se va | componentes del home | Home cerca de 10.000 px en escritorio | D4 | bloqueada (D4) |
| **T16** | Pasada de **Impeccable** (`/impeccable audit` y `polish`) después de las fases 1 y 2 | **Claude** | Gemini, QA visual | — | Puntaje igual o mejor que el 15/20 del 8/10 | Fases 1 y 2 | pendiente |
| **T17** | **Páginas legales:** privacidad (ampliada), términos y cookies, en ES y EN, más los enlaces en el pie y la línea de aceptación en el formulario | Claude escribe los textos ([briefs/T17-legal.md](briefs/T17-legal.md) y [-en](briefs/T17-legal-en.md)) → **Codex** arma las páginas | Gemini revisa que coincidan con lo que el sitio hace de verdad | `src/app/privacidad/**`, `src/app/terminos/**`, `src/app/cookies/**`, sus pares en `src/app/en/**`, `src/components/sections/footer.tsx`, la línea legal de `AplicarOS.tsx` y `src/app/sitemap.ts` | Las 3 páginas en ES y EN, enlazadas desde el pie de todas las páginas. La política de cookies describe lo que el sitio guarda de verdad. Los marcadores `[JURISDICCIÓN]` quedan como `TODO(Mario)` hasta D7 | D7 (solo para publicar) | pendiente |
| **T18** | **Pulido de «muestra viva»:** efectos con intención y sin abrumar. Movimiento coherente (mismas curvas y duraciones), estados de hover y foco en todos los elementos interactivos, una página 404 con estilo propio, cargas sin saltos, efectos pesados aligerados en el teléfono, y `prefers-reduced-motion` respetado en todo | **Codex** | Claude define qué efectos se quedan; Gemini mira la preview | componentes compartidos de movimiento (`src/components/shared/**`, `src/hooks/**`), `src/app/not-found.tsx` y ajustes puntuales anotados en la entrega. **No toca `HomeExperience.tsx`** mientras Claude trabaje ahí | Un inventario de efectos en la entrega (dónde, qué hace y si se queda, se baja o se va). Sin saltos de diseño al cargar. Rendimiento en el teléfono igual o mejor que antes | — | pendiente |

## Para arrancar ya (sin decisiones pendientes)

- **Gemini:** T03 (verificar casos), T09 (elegir las piezas de video) y T12 (auditoría de inglés).
- **Codex:** T17 (páginas legales), T13 (deuda técnica), T18 (pulido) y T11 (lab). El arranque está en [codex/ARRANQUE-1.md](codex/ARRANQUE-1.md).
- **Claude:** los textos de T02 y T05, y armar la rama `triada/web`.
- **Mario:** D2 y D6 (desbloquean T07), D3 con el código de las apps (T08), D4 (T15) y D5.
- **D1 decidida el 1/11 (opción c):** T01, T06 y T10 quedan libres.
