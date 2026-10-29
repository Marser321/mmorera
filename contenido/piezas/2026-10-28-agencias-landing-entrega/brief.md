# Brief · 2026-10-28-agencias-landing-entrega

Versión 1 del método `../../marca/guion.md`. La versión anterior está en `v0/`.

**Persona y momento:** responsable de cuentas u operaciones de una agencia chica. El cliente ya aprobó diseño y copy de la landing de campaña y la implementación está tercerizada o por tercerizar. El momento es cuando alguien dice «ya está lista» y nadie sabe bien qué revisar.

**Lo que cree hoy:** que una landing está terminada cuando se parece al diseño aprobado.

**Insight:** una landing está terminada cuando pasa pruebas que se escribieron antes de empezar. Si «terminado» no está escrito, cada revisión lo redefine, y un cambio nuevo se disfraza de corrección.

**Servicio que se vende:** implementación de landings y formularios para agencias, con la lista de pruebas de entrega acordada antes de empezar.

**Prueba visible:** trabajo propio. El sitio de Mario tiene 52 pruebas automáticas escritas (Playwright; `npx playwright test --list` en `web/`, 28/10/2026). La lámina muestra los nombres reales de cinco. No se muestran tildes de «pasó» porque no se corrió la suite para esta pieza.

**Ganchos:**

1. Pregunta sin respuesta fácil: «¿Cuándo está terminada una landing?» **← elegido.** Toda agencia cree saberlo hasta que lo tiene que escribir.
2. Contradicción: «Que se parezca al diseño no significa que esté terminada.»
3. Escena: «“Ya está lista.” La abrís en el celular y el formulario no envía.»

**Oferta de entrada:** «Pasame el diseño aprobado. Te devuelvo la lista de pruebas que va a pasar antes de entregarla.»

**Acento (verde señal):** marca **lo que se comprueba**: los nombres de las pruebas, el número 52 y los índices de la lista de pruebas mínimas.

**Placas de imagen:** solo la portada. Un nivel de burbuja apoyado sobre una superficie de concreto lisa, con la burbuja centrada, luz rasante desde la izquierda y la mitad superior libre. La metáfora: lo terminado se mide.

**Veracidad:**

- El 52 sale del listado real del 28/10 y los nombres de las pruebas se citan tal cual de `web/e2e/site.spec.ts`.
- No se muestran resultados de ejecución.
- La lista de pruebas mínimas es un criterio propuesto, no una norma: **Mario confirma** que la suscribe.
- «Te devuelvo la lista» describe trabajo: **Mario confirma** si esa entrega inicial tiene costo.

## Guion

| # | Rol | Texto exacto | Visual | Puente → |
|---|---|---|---|---|
| 01 | Gancho | Rótulo: PARA AGENCIAS / **¿Cuándo está terminada una landing?** / Bajada: Si no lo escribieron antes, cambia en cada revisión. | Portada fotográfica: placa del nivel de burbuja, con el titular arriba | ¿Entonces cuándo? |
| 02 | Giro | **«Terminada» no es que se parezca al diseño. Es que pasa pruebas que acordaron antes.** | Postura en banda marfil, a pantalla completa | ¿Cómo se ve una prueba escrita? |
| 03 | Prueba | Rótulo: MI SITIO · PRUEBAS REALES / **52 pruebas escritas.** Algunas: / › valida el brief por pasos y enfoca el primer error / › muestra un error recuperable si falla el envío / › mantiene la composición sin desborde en tablet y pantalla ancha / › ofrece un único menú móvil con rutas, idioma, tema y CTA / › publica canonical, hreflang, OG, JSON-LD y sitemap canónicos / Anotación: Cada una es una frase que alguien puede leer y comprobar. | Artefacto: terminal recreada con líneas reales, el 52 en señal | ¿Cuáles necesita una landing de campaña? |
| 04 | Criterio | Rótulo: EL MÍNIMO / **Cinco pruebas que una landing de campaña tiene que pasar.** / 01 El formulario envía y la consulta llega adonde la esperan. 02 Quien consulta ve el próximo paso. 03 En el celular, nada tapa el botón. 04 Si el envío falla, la persona sabe qué hacer. 05 La conversión se registra una sola vez. | Lista que se guarda, con índices en señal | ¿Y cuándo se escriben? |
| 05 | Criterio | Rótulo: ANTES DE EMPEZAR / **Con las pruebas escritas, un cambio fuera de la lista es un pedido nuevo.** / Cuerpo: No una corrección. La lista también dice quién aprueba y qué accesos faltan. | Diagrama: diseño aprobado → pruebas escritas → implementación → entrega, con el nodo «pruebas escritas» marcado | → oferta |
| 06 | Oferta | **Implemento landings con «terminado» escrito y probado.** / Pasame el diseño aprobado. Te devuelvo la lista de pruebas que va a pasar antes de entregarla. | Cierre | — |

