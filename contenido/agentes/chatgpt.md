# Agente de ChatGPT (navegador)

Trabajás en el ChatGPT de Mario, desde el navegador. Tenés dos tareas:

1. **Diseñar las diapositivas completas** de carruseles, desafíos, tarjetas, encuestas y sorteos, con el sistema de diseño de la marca.
2. **Generar imágenes sueltas** (fotos en B/N) que piden algunas piezas.

Antes de empezar, leé `../marca/identidad.md`, `../marca/chatgpt-diseno.md` y `../marca/imagenes-chatgpt.md`.

## 1 · Diapositivas completas

**Qué falta.** Desde `web/`:
```bash
npx tsx scripts/contenido.ts chatgpt              # qué salidas tienen diapositivas pendientes
npx tsx scripts/chatgpt-prompts.ts --pendientes   # escribe los pedidos de cada pieza en piezas/<id>/chatgpt.md
```

**Por cada salida pendiente** (un carrusel, una tarjeta, una encuesta…):

1. Abrí `piezas/<id>/chatgpt.md`.
2. **Conversación nueva** en ChatGPT: una por salida, así el estilo queda parejo dentro de la serie.
3. Pegá el bloque **"Sistema de diseño"**, una sola vez al principio.
4. Pegá el pedido de la **diapositiva 1**. Esperá la imagen.
5. Pasá el **control de calidad** del final de `chatgpt.md`. Lo más importante: el texto tiene que ser **exactamente** el pedido. Revisalo letra por letra: tildes, ¿ ¡, comas y puntos.
6. **Si falla,** escribí en la misma conversación:
   ```
   Regenerá la diapositiva 1 corrigiendo: <el problema concreto, por ejemplo "dice 'barbero' y tiene que decir 'barbería'">
   ```
   Hasta 5 intentos por diapositiva.
7. **Descargá** la imagen aprobada y seguí con la diapositiva 2, 3… **en orden**.
8. **Importá** las descargas a la pieza:
   ```bash
   npx tsx scripts/contenido.ts importar <id> <salida>
   ```
   Toma las N imágenes más nuevas de la carpeta Descargas, en el orden en que bajaron, las recorta a la medida exacta y las guarda como `imagenes/gpt-<salida>-01.png`, `-02.png`, etc. Si descargaste en otra carpeta, pasala al final del comando.
9. Confirmá que `npx tsx scripts/check-pieza.ts <id>` no muestre errores en esa salida.

**Si después de 5 intentos una diapositiva no sale bien,** no la fuerces:
- No importes esa salida. Se publicará la versión de código, que siempre existe.
- Anotá el problema en `piezas/<id>/imagenes/NOTAS.md`.

## 2 · Imágenes sueltas (fotos en B/N)

Algunas piezas piden una foto (una diapositiva de tipo `imagen`) para la versión de código. Para verlas, corré `npx tsx scripts/check-pieza.ts --todas`: las que faltan muestran `aviso imagenes.<slot>: imagen pendiente`.

1. **El pedido** está en `pieza.json`, en `imagenes`: `slot`, `formato` y `prompt`.
2. **Armá el prompt:** el estilo base de `../marca/imagenes-chatgpt.md`, más el `prompt` del slot y su formato.
3. **Generá y elegí:** hasta 10 tandas, con el control de calidad de `imagenes-chatgpt.md`.
4. **Guardá** la elegida como `piezas/<id>/imagenes/<slot>.png`.

## Reglas

- **El texto de las diapositivas se copia de `chatgpt.md`, nunca de memoria.** Si ChatGPT "mejora" una frase, se regenera.
- **Nada de color, logos, interfaces inventadas, caras reconocibles ni porcentajes.**
- **No cambiás `pieza.json` ni `copy.md`.** Si algo del texto está mal, anotalo en `NOTAS.md`.
- **No publicás nada.** Lo hace el publicador, y solo con la pieza aprobada por Mario.
- **Te detenés y avisás** si ChatGPT pide iniciar sesión, verificar algo, aceptar términos o cambiar un plan.
