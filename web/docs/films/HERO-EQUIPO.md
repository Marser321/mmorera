# Hero de la home: «El equipo» (guion, 16/11/2026)

Mario pidió cambiar el hero de la home: las partículas «están bien, pero no para algo principal». Quiere una pieza cinemática, de ancho completo, divertida, que muestre a los agentes de IA trabajando en equipo con un orquestador. En sus palabras: «personajitos estudiando y buscando información y compartiendo entre ellos, de manera muy jocosa y cotidiana, como si discutieran dos personas», «humanizar a los agentes y ver cómo se ayudan entre sí por los puntos fuertes».

Este documento es el guion. El boceto animado está en `src/components/films/hero/` y se renderiza con `npx tsx scripts/render-hero-boceto.ts`.

## La idea en una línea

Llega un pedido a un escritorio. Cinco robots chiquitos discuten, cada uno busca por su lado, y no sale nada hasta que una mano los ordena. Recién ahí lo resuelven juntos.

Es lo que Mario vende: no una herramienta suelta, sino alguien que orquesta varias y decide.

## El reparto

Un robot de escritorio por servicio, con el color de su puerta. Ninguno habla: se entienden con gestos, así el film sirve en español y en inglés.

| Personaje | Color | Servicio | Su punto fuerte | Lo que lleva | Su manía |
| --- | --- | --- | --- | --- | --- |
| **Plano** | Azul | Webs y landings | Le da forma a todo | Un plano enrollado | Quiere dibujar antes de escuchar |
| **Voz** | Dorado | Agentes de IA | Responde al instante | Auriculares con micrófono | Contesta primero, piensa después |
| **Cable** | Verde | Automatización y CRM | Une las piezas | Una madeja de cable | Se enreda en su propio cable |
| **Toma** | Coral | Contenido con IA | Lo cuenta lindo | Una camarita | Filma todo, hasta la pelea |
| **Lupa** | Violeta | Campañas con IA | Mira los números | Una lupa | Mide antes de opinar |

**El orquestador** es una mano humana que entra desde arriba. No empuja ni reta: golpea la mesa dos veces y señala. Es la capa humana, «una persona que decide», y no hace falta mostrar una cara.

## Las escenas (22 segundos, en bucle)

| # | Segundos | Qué pasa | Quién mira a quién | El chiste |
| --- | --- | --- | --- | --- |
| 1 | 0–3 | **Llega el pedido.** Plano y Voz trabajan en calma. Una nota adhesiva baja desde arriba y cae en el escritorio. | Plano la sigue con la vista, Voz mira a Plano, Cable intenta atajarla y falla. Toma tarda un instante en darse cuenta. | Reaccionan de a uno, con un pequeño retraso. Nadie salta en bloque. |
| 2 | 3–8 | **Discuten.** Voz y Plano tiran de la misma nota, cada uno para su lado. Cable busca dónde ayudar, Toma filma la pelea, Lupa mira el papel con la lupa y el ojo le queda enorme. | Plano y Voz se miran entre ellos. Toma gira apenas hacia el espectador, como diciendo «¿viste esto?», y vuelve a filmar. | La nota se tensa, una pausa, y un tironcito más. |
| 3 | 8–12 | **Cada uno busca por su lado.** Plano se sube a una pila de libros, Lupa se va bajo la lámpara, Cable da vueltas enredado en un cable USB, Toma encuadra, Voz se queda solo con la nota. | Cable le pide ayuda a Voz con la mirada. Voz duda y no va. | Todos trabajan mucho y nadie avanza. |
| 4 | 12–16 | **La mano que ordena.** Entra la mano y da dos golpecitos en el escritorio. Señala la nota y después la fila. | Uno la ve primero y los demás siguen su mirada. Es el único momento en que los cinco miran lo mismo. | El silencio repentino. |
| 5 | 16–20 | **Lo resuelven juntos.** La nota pasa de mano en mano, de a dos por plano. Toma festeja, se cae de espaldas y Cable le tiende la mano. Después se enciende un teléfono chico con los cinco colores. | Cable mira a Toma en el piso. Toma mira un instante al espectador, con vergüenza, y vuelve al equipo. Lupa mira el teléfono. | La caída, y que lo levante justo el que se enredaba solo. |
| 6 | 20–22 | **Y llega otro pedido.** Un respiro de satisfacción y otra nota entra desde arriba. | Alguien la descubre primero. | El bucle, resuelto con un corte. |

