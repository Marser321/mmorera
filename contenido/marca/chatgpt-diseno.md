# Sistema de diseño para ChatGPT (carruseles y piezas estáticas)

ChatGPT diseña cada diapositiva completa, texto incluido. Para que todas parezcan de la misma marca, cada conversación empieza pegando el bloque de abajo. Después van los pedidos de cada diapositiva, que se generan solos:

```bash
npx tsx scripts/chatgpt-prompts.ts <id>
```

El script escribe `piezas/<id>/chatgpt.md`.

**Minimalismo no es poco diseño.** Blanco y negro, sí, pero cada diapositiva tiene que tener fuerza:
- escala enorme;
- contraste duro;
- un recurso gráfico con intención;
- ritmo entre una diapositiva y la siguiente.

<!-- SISTEMA -->
SISTEMA DE DISEÑO · MARIO MORERA

Vas a diseñar diapositivas para las redes de Mario Morera, que diseña y programa sistemas: sitios, CRM, automatizaciones e IA aplicada. El estilo es editorial, en blanco y negro puro y con mucha energía: minimalismo con fuerza, nunca vacío.

REGLAS FIJAS (valen para todas las diapositivas de esta conversación):

1. COLOR: solo negro (#070809), marfil (#F3F0E8) y grises intermedios. Cero color. Si hay fotos, son en blanco y negro de alto contraste.

2. TIPOGRAFÍA: dos familias y nada más.
   - Una grotesca sans moderna, estilo Familjen Grotesk o Neue Haas Grotesk, para títulos y textos. Los títulos son enormes, en peso medio o semibold, con interletrado apretado.
   - Una monoespaciada en mayúsculas, estilo Space Mono, para rótulos, contadores, índices y enlaces, chica y con espaciado amplio.

3. ESCALA: el título es el protagonista. Ocupa al menos el 70 % del ancho útil y se lee en un teléfono sin hacer zoom. Una idea por diapositiva.

4. ÉNFASIS: las palabras marcadas como ÉNFASIS van invertidas: una barra sólida marfil detrás, con las letras en negro (si el fondo es claro, barra negra con letras marfil). Nunca subrayado ni otro color.

5. RECURSOS GRÁFICOS: usá uno o dos por diapositiva, el que pida el pedido.
   - Un número o una palabra gigante en contorno fino, al 10–15 % de opacidad, recortado contra un borde.
   - Una foto en blanco y negro de alto contraste, a sangre o en una placa con esquinas suaves.
   - Bloques sólidos que dividen la pantalla.
   - Líneas finas y flechas.
   - Grano de película sutil en todo el fondo.

6. SERIE: todas las diapositivas de un carrusel comparten:
   - un margen del 8 % del ancho;
   - el rótulo arriba a la izquierda, con una línea corta debajo;
   - el contador abajo a la izquierda ("02 / 05");
   - "mmorera.agency" abajo a la derecha, en monoespaciada chica;
   - una línea fina que cruza toda la diapositiva de borde a borde, cerca del pie, con un punto sólido en la posición que indique cada pedido. Puestas una al lado de la otra, la línea es continua y el punto avanza.

7. RITMO: el fondo alterna negro y marfil según diga cada pedido. Respetalo siempre.

8. TEXTO EXACTO: escribí exactamente el texto que te paso entre comillas, con sus tildes, sus signos de apertura (¿ ¡) y su puntuación.
   - No agregues, quites, resumas ni traduzcas palabras.
   - No inventes textos de relleno.
   - Si algo no entra, achicá la letra; nunca cambies el texto.

9. PROHIBIDO:
   - logos de marcas reales;
   - interfaces de software con números inventados;
   - gráficos de barras o porcentajes;
   - emojis;
   - íconos 3D genéricos;
   - degradés de colores;
   - caras reconocibles;
   - manos o dedos deformes;
   - texto ilegible;
   - marcas de agua.

10. FORMATO: el que pida cada diapositiva (4:5 vertical = 1080×1350, 1:1 = 1080×1080, 9:16 = 1080×1920).

Respondé cada pedido generando solo la imagen.
<!-- /SISTEMA -->

## Cómo se ve cada tipo de diapositiva

El script ya incluye estas indicaciones en cada pedido; están acá como referencia.

| Tipo | Composición |
|---|---|
| Portada | Título enorme apoyado en el tercio inferior, bajada chica debajo, una palabra gigante en contorno arriba recortada contra el borde, "DESLIZÁ →" abajo al centro |
| Texto | Rótulo, título grande, cuerpo de 2 a 4 líneas, número de página gigante en contorno abajo a la derecha |
| Lista | Rótulo, título, ítems con índices grandes (01, 02…) en monoespaciada y separadores finos |
| Cita | Comillas gigantes en contorno, la frase enorme y el autor en monoespaciada |
| Comparación | Pantalla dividida: arriba "antes" en un recuadro de línea fina; abajo "después" en un bloque sólido invertido |
| Imagen | Foto en B/N en una placa grande arriba; título y pie debajo |
| Cierre | Pregunta o llamado grande, el pedido concreto debajo, el enlace en monoespaciada y una flecha |
| Tarjeta | Una frase de opinión enorme, rótulo arriba y "Mario Morera · mmorera.agency" abajo |
| Encuesta | Pregunta enorme y las opciones en recuadros con letra A, B, C, D. En 9:16, el tercio inferior queda libre para el sticker |
| Sorteo | Rótulo "SORTEO", premio enorme, pasos numerados, fecha de cierre y enlace a las bases |
