# Tandas · de un brief a un carrusel listo para revisar

Una tanda son **de 3 a 5 piezas** que se producen juntas: comparten dirección de imagen y un Proyecto de ChatGPT. Cada carpeta de acá es el espejo local de ese Proyecto. Lo que se carga en ChatGPT sale de esta carpeta y lo que ChatGPT devuelve queda anotado acá.

Por qué así: con instrucciones fijas, un brief por pieza y referencias, ChatGPT inventa menos y la serie sale pareja. No es pedir imágenes porque sí.

Ejemplo completo: [`2026-10-28-piloto/`](2026-10-28-piloto/). Ahí está [`comparacion.html`](2026-10-28-piloto/comparacion.html), con las piezas antes y después.

## Quién hace qué

| Paso | Quién | Modelo |
|---|---|---|
| Brief, guion y copy de cada pieza (`marca/guion.md`) | Claude | Opus |
| Instrucciones, brief de tanda y pedidos de imagen | Claude | Opus |
| Crear el Proyecto, generar y descargar | Agente del navegador (`agentes/chatgpt.md`) | Sonnet o menor |
| Elegir placas, convertirlas y componer `diseno.html` | Claude | Opus |
| Aprobar la postura, la oferta y cada pieza | Mario | — |

## Carpeta de una tanda

```
tandas/<AAAA-MM-DD>-<slug>/
  instrucciones.md   se pega en Ajustes del proyecto: rol, dirección de la serie, prohibiciones y formato
  brief-tanda.md     archivo del Proyecto: por pieza, de qué trata, titular (no se dibuja), metáfora, placa, cámara y zona libre
  referencias/       archivos del Proyecto: imágenes de estilo aprobadas y wireframes de render-laminas --guias
  pedidos.md         un pedido por imagen, el enlace de cada chat y el resultado
  comparacion.html   (opcional) antes y después, o la tanda completa para revisar
```

`instrucciones.md` y `brief-tanda.md` siguen las plantillas de [`../marca/imagenes-chatgpt.md`](../marca/imagenes-chatgpt.md).

## Paso a paso

1. **Elegir las piezas.** Pueden ser de 3 a 5 del calendario, o nuevas, con una persona y una dificultad distinta por pieza. Para cada una: `piezas/<id>/brief.md` con insight, ganchos, guion lámina por lámina, oferta y acento ([`../marca/guion.md`](../marca/guion.md)).
2. **Leer.** Hacer una sola lectura con la rúbrica de [`../agentes/lector-de-audiencia.md`](../agentes/lector-de-audiencia.md). No pasa al arte sin 2 en Curiosidad y en Novedad.
3. **Preparar la tanda.** Crear la carpeta con `instrucciones.md`, `brief-tanda.md`, `referencias/` y `pedidos.md`. Para que ChatGPT vea dónde va el texto, se puede sumar a `referencias/` el wireframe de la portada: `npx tsx scripts/render-laminas.ts <id> --guias` (desde `web/`).
4. **Generar.** El agente del navegador, con modelo chico, crea el Proyecto con memoria solo del proyecto y carga instrucciones y fuentes. Después abre un chat por pieza y deja los originales en `piezas/<id>/imagenes/<slot>-v1.png`.
5. **Elegir y convertir.** Claude revisa cada placa con los criterios de `imagenes-chatgpt.md` y la convierte: `npx tsx scripts/placa-marca.ts <id>`.
6. **Componer.** Claude arma `piezas/<id>/diseno.html` sobre `../diseno/kit.css`, una `<section class="lamina">` por lámina. Cada pieza se diseña tomando como referencia `../diseno/formatos/`.
7. **Renderizar y revisar.** Desde `web/`:
   - `npx tsx scripts/render-laminas.ts <id>` deja `salida/lamina-NN.png` y `salida/carrusel.pdf`;
   - `npx tsx scripts/check-pieza.ts <id>` valida la pieza.

   Se revisa cada PNG y una miniatura a 360 px.
8. **Entregar a Mario.** Las piezas quedan en `borrador` con su brief, copy, texto alternativo y salidas. Mario ajusta la postura y la oferta y aprueba. Publicar exige además una instrucción suya para esa pieza y esa plataforma (`../agentes/publicador.md`).

## Lo que aprendimos en la primera tanda (28/10)

- ChatGPT respetó la zona libre y no puso texto, pero **ignoró el blanco y negro**. Se convierte en código.
- Las imágenes tardan entre 1 y 2 minutos cada una. Conviene revisar el cupo de la cuenta antes de empezar; ese día quedaba un 8 %.
- Las capturas del Chrome de Mario pueden fallar. El agente trabaja leyendo la página (`find`, `read_page`, `javascript_tool`).
