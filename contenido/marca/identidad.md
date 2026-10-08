# Identidad visual

**Blanco y negro, con energía.** Minimalismo no es poco diseño: no hay color, y por eso la fuerza sale de la escala, el contraste, la textura y el movimiento. Cada pieza tiene que dar ganas de seguir mirando.

## Color

| Token | Oscuro | Claro (invertido) |
|---|---|---|
| Fondo | `#070809` | `#F3F0E8` |
| Texto principal | `#F3F0E8` | `#0B0C0E` |
| Cuerpo | marfil al 82 % | grafito al 82 % |
| Rótulos | marfil al 58 % | grafito al 60 % |
| Líneas | marfil al 22 % | grafito al 20 % |

- **Sin color de acento:** es una decisión de Mario, del 2026-10-08.
- **Inversión como golpe:** blanco↔negro marca el ritmo. Los carruseles alternan fondo en cada deslizada y los reels invierten en el remate, con un flash.
- **Énfasis:** la palabra queda en una barra invertida y da un pequeño salto (`*palabra*` en los datos).
- **Fotos e imágenes:** siempre en escala de grises y con alto contraste.

## Tipografía

- **Familjen Grotesk** para títulos y textos. Títulos enormes, peso 500 y tracking -0,035 em.
- **Space Mono** solo para datos: rótulos, contadores, índices, fechas y enlaces.
- **Tamaños:** los calcula `web/src/data/social/layout.ts`. En los reels el título va a 120–156 px: pocas palabras por línea, para que se lea en el teléfono sin esfuerzo. Si un texto no entra, se acorta; no se achica a mano.

## Recursos gráficos (lo que da energía)

Uno o dos por pantalla, nunca todos:

- **Eco:** una palabra o un número gigante, en contorno fino, que cruza el cuadro y se recorta contra el borde.
- **Número de página gigante** en contorno, en las diapositivas de contenido.
- **Hilo continuo:** una línea que atraviesa todas las diapositivas de un carrusel a la misma altura, con un punto que avanza. Puestas una al lado de la otra, forman una sola pieza.
- **Bloques sólidos** que dividen la pantalla: la comparación antes/después.
- **Grano de película** sutil sobre todo: da cuerpo al negro y al marfil.
- **Fotos en B/N** de alto contraste, a sangre o en placa, generadas en ChatGPT (`imagenes-chatgpt.md`).
- **"DESLIZÁ →"** en la portada, y barra de progreso por segmentos en los reels.

## Movimiento: rápido para enganchar, lento para leer

- **Pulsos cortos:** de 1,4 a 3,4 s según lo que haya que leer. Cada corte entra con una transición distinta:
  - **golpe:** la escala cae con rebote;
  - **barrido:** entra de costado con desenfoque de movimiento;
  - **zoom:** crece desde el fondo;
  - **flash:** un destello invertido. Siempre que cambia el color.
- **Texto:** entra palabra por palabra subiendo de su máscara, con algo de escala y desenfoque, y sale hacia arriba antes del corte.
- **Números:** cuentan desde cero hasta su valor real (por ejemplo, "26" tablas).
- **Cámara:** se acerca apenas durante cada pulso. El eco se desliza en sentido contrario.
- **Retención:** barra por segmentos (una por pulso) y contador "02 / 06".
- **Cierre:** la firma (monograma, nombre y llamado) termina quieta, así el loop vuelve al gancho sin salto.

## Mario en las imágenes

**No aparece la cara de Mario.** Si hace falta una persona: manos, siluetas de espalda, un escritorio, una pantalla sin texto legible. El protagonista es el trabajo.

## Quién diseña qué

- **Reels:** siempre de código (`web/src/components/social/`).
- **Carruseles, desafíos, tarjetas, encuestas y sorteos:**
  - Los diseña **ChatGPT**, completos, con `chatgpt-diseno.md`.
  - El código genera siempre una versión de **respaldo**: si la de ChatGPT no está completa o no pasa el control, se publica la de código.