## Actuación: miradas con motivo (17/11)

Mario le pidió a Codex una dirección más expresiva: miradas con intención, gestos entre los robots y algún guiño al espectador. Codex dejó su propuesta en `docs/revision-hero/DIRECCION-ACTUACION-variantes.md`. Esa carpeta es de revisión y no se sube al repositorio: ahí están también las imágenes que se nombran más abajo. Esto es lo que queda incorporado al guion:

- **Cada mirada tiene destino y motivo:** un objeto, un compañero, la mano o la cámara. Nadie mira a la nada.
- **Las reacciones van escalonadas.** Uno descubre, otro lo sigue, un tercero reacciona. La única mirada de los cinco a la vez es la de la escena 4, porque ahí hay una causa: la mano.
- **Una acción y una reacción por plano.** Si un plano pide cinco coreografías juntas, el generador las mezcla y el gesto no se lee. Lo demás queda casi quieto, con parpadeos.
- **El guiño al espectador es de un solo personaje: Toma.** Es el que filma, así que es el cómplice natural de quien mira. Tiene dos guiños y ninguno más en todo el film: el «¿viste esto?» de la pelea y la vergüenza después de la caída. Si el primero no se lee en la prueba, queda solo el segundo. Los demás nunca miran a cámara.
- **Los gestos cuentan relaciones, sin sonido.** Tres parejas sostienen la historia: Plano y Voz (la nota), Cable y Toma (la caída y la ayuda), Lupa y el resultado (el teléfono). Son también las parejas del corte para teléfono.
- **El guiño no es interacción.** Toma mira a cámara como parte de la actuación; no sigue el cursor ni el dedo. El sitio no promete que los robots respondan.

## Continuidad: lo que no cambia de un cuadro a otro

La referencia de los personajes es la prueba de aspecto que eligió Mario: `docs/revision-hero/robots-prueba-2.png`.

| Personaje | Rasgos fijos |
| --- | --- |
| **Todos** | Dos ojos de lente al frente de la cara, con párpados metálicos. Cuerpo de esmalte con tornillos y juntas. Unos 8 cm. |
| **Plano** (azul) | Cabeza redonda con una antenita de bolita. Plano enrollado y regla de acero. |
| **Voz** (dorado) | Auriculares grandes con micrófono de brazo y una antena fina. Sin objetos en las manos. |
| **Cable** (verde) | Carrete de cable en la espalda, con asa. Ficha USB en la mano. Rejilla a un lado de la cabeza. |
| **Toma** (coral) | La cabeza es una cámara coral con parasol. Los dos ojos van dentro del parasol. Luz roja arriba. |
| **Lupa** (violeta) | Antenita de bolita. Una lupa casi de su tamaño. |

Además: una sola nota adhesiva, sin texto. El resultado es un teléfono chico, no una tableta. El mismo escritorio, la misma lámpara arriba a la derecha y el negro libre arriba a la izquierda.

**Revisión de los cuadros contra esa referencia (17/11):**

- Los cinco cuadros clave (`cuadro-1` a `cuadro-5`) cuentan bien la historia, pero el diseño se corre: los ojos quedan arriba de la cabeza, más de dibujo; desaparecen las antenas; la cabeza de Toma sale gris y con un solo ojo. En el 1 y el 5 se nota más. Sirven para probar el movimiento, no como imagen final.
- `cuadro-5-variante-miradas-exploratoria.png` (Codex): sirve por la idea de quién mira a quién. El diseño se corre igual que en el cuadro 5, y el resultado aparece en una tableta.
- `movil-01-entrada-exploratoria.png` (Codex): es la más fiel a la referencia. La antena de Plano es correcta, está en el diseño aprobado. Sobra la tableta de Voz, y la nota queda donde iría el título.
- `movil-02-reaccion-exploratoria.png` (Codex): Cable sale igual a la referencia. A Toma le cambió la cara: un ojo afuera y un lente dentro del parasol, en vez de los dos ojos adentro. Toma está sentado, así que es un plano posterior a la caída.

Antes de generar más cuadros hace falta una **hoja de personajes**: cada robot de frente y de tres cuartos, sacada de la prueba aprobada. Con esa hoja como referencia se rehacen los cuadros clave.

