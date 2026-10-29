# Encargo · Tandas de contenido con Codex · 28/10/2026

**Quién:** Codex, trabajando directo en este repositorio. Genera las placas con su propio generador de imágenes, sin manejar el navegador. Compone, renderiza y audita lo que hace. **Mario** revisa y aprueba. Nada se publica.

**Prompt para lanzarlo:** [`../agentes/PROMPT-codex.md`](../agentes/PROMPT-codex.md).

**Qué tiene que leer Codex antes de empezar:**
- las skills de `.agents/skills/`: `contenido-redes` y `contenido-mejora-continua`;
- [`../marca/guion.md`](../marca/guion.md): método y posicionamiento;
- [`../tandas/README.md`](../tandas/README.md);
- [`../diseno/kit.css`](../diseno/kit.css) y [`../diseno/formatos/`](../diseno/formatos/);
- las tres piezas del piloto, como nivel de referencia: `../piezas/2026-10-28-*/` (brief.md, diseno.html y salida/);
- [`../ideas-pilares.md`](../ideas-pilares.md): el detalle de cada idea.

---

## En números

| | |
|---|---|
| Piezas | **36**, en 9 tandas de 4, más una tanda 00 de calentamiento |
| Tarjetas sueltas (1 lámina) | 7 |
| Carruseles de 3 láminas | 9 |
| Carruseles de 4 láminas | 11 |
| Carruseles de 5 láminas | 9 |
| Láminas en total | **123**, un promedio de **3,4 láminas por pieza** |
| Placas de imagen | 30: la portada de cada carrusel y la tarjeta 20. Las otras 6 tarjetas son tipográficas |
| Pilares | IA aplicada en 22 piezas (incluye 2 de marketing con IA), automatización 5, CRM 3, landings y marketing 2, trabajar con Mario 4 |

Cada tanda mezcla formatos: casi siempre una tarjeta, un carrusel de 3, uno de 4 y uno de 5. Así el feed alterna fotos y tipografía.

---

## Cómo se trabaja cada tanda

1. **Bitácora.** Leer [`../mejoras.md`](../mejoras.md) y aplicar el punto abierto desde el brief. En la tanda 01 es el ciclo 02: oferta desde el alto valor.
2. **Crear las piezas** en `piezas/<fecha de creación>-<slug>/`. La fecha es la del día en que Codex crea la pieza; no la programa. Cada pieza lleva:
   - `brief.md`: persona y momento, insight, tres ganchos con técnica, guion lámina por lámina con puentes, oferta, acento, placa y veracidad. Sigue `guion.md`, secciones 2 y 10, partiendo de la idea de `ideas-pilares.md`.
   - `copy.md`: Instagram y LinkedIn por separado.
   - `alt.md`: texto alternativo por lámina.
   - `pieza.json`: `generador: "html"`, `estado: "borrador"`, `postura: true` si la idea dice «confirma Mario» o si es una opinión, y `ejemplo: true` si hay datos recreados.
3. **Auditar el copy,** en una sola ronda, con la rúbrica de [`../agentes/lector-de-audiencia.md`](../agentes/lector-de-audiencia.md). No pasa al arte sin 2 en Curiosidad y en Novedad, sin ceros y con Veracidad aprobada. El puntaje se anota en el brief, y también se pasa la lista negra completa: duda, hambre y humo.
4. **Carpeta de la tanda** en `tandas/<fecha>-codex-NN/`:
   - `instrucciones.md`: copiada del piloto, la dirección de la serie;
   - `brief-tanda.md`: por pieza, de qué trata, el titular (que no se dibuja), la metáfora, la placa, la cámara y la zona libre;
   - `pedidos.md`: los prompts exactos usados en el generador.
5. **Placas.** Con el generador de imágenes de Codex, una placa sin texto por pieza que la lleve: vertical 4:5, objeto en el tercio inferior y zona libre para el titular. Se le pasan las instrucciones de la serie y el brief de esa pieza, no un prompt suelto.
   - Guardar el original como `imagenes/portada-v1.png`, elegir con los criterios de [`../marca/imagenes-chatgpt.md`](../marca/imagenes-chatgpt.md) y convertir con `npx tsx scripts/placa-marca.ts <id>` (desde `web/`).
   - Si el generador se agota o pide confirmación, se anota y se sigue con las tarjetas tipográficas.
