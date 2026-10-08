# Gemini · producción de piezas y plantillas

Producís contenido para las redes de Mario con un sistema ya armado: plantillas animadas en código (Remotion), un validador y un render. Tu trabajo rinde si seguís el contrato. Puede llevar varias vueltas: está bien iterar hasta que el validador y la revisión visual pasen.

**Antes de nada leé:**
- `../README.md`
- `../marca/identidad.md`
- `../marca/voz.md`
- `../marca/reglas.md`

## Carril 1 · Piezas a partir del calendario (el más común)

Tomás una fila del calendario (`../calendario/AAAA-MM.md`), o un encargo de `../encargos/`, y la convertís en una pieza.

1. **Creá la carpeta** `../piezas/<AAAA-MM-DD>-<slug>/` con:
   - **`pieza.json`:**
     - copiá la plantilla que corresponda de `../plantillas/`;
     - `estado` va en `"borrador"`;
     - `rama`, `fuente`, `serie` según la fila;
     - `"ejemplo": true` si hay datos de muestra;
     - `"postura": true` si es una opinión.
   - **`copy.md`:** una sección por plataforma de las `salidas`:
     - `## LinkedIn`
     - `## Instagram`
     - `## TikTok y Shorts`
     - `## X`

     En la sección de cada encuesta van sus opciones, y "Alt:" donde haga falta.
2. **Escribí desde las fuentes,** nunca de memoria:
   - Casos: `web/docs/films/dossiers/<caso>.md` y `web/src/data/capabilityCases.ts`.
   - Si una cifra no está en una fuente, no va.
3. **Validá hasta que no haya errores:**
   ```bash
   cd web
   npx tsx scripts/check-pieza.ts <id>
   ```
   - Si un texto "no entra", acortalo.
   - Si aparece "honestidad", sacá la cifra o la promesa.
4. **Si la pieza pide imágenes,** escribí el `prompt` de cada slot siguiendo `../marca/imagenes-chatgpt.md`. Las genera el agente del navegador; vos no las inventes.
5. **Renderizá:**
   ```bash
   npx tsx scripts/render-social.ts <id> --stills   # primero los PNG
   npx tsx scripts/render-social.ts <id>            # después todo, con los MP4
   ```
6. **Revisá cada PNG** en `salida/`:
   - nada cortado ni pegado al borde;
   - el énfasis (`*palabra*`) donde corresponde;
   - el ritmo del reel, mirando el MP4 entero.
7. **Si todo está bien:**
   ```bash
   npx tsx scripts/contenido.ts listo <id>
   ```
8. **Reportá en el encargo:** qué piezas quedaron listas, qué avisos quedan y qué dudas tenés.

## Carril 2 · Plantillas nuevas (con revisión de Claude)

Si una idea no entra en las plantillas existentes, proponés una nueva con el mismo contrato que las demás:

1. **Geometría pura** en `web/src/data/social/layout.ts`: una función que devuelve elementos con su caja. Sin React.
2. **Test** en `web/src/data/social/social.test.ts`: el layout en los tres formatos, con textos largos y cortos, sin problemas en `layoutProblems`.
3. **Composición** en `web/src/components/social/`:
   - el movimiento sale de `useCurrentFrame()`;
   - el texto se dibuja con `MaskWords` o `FadeText` sobre los bloques del layout;
   - nunca uses `transition` o `animation` de CSS.
4. **Registro:**
   - el tipo en `web/src/data/social/types.ts`;
   - los trabajos en `render.ts`;
   - la composición en `web/src/remotion/socialRoot.tsx`.
5. **Verificación:**
   ```bash
   npm test
   npx tsc --noEmit
   npx eslint <archivos>
   ```
   Más un render de muestra.

La plantilla queda en una rama de git. **Claude la revisa antes de que se use.**

## Lo que no hacés

- No aprobás piezas ni las publicás.
- No tocás `../marca/` ni las reglas del validador (`web/src/data/social/validate.ts`).
- No tocás código del sitio fuera de `web/src/components/social/`, `web/src/data/social/` y `web/src/remotion/socialRoot.tsx`.
- No commiteás en `main`.
- No subís a git imágenes ni renders: `imagenes/` y `salida/` están ignorados.
