# Guion · cómo se escribe una pieza que frena, enseña y vende

Método único para carruseles y piezas estáticas de LinkedIn e Instagram. Reemplaza el método de `../agentes/copywriter.md` para estos formatos; la voz sigue en `voz.md` y la honestidad en `reglas.md`.

La regla de fondo: **Claude escribe todo el texto. ChatGPT nunca redacta; solo genera imágenes sin texto.** El diseño compone el texto exacto en código.

---

## 1. Lo que dice el estudio (28/10/2026)

Revisamos guías y análisis de carruseles B2B de LinkedIn e Instagram. Casi todas las cifras publicadas vienen de proveedores de herramientas, así que las tomamos como dirección, no como verdad. Los patrones que se repiten:

- **La portada es una miniatura.** En LinkedIn el documento aparece con la primera página y el número de páginas; en Instagram, como un cuadro más del feed. Se decide en un segundo, con el pulgar en movimiento.
- **La lámina 2 es la que más lectores pierde** y además es la que Instagram vuelve a mostrar cuando alguien no interactuó la primera vez. Tiene que funcionar sola: nada de "como te decía".
- **Cada lámina responde la pregunta anterior y abre la siguiente.** Si no hace ninguna de las dos cosas, es el lugar donde la persona deja de deslizar.
- **Tres líneas por lámina como techo.** Una idea por lámina; si el resumen necesita un "y", son dos láminas.
- **Entre 5 y 8 láminas.** Menos de 5 no sostiene la lectura; después de 10 o 12 se cae la terminación.
- **Guardar y compartir pesan más que el like.** Se guarda lo que se va a usar después: una lista, un criterio, un antes/después, una prueba para hacer.
- **Lo que parece un aviso se saltea.** La pieza tiene que leerse como alguien que sabe mostrando cómo piensa, no como una publicidad.
- **El cierre convierte cuando el paso es concreto** y continúa el problema de la pieza. "Escribime" o "contactanos" no es un paso.