6. **Componer** `diseno.html` sobre `kit.css`. Se diseña cada pieza, usando como referencia los formatos y el piloto. Están prohibidas dos cosas: copiar una pieza cambiando el texto y repetir la misma composición en toda la tanda.
7. **Renderizar y validar** desde `web/`: `npx tsx scripts/render-laminas.ts <id>` y `npx tsx scripts/check-pieza.ts <id>`.
8. **Auditoría visual.** Abrir cada PNG a tamaño completo y en una miniatura de 360 px, y chequear:
   - el titular se lee en la miniatura;
   - no hay desbordes ni palabras sueltas al final de un párrafo;
   - la señal aparece como mucho una vez por lámina, con la función que declara el brief;
   - lo recreado lleva el rótulo «ejemplo recreado»;
   - no hay glifos que las fuentes no tienen (`→`, `›`, `…`): se dibujan en CSS o se cambian;
   - el contraste es suficiente y el folio y el contador están bien.

   Se corrige y se vuelve a renderizar, como mucho dos rondas. Lo que siga mal se anota en el informe.
9. **Galería** `tandas/<tanda>/galeria.html`: copiar `tandas/2026-10-28-piloto/comparacion.html`, sin la fila «antes», con las piezas de la tanda.
10. **Ciclo de mejora:** verificar el punto aplicado, registrarlo en `mejoras.md` y abrir el siguiente con la skill `contenido-mejora-continua`. La evidencia sin Mario es la rúbrica y la comparación con la tanda anterior, y se registra como tal.
11. **Informe** `tandas/<tanda>/INFORME.md`. Incluye:
   - las piezas con su formato y su puntaje;
   - las decisiones de diseño;
   - lo que Mario tiene que confirmar: posturas, ofertas, datos y formato de la asesoría;
   - lo que quedó pendiente.
12. **Git:** trabajar en la rama `contenido/codex-tandas`, con un commit por tanda que lleve solo los archivos de esa tanda. Sin push ni merge a `main`. Las imágenes y los renders no van a git; ya están en `.gitignore`.

Después de cada tanda se pasa a la siguiente sin esperar a Mario. Hay que frenar e informar si una pieza no aprueba la auditoría tras dos rondas, si falla el validador por algo que no es de la tanda, o si aparece algo que exija una decisión de Mario.

---

## Formatos: el arco según la cantidad de láminas

| Formato | Arco | Notas |
|---|---|---|
| **Tarjeta (1)** | La lámina es el gancho y el criterio a la vez | Tipográfica, en banda marfil o pared. El caption hace el giro, da la prueba y la oferta |
| **Carrusel de 3** | Gancho, después prueba o criterio, después oferta | La lámina 2 se entiende sola. La oferta resume el criterio en una línea |
| **Carrusel de 4** | Gancho, giro, prueba o criterio, oferta | El formato del piloto, comprimido |
| **Carrusel de 5** | Gancho, giro, prueba, criterio, oferta | El arco completo de `guion.md` |

---

## Reglas que no se negocian

- **Borrador siempre.** Codex no aprueba ni publica. Mario aprueba y pide la publicación pieza por pieza.
- **Veracidad** ([`../marca/reglas.md`](../marca/reglas.md)):
  - la prueba real es solo la que existe en el repo, y se cita el archivo;
  - los números de trabajo propio se vuelven a verificar en el momento; por ejemplo, el total de pruebas del sitio con `npx playwright test --list`;
  - lo recreado se rotula;
  - si se afirma una capacidad de un modelo o herramienta, va con fecha y una fuente actual en el brief.
- **Posicionamiento** (`guion.md`, «Desde dónde se vende» y sección 7): alto valor, directo con Mario, para quién es y el primer paso. Sin cupos, precios, gratuidad ni plazos inventados, y sin muletillas de hambre.
- **Marca:**
  - pared, marfil y la señal `#71F3A2` una vez por lámina, con una sola función por pieza;
  - no aparecen caras, logos de terceros ni texto dentro de las placas;
  - monograma oficial del kit.
- **Las piezas con «confirma Mario»** llevan `postura: true` y una nota en el informe.

---

## Tanda 00 · Calentamiento (3 piezas, solo cierres)

Pasar los cierres del piloto a la fórmula del ciclo 02. En cada pieza se cambian la lámina de oferta y la oferta de los dos captions, y se vuelve a renderizar. La pieza se toca solo en eso.

