# Arranque de Codex · sesión 7 (1/11/2026)

Pegar en Codex **después** del prompt fijo `web/docs/triada/PROMPT-codex.md`, con el repo MMORERA abierto.

---

Mario vio la preview y pidió un giro. La simplificación le gusta, pero se perdieron piezas de calidad que quería **reorganizar, no quitar**: páginas cortas, pero **más páginas y más ramas**.

**Ya revertí en `triada/web`:**
- **las partículas**, a la versión anterior a T24 (desfilan en reposo y responden a `setActiveFamilies` y al foco);
- **la barra de abajo**, a la versión anterior a T22 (con las secciones del home actual) y `WhatsAppFab` en las páginas internas;
- **`ScrollFilm`**, a su largo completo.

Los datos y textos de las ramas nuevas ya están en `src/data/branchPages.ts` y en `paginas.ts`.

**Brief con todo el detalle:** **`web/docs/triada/briefs/T42-ramas.md`**.

**Orden:**
1. Si estás en medio de **T07 + T32** (`/agentes`), termínala primero.
2. **T42**, «Sobre mí»: recupera de git `AuthorManifestoScene` y `LogoOvertureSection` (`git show 9078194^:…`) y arma la página con el CV abajo.
3. **T43**, `/capacidades` y las 9 páginas por familia: el menú de capacidades que hace responder a las partículas y corre los films.
4. **T44**, `/casos-de-uso` y las 3 páginas.
5. **T11 ampliada**, `/lab`, con el estudio de identidad visual y la bandeja. **Reemplaza** a la T11 del arranque 6.
6. **T45**: el menú con Capacidades y «Casos ▾», las puertas en el home y los e2e.

T14 (el filtro por servicio) queda para después.

**Ramas:** cada tarjeta sale de la punta de `triada/web`. Si dos tarjetas tocan el mismo archivo (el menú o el home), encadénalas como en el arranque 3. **No sincronices el tablero en mi worktree.**

## Al terminar cada tarjeta

- Desde `web/`: `npm run lint` (0 avisos), `npm test`, `npm run build` y la suite e2e completa contra `next start`.
- Prueba ES y EN a 390 y 1440 px, con teclado y con movimiento reducido.
- Commit en `triada/codex/<ID>`, nota en `web/docs/triada/entregas/<ID>.md` y estado `para revisar` en el tablero (solo el de tus tarjetas).
