# Sistema de diseño para la versión B (la diapositiva entera)

En la versión B, la IA de imágenes (Codex con `~/bin/imagen`, por defecto; o ChatGPT en el navegador, hoy en pausa por D-016) diseña cada diapositiva completa, texto incluido. Mario ve las dos versiones (A y B) y elige.

Los pedidos se generan solos en el bloque **ENTERA** de `piezas/<id>/chatgpt.md` (y en `pedidos.json`). **Cada pedido es autocontenido:** trae el bloque de abajo y lo propio de la diapositiva, así se pasa entero a Codex o a ChatGPT. Con ChatGPT, además, se adjuntan las referencias de `contenido/marca/referencias/` con la frase «Estas son piezas aprobadas de la marca: copiá su clima, su materia y su tipografía, no su texto».

```bash
npx tsx scripts/chatgpt-prompts.ts <id>
```

La estética es la del sitio, **«Pared y piedra»**: pared negra mate con grano, marfil gastado, la piedra del monograma, títulos anchos. Minimalismo con materia, nunca vacío.

<!-- SISTEMA -->
SISTEMA DE DISEÑO · MARIO MORERA · «PARED Y PIEDRA»

Vas a diseñar diapositivas para las redes de Mario Morera, que diseña y programa sistemas: sitios, CRM, automatizaciones e IA aplicada. El estilo es el de su sitio: editorial, sobrio y con materia. Una pared negra mate con grano, letras marfil gastadas, textura de piedra. Nada de brillo digital.

REGLAS FIJAS (valen para todas las diapositivas de esta conversación):

1. COLOR: pared (#0B0B0A, negro mate) y marfil (#ECE7DD, blanco roto cálido), con grises cálidos entre los dos. Cero color de acento. Si hay fotos, son en blanco y negro cálido.

2. MATERIA: el fondo nunca es plano: grano de película fino sobre todo (también sobre las letras) y, apenas, textura de piedra o de hormigón. Las letras marfil se ven un poco gastadas, como impresas en la pared.

3. TIPOGRAFÍA: tres familias y nada más.
   - TÍTULOS: una display ancha y geométrica, estilo Unbounded, en peso medio (500), con interletrado apenas apretado. Enormes.
   - TEXTOS: una grotesca sobria, estilo Familjen Grotesk, en peso normal.
   - RÓTULOS, contadores, índices y enlaces: una monoespaciada, estilo Space Mono, chica, en mayúsculas y con espaciado amplio.

4. ESCALA: el título es el protagonista y se lee en un teléfono sin hacer zoom. Una idea por diapositiva. Mucho aire alrededor.

5. ÉNFASIS: las palabras marcadas como ÉNFASIS van sobre una barra sólida del color opuesto al fondo (marfil sobre pared, con las letras en pared). Nunca subrayado ni otro color.

6. RECURSOS GRÁFICOS: uno por diapositiva, el que pida el pedido.
   - El arco de un anillo grueso (como el aro de un monograma), con textura de piedra marfil, que entra desde una esquina y se funde. Nunca pasa por encima del texto.
   - Un número gigante en contorno finísimo, al 10 % de opacidad, recortado contra un borde.
   - Una foto en blanco y negro cálido, en una placa con esquinas apenas redondeadas.
   - Un bloque sólido del color opuesto, con textura de piedra (la comparación).
   - Líneas finísimas y flechas finas.

7. SERIE: todas las diapositivas de un carrusel comparten:
   - un margen del 9 % del ancho;
   - el rótulo arriba a la izquierda, con una raya corta debajo;
   - el contador abajo a la izquierda ("02 / 05");
   - "mmorera.agency" abajo a la derecha, en monoespaciada chica;
   - una línea finísima que cruza toda la diapositiva de borde a borde, cerca del pie, con un punto sólido en la posición que indique cada pedido. Puestas una al lado de la otra, la línea es continua y el punto avanza.

8. LUZ: casi todo va sobre la pared. Solo la frase clave (la cita) va invertida, sobre marfil. Respetá el fondo que diga cada pedido.

9. TEXTO EXACTO: escribí exactamente el texto que te paso entre comillas, con sus tildes, sus signos de apertura (¿ ¡) y su puntuación.
   - No agregues, quites, resumas ni traduzcas palabras.
   - No inventes textos de relleno ni firmas.
   - Si algo no entra, achicá la letra; nunca cambies el texto.

10. EL MONOGRAMA NO SE DIBUJA: no pongas ningún logo ni monograma. En el cierre, dejá vacío el rincón que diga el pedido: la firma se pone después.

11. PROHIBIDO:
   - logos de marcas reales;
   - interfaces de software con números inventados;
   - gráficos de barras o porcentajes;
   - emojis;
   - íconos 3D genéricos;
   - degradés de colores y brillos neón;
   - caras reconocibles;
   - manos o dedos deformes;
   - texto ilegible;
   - marcas de agua.

12. FORMATO: el que pida cada diapositiva (4:5 vertical = 1080×1350, 1:1 = 1080×1080, 9:16 = 1080×1920).

Respondé cada pedido generando solo la imagen.
<!-- /SISTEMA -->

## Cómo se ve cada tipo de diapositiva

El script ya incluye estas indicaciones en cada pedido; están acá como referencia. Es la misma composición que la versión A (`web/src/components/social/`).

| Tipo | Composición |
|---|---|
| Portada | Título enorme apoyado abajo, bajada debajo, el arco de piedra entrando por la esquina de arriba a la derecha, "DESLIZÁ →" abajo al centro |
| Texto | Rótulo, título grande, cuerpo de 2 a 5 líneas, número gigante en contorno abajo a la derecha |
| Lista | Rótulo, título, ítems con índices (01, 02…) en monoespaciada y separadores finísimos |
| Cita | Sobre marfil: la frase enorme apoyada abajo, el autor en monoespaciada, el arco arriba a la derecha |
| Comparación | Arriba "antes" en un recuadro de línea finísima; abajo "después" en un bloque sólido del color opuesto, con piedra |
| Imagen | Foto en B/N cálido en una placa grande arriba; título y pie debajo |
| Cierre | Rincón de arriba a la izquierda vacío (ahí va el monograma), pregunta o llamado grande, el pedido concreto, el enlace en monoespaciada |
| Tarjeta | Una frase de opinión enorme, apoyada abajo; el arco arriba a la derecha |
| Encuesta | Pregunta enorme y las opciones en recuadros con letra A, B, C, D. En 9:16, el tercio inferior queda libre para el sticker |
| Sorteo | Rótulo "SORTEO", premio enorme, pasos numerados, fecha de cierre y enlace a las bases |

## La firma del cierre

La IA deforma los logos, así que no dibuja el monograma. `contenido.ts importar` (descargas de ChatGPT) o `contenido.ts firmar <id>` (diapositivas de Codex, ya en `imagenes/`) pega el vector oficial, con la textura de piedra y fundido hacia abajo, en el rincón que el pedido dejó vacío. `firmar` no firma dos veces el mismo archivo.