| Pieza | Cierre actual | Dirección del cierre nuevo |
|---|---|---|
| `2026-10-28-cotizar-trabajos-a-medida` | «Mandame el link… te devuelvo qué preguntas le faltan» | Diseño formularios que dejan cotizar, lo hago yo de punta a punta; para empresas que cotizan a medida; escribime con tu caso |
| `2026-10-28-agencias-landing-entrega` | «Pasame el diseño aprobado. Te devuelvo la lista de pruebas» | Implemento con «terminado» escrito antes de empezar; trabajás conmigo, sin intermediarios; contame qué está aprobado |
| `2026-10-28-servicios-que-incluye` | «Mandame tu página. Te devuelvo las tres respuestas» | Reescribo páginas de servicio; lo hago yo; para consultores que reciben «¿qué incluye?»; contame qué vendés |

Sirve también para comprobar que Codex maneja el kit y el render antes de las tandas nuevas.

---

## Las nueve tandas

El número de idea remite a [`../ideas-pilares.md`](../ideas-pilares.md). El gancho es el elegido; Codex puede mejorarlo si la rúbrica lo justifica y lo anota en el brief. Las placas son objetos de taller u oficina, en la misma serie de luz que el piloto.

### Tanda 01 · Qué delegar a la IA

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 01 | `tres-ias-y-yo` | Carrusel 5 | IA | «Este carrusel lo hicimos tres IAs y yo.» | Tres herramientas distintas alineadas (lápiz, regla, lupa) y un lugar vacío para la cuarta |
| 05 | `cuatro-preguntas-para-delegar` | Carrusel 4 | IA | «4 preguntas para saber si una tarea se puede delegar. La cuarta casi nadie la contesta.» | Cuatro bloques de madera apilados en escalera |
| 24 | `agente-sin-manual` | Carrusel 3 | IA | «Un agente sin manual es un pasante sin inducción.» | Un cuaderno cerrado atado con un cordel |
| 29 | `que-te-sacarias-de-encima` | Tarjeta | IA | «La pregunta no es qué puede hacer la IA. Es qué te sacarías de encima mañana.» | Tipográfica, banda marfil |

### Tanda 02 · Cómo funciona por dentro

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 02 | `modelo-aplicacion-arnes` | Carrusel 5 | IA | «No te falta un modelo mejor. Te falta un arnés.» | Un arnés de seguridad de altura enrollado sobre concreto |
| 03 | `la-ia-necesita-una-carpeta` | Carrusel 4 | IA | «No es que la IA se olvide. Es que cada chat empieza de cero.» | Una carpeta de archivo de cartón cerrada, con separadores |
| 12 | `automatizacion-aburrida` | Carrusel 3 | Automatización | «La automatización que más rinde es la más aburrida.» | Un interruptor de palanca de pared, en primer plano |
| 40 | `no-subcontrato` | Tarjeta | Trabajar con Mario (confirma Mario) | «No subcontrato. Si me escribís, te contesto yo.» | Tipográfica con monograma |

### Tanda 03 · Agentes con criterio

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 04 | `enjambre-es-organigrama` | Carrusel 5 | IA | «Si no podés dibujar el organigrama, no armes el enjambre.» | Una fila de sellos de goma de distintos tamaños, sin grabado visible |
| 23 | `permisos-para-agentes` | Carrusel 4 | IA | «La IA ya puede usar tu computadora. ¿Qué la dejarías hacer?» | Una llave puesta en una cerradura de puerta lisa |
| 14 | `tres-senales-automatizar` | Carrusel 3 | Automatización | «Tres señales de que una tarea ya pide automatización.» | Tres piedras planas apiladas |
| 30 | `aburre-y-se-repite` | Tarjeta | Automatización | «Si una tarea te aburre y se repite, ya es candidata.» | Tipográfica, con resaltado en señal |

### Tanda 04 · Escribir con IA sin sonar a IA

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 38 | `palabras-prohibidas-ia` | Carrusel 5 | Marketing e IA | «Mi lista de palabras prohibidas para textos con IA.» | Una goma de borrar gastada sobre una hoja |
| 22 | `pedido-como-brief` | Carrusel 4 | IA | «Una línea contra una página. Adiviná cuál trae la respuesta que querías.» | Un plano enrollado con una banda elástica |
| 27 | `transcribir-no-es-documentar` | Carrusel 3 | IA | «Transcribir una reunión no es documentarla.» | Un micrófono de mesa |
| 41 | `herramienta-por-semana` | Tarjeta | IA | «Una herramienta nueva por semana no es una estrategia.» | Tipográfica |