Fuentes consultadas: [Socialinsider](https://www.socialinsider.io/blog/linkedin-carousel/), [Oktopost](https://www.oktopost.com/blog/linkedin-carousel-pdf-best-practices/), [TryMyPost](https://www.trymypost.com/blog/linkedin-document-posts-vs-carousels-2026), [Carouselli](https://carouselli.com/blog/linkedin-carousel-body-copy), [Hristo Butchvarov](https://hristobutchvarov.substack.com/p/carousel-design-that-converts-what), [Contentdrips](https://contentdrips.com/blog/2026/06/carousel-hook-examples/), [Usevisuals](https://usevisuals.com/blog/linkedin-carousel-call-to-action-examples).

---

## 2. El brief (`piezas/<id>/brief.md`)

Antes de escribir una palabra de copy, el brief responde esto. Si un campo queda vacío, la pieza no está lista para escribirse.

```markdown
# Brief · <id>

**Persona y momento:** quién es (rol, tipo de negocio) y en qué momento exacto aparece el problema.
**Lo que cree hoy:** la idea que tiene y que la pieza va a mover.
**Insight:** una línea. Lo que no sabe o no había visto así.
**Servicio que se vende:** el alcance concreto que Mario ofrece para esto.
**Prueba visible:** qué se ve en la pieza que demuestra el insight (artefacto, trabajo propio, fuente).
**Ganchos:** tres, cada uno con su técnica (sección 4). Elegido: cuál y por qué.
**Oferta de entrada:** qué le pide Mario a la persona para empezar y qué le devuelve.
**Acento:** qué palabra, marca o dato lleva el verde señal (uno por pieza).
**Placas de imagen:** qué lámina lleva foto y qué metáfora cumple.
**Veracidad:** qué se afirma, de dónde sale y qué está rotulado como ejemplo.
```

## 3. El insight: sin insight no hay pieza

Un insight es algo que la persona **no sabía, o sabía sin poder decirlo**, y que cambia una decisión. Pruebas para saber si lo es:

- **¿Lo podría haber escrito cualquiera?** "Respondé rápido tus consultas" no es insight. "La consulta que más tarda en cerrarse es la que llega con menos datos" sí.
- **¿Contradice algo cómodo?** Si todos están de acuerdo con la frase sin pensar, no mueve nada.
- **¿Se puede mostrar?** Si no hay forma de hacerlo visible (un formulario, un recorrido, una salida de prueba), todavía es una opinión. Buscá la prueba o cambiá el insight.
- **¿Cabe en una línea?** Si necesita un párrafo, todavía no está pensado.

## 4. El gancho: seis técnicas

La portada tiene como máximo diez palabras en el titular. Tiene que ser específica, para que la persona imagine la respuesta, y abierta, para que no pueda adivinarla.

| Técnica | Cómo funciona | Ejemplo en voz de Mario |
|---|---|---|
| **Contradicción** | Da vuelta una creencia cómoda | "El formulario más corto te trae los peores presupuestos." |
| **Error nombrado** | Señala dónde está la falla, sin decir todavía cuál es | "El presupuesto no se traba en el precio. Se traba en la pregunta 1." |
| **Escena con hora u objeto** | Pone al lector adentro de un momento concreto | "23:45. Entra una consulta. Nadie la ve hasta el lunes." |
| **Número contable** | Promete una lista cerrada y adelanta un dato | "3 preguntas antes del precio. La tercera evita la visita." |
| **Antes / después** | Muestra el cambio y esconde el cómo | "Mismo formulario. Una pregunta distinta." |
| **Pregunta sin respuesta fácil** | Pide algo que el lector no puede contestar sin deslizar | "¿Cuándo está terminada una landing?" |

Se escriben las tres variantes en el brief, cada una con una técnica distinta, y se elige una. No se maquilla la misma frase tres veces.

## 5. El arco del carrusel

Cinco roles. Un carrusel de 5 láminas usa uno por lámina; uno de 7 u 8 estira la **prueba** o el **criterio**, nunca el gancho.

| Rol | Qué hace | Regla |
|---|---|---|
| **Gancho** (portada) | Frena y abre la pregunta | Imagen o artefacto dominante; titular corto; nada de párrafos |
| **Giro** (lámina 2) | Dice qué está mal en lo que la persona cree | Se entiende sola: es la segunda portada |
| **Prueba** | Muestra el problema o la solución | Un artefacto, una captura propia o una fuente; se ve, no se cuenta |
| **Criterio** | La regla que la persona se lleva | Afirmativa y aplicable mañana; es lo que se guarda |
| **Oferta** | El paso concreto con Mario | Sección 7 |

**Puentes entre láminas.** Cada lámina termina con una de estas cuatro salidas:

1. **Pensamiento incompleto:** la frase se cierra en la siguiente.
2. **Anuncio directo:** "La tercera es la que nadie pregunta."
3. **Contraste:** la lámina siguiente es lo opuesto ("Esto pide el formulario típico. → Esto pide uno que cotiza.").
4. **Número que sigue:** "01 / 03" con el siguiente visible.

Si una lámina no deja nada abierto y no es la última, se elimina o se fusiona.

**Densidad.** Como máximo tres líneas de cuerpo por lámina y 25 palabras de cuerpo. Si no entra, se corta texto; no se achica la letra.

## 6. La prueba: qué podemos mostrar

Mario autorizó (28/10) usar como prueba:

- **Artefactos recreados:** formularios, mails, páginas, mensajes, presupuestos. Se diseñan en código, se rotulan "ejemplo" en la lámina y usan datos de muestra evidentes.
- **Trabajo propio:** su sitio, sus sistemas, sus scripts de prueba, su sistema de contenido y fotogramas de sus films. **Nunca datos de clientes visibles:** sin nombres, teléfonos, emails ni montos reales. Si la captura es de un proyecto de cliente, se revisa cuadro por cuadro o no se usa.
- **Proceso:** cómo diagnostica, qué decide, qué entrega y cómo lo comprueba.
- **Fuentes públicas:** con enlace en el caption cuando hay un dato externo.

Lo que sigue prohibido: cifras de resultado, testimonios inventados, interfaces con números falsos presentadas como reales y experiencias que Mario no confirmó.

## 7. La oferta: vender desde la seguridad

El cierre no pide permiso, ofrece un trabajo. La fórmula es:

> **Qué hago** (alcance concreto) + **qué me mandás para empezar** + **qué te devuelvo**.

- "Diseño formularios de presupuesto que piden lo que hace falta para cotizar. Mandame el tuyo y te devuelvo las preguntas que le faltan."
- "Implemento landings con la definición de terminado escrita y probada. Si tenés una por entregar, pasame el diseño y te mando qué pruebas va a pasar."

Reglas:

- Sin precio, gratuidad, plazos ni disponibilidad que Mario no haya confirmado. "Te devuelvo" describe un trabajo, no promete que sea gratis. Si Mario define una condición, se agrega.
- Una sola oferta por pieza, ligada al problema de esa pieza.
- La lámina de oferta repite el verbo del servicio en grande y deja el paso abajo. El caption repite el paso con otras palabras.

## 8. Caption por plataforma

**LinkedIn (documento PDF).** Antes de "ver más" se ven dos líneas, y esas dos líneas son el gancho. Se escribe en primera persona cuando habla Mario. El cuerpo va de 120 a 220 palabras, en párrafos de una a tres líneas, y desarrolla la idea que la imagen no alcanza: el porqué. Cierra con la oferta y una pregunta específica que se pueda contestar en un comentario. Hasta tres hashtags.

**Instagram (carrusel).** La primera línea es el gancho con otras palabras, no la misma frase de la portada. Siguen de dos a cuatro líneas con el criterio, después la oferta, y "Guardalo para cuando…" si la pieza es de uso. Entre tres y cinco hashtags específicos.

Los captions no repiten el carrusel: lo complementan.

## 9. Lista negra

**Muletillas de duda.** Se sacan siempre, porque le quitan seguridad a Mario:

| En vez de | Escribí |
|---|---|
| "podés necesitar", "puede ayudar", "podría servir" | el verbo afirmativo: "necesitás", "sirve para" |
| "quizá", "tal vez", "en algunos casos" | la condición concreta: "si el trabajo depende de la medida, …" |
| "conviene", "es recomendable" | la indicación: "pedí", "sacá", "agregá" |
| "si te pasa, escribime" | la oferta con alcance (sección 7) |
| "revisamos por dónde empezar" | qué se revisa y qué se devuelve |

**Señales de texto genérico (slop):**

- "En un mundo donde…", "Hoy más que nunca…", "La clave está en…", "No se trata de X, se trata de Y" (una vez por pieza como máximo, y solo si es el giro).
- Tríadas de abstractos: "claridad, confianza y crecimiento".
- Verbos de humo: "potenciá", "optimizá", "impulsá", "transformá", "llevá al siguiente nivel".
- Frases que podría firmar cualquier agencia. Prueba: si se cambia "Mario" por otro nombre y nada se rompe, la frase es genérica.
- Preguntas retóricas en cadena.
- Emojis de relleno, flechas decorativas y signos de exclamación.

**Lo que sí suena a Mario:** sustantivos concretos (formulario, campo, visita, entrega, prueba), verbos de oficio (pedir, probar, entregar, cotizar, revisar) y criterio dicho sin vueltas.

## 10. Guion lámina por lámina (`brief.md`, sección "Guion")

```markdown
| # | Rol | Texto exacto | Visual | Puente → |
|---|---|---|---|---|
| 01 | Gancho | Titular / bajada | Placa GPT: … o artefacto: … | Qué queda abierto |
| 02 | Giro | … | … | … |
| … | | | | |
```

La columna **Puente** es obligatoria. La columna **Visual** dice qué formato de `../diseno/formatos/` usa la lámina y dónde va el acento.

## 11. Antes de pasar al arte

1. Leé la portada sola, a tamaño de teléfono. ¿Frena? ¿Se entiende sin contexto?
2. Leé solo la lámina 2. ¿Funciona como portada?
3. Leé el carrusel en voz alta. Donde te trabás o suena a folleto, se reescribe.
4. Prueba del "¿y qué?": después de cada lámina, ¿la persona sabe algo que antes no sabía?
5. Pasá la lista negra.
6. Una sola lectura independiente con la rúbrica de `../agentes/lector-de-audiencia.md`. Pasa al arte con 2 en Curiosidad y en Novedad, sin ceros y con Veracidad aprobada.
