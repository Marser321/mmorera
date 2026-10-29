# Placas con ChatGPT

ChatGPT genera **placas fotográficas sin texto**: el objeto metáfora de una portada, una escena o una textura. Encima, el código compone la tipografía exacta (`../diseno/kit.css`). ChatGPT nunca escribe texto en la imagen ni redacta copy.

Las placas se piden **por tanda, dentro de un Proyecto de ChatGPT** con instrucciones y brief fijos. Así ChatGPT inventa menos y la serie sale pareja. El flujo completo está en [`../tandas/README.md`](../tandas/README.md). Lo maneja un agente con modelo chico (Sonnet o menor), nunca Opus.

## Dirección de la serie (va en las instrucciones del Proyecto)

Partir de este bloque y ajustarlo solo si la tanda lo pide. Ejemplo vivo: `../tandas/2026-10-28-piloto/instrucciones.md`.

```
Sos el fotógrafo de still life de MMORERA. En este proyecto generás SOLO placas fotográficas SIN TEXTO; encima se compone la tipografía en código.
- Blanco y negro: negros mates cercanos a #0B0B0A, luces marfil cálidas cercanas a #ECE7DD, alto contraste, grano fino.
- Luz: una sola fuente dura, lateral, desde la izquierda y un poco alta. Sombras largas y negras. Sin relleno ni contraluz.
- Materiales reales: papel, metal cepillado, aluminio, concreto, madera gastada, cartón.
- Lente de 50 a 85 mm. Un solo objeto protagonista y mucho espacio negativo.
- ZONA LIBRE: cada pedido indica dónde va el titular; esa zona queda en negro casi plano, sin objetos ni brillos.
- Estética de catálogo de herramientas o revista de arquitectura. Nada de stock ni render 3D brillante.
- Prohibido: texto, letras, números, graduaciones, marcas, logos o etiquetas (aunque sean ilegibles); pantallas, caras, personas; humo, partículas, destellos.
- Vertical 4:5 (1080×1350) salvo otro pedido. Una imagen por pedido.
```

## Brief de placa (va en `brief-tanda.md`, uno por pieza)

| Campo | Qué dice |
|---|---|
| **De qué trata** | La pieza en dos líneas, para que ChatGPT entienda el contexto |
| **Titular que irá encima** | Entre comillas y con la aclaración «no se dibuja» |
| **Metáfora** | Por qué este objeto: «medir antes de cotizar», «lo terminado se mide» |
| **Placa** | Objeto, material, superficie, luz y lo que **no** tiene (sin graduaciones, sin etiqueta) |
| **Cámara** | Ángulo y altura: a ras, 35 a 45° o cenital |
| **Objeto** | Dónde va en el cuadro: tercio inferior, a la derecha… |
| **Zona libre** | Porcentaje y posición donde va el titular |

Objetos que funcionaron: cinta métrica, nivel de burbuja y caja de cartón entreabierta (tanda del 28/10). Otros candidatos: escuadra, llave, sobre cerrado, regla, sello, carpeta, interruptor, silla vacía (`noche.png`). Que cada objeto cumpla una metáfora del insight, no que decore.

## Después de generar

1. **Elegir** con estos criterios:
   - no tiene ningún texto, número, graduación ni logo (revisar con zoom);
   - la zona libre está limpia;
   - el objeto se reconoce a 360 px;
   - la luz viene de la izquierda;
   - no hay geometría rota.
2. **Guardar el original** como `piezas/<id>/imagenes/<slot>-v1.png` (si hubo más intentos, `-v2`, `-v3`).
3. **Convertir a la marca** desde `web/`: `npx tsx scripts/placa-marca.ts <id> [slot]`. Deja `imagenes/<slot>.png` en pared y marfil, a 1080×1350. ChatGPT suele devolver color aunque se le pida blanco y negro: no se gastan intentos en eso.
4. **Ver la placa compuesta** en la lámina antes de darla por buena: el degradé del kit (`data-texto`) asegura la lectura del titular.

Si después de 4 intentos ninguna sirve, se deja la mejor como `<slot>-candidata.png` y el problema se anota en `imagenes/NOTAS.md`.

## Dónde se guardan

- `piezas/<id>/imagenes/` no va a git: guarda el original y la convertida.
- La tanda conserva en `../tandas/<tanda>/pedidos.md` qué se pidió, el enlace de cada chat y el resultado.