### Tanda 05 · La capa humana

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 19 | `hablas-conmigo` | Carrusel 5 | Trabajar con Mario (confirma Mario) | «La persona con la que hablaste el lunes es la que escribe el código el martes.» | Dos sillas enfrentadas |
| 17 | `landing-una-decision` | Carrusel 4 | Landings | «Una landing no es una web más corta. Es una sola decisión.» | Una sola llave sobre la mesa |
| 18 | `oferta-en-una-frase` | Carrusel 3 | Marketing | «Antes de la landing, tu oferta en una frase.» | Una tarjeta en blanco apoyada contra un sobre |
| 20 | `pocos-proyectos` | Tarjeta con placa | Trabajar con Mario (confirma Mario) | «Por qué trabajo con pocos proyectos a la vez.» | Un reloj de arena |

### Tanda 06 · Límites claros

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 06 | `que-hace-bien-la-ia` | Carrusel 5 | IA | «Lo que la IA hace bien hoy, y lo que todavía no.» | Una balanza de platos vacía y equilibrada |
| 07 | `modelos-cambian-proceso-no` | Carrusel 4 | IA | «Esperar el modelo perfecto es la forma más cara de no empezar.» | Un portalámparas con la bombilla desenroscada al lado |
| 09 | `politica-de-ia-del-equipo` | Carrusel 3 | IA | «Tu equipo ya usa IA. ¿Sabés con qué datos?» | Un candado abierto |
| 39 | `para-quien-es-tu-negocio` | Tarjeta | IA y marketing | «Lo que la IA no puede decidir por vos: para quién es tu negocio.» | Tipográfica |

### Tanda 07 · Método

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 37 | `publicar-con-ia-sin-sonar-a-ia` | Carrusel 5 | Marketing e IA | «Cómo publico con IA sin sonar a IA.» | Una pila ordenada de hojas en blanco con un clip |
| 08 | `ia-revisa-ia` | Carrusel 4 | IA | «Mi copywriter es una IA. Mi editor también. El que decide soy yo.» | Una lupa sobre una hoja en blanco |
| 13 | `desorden-mas-rapido` | Carrusel 3 | Automatización | «Automatizar un proceso desordenado lo hace desordenado más rápido.» | Un cable enredado sobre el piso |
| 42 | `automatizar-no-es-dejar-de-mirar` | Tarjeta | Automatización | «Automatizar no es dejar de mirar. Es mirar menos veces lo mismo.» | Tipográfica |

### Tanda 08 · De la consulta al sistema

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 11 | `copiar-y-pegar` | Carrusel 5 | IA (confirma Mario) | «La IA no reemplaza al que decide. Reemplaza al que copia y pega.» | Unas tijeras de papel abiertas |
| 28 | `ia-primer-filtro` | Carrusel 4 | IA | «Primer filtro, no última palabra.» | Un timbre de recepción de mostrador |
| 10 | `antes-de-pagar-ia` | Carrusel 4 | IA | «Cinco preguntas antes de pagar una herramienta de IA. La quinta es la que importa.» | Una billetera de cuero cerrada |
| 33 | `tres-puertas-una-bandeja` | Carrusel 3 | CRM | «WhatsApp, mail y formulario: tres puertas, una sola bandeja.» | Una bandeja de metal de escritorio vacía |

### Tanda 09 · Trabajar juntos

| Idea | Slug | Formato | Pilar | Gancho | Placa |
|---|---|---|---|---|---|
| 21 | `primera-sesion` | Carrusel 5 | Trabajar con Mario (confirma Mario) | «Qué pasa en una primera sesión conmigo.» | Dos tazas sobre una mesa |
| 15 | `crm-que-nadie-carga` | Carrusel 4 | CRM | «El CRM más caro es el que nadie carga.» | Un fichero de metal con el cajón abierto y vacío |
| 25 | `que-es-una-skill` | Carrusel 4 | IA | «Qué es una skill, y por qué tu equipo debería escribir las suyas.» | Una caja de herramientas abierta con una sola herramienta |
| 16 | `contar-consultas-semana` | Carrusel 3 | CRM | «Antes de elegir CRM, contá tus consultas de una semana.» | Siete clips en fila |

---

## Al terminar todo

Codex deja `tandas/RESUMEN-codex.md` con:
- las piezas por tanda y su puntaje;
- los ciclos de mejora aplicados y qué resultado dio cada uno;
- lo que Mario tiene que confirmar, agrupado: posturas, ofertas, datos y formato de la asesoría;
- las cinco piezas que Codex recomienda publicar primero y por qué.