## Entrada, salida y teléfono (17/11)

Propuesta de Codex en `docs/revision-hero/CONTINUIDAD-ENTRADA-MOVIL.md`, incorporada así:

- **Entrada.** El póster se ve desde el primer instante, con el título y el botón ya disponibles. El video arranca en silencio cuando está listo, sin fundido desde negro. Si no carga o no puede reproducirse, queda el póster. El mensaje no espera a la animación.
- **Salida.** El hero se va con el desplazamiento normal, sin fijar la pantalla. El último plano es el teléfono con los cinco colores, que son los de las cinco puertas de Servicios que vienen debajo: el final del film presenta la sección siguiente. El video se pausa fuera de pantalla y sigue donde estaba al volver.
- **Bucle.** Se resuelve con un corte o un fundido corto. No se promete un bucle perfecto sin probarlo.
- **Teléfono.** Un montaje vertical propio, con las tres parejas: dos robots por plano y de 2 a 4 segundos por gesto. Los cinco aparecen por cortes; juntos y diminutos no se leen. El título y el botón van en una zona oscura estable y el video en su propia ventana, no detrás del texto. Se revisa a 320, 375 y 430 px de ancho, mirando dónde caen los ojos, la nota y el teléfono con el recorte.
- **Peso.** Un archivo horizontal para escritorio y uno vertical para teléfono, cada uno con su póster. Se descarga uno solo.
- **Accesibilidad.** Un botón de pausa visible y con nombre. Con movimiento reducido se muestra un póster que cuente la historia y el film no arranca. Nada depende del sonido ni de pasar el cursor.

## Cómo se ve: fotorrealista (corrección de Mario, 16/11)

Mario vio el boceto y lo corrigió: «los bocetos son demasiado simples, yo buscaba algo más realista, fotorrealista, y que con expresiones y juegos transmitamos el humor, para que sea coherente con el resto de la página». La plastilina queda descartada.

- **Escala real, lente macro.** Los cinco son robots de escritorio de unos 8 cm, filmados como si fueran objetos de verdad sobre un escritorio de noche. El resto del sitio es cine fotorrealista (el lavado de L&B, la barbería, te_Cargo, Vespera, el camión): el hero tiene que verse igual.
- **El humor sale de las caras y del juego, no del dibujo.** Cada robot tiene dos ojos de lente con párpados mecánicos: con los párpados, la inclinación de la cabeza y la postura alcanza para el susto, la duda, el fastidio y el orgullo. Los chistes son de escala: tiran de una nota adhesiva más grande que ellos, Cable se enreda en un cable USB de verdad, Lupa se mira con su propia lupa y el ojo le queda enorme, Toma filma todo con su luz roja prendida.
- **El escenario:** un escritorio de madera oscura contra la pared negra mate del sitio, con una pila de libros, el borde de un teclado, una taza y una lámpara cálida. Mucho negro arriba a la izquierda, donde va el título.
- **El pedido** es una nota adhesiva que cae. **El resultado** es un teléfono chico que se enciende con los cinco colores.
- **El orquestador** es una mano de verdad. Se puede generar o filmar la de Mario.
- **Los colores** son los de las puertas, como esmalte sobre metal, no saturados de juguete.
- **Teléfono:** un corte vertical propio, con dos o tres robots por plano.
- **Sin sonido al entrar.** La banda (golpes, zumbidos de motorcitos, murmullos sin palabras, música) es un extra para un botón «con sonido».

El boceto en código sigue sirviendo, pero solo como guía de ritmo y de posiciones: no muestra el aspecto final.

## Orden de trabajo

1. Guion y reparto (este documento).
2. Boceto en código, con muñecos provisorios: guía de ritmo y de encuadre.
3. **Prueba de aspecto** en GPT: los cinco robots juntos. Aprobada el 16/11: el aspecto «limpio y moderno» (`robots-prueba-2.png`).
4. Un cuadro clave por escena. Hechos el 16/11; cuentan la historia, pero el diseño se corre (ver «Continuidad»).
5. **Prueba de movimiento:** un solo plano corto, la discusión, para ver si el generador sostiene a los cinco robots, las miradas y el guiño de Toma.
6. **Hoja de personajes** y cuadros clave rehechos con ella, uno por pareja y por gesto.
7. Video plano por plano, a partir de esos cuadros.
8. Edición final en Remotion, con la versión horizontal y la vertical.
9. Reemplazo del hero en la home, con póster, pausa y versión para movimiento reducido.

