# Identidad visual

**La estética es el ultraminimalismo en blanco y negro.** Nada de degradés, colores de moda ni stock. El contenido manda; el diseño ordena y le da ritmo.

## Color

| Token | Oscuro (por defecto) | Claro (invertido) |
|---|---|---|
| Fondo | `#070809` | `#F3F0E8` |
| Texto principal | `#F3F0E8` | `#0B0C0E` |
| Cuerpo | marfil al 82 % | grafito al 82 % |
| Rótulos | marfil al 58 % | grafito al 60 % |
| Líneas | marfil al 22 % | grafito al 20 % |

- **Las dos variantes:** la oscura es la base. La clara se usa como **signo de puntuación**: el remate de un reel, el cierre de un carrusel, una cita.
- **Sin color de acento.** El énfasis se hace invirtiendo: la palabra queda en una barra marfil con letra negra (`*palabra*` en los datos).
- **Fotos e imágenes en escala de grises.** El render las pasa a grises aunque lleguen en color.

## Tipografía

- **Familjen Grotesk** para títulos y textos: peso 500 en títulos, tracking -0,035 em; peso 400 en cuerpo.
- **Space Mono** solo para datos y rótulos: contadores, índices, fechas, enlaces y el rótulo sobre los títulos. Va en mayúsculas con tracking 0,14 em, salvo los enlaces.
- **Los tamaños no se eligen a ojo:** los calcula `web/src/data/social/layout.ts` para que cada texto entre en su zona segura. Si algo no entra, el validador lo marca: se acorta el texto, no se achica a mano.

## Composición

- **Zona segura por formato:** en 9:16 se respeta lo que tapan Reels, TikTok y Shorts. Arriba ~250 px, abajo ~480 px y a la derecha ~160 px quedan libres.
- **Una idea por pantalla.** Si hace falta otra idea, va en otro pulso o en otra diapositiva.
- **Alineación a la izquierda, mucho aire.** La portada del carrusel apoya el título abajo, como una tapa editorial.
- **Firma:** el monograma MM, "Mario Morera" y `mmorera.agency`.

## Movimiento: lento con pulso

El ritmo tiene que enganchar sin gritar.

- **Cortes:** cada pulso dura lo que tarda en leerse (1,8–4,2 s) y corta al siguiente.
- **Entradas:** el texto entra por máscara, palabra por palabra, en menos de un segundo. Sale hacia arriba justo antes del corte.
- **Cámara:** se acerca apenas (3,5 %) durante cada pulso.
- **Énfasis:** la barra invertida se dibuja después de que la palabra entra.
- **Inversión:** cuando cambia el color, el nuevo fondo sube como una cortina.
- **Retención:** barra de progreso fina arriba y contador "02 / 06".
- **Cierre:** la firma termina quieta, para que el loop vuelva al gancho sin salto.

## Mario en las imágenes

**No aparece la cara de Mario.** Cuando hace falta una persona: manos, siluetas de espalda, un escritorio, una pantalla. El protagonista es el trabajo.
