# Hero de la home: «El equipo» (guion, 16/11/2026)

Mario pidió cambiar el hero de la home: las partículas «están bien, pero no para algo principal». Quiere una pieza cinemática, de ancho completo, divertida, que muestre a los agentes de IA trabajando en equipo con un orquestador. En sus palabras: «personajitos estudiando y buscando información y compartiendo entre ellos, de manera muy jocosa y cotidiana, como si discutieran dos personas», «humanizar a los agentes y ver cómo se ayudan entre sí por los puntos fuertes».

Este documento es el guion. El boceto animado está en `src/components/films/hero/` y se renderiza con `npx tsx scripts/render-hero-boceto.ts`.

## La idea en una línea

Llega un pedido a una mesa de taller. Cinco personajes chiquitos discuten, cada uno busca por su lado, y no sale nada hasta que una mano los ordena. Recién ahí lo resuelven juntos.

Es lo que Mario vende: no una herramienta suelta, sino alguien que orquesta varias y decide.

## El reparto

Un personaje por servicio, con el color de su puerta. Ninguno habla: se entienden con globos de íconos, así el film sirve en español y en inglés.

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
| 1 | 0–3 | **Llega el pedido.** Un papel cae sobre la mesa. | Los cinco saltan del susto al mismo tiempo. |
| 2 | 3–8 | **Discuten.** Voz contesta primero, Plano despliega su dibujo, los dos globos chocan. Cable se mete en el medio, Toma filma la pelea, Lupa mide el papel y niega con la cabeza. | Tiran del papel cada uno para su lado. |
| 3 | 8–12 | **Cada uno busca por su lado.** Plano se sube a una pila de libros, Lupa se va bajo la lámpara, Cable da vueltas enredado, Toma encuadra, Voz se queda solo con el papel. | Todos trabajan mucho y nadie avanza. |
| 4 | 12–16 | **La mano que ordena.** Entra la mano, golpea la mesa dos veces, todos miran para arriba. Señala de izquierda a derecha y cada uno salta a su lugar. | El silencio repentino. |
| 5 | 16–20 | **Lo resuelven juntos.** El papel pasa de mano en mano y cada uno le suma su color. Al final se levanta convertido en una ventanita encendida. | Festejan y Toma se cae de espaldas. |
| 6 | 20–22 | **Y llega otro pedido.** Vuelven a su lugar. El papel siguiente ya viene cayendo. | El bucle. |

## Cómo se ve

- **Escenario:** una mesa de taller contra la pared mate del sitio (`#0B0B0A`), con una lámpara cálida, una pila de libros y nada más. Panorámico, como un diorama.
- **Estilo sugerido:** plastilina o muñecos hechos a mano, con huellas de dedos y luz de lámpara. Se ve cálido, combina con la pared y disimula los defectos del video generado. **Falta que Mario lo confirme.**
- **El título va abajo a la izquierda**, donde el cuadro queda calmo: los personajes ocupan el centro y la derecha.
- **Teléfono:** un corte vertical propio, con tres personajes por plano.
- **Sin sonido al entrar.** La banda (golpes, murmullos sin palabras, música) es un extra para un botón «con sonido».

## Orden de trabajo

1. Guion y reparto (este documento).
2. Boceto animado en código, con muñecos provisorios: sirve para aprobar la historia, el ritmo y el encuadre antes de gastar créditos.
3. Hoja de personajes e imágenes base en GPT (indicaciones abajo).
4. Video en Flow, plano por plano, a partir de esas imágenes.
5. Edición final en Remotion, con la versión horizontal y la vertical.
6. Reemplazo del hero en la home, con póster, pausa y versión para movimiento reducido.

## Indicaciones para las imágenes base (GPT)

Se generan en este orden. Todas sin texto dentro de la imagen.

**1. Hoja de personajes**

> Hoja de personajes de animación en plastilina (stop motion), cinco personajes pequeños de cuerpo redondeado y ojos grandes, sin boca definida, con huellas de dedos visibles en la superficie. De izquierda a derecha: uno azul eléctrico con un plano de papel enrollado bajo el brazo; uno dorado con auriculares y micrófono; uno verde lima envuelto en una madeja de cable con enchufe; uno coral con una cámara de cine diminuta; uno violeta con una lupa. Cada uno de frente y de perfil. Fondo negro mate liso, luz cálida de lámpara desde arriba a la izquierda, sombras suaves. Fotografía de estudio, lente macro, poca profundidad de campo. Sin texto ni logotipos.

**2. El escenario vacío**

> Diorama panorámico de una mesa de taller de madera oscura contra una pared negra mate con textura fina. A la izquierda, una pila de libros viejos de plastilina; arriba a la derecha, una lámpara de escritorio encendida que da luz cálida. La mesa está vacía en el centro. Estética de stop motion en plastilina, fotografía macro, formato muy apaisado 21:9, mucho aire negro arriba. Sin personajes, sin texto.

**3. Un cuadro clave por escena**

Con la hoja de personajes y el escenario como referencia, pedir el primer cuadro de cada escena (las seis de la tabla). Ejemplo para la escena 2:

> Los cinco personajes de la hoja de referencia sobre la mesa del diorama de referencia, alrededor de un papel doblado. El dorado y el azul se inclinan uno contra el otro discutiendo, el verde se mete entre los dos con su cable, el coral los filma con su camarita y el violeta mira el papel con la lupa. Misma luz cálida, mismo fondo negro mate, mismo estilo de plastilina. Formato 21:9. Sin texto.

## Indicaciones para el movimiento (Flow)

- Un clip por escena, de 4 a 6 segundos, a partir de su cuadro clave.
- Cámara quieta o con un acercamiento muy lento: el montaje y los cortes se hacen después, en código.
- Pedir movimiento de stop motion: saltitos, cabeceos, cuerpos que se aplastan y se estiran.
- La mano del orquestador entra desde arriba, golpea la mesa dos veces con un dedo y señala.
- Nada de texto, globos ni interfaz dentro del video: eso se agrega en Remotion.
