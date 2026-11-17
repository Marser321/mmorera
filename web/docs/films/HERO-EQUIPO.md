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

| # | Segundos | Qué pasa | El chiste |
| --- | --- | --- | --- |
| 1 | 0–3 | **Llega el pedido.** Una nota adhesiva cae sobre el escritorio. | Los cinco saltan del susto al mismo tiempo. |
| 2 | 3–8 | **Discuten.** Voz contesta primero, Plano despliega su dibujo, los dos globos chocan. Cable se mete en el medio, Toma filma la pelea, Lupa mira la nota con la lupa y el ojo le queda enorme. | Tiran de la nota cada uno para su lado. |
| 3 | 8–12 | **Cada uno busca por su lado.** Plano se sube a una pila de libros, Lupa se va bajo la lámpara, Cable da vueltas enredado en un cable USB, Toma encuadra, Voz se queda solo con la nota. | Todos trabajan mucho y nadie avanza. |
| 4 | 12–16 | **La mano que ordena.** Entra la mano, golpea el escritorio dos veces, todos miran para arriba con los párpados bien abiertos. Señala de izquierda a derecha y cada uno salta a su lugar. | El silencio repentino. |
| 5 | 16–20 | **Lo resuelven juntos.** La nota pasa de mano en mano y cada uno le suma lo suyo. Al final se enciende un teléfono chico con los cinco colores. | Festejan y Toma se cae de espaldas. |
| 6 | 20–22 | **Y llega otro pedido.** Vuelven a su lugar. La nota siguiente ya viene cayendo. | El bucle. |

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
3. **Prueba de aspecto** en GPT: los cinco robots juntos y el escritorio vacío. Si Mario la aprueba, se sigue.
4. Un cuadro clave por escena, con la prueba de aspecto como referencia.
5. Video en Flow, plano por plano, a partir de esos cuadros.
6. Edición final en Remotion, con la versión horizontal y la vertical.
7. Reemplazo del hero en la home, con póster, pausa y versión para movimiento reducido.

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

## Indicaciones para el movimiento (Flow)

- Un clip por escena, de 4 a 6 segundos, a partir de su cuadro clave.
- Cámara quieta o con un acercamiento muy lento: el montaje y los cortes se hacen después, en código.
- Pedir movimiento mecánico y un poco torpe: cabeceos, párpados que se abren y se cierran, bracitos que tiran, pasitos cortos. Nada de caricatura.
- Que no aparezcan objetos nuevos ni cambien los robots de forma o de color entre cuadros.
- La mano entra desde arriba, golpea el escritorio dos veces con un dedo y señala la fila.
- Nada de texto, globos ni interfaz dentro del video: lo que haga falta se agrega en Remotion.
