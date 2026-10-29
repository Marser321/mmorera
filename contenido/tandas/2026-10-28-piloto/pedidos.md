# Pedidos · Proyecto «MMORERA · Tanda 01 · Piloto»

Proyecto en ChatGPT con:

- **Instrucciones:** el contenido de `instrucciones.md`.
- **Archivos:** `brief-tanda.md` y `referencias/noche.png`. Se suman los wireframes de `salida/guias/` cuando estén.

Se abre un chat por pieza y cada chat empieza con su pedido. Si una imagen falla, se pide la corrección en el mismo chat, nombrando el problema exacto. Hay hasta 4 intentos por placa; después se deja la mejor como candidata y se anota el problema en `NOTAS.md`.

## Chat 1 · Pieza 1

> Pieza 1 del brief-tanda.md: generá la placa de la cinta métrica. Vertical 4:5. El objeto va en el tercio inferior, un poco a la derecha, y el 45 % superior queda negro casi plano para el titular. La cinta es metal liso, sin graduaciones ni números. Sin texto de ningún tipo.

Correcciones frecuentes:

- «La cinta tiene números: hacela lisa, sin ninguna marca».
- «Bajá el objeto: el tercio superior tiene que quedar vacío».

## Chat 2 · Pieza 2

> Pieza 2 del brief-tanda.md: generá la placa del nivel de burbuja sobre concreto. Vertical 4:5. Cámara casi a ras de la superficie, nivel centrado en el tercio inferior, y la mitad superior negra y plana. El nivel no tiene marca, escala ni números, y la burbuja está exactamente centrada. Sin texto de ningún tipo.

Correcciones frecuentes:

- «Hay marcas o logo en el nivel: sacalos».
- «La burbuja no está centrada».

## Chat 3 · Pieza 3

> Pieza 3 del brief-tanda.md: generá la placa de la caja de cartón entreabierta. Vertical 4:5. Caja centrada en el tercio inferior, una solapa levantada que recibe la luz desde la izquierda y el interior en sombra, sin que se vea el contenido. El 40 % superior queda negro casi plano. Sin etiquetas, cinta con texto ni impresión. Sin texto de ningún tipo.

Correcciones frecuentes:

- «Se ve contenido adentro: dejalo en sombra».
- «La caja tiene impresión o etiqueta: cartón liso».

## Dónde va cada placa

| Chat | Archivo final |
|---|---|
| 1 | `piezas/2026-10-28-cotizar-trabajos-a-medida/imagenes/portada.png` |
| 2 | `piezas/2026-10-28-agencias-landing-entrega/imagenes/portada.png` |
| 3 | `piezas/2026-10-28-servicios-que-incluye/imagenes/portada.png` |

## Resultado de la tanda (28/10)

- Las tres placas salieron en el primer intento, sin texto ni números y con la zona libre respetada. Cada una tardó entre 1 y 2 minutos.
- **ChatGPT ignoró el «cero color»:** las herramientas salieron amarillas y la luz ámbar. Se resuelve en código: `imagenes/portada.png` es la versión convertida a negro pared y marfil (luminancia con poco peso en el rojo, contraste ×1,25, coloreado `#0B0B0A`→`#ECE7DD`). El original queda como `portada-v1.png`.
- **Para las próximas tandas:** no gastar intentos en pelear el color. Pedir luz baja, una sola fuente y zona libre, y convertir siempre en código.
