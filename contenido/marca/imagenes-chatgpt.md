# Imágenes con ChatGPT

El agente del navegador genera las imágenes en el ChatGPT de Mario: hasta 10 tandas por imagen. El texto **nunca** va en la imagen; lo pone el código. La imagen es atmósfera o metáfora; el mensaje lo dice la tipografía.

## Estilo base (va en todos los prompts)

```
Fotografía editorial en blanco y negro, alto contraste, grano fino, mucho espacio negativo.
Composición minimalista con un solo sujeto. Luz lateral dura, sombras profundas.
Sin texto, sin letras, sin números, sin logos, sin marcas de agua, sin interfaces de pantalla legibles.
Sin rostros visibles. Estética sobria y precisa, como una revista de arquitectura.
```

## Sujetos que encajan

| Tema | Ideas de sujeto |
|---|---|
| Sistemas y automatización | Engranajes de reloj abiertos, cables ordenados en un rack, una fila de interruptores, agua que pasa por canales |
| Criterio e IA | Una pieza de ajedrez sola, una lupa sobre papel, dos caminos en un bosque, una mano que corrige con lápiz |
| Oficio, diseño y código | Manos sobre un teclado (sin pantalla legible), una regla y una escuadra, una maqueta de cartón, bocetos sobre una mesa |
| Casos (negocios) | El objeto del rubro en abstracto: una tijera de barbero, una manguera con agua en contraluz, un estetoscopio, un volante |
| Comunidad | Sillas vacías alrededor de una mesa, un micrófono de pie, papeles con marcas de votación (sin texto legible) |

## Plantilla de prompt

```
[Estilo base]
Sujeto: <sujeto concreto, una frase>.
Encuadre: <primer plano | plano medio | cenital>, sujeto en el <tercio izquierdo | centro | tercio inferior>, el resto en negro.
Formato: <4:5 vertical | 9:16 vertical | 1:1 cuadrado>.
```

**Formato por slot** (lo dice `pieza.json` en `imagenes[].formato`):
- `feed` → 4:5 (1080×1350)
- `reel` → 9:16 (1080×1920)
- `cuadrado` → 1:1 (1080×1080)

## Control de calidad (elegir entre las tandas)

Una imagen se descarta si:
- tiene texto, letras o números, aunque sean ilegibles;
- tiene logos o marcas;
- tiene una cara reconocible;
- tiene manos o dedos deformes;
- tiene objetos imposibles;
- es en color (el render la pasa a grises, pero mejor que venga en B/N);
- tiene el sujeto donde va el texto: revisá el encuadre que pide el prompt.

Si después de 10 tandas ninguna sirve, el agente deja la mejor como `<slot>-candidata.png` y anota el problema en `imagenes/NOTAS.md`. No inventa otra solución.

## Dónde se guardan

- La elegida va en `piezas/<id>/imagenes/<slot>.png`; el validador la busca con ese nombre.
- Las descartadas que valga la pena conservar van como `<slot>-alt-1.png`, `<slot>-alt-2.png`, etc.
- Medida: la proporción del formato (el validador acepta hasta un 3 % de diferencia). Si ChatGPT entrega otra medida, se recorta al formato sin deformar.