## Captions

### Instagram

«Ya está lista.» ¿Según qué?

Para una agencia, una landing está terminada cuando pasa pruebas que se acordaron antes de empezar: el formulario envía, quien consulta ve el próximo paso, nada se rompe en el celular y la conversión se registra.

Con esa lista escrita, cualquier cambio que no esté en ella es un pedido nuevo, no una corrección.

Implemento landings para agencias con «terminado» escrito y probado. Pasame el diseño aprobado y te devuelvo la lista de pruebas que va a pasar.

Guardalo para el próximo arranque.

#Agencias #Landings #DesarrolloWeb #Campañas

### LinkedIn (documento PDF)

¿Cuándo está terminada una landing? Si nadie lo escribió antes de empezar, la respuesta cambia en cada revisión.

Para muchos equipos, «terminada» significa que se parece al diseño aprobado. Pero eso no dice si el formulario envía, adónde llega la consulta, qué ve la persona después ni si la conversión se registra.

Mi sitio tiene 52 pruebas escritas. Cada una es una frase que alguien puede leer y comprobar: «valida el brief por pasos y enfoca el primer error», «muestra un error recuperable si falla el envío». No hace falta automatizar todo para una landing de campaña, pero sí escribir qué se va a comprobar.

La ventaja aparece en la entrega. Con la lista acordada, un cambio que no está en ella es un pedido nuevo, no una corrección. Y la discusión de «esto estaba incluido» se resuelve leyendo la lista.

Implemento landings y formularios para agencias con esa lista desde el arranque. Pasame el diseño aprobado y te devuelvo las pruebas que va a pasar antes de entregarla.

¿Qué prueba agregarías vos a la lista?

#Agencias #DesarrolloWeb #Landings

## Texto alternativo

1. Nivel de burbuja sobre concreto, con la burbuja centrada. Texto: «¿Cuándo está terminada una landing?»
2. Texto sobre fondo marfil: «Terminada» no es que se parezca al diseño. Es que pasa pruebas que acordaron antes.
3. Terminal con cinco nombres de pruebas reales del sitio de Mario y el número 52.
4. Lista de cinco pruebas mínimas para una landing de campaña.
5. Diagrama: diseño aprobado, pruebas escritas, implementación y entrega.
6. Implemento landings con «terminado» escrito y probado.

## Lectura independiente (rúbrica 28/10)

Lectura de Claude con la rúbrica (no es independiente: Mario es el lector final).

| Freno | Curiosidad | Novedad | Guardado | Voz y venta | Veracidad |
|---|---|---|---|---|---|
| 2 | 2 | 2 | 2 | 2 | pasa, con dos confirmaciones de Mario |

- **Novedad:** «un cambio fuera de la lista es un pedido nuevo» le resuelve a una agencia la discusión de alcance, que es lo que más le pesa.
- **Prueba:** el 52 y los nombres de las pruebas son reales y verificables, y no se muestran resultados de ejecución.
- **Riesgo:** los nombres técnicos de la lámina 3 (canonical, JSON-LD) son jerga, pero para este público funciona como señal de oficio. Si la pieza se reorienta a dueños de negocio, hay que cambiarlos.
