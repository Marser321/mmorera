# Agente de ChatGPT (navegador, en la Mac mini)

Trabajás en el ChatGPT de Mario, desde el navegador de la Mac mini, con la carpeta `/Users/mariomorera/proyectos/mmorera`. Por cada pieza hacés dos cosas, **en este orden**:

1. **ARTE (versión A):** imágenes **sin ninguna letra**, una por slot, con la franja vacía donde el código pone el texto.
2. **ENTERA (versión B):** las diapositivas completas, con el texto exacto.

Mario ve las dos versiones y elige. Si solo llegás a la A, ya hay pieza para publicar.

> **Hoy este agente está en pausa** (D-016, términos de OpenAI): el arte sale por defecto con Codex (`~/bin/imagen`), que lo maneja el guionista con los mismos pedidos (`chatgpt.md` y `pedidos.json`). Cada pedido es **autocontenido** (trae el sistema de la marca), así sirve para las dos herramientas.

Antes de empezar, leé `../marca/identidad.md`, `../marca/imagenes-chatgpt.md` y `../marca/chatgpt-diseno.md`.

## Modo asistido (el que se usa hoy)

Decisión de Mario del 26/11: el arte y las diapositivas salen de **ChatGPT en el navegador**, que rinde más y no gasta el cupo de Codex. Para no romper los términos de OpenAI, **lo maneja Mario, no un agente**:

1. **Chat nuevo dentro del proyecto «mmorera · piezas»** de ChatGPT (`../marca/chatgpt-proyecto.md`): ya trae las instrucciones de la marca y las referencias, así que no hace falta pegar el sistema. Fuera del proyecto, el primer mensaje es `sistema_arte` o `sistema_entera` de `piezas/<id>/pedidos.json`, con las referencias adjuntas.
2. **Uno por imagen, en orden:** el `pedido` corto. Todos entran en un mensaje de Telegram.
3. **Mario devuelve la imagen a la Mac**, que la guarda con:
   - `contenido.ts arte <id> <slot> <archivo>` (versión A);
   - `contenido.ts importar` o `firmar` (versión B).
4. **Codex** (`~/bin/imagen`) queda de respaldo, con el `prompt` autocontenido.

El agente de abajo (automático) queda apagado.

## Preparar los pedidos

Desde `/Users/mariomorera/proyectos/mmorera/web`:

```bash
npx tsx scripts/chatgpt-prompts.ts <id>            # una pieza (la que te pasaron)
npx tsx scripts/chatgpt-prompts.ts --pendientes    # o todas las que tienen algo pendiente
```

Escribe `contenido/piezas/<id>/chatgpt.md` con los dos bloques, ARTE y ENTERA. Todo lo que pegás en ChatGPT sale de ahí.

## 1 · ARTE (versión A)

1. **Conversación nueva** en ChatGPT.
2. **Adjuntá las referencias** de `contenido/marca/referencias/` (todas las imágenes) y escribí: «Estas son piezas aprobadas de la marca: copiá su clima, su materia y su tipografía, no su texto».
3. Por cada slot, pegá su pedido **entero** (ya trae el sistema de arte). Esperá la imagen.
4. Pasá el **control de calidad** del bloque ARTE. Lo más importante: **ninguna letra** (ni ilegible) y la **franja de abajo vacía**.
5. Si falla, escribí en la misma conversación: `Regenerá corrigiendo: <problema concreto>`. Hasta 5 intentos por imagen.
6. Descargá la aprobada y pasala a la pieza:
   ```bash
   npx tsx scripts/contenido.ts arte <id> <slot> <archivo descargado>
   ```
   Sin archivo, toma la imagen más nueva de Descargas. La recorta al formato y la guarda como `imagenes/<slot>.png`.

Si la pieza no pide arte, el bloque lo dice: pasá a ENTERA.

## 2 · ENTERA (versión B)

**Por cada salida** del bloque ENTERA (un carrusel, una tarjeta, una encuesta…):

1. **Conversación nueva**: una por salida, así el estilo queda parejo dentro de la serie.
2. **Adjuntá las referencias** de `contenido/marca/referencias/`, con la misma frase.
3. Pegá el pedido **entero** de la **diapositiva 1** (ya trae el sistema de diseño). Esperá la imagen.
4. Pasá el **control de calidad** del bloque ENTERA. El texto tiene que ser **exactamente** el pedido: revisalo letra por letra (tildes, ¿ ¡, comas y puntos). En el cierre, el rincón de arriba a la izquierda vacío y **ningún logo dibujado**.
5. Si falla: `Regenerá la diapositiva N corrigiendo: <problema concreto, por ejemplo "dice 'barbero' y tiene que decir 'barbería'">`. Hasta 5 intentos por diapositiva.
6. Descargá la aprobada y seguí con la 2, la 3… **en orden**.
7. Al terminar la salida, importá las descargas:
   ```bash
   npx tsx scripts/contenido.ts importar <id> <salida>
   ```
   Toma las N imágenes más nuevas de Descargas, en el orden en que bajaron, las recorta a la medida exacta, las guarda como `imagenes/gpt-<salida>-01.png`, `-02.png`… y **pega el monograma** en el cierre.

**Si después de 5 intentos una diapositiva no sale bien,** no la fuerces: no importes esa salida (Mario recibe solo la versión A) y anotá el problema en `piezas/<id>/imagenes/NOTAS.md`.

## Al terminar

```bash
npx tsx scripts/check-pieza.ts <id>
```

No tiene que mostrar errores. Los avisos de «versión de ChatGPT pendiente» de una salida que no salió están bien.

## Reglas

- **El texto de las diapositivas se copia de `chatgpt.md`, nunca de memoria.** Si ChatGPT «mejora» una frase, se regenera.
- **Ningún color de acento, ningún logo (tampoco el de Mario), ninguna interfaz inventada, ninguna cara ni mano, ningún porcentaje.**
- **No cambiás `pieza.json` ni `copy.md`.** Si algo del texto está mal, lo anotás en `NOTAS.md`.
- **No publicás nada.** Lo hace el publicador, en la notebook, y solo lo que Mario aprobó.
- **Una conversación por bloque o salida;** no reutilices conversaciones de otras piezas.

## Te detenés y avisás si…

- ChatGPT pide iniciar sesión, verificar algo (código, captcha), aceptar términos o cambiar de plan.
- ChatGPT dice que llegaste a un límite de imágenes.
- Una descarga no aparece o el comando `arte` / `importar` da error.

No reintentás con otra estrategia ni con otra cuenta: anotás qué pasó en `piezas/<id>/imagenes/NOTAS.md` y terminás.
