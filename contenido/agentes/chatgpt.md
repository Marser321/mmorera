# Agente de ChatGPT (navegador, en la Mac mini)

Trabajás en el ChatGPT de Mario, desde el navegador de la Mac mini, con la carpeta `/Users/mariomorera/proyectos/mmorera`. Por cada pieza hacés dos cosas, **en este orden**:

1. **ARTE (versión A):** imágenes **sin ninguna letra**, una por slot, con la franja vacía donde el código pone el texto.
2. **ENTERA (versión B):** las diapositivas completas, con el texto exacto.

Mario ve las dos versiones y elige. Si solo llegás a la A, ya hay pieza para publicar.

Antes de empezar, leé `../marca/identidad.md`, `../marca/imagenes-chatgpt.md` y `../marca/chatgpt-diseno.md`.

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
3. Pegá el **Sistema de arte**, una sola vez.
4. Por cada slot, pegá su pedido. Esperá la imagen.
5. Pasá el **control de calidad** del bloque ARTE. Lo más importante: **ninguna letra** (ni ilegible) y la **franja de abajo vacía**.
6. Si falla, escribí en la misma conversación: `Regenerá corrigiendo: <problema concreto>`. Hasta 5 intentos por imagen.
7. Descargá la aprobada y pasala a la pieza:
   ```bash
   npx tsx scripts/contenido.ts arte <id> <slot> <archivo descargado>
   ```
   Sin archivo, toma la imagen más nueva de Descargas. La recorta al formato y la guarda como `imagenes/<slot>.png`.

Si la pieza no pide arte, el bloque lo dice: pasá a ENTERA.

## 2 · ENTERA (versión B)

**Por cada salida** del bloque ENTERA (un carrusel, una tarjeta, una encuesta…):

1. **Conversación nueva**: una por salida, así el estilo queda parejo dentro de la serie.
2. **Adjuntá las referencias** de `contenido/marca/referencias/`, con la misma frase.
3. Pegá el **Sistema de diseño**, una sola vez.
4. Pegá el pedido de la **diapositiva 1**. Esperá la imagen.
5. Pasá el **control de calidad** del bloque ENTERA. El texto tiene que ser **exactamente** el pedido: revisalo letra por letra (tildes, ¿ ¡, comas y puntos). En el cierre, el rincón de arriba a la izquierda vacío y **ningún logo dibujado**.
6. Si falla: `Regenerá la diapositiva N corrigiendo: <problema concreto, por ejemplo "dice 'barbero' y tiene que decir 'barbería'">`. Hasta 5 intentos por diapositiva.
7. Descargá la aprobada y seguí con la 2, la 3… **en orden**.
8. Al terminar la salida, importá las descargas:
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
