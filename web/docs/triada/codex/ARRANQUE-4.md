# Arranque de Codex · sesión 4 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

T21, T23, T04, T30 y T29 están integradas en `triada/web`. Excelente trabajo: el home bajó de 14.743 a unos 8.200 px.

**Lo que resolví al integrar:**
- los textos `TODO(Claude)`: el aviso de «sitio externo» y el de correo seleccionado;
- en el menú, «Sobre mí · CV» quedó como un solo ítem, como dice el brief. Mi arranque anterior fue ambiguo.

Siguen 4 tarjetas, en este orden. Todas salen de la punta de `triada/web`, cada una en su worktree, salvo que se indique otra cosa. **No sincronices el tablero en mi worktree.**

## 1. T35 · e2e del recorrido nuevo

`e2e/site.spec.ts` todavía espera contratos que ya no existen. La corrida completa contra el build integrado dio los fallos de la lista de abajo.

Corrida del 1/11 contra `next start`: **39 en verde y 12 fallos**. Todos los fallos son contratos retirados a propósito; no apareció ningún fallo de la app:

| Línea | Test | Qué cambió |
|---|---|---|
| 28 | navega por la cabecera y conserva un único canvas | El menú es «Servicios ▾ · Casos · Sobre mí · CV» (T23) |
| 59 | mantiene una navegación compacta y oculta redes no verificadas | Ídem |
| 74 | ofrece un único menú móvil con rutas, idioma, tema y CTA | El menú móvil trae las 4 entradas de servicios |
| 225, 252, 262, 314 | película personal (control, póster, móvil y scroll) | La película del perfil ya no se monta (T21) |
| 353 | mantiene la composición sin desborde en tablet y pantalla ancha | Revisar qué mide: el retrato y el perfil ya no existen |
| 553 | el perfil abre con la entrada del monograma | «Cómo trabajo» lleva el monograma quieto (T21) |
| 609 | ofrece fallback estático con touch y reduced motion | Revisar contra el home nuevo |
| 642 | presenta movimiento reducido en escritorio sin superponer el manifiesto | El manifiesto se retiró |
| 731 | cruza el fondo abstracto con el tema y mantiene Perfil oscuro | `#perfil` es ahora «Cómo trabajo» |

**Para cada fallo:**
- si prueba algo que se retiró a propósito (manifiesto, entrada del monograma, método, órbita, riel en el home, rail de modos, menú «Trabajo / Sistemas / Estudio» o brief visible de entrada), **reemplázalo por la prueba del contrato nuevo**: «Cómo trabajo», «Pruébalo tú», el menú «Servicios ▾» y el brief plegado detrás de su disclosure;
- si falla por un problema real de la app, arréglalo y explícalo;
- no cambies textos.

**Listo cuando:** la suite completa da verde contra `next start`, sin `test.skip` nuevos ni tests de envío de formularios a servicios reales.

## 2. Limpieza de lo retirado

Quedaron sin importadores y se pueden borrar:
- `premium/AuthorManifestoScene.tsx`;
- `films/LogoOvertureSection.tsx`. **No borres** la composición `films/compositions/LogoOverture.tsx` ni sus datos: los usan los films;
- `premium/home/WorkflowSection.tsx`;
- `premium/ProjectIndex.tsx`.

Antes de borrar, confirma con `grep` que no hay otros usos, incluidos los e2e de T35. **`OrchestrationWheelSection.tsx` se conserva** para T06. Yo borro `WORKFLOW_STAGES` de `solutionsData.ts` en cuanto entregues.

**Listo cuando:** lint, tests y build están en verde y el bundle del home no incluye esos módulos. Anota el antes y el después del tamaño del chunk de la página, si lo tienes a mano.

## 3. T26 · Plantilla de página de servicio

- **`src/components/service/ServicePage.tsx` y su test.** La secuencia es la del brief `briefs/T27-servicios.md`:
  1. héroe: eyebrow, H1, bajada y CTA;
  2. para quién y para quién no;
  3. línea de herramientas;
  4. «Cómo funciona»: un slot para un componente, como un film o un momento interactivo;
  5. prueba: casos con «Pruébalo», reutilizando el marcado de `TryItCards` o extrayendo un `TryItButtons` compartido que también use `CaseStudy`;
  6. cómo se contrata: 3 pasos y una línea de precio;
  7. cierre con CTA.
- **Cada sección se omite si no tiene datos.**
- **Los datos** van en `src/data/servicePages.ts`. Ese archivo es mío: crea la **interfaz** en `src/types/` y deja los datos como `TODO(Claude)` en un ejemplo de test. Yo cargo los textos de T27.
- **Listo cuando:** la plantilla se puede renderizar con datos de prueba, tiene la jerarquía de títulos correcta (un solo H1) y se ve bien en ES y EN a 390 px.

## 4. T27 · `/sistemas` y `/estudio` con la plantilla

Sale de la rama de T26. Brief con los textos exactos: **`web/docs/triada/briefs/T27-servicios.md`**. Yo cargo los textos en `src/data/servicePages.ts` y el SEO en `paginas.ts` cuando avises que T26 está lista. Si te adelantas, usa `TODO(Claude)`.

- **`/sistemas`:**
  - se quedan el film de apertura (acortado a 2.500 px o menos) y los casos de uso;
  - dejan de montarse la telemetría y la bandeja omnicanal.
- **`/estudio`:**
  - «Cómo funciona» muestra films de casos de web;
  - dejan de montarse la órbita, el estudio de *design tokens* y el bloque de «una sola intención».
  - **No borres** el estudio de tokens: va al Lab (T11).
- **Listo cuando:** cada página dice en su primera pantalla qué se contrata y para quién, y se ve en ES y EN a 390 y 1440 px, con teclado y movimiento reducido.

## Al terminar cada tarjeta

- Desde `web/`: `npm run lint` (0 avisos), `npm test` (hoy 1136/1136), `npm run build` y los e2e que toquen lo que cambiaste.
- Commit en `triada/codex/<ID>`, nota en `web/docs/triada/entregas/<ID>.md` y estado `para revisar` en el tablero (solo el de tus tarjetas).

**Marca:** tokens de `globals.css`, sin colores nuevos. Ante la duda, menos efecto y mejor terminado.
