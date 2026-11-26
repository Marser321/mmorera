# Arte con ChatGPT (versión A)

En la versión A, ChatGPT pinta **solo el fondo**: una imagen sin ninguna letra. El texto lo pone el código encima, en Unbounded y Familjen, con el mismo grano y la misma piedra sobre imagen y letras. Así el texto queda integrado: parece impreso en la pared, no pegado encima.

Para que funcione, cada arte **deja vacía la franja donde va el texto** (pared lisa y oscura). El render apoya el texto ahí y le pone un velo suave; si el sujeto invade esa franja, el texto lo tapa.

Los pedidos de cada pieza se generan solos, en el bloque **ARTE** de `piezas/<id>/chatgpt.md`:

```bash
npx tsx scripts/chatgpt-prompts.ts <id>
```

## Antes de pedir

1. **Conversación nueva** en ChatGPT para el arte de la pieza.
2. **Adjuntá las referencias** de `contenido/marca/referencias/` (las piezas que Mario aprobó) y decile: «Estas son piezas aprobadas de la marca: copiá su clima, su materia y su tipografía, no su texto».
3. Pegá el sistema de abajo, una vez.
4. Pegá los pedidos de a uno.

<!-- ARTE -->
SISTEMA DE ARTE · MARIO MORERA · «PARED Y PIEDRA»

Vas a pintar fondos para las redes de Mario Morera, que diseña y programa sistemas (sitios, CRM, automatizaciones, IA aplicada). Las imágenes van de fondo a sangre y el texto se pone después, por código. Tu imagen NO lleva ninguna letra.

REGLAS FIJAS (valen para todas las imágenes de esta conversación):

1. MATERIA: fotografía editorial, sobria, como una revista de arquitectura. Pared de hormigón o piedra, mate, con grano de película. Luz rasante, tenue y cálida, que deja ver la textura. Sombras profundas.

2. COLOR: solo negro mate (#0B0B0A), marfil gastado (#ECE7DD) y grises cálidos entre los dos. Ningún otro color, ni un acento. Si dudás, blanco y negro.

3. UN SOLO SUJETO, simple y concreto (un objeto, un rincón, una herramienta), en la parte de la imagen que diga el pedido. Nada más compite con él.

4. ZONA VACÍA: el pedido dice qué parte de abajo queda libre. Ahí no hay objetos, ni brillos, ni detalles: pared lisa y oscura, en calma. Es donde va el texto.

5. NINGUNA LETRA: ni texto, ni números, ni carteles, ni etiquetas, ni pantallas con contenido, ni logos, aunque sean ilegibles o estén desenfocados.

6. PROHIBIDO: personas y caras; manos o dedos (salen deformes); logos y marcas reales; interfaces de software; gráficos; emojis; íconos 3D; degradés de colores; objetos imposibles; marcas de agua.

7. FORMATO: el que pida cada imagen (4:5 vertical = 1080×1350, 1:1 = 1080×1080, 9:16 = 1080×1920).

8. SERIE: todas las imágenes de una pieza parecen de la misma pared y la misma luz.

Respondé cada pedido generando solo la imagen.
<!-- /ARTE -->

## Sujetos que encajan

| Tema | Ideas de sujeto |
|---|---|
| Sistemas y automatización | Una fila de interruptores en la pared, cables ordenados en un rack, agua que corre por un canal de piedra, una llave colgada de un clavo |
| Criterio e IA | Una pieza de ajedrez sola, una lupa sobre papel, una silla vacía frente a un escritorio, una lámpara que ilumina un solo punto |
| Oficio, diseño y código | Una regla y una escuadra, una maqueta de cartón, bocetos sobre una mesa, un teclado cerrado sobre piedra |
| Casos (negocios) | El objeto del rubro en abstracto: una tijera de barbero, una manguera con agua en contraluz, un estetoscopio, un volante |
| Comunidad | Sillas vacías alrededor de una mesa, un micrófono de pie, papeles sin texto sobre una mesa |
| De noche, a destiempo | Un teléfono boca abajo con un halo de luz, una lámpara encendida en un escritorio vacío, un reloj sin números |

## Control de calidad (elegir entre las tandas)

Una imagen se descarta si:
- tiene **cualquier** letra o número, aunque sea ilegible;
- el sujeto invade la franja vacía del pedido;
- tiene color (aunque el render la pasa a la paleta, la luz cambia);
- tiene logos, caras, manos, o un objeto imposible;
- no parece de la misma pared que las referencias.

Hasta 5 intentos por imagen. Si ninguna sirve, se guarda la mejor como `<slot>-candidata.png` y se anota el problema en `imagenes/NOTAS.md`. No se inventa otra solución: la versión A sale igual, con el respaldo de `~/bin/imagen`.

## Dónde se guardan

Desde `web/`:

```bash
npx tsx scripts/contenido.ts arte <id> <slot> <archivo descargado>
```

Recorta a la medida del formato del slot y la guarda como `piezas/<id>/imagenes/<slot>.png`, que es donde la buscan el validador y el render. Sin archivo, toma la imagen más nueva de Descargas.

## Cómo la usa el código

- En `pieza.json`, el slot se declara en `imagenes` (`slot`, `formato`, `prompt`) y una diapositiva lo usa con `"fondo": "<slot>"` (portada, tarjeta, cita y cierre) o con `"imagen": "<slot>"` (diapositiva de imagen, en placa).
- El render (`web/src/components/social/SocialKit.tsx`, `FondoArte`) pasa la imagen a grises, lleva el blanco a marfil, le pone un velo de pared en la zona del texto y encima el mismo grano y la misma piedra que a las letras.
- Con fondo, el texto se achica hasta entrar en su franja (`FRANJA_TEXTO` en `web/src/data/social/layout.ts`: portada 50 %, tarjeta y cita 55 %, cierre 60 %).
