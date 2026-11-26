# Identidad visual · «Pared y piedra»

**Una sola identidad: la del sitio.** Las piezas de redes usan lo mismo que mmorera.agency: pared negra mate con grano, marfil gastado, la textura de piedra del monograma y títulos en Unbounded. Sin color de acento. Minimalismo con materia: la fuerza sale de la escala, de la tipografía y de la textura, nunca de un color.

Decisión de Mario del 2026-11-26 (central #25). Reemplaza la identidad «blanco y negro con energía» de octubre (`#070809`, solo Familjen).

La referencia de cómo tiene que sentirse es `web/public/og/inicio-es.jpg`. Las piezas aprobadas por Mario quedan en `referencias/`: se adjuntan en cada conversación con ChatGPT.

## Color

| Token | Pared (oscuro, el normal) | Marfil (invertido) |
|---|---|---|
| Fondo | `#0B0B0A` | `#ECE7DD` |
| Texto principal | `#ECE7DD` | `#0B0B0A` |
| Cuerpo | marfil al 78 % | pared al 80 % |
| Rótulos | marfil al 58 % | pared al 62 % |
| Líneas | marfil al 16 % | pared al 18 % |

- **Sin color de acento** (decisión de Mario, 2026-10-08, confirmada el 2026-11-26).
- **Casi todo va sobre la pared.** Solo la frase clave de un carrusel (la cita) va sobre marfil, como la banda marfil de cada página del sitio. El cierre vuelve a la pared, donde firma el monograma.
- **Énfasis:** la palabra queda sobre una barra marfil, con las letras en pared (`*palabra*` en los datos).
- **Fotos y arte:** pasan a grises y el blanco se lleva a marfil; lo negro queda pared.

## Materia

- **Grano de pared:** el mismo ruido que el sitio (`--grano-pared` de `globals.css`), en overlay, **encima de todo**: fondo, imagen y letras comparten el grano.
- **Piedra:** la textura del monograma (`web/public/marca/textura-piedra.webp`) apenas en la pared y en multiply sobre todo: el marfil se gasta como en el logo.
- **Luz:** una luz rasante muy suave desde arriba. La pared nunca es plana.

## Tipografía

- **Unbounded** (peso 500, tracking −0,035 em) para títulos, frases y citas. Es la tipografía ancha del sitio: los títulos son grandes pero con pocas palabras por línea.
- **Familjen Grotesk** (400) para cuerpos, bajadas, ítems y opciones.
- **Space Mono** (400, mayúsculas, espaciado amplio) para rótulos, contadores, índices, fechas y enlaces.
- **Tamaños:** los calcula `web/src/data/social/layout.ts` (mide Unbounded al 106 %, calibrado contra el navegador). Si un texto no entra, se acorta; no se achica a mano.
- Las fuentes están en archivos locales (`web/src/remotion/fuentes/`): el render no depende de la red.

## Recursos gráficos

Uno por pantalla, nunca todos:

- **El arco del anillo:** una porción del aro del monograma, gigante, de piedra, que entra por una esquina y se funde. En la portada, la tarjeta y la cita (arriba a la derecha) y, muy tenue, en el cierre (abajo).
- **Número en contorno** gigante y muy tenue, en las diapositivas de contenido.
- **Hilo continuo:** una línea finísima que cruza todas las diapositivas de un carrusel a la misma altura, con un punto que avanza (como el pie de las portadas OG).
- **Bloques:** la comparación antes/después, con el «después» en marfil.
- **Eco:** una palabra gigante en contorno, en los reels.
- **Arte de fondo** (versión A): una imagen de ChatGPT sin letras, a sangre, con la franja del texto vacía (`imagenes-chatgpt.md`).
- **"DESLIZÁ →"** en la portada, y barra de progreso por segmentos en los reels.

## El monograma

**No se estampa en las piezas.** Va chico, como firma, **solo en la diapositiva de cierre** (y en la firma de los reels): el MM con la textura de piedra, fundido hacia abajo, como `MonogramaFundido` del sitio. ChatGPT no lo dibuja nunca: en la versión B lo pega `contenido.ts importar`.

## Dos versiones por pieza

Cada pieza estática sale en dos versiones y Mario elige una en Telegram:

- **A · arte + código:** la IA de imágenes (Codex por defecto; ChatGPT en pausa, D-016) pinta un fondo sin letras (`imagenes/<slot>.png`) y el código pone el texto encima, integrado con velo, grano y piedra compartidos. Si no hay arte, la versión A sale igual, solo con código.
- **B · entera:** la IA diseña la diapositiva completa con el texto exacto (`imagenes/gpt-<salida>-NN.png`), con `chatgpt-diseno.md`.

Los reels salen siempre del código.

## Movimiento: rápido para enganchar, lento para leer

- **Pulsos cortos:** de 1,4 a 3,4 s según lo que haya que leer. Cada corte entra con una transición distinta (golpe, barrido, zoom; flash cuando cambia la luz).
- **Texto:** entra palabra por palabra subiendo de su máscara y sale hacia arriba antes del corte.
- **Números:** cuentan desde cero hasta su valor real.
- **Cámara:** se acerca apenas durante cada pulso. El eco se desliza en sentido contrario.
- **Retención:** barra por segmentos (una por pulso) y contador "02 / 06".
- **Cierre:** la firma (monograma, nombre y llamado) termina quieta, así el loop vuelve al gancho sin salto.

## Mario en las imágenes

**No aparece la cara de Mario.** Ni personas ni manos en el arte: objetos, rincones, herramientas. El protagonista es el trabajo.