## Indicaciones para las imágenes base (GPT)

Van en inglés porque así responde mejor el generador. Todas sin texto dentro de la imagen y sin nombrar personajes ni marcas que ya existen.

**1. Prueba de aspecto: los cinco robots**

> Photorealistic macro photograph of five small original desk robots standing in a row on a dark walnut desk at night, each about 8 cm tall. Each robot has a compact rounded body of matte enamel-painted metal with fine scratches, visible tiny screws and panel seams, two large round glass camera-lens eyes with mechanical metal eyelids, and two thin articulated arms. Left to right: an electric blue robot holding a tiny rolled blueprint and a small steel ruler; a brushed brass-gold robot wearing a tiny headset with a boom microphone; a lime green robot carrying a spool of thin cable on its back and holding a USB plug; a coral-red robot whose head is a miniature cinema camera with a small red tally light on; a violet robot holding a magnifying glass almost as big as itself. Each one shows a different expression using only its eyelids, head tilt and posture: curious, impatient, flustered, proud, skeptical. Matte black wall behind them, warm desk-lamp light from the upper right, soft cool rim light, shallow depth of field, dust visible in the light, real-world scale cues. Cinematic, 21:9. No text, no logos, no people.

**2. El escritorio vacío**

> Photorealistic wide macro photograph of a designer's desk at night against a matte black wall. Dark walnut desktop, a stack of three worn hardcover books on the left, the edge of a mechanical keyboard, a ceramic coffee cup, a coiled USB cable, a desk lamp at the top right casting a warm pool of light, a faint cool glow from a monitor out of frame. The center of the desk is empty. Shallow depth of field, cinematic, 21:9, a lot of dark empty wall in the upper left. No characters, no text, no logos.

**3. Un cuadro clave por escena**

Con las dos imágenes anteriores como referencia, pedir el primer cuadro de cada escena. Los tres que más definen el tono:

> Scene 2, the argument. The same five robots from the reference image on the same desk, crowded around a yellow sticky note lying on the desk. The gold robot and the blue robot each pull one corner of the note toward themselves, eyelids half closed in stubbornness. The green robot squeezes between them holding up its USB plug. The coral camera-headed robot films the fight from one side, red light on. The violet robot inspects the note through its magnifying glass, and its eye looks huge through the lens. Same warm lamp light, same matte black wall, photorealistic macro, 21:9. No text on the note, no logos, no people.

> Scene 4, the hand. The same five robots frozen mid-action, all looking straight up with eyelids wide open. A real adult human hand in a dark sleeve comes down from the top of the frame and taps the desk with its index finger next to the sticky note. Photorealistic, same desk and light, shallow depth of field, 21:9. No text, no logos, no face.

> Scene 5, together. The same five robots standing in a neat row, passing the sticky note from one to the next. At the end of the row a small phone stands upright on the desk with its screen glowing, showing five plain vertical color bars in blue, green, gold, coral and violet. The robots look at it with eyelids wide and proud postures; the coral one has tipped over backwards. Photorealistic macro, same desk and light, 21:9. No text, no logos, no people.

## Indicaciones para el movimiento (Flow o ElevenLabs)

- Un clip por gesto, de 4 a 6 segundos, a partir de su cuadro clave.
- Una acción principal y una reacción secundaria por clip. El resto, casi quieto y con parpadeos.
- Cada movimiento con final: «tira, hace una pausa y se queda con la nota tensa». Sin final, el generador inventa.
- Cámara quieta o con un acercamiento muy lento: el montaje y los cortes se hacen después, en código.
- Pedir movimiento mecánico y un poco torpe: cabeceos, párpados que se abren y se cierran, bracitos que tiran, pasitos cortos. Nada de caricatura.
- Que no aparezcan objetos nuevos ni cambien los robots de forma o de color entre cuadros.
- La mano entra desde arriba, golpea el escritorio dos veces con un dedo y señala la fila.
- Nada de texto, globos ni interfaz dentro del video: lo que haga falta se agrega en Remotion.
