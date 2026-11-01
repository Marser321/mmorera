# Tríada Claude · Gemini · Codex para mmorera.agency

Protocolo de trabajo entre tres agentes para llevar la web al siguiente nivel sin que se pisen. Lo que hay que hacer está en [`TABLERO.md`](TABLERO.md); el porqué, en [`../MEJORAS-DESDE-EL-MERCADO.md`](../MEJORAS-DESDE-EL-MERCADO.md).

**Regla de oro:** un push a `main` es producción. **Solo Claude integra en `main`, y solo con el OK de Mario para esa entrega.**

## Quién hace qué

| Agente | Dónde corre | Para qué es mejor | Qué entrega | Qué NO toca |
|---|---|---|---|---|
| **Claude (Opus)** | Claude Code, en este repo | Dirección, arquitectura, copy (ES neutro con tuteo y EN), revisión de código, integración | Briefs de tarea, textos exactos, datos (`src/data`, `src/config/site.ts`), revisión, merge, deploy con OK | — (es el dueño de los archivos compartidos) |
| **Codex** | Codex, en su rama | Implementar tareas de código bien especificadas: componentes, páginas, tests, refactors, deuda técnica | Una rama `triada/codex/<ID>` con el código, tests verdes y una nota de entrega | `main`; textos que no estén en el brief; `site.ts`; los datos de casos; los archivos de Gemini |
| **Gemini** | Antigravity, sobre esta carpeta | Investigar, verificar, generar assets e imágenes, criticar con otra mirada | Kits de verificación, assets en carpetas propias, auditorías y críticas por escrito | Código de la app (`src/`), `main`, el estado de las tareas de otros |
| **Subagentes Sonnet** | Lanzados por Claude | Manejar el navegador: QA de la preview, capturas, recorridos | Informes de QA | Nada del repo salvo su informe |
| **Mario** | — | Decidir y aprobar | Las decisiones `D*` del tablero y el OK de cada deploy | — |

Codex entra cuando tiene créditos. Si una tarea de Codex se traba por eso, Claude puede tomarla y lo anota en el tablero.

## Cómo viaja una tarea

```
1. Claude escribe la tarjeta en TABLERO.md: ID, dueño, rama, archivos permitidos, textos exactos, criterio de "listo".
2. El dueño la toma: cambia el estado a «en curso» y trabaja SOLO en los archivos permitidos.
3. Al terminar, deja entregas/<ID>.md: qué hizo, cómo se prueba, qué quedó dudoso. Estado → «para revisar».
4. Claude revisa: diff, `npm run lint`, `npm test`, build y preview. Un subagente recorre la preview en escritorio y a 390 px.
   - Si falta algo: devuelve con una lista concreta (estado → «devuelta»).
   - Si está bien: integra en la rama de la tríada (estado → «integrada»).
5. Mario mira la preview y da el OK → Claude publica en main (estado → «publicada»).
```

**El crítico cruzado (opcional, para lo visible):** cuando una tarea cambia textos o diseño, Gemini lee la preview **sin ver el brief** y marca lo genérico, lo confuso o lo que no suena a Mario (mismo criterio que el loop de contenido, `contenido/agentes/loop-gemini.md`). Claude integra o descarta cada punto con una línea de razón.

## Ramas

- **Integración:** `triada/web`, que sale de `main`. Las ramas de tarea salen de `triada/web` y vuelven ahí.
- **Tareas:** `triada/codex/<ID>`, `triada/gemini/<ID>` y `triada/claude/<ID>`.
- El checkout local puede estar en otra rama (por ejemplo `contenido/codex-tandas`, que tiene trabajo sin commitear). **Nadie hace `checkout` de otra rama sobre ese trabajo.** Para una rama de tarea, usar un `git worktree` aparte (`git worktree add ../mmorera-<ID> -b triada/codex/<ID> triada/web`).
- Nada se commitea en `main` directo. Sin `--force` en ramas compartidas.

## Archivos: quién es dueño

| Zona | Dueño | Los demás |
|---|---|---|
| `src/config/site.ts`, `src/data/**` (casos, servicios, textos) | Claude | Leen. Si necesitan un cambio, lo piden en su nota de entrega |
| `src/components/**`, `src/app/**`, `e2e/**`, `src/**/*.test.ts` | El dueño de la tarjeta, solo en los archivos que esta permite | — |
| `docs/films/kits/**`, `docs/triada/gemini/**`, `public/portfolio/**` (assets nuevos) | Gemini | Claude revisa y usa |
| `docs/triada/TABLERO.md` | Claude escribe las tarjetas; cada dueño solo cambia el **estado** de las suyas | — |
| `docs/triada/entregas/**` | Cada uno escribe la suya | — |

Si una tarea necesita tocar un archivo fuera de su lista, el dueño **no lo toca**: lo anota en la entrega y Claude decide.

## Reglas que valen para los tres

- **Honestidad:** nada de cifras, resultados, testimonios ni capacidades sin fuente. Lo que es demo se rotula «Demo» o «Ejemplo». Rige lo de `docs/films/HANDOFF.md` y `contenido/marca/reglas.md`.
- **Voz:** español neutro con tuteo (sin voseo) e inglés claro. Los textos visibles salen del brief de Claude; quien implementa no los reescribe.
- **Marca «pared»:** negro mate `#0B0B0A`, marfil `#ECE7DD` y una sola señal `#71F3A2`. Tokens en `src/app/globals.css`.
- **Calidad mínima de cada entrega:** sin errores de lint nuevos, tests verdes, ES y EN, teléfono a 390 px sin desborde, teclado y `prefers-reduced-motion` respetados (`hooks/useReducedMotionSafe.ts`).
- **Rendimiento:** OneDrive y una CPU cargada distorsionan Lighthouse local. Medir intercalado o en la preview, no en caliente.
- **Secretos:** ninguna clave en el repo. `.env.local` no va a git.
