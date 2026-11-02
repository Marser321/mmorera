# Arranque de Codex · sesión 5 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

T27, T37 y T39 están integradas en `triada/web`. Gracias por la lista exacta de pendientes; ya resolví mi parte:
- **«Qué incluye»** en las páginas de servicio: un campo `deliverables` en `ServicePageContent`, su bloque en `ServicePage` (entre «Para quién es» y las herramientas) y los datos de Webs y CRM. Salen de `SERVICE_SOLUTIONS`, que sigue siendo la única fuente;
- **la foto** reemplaza al monograma en `#perfil` (D13);
- **el CV y el SEO de `/cv`** ya están (D14).

Siguen 2 tarjetas, desde la punta de `triada/web`, cada una en su worktree. **No sincronices el tablero en mi worktree.**

## 1. T40 · e2e de las páginas de servicio y la foto

`e2e/site.spec.ts` tiene 6 tests que esperan contratos retirados:

| Línea (aprox.) | Qué espera | Contrato nuevo |
|---|---|---|
| 28 | H1 «Conecto lo que hoy trabaja separado» en `/sistemas` | «Que ninguna consulta quede sin seguimiento.» / «So no enquiry goes without follow-up.» |
| 444 | Órbita y film por capacidad en `/estudio` | El selector de films de casos (3 tabs) |
| 602, 649 y 689 | Fondo telar-pulso del cierre de `/estudio` | El cierre nuevo (banda marfil con CTA). Las partes de `/aplicar` se quedan |
| fallback estático | `.monograma-fundido` en `#perfil` | La foto: `#perfil img` con `alt` en ES y EN, sin animación |

**Listo cuando:** la suite completa da verde contra `next start`, sin `skip` nuevos ni envíos a servicios reales.

## 2. T06 · Página `/cv`

Brief con los textos exactos: **`web/docs/triada/briefs/T06-cv.md`**.

- **Ya están:**
  - los PDF `public/cv/mario-morera-cv-es.pdf` y `-en.pdf`;
  - `pageMetadata("cv", …)`.
- **Hay que hacer:**
  - las páginas `src/app/cv/page.tsx` y `src/app/en/cv/page.tsx`, y sumarlas al sitemap;
  - conectar el `cvLink` del héroe (`CV_DESTINATION`), el ítem «Sobre mí · CV» del menú y «Ver CV» en el contacto.
- **«Con qué trabajo»:** reutiliza `OrchestrationWheelSection` en versión simple, o una lista con los datos de `skillOrbit`. Elige lo más liviano y explícalo.
- **Listo cuando:** `/cv` y `/en/cv` se ven a 390 y 1440 px, con teclado y movimiento reducido; los PDF abren; y el texto no nombra el país (lo controla `publicContent`).

## Al terminar cada tarjeta

- Desde `web/`: `npm run lint` (0 avisos), `npm test` (hoy 1141/1141), `npm run build` y los e2e que toquen lo que cambiaste.
- Commit en `triada/codex/<ID>`, nota en `web/docs/triada/entregas/<ID>.md` y estado `para revisar` en el tablero (solo el de tus tarjetas).
