# Plan de experiencia y comunicación · mmorera.agency

**Autor:** agente planificador (Claude), 1/11/2026. **Estado:** propuesta. Claude revisa el plan y pasa las tarjetas a [`TABLERO.md`](TABLERO.md).

**Qué se miró:**
- **Documentos:** `README.md`, `TABLERO.md` (D1–D7, T01–T18), `../MEJORAS-DESDE-EL-MERCADO.md`, las entregas T01-T05, T03 y T17, y las notas de Gemini `critica-T01-T02.md`, `T03-verificacion.md` y `T12-ingles.md`. El inventario de efectos de Codex (T18) todavía no existe; la sección 3.8 propone uno para que Codex lo complete.
- **Posicionamiento y voz:** `posicionamiento-alto-valor`, `perfil-hibrido-postulaciones`, `contenido/marca/guion.md` («Desde dónde se vende» y «Lista negra»), `../ROADMAP-SITIO.md` y el brief web del 27/10.
- **Navegador, en solo lectura, a 1440 px y a 390 px:**
  - Producción `https://mmorera.agency`. Muestra lo que hay en `origin/main` (`bf22c8d`): marca «pared», monograma en la cortina y rótulos «Ejemplo».
  - La preview `http://localhost:3011`, que corre `triada/web` en `2f1afbb`, con T01, T02, T05 y T17.
  - No se envió ningún formulario.
- **Código:** `web/src/` en el worktree `mmorera-T01`, que está en la misma versión que `triada/web`.

> **Hallazgo que va antes que todo el plan:** `triada/web` salió del `main` local (`8372080`), que va **9 commits detrás de `origin/main`**, es decir, de lo que está en producción. A la rama y a la preview les faltan:
> - la marca «pared» (`a5438a7`, `857bba0`, `a6746d2`);
> - el SEO por página (`bf22c8d`);
> - «casos a un clic, films por capacidad y pulido con Impeccable», con los rótulos «Datos de ejemplo» y la telemetría como objetivos (`9355fc8`);
> - el arreglo del desborde de `/estudio` en el teléfono (`d0eda08`);
> - dos commits del sistema de contenido.
>
> La preview que mira Mario no contiene lo que ya está publicado, y publicar `triada/web` así obliga a resolver la fusión sobre la marcha. Además, el checkout principal tiene unos 50 archivos de `web/src` sin commitear. Lo resuelve **T19**, antes de cualquier otra tarjeta.

**Límite honesto:** el sitio no tiene analítica en el código (lo comprobó T17). Todo lo que este plan dice sobre cómo se comporta un visitante es criterio, no medición. Las alturas en px sí son medidas.

---

## 1. Resumen para Mario

1. El home mide **14.737 px en escritorio y 16.707 px en el teléfono** (preview del 1/11). Perfil y método suman 5.450 px: repiten «una sola dirección» y prometen «velocidad extrema» y «sin compromiso».
2. Abruma por dos razones. Cuenta **cuatro veces** qué sabes hacer: servicios, órbita, perfil y método. Y muestra **20 entradas de casos** antes de que alguien elija algo.
3. **Propuesta:** un recorrido de 6 tramos, con una idea cada uno: *qué construyo → qué necesitas → pruébalo → así se conecta → cómo trabajo → hablemos*. La Fase A sola lo deja cerca de 8.500 px; con los momentos interactivos, por debajo de 10.000.
4. **Lo que sale del home no se borra:**
   - la órbita de capacidades pasa a `/cv`;
   - el riel de 14 films, a `/casos-de-exito`;
   - el estudio de tokens, al Lab.
5. **Revelar de a poco** tiene tres niveles:
   - el home da una frase y una prueba por servicio;
   - cada servicio tiene su página, con cómo funciona;
   - cada caso trae «Pruébalo tú», el film y la arquitectura plegada.
6. **Cuatro momentos que demuestran en vez de describir:**
   - una consulta de punta a punta;
   - un agente de prueba guiado;
   - del brief a la pieza;
   - «Pruébalo tú» en cada caso.

   Los cuatro reutilizan lo que ya existe.
7. **Urgente y barato:** quedan textos con voseo en producción, en `/aplicar`, los casos y el estudio. Se corrigen en la Fase A.
8. **16 tarjetas nuevas (T19–T34) en 4 fases.** La Fase A no construye nada nuevo: solo saca ruido.
9. **Antes de tocar nada:** `triada/web` va 9 commits detrás de producción. Le faltan la marca «pared» y los rótulos «Ejemplo», y por eso la preview muestra «24/7» y «18s con IA» sin rótulo. Hay que ponerla al día y decidir el trabajo sin commitear del checkout principal (T19).
10. **Lo primero que necesito de ti:**
    - aprobar la narrativa (D4 concretada);
    - las partículas sin desfile de logos (D8);
    - qué pasa con la barra flotante (D9);
    - los nombres del menú (D10).

---

## 2. Audiencias y recorridos

### A · Dueño o dueña de un negocio sin equipo técnico

Clínica, barbería, detailing, inmobiliaria o estudio. Llega desde una pieza de Instagram o LinkedIn, una recomendación o una propuesta de Mario.

| Momento | Qué tiene que entender | Qué lo frena hoy | Qué ve en el recorrido propuesto |
|---|---|---|---|
| **5 s** | «Aquí me arman la web, el agente que responde y el CRM, y hablo directo con quien lo construye.» | «Orquesto la tecnología…» le suena a consultoría cara (crítica de Gemini). Detrás del título desfilan logos de herramientas. | El héroe de D1, con el fondo quieto. Los 4 chips nombran lo que compra |
| **30 s** | Que su problema concreto tiene solución: consultas sin responder, agenda desordenada, una web que no explica o contenido que no sale | Tiene que bajar 3.275 px de servicios en escenas. «Pasa por un servicio» no funciona en el teléfono | Tramo «¿Qué necesitas resolver?»: cuatro puertas, cada una con un caso al lado |
| **2 min** | Que eso funciona de verdad y cómo se trabaja: cuentas a su nombre, diagnóstico, instalación y mantenimiento | No hay nada que pueda probar en el home. El método promete plazos («1 a 3 semanas») | «Pruébalo tú»: entra a la app de cuadrilla de L&B o al CRM demo de New Brothers. «Cómo trabajo» lo dice con hechos |
| **Siguiente paso** | Escribir sin miedo a quedar fuera de presupuesto | El brief de 3 pasos se siente burocrático para una consulta rápida. No hay referencia de inversión (D2) | WhatsApp o «Consultar por un proyecto». El brief se abre solo si lo elige |

### B · Reclutador o empresa que busca *AI Automation / Operations*

Llega desde LinkedIn, una postulación o un perfil de plataforma.

| Momento | Qué tiene que entender | Qué lo frena hoy | Qué ve en el recorrido propuesto |
|---|---|---|---|
| **5 s** | El rol coincide con su búsqueda | Nada: el eyebrow «AI Automation & Operations» ya cumple | Igual que hoy |
| **30 s** | Años, inglés, modalidad, stack y CV | El CV no está enlazado. «Consultar por un puesto» abre un `mailto:` que en muchos navegadores no hace nada (Gemini) | Bajo los botones del héroe, «¿Buscas a alguien para tu equipo? Ver CV →», que lleva a `/cv` con el PDF |
| **2 min** | Que construyó sistemas reales con IA y que sabe coordinar: «un link a algo que hayas construido», como piden los avisos | La órbita lista 9 familias y 11 logos, pero no prueba nada | El caso «Mi oficina de agentes» (T10) y un sistema real que se puede abrir |
| **Siguiente paso** | Contactar por el camino de empleo | `mailto:` | «Consultar por un puesto», con «Ver CV» y «Copiar correo» |

### C · Agencia o colega que quiere sumar a Mario a un proyecto

Llega por una recomendación o una propuesta técnica.

| Momento | Qué tiene que entender | Qué lo frena hoy | Qué ve en el recorrido propuesto |
|---|---|---|---|
| **5 s** | Hace web, automatización, IA y motion, y lo hace bien: la propia web lo demuestra | La feria de efectos le hace dudar del criterio | Una web sobria, con pocos efectos y bien terminados |
| **30 s** | Qué partes puede tomar: frontend Next.js, integraciones con GHL o n8n, agentes o motion | Las capacidades están en una órbita con «Nivel de dominio en producción» | La página de cada servicio, con las herramientas nombradas después del resultado |
| **2 min** | Cómo decide y cómo entrega | «Bajo el capó» existe y es lo mejor para este lector, pero queda enterrado y nadie lo anuncia | En cada caso, «Ver arquitectura» y «Recorridos guiados». Después, el Lab (T11) |
| **Siguiente paso** | Proponer un proyecto conjunto | El brief no tiene la opción «agencia» (las de equipo son: solo, equipo pequeño, varias áreas y dirección externa) | «Consultar por un proyecto», con una opción «Soy una agencia o un equipo que quiere sumarte» |

---

## 3. Diagnóstico por página

Medido el 1/11/2026 con el navegador en solo lectura. Las capturas se tomaron durante el recorrido y no se guardaron en el repo, porque este plan es el único archivo permitido. Para reproducir cada punto alcanza con la ruta y el `id` de la sección.

### 3.1 Home `/` (preview `triada/web`)

**Altura por tramo, en px (escritorio 1440 / teléfono 390):**

| Tramo (`id`) | 1440 | 390 | Qué dice |
|---|---|---|---|
| `#hero` | 828 | 834 | El posicionamiento de D1 |
| `#servicios` | 3.275 | 3.438 | 4 servicios en escenas, con el reel del caso al lado |
| `#proyectos` | 2.041 | 3.235 | Riel de 14 films y un índice de 6 casos |
| `#orquestacion` | 1.433 | 1.157 | Órbita de 9 familias y 11 insignias de herramientas |
| `#perfil` | **4.605** | **4.589** | La entrada del monograma (824) y el manifiesto CREAR / CONSTRUIR / ESCALAR (3.781) |
| `#metodo` | 845 | 1.552 | 4 etapas |
| `#contacto` | 1.230 | 1.203 | Dos caminos y el brief embebido |
| **Total de la página** | **14.737** | **16.707** | El pie mide 384 |

En producción el total es casi igual: 14.672 y 16.722. Allí todavía se ven el héroe viejo («resuelto por una sola persona»), «95+ PageSpeed», «<5 minutos», «24/7» y «Cupos limitados · 4 a 5 proyectos por trimestre». Ya están corregidos en `triada/web`; falta publicarlos con el OK de Mario y después de T19.

**Dónde abruma:**
- **Cuatro listas de capacidades seguidas:** servicios (4), órbita (9 familias y 11 logos), perfil (crear, construir y escalar) y método (4 etapas). El visitante lee cuatro veces «qué sé hacer» y ninguna vez «qué te pasa a ti».
- **20 entradas de casos en `#proyectos`:** el riel de 14 films y el índice de 6. Las 6 del índice llevan el rótulo «Film insignia», y las 14 del riel también son films, así que el rótulo ya no distingue nada. En el teléfono, el tramo mide 3.235 px.
- **Tres capas de navegación a la vez:**
  - el menú superior;
  - la barra flotante (`IslandBar`), con 6 anclas, WhatsApp y el tema;
  - los botones del héroe.

  Hay **5 enlaces a WhatsApp** en el home.
- **El fondo de partículas desfila logos de herramientas** detrás del título: en la preview se vieron Next.js, una nube y una malla. Son 16.000 partículas en escritorio (`TechParticleField.tsx`). Compiten con el h1 y hablan de herramientas, no del cliente.
- **Muchos acentos de color:**
  - cuatro en los chips del héroe (cian, verde, violeta y ámbar);
  - uno por familia en la órbita;
  - violeta y verde en las palabras del manifiesto.

  La marca dice una sola señal: `#71F3A2`.

**Dónde se pierde el hilo o se repite:**
- **`#perfil` es el 31 % del home y repite «una sola dirección» cuatro veces:**
  - en un texto de la sección («Una sola dirección: Crear, Construir, Escalar.»);
  - en un rótulo;
  - en el h2;
  - en un segundo h2 idéntico en el DOM.

  Su texto («coordinados por una misma persona», «Sistemas propios… construidos para operar y facturar») choca con D1, que habla de orquestar personas, herramientas y modelos. Además repite al héroe.
- **`#metodo` vende desde el hambre:** «Sin compromiso», «Velocidad extrema», «sprints ágiles de 1 a 3 semanas» y «Un proceso probado en 4 etapas para que nunca haya sorpresas». Todo eso está en la lista negra de `guion.md`.
- **El orden empuja a mirar el pasado:** el CTA principal del héroe, «Ver proyectos», salta los servicios.

**Qué no se entiende sin conocer el oficio:**
- «Stack» en la barra flotante;
- «Orquestación del ecosistema»;
- «Nivel de dominio en producción»;
- «En incorporación»;
- «Herramientas en producción»;
- la consigna «Pasa por un servicio», que depende del hover y no existe en el teléfono.

**Qué efecto sí comunica algo (se conserva):**
- **El escenario fijo de `#servicios`:** cada promesa tiene al lado el reel grabado del caso real. Es promesa y prueba juntas, el mejor efecto del home.
- **Los chips del héroe que hacen que las partículas dibujen el glifo del servicio:** la acción tiene una respuesta. Se queda esta función de las partículas, no el desfile.
- **El monograma:** es identidad. Se conserva en versión corta, como recomienda la memoria de marca: el momento de marca vive en la cortina de cambio de página.
- **El contacto con dos caminos (T02).**

### 3.2 `/sistemas` (9.398 px en escritorio)

**Tramos:**

| Tramo | Altura |
|---|---|
| Héroe | 648 |
| Film de apertura (`ScrollFilm`) | **4.680** |
| Telemetría | 254 |
| Casos de uso | 1.303 |
| Bandeja omnicanal | 1.093 |
| Cierre | 320 |

**Lo que abruma:**
- **Cifras: la preview retrocede respecto de producción.**
  - **En la preview** (`triada/web`):
    - la telemetría dice «24/7 · Operación sin pausa» y «<5 min · Primera respuesta al lead»;
    - la bandeja omnicanal titula «Respuesta en 18s con IA» y el chat dice «evita perder un 40% de prospectos fríos»;
    - no hay ningún rótulo «Ejemplo».
  - **En producción** (`origin/main`) ya figuran «Diseñado para operar sin pausa», «Objetivo de primera respuesta» y «Datos de ejemplo». Vuelven con T19.
  - **Lo que queda en las dos versiones:**
    - los números arrancan en «00/7» y «<00 min» antes de contar;
    - la demo muestra montos («$2800 USD») e «Intención» con personas de muestra («Carlos Méndez»).

    Está rotulado como ejemplo, pero carga cifras que no ayudan a entender el servicio.
- **El film de apertura ocupa la mitad de la página** para 4 estados (Hoy → La grieta → Conexión → Sistema). La idea es justo la historia de la orquestación; el largo es lo que cansa.

**Lo que no se entiende:**
- «Tecnología contextual: HubSpot»;
- el eyebrow mezcla idiomas: «Systems · CRM / IA / Automatización» (T12);
- «Tocá un nodo para inspeccionarlo» tiene voseo.

**Lo que comunica y se conserva:**
- Los casos de uso (`UseCaseFilmRoom`) separan «Caso real» de «Ejemplo». Es el patrón de honestidad que debería tener todo el sitio.
- La historia del film de apertura, en una versión más corta, sirve de base para el momento M1.

### 3.3 `/estudio` (4.883 px)

**Tramos:**

| Tramo | Altura |
|---|---|
| Héroe | 648 |
| Órbita «Nueve familias que trabajan juntas» | 1.181 |
| Estudio de *design tokens* | 1.412 |
| Cierre | 319 |

**Problemas:**
- **La página no dice qué se puede contratar.** «Estudio · Design / Motion / Creative Tech» y «La tecnología también puede tener pulso» no nombran ninguno de los 4 servicios.
- **Repite la órbita del home.**
- **El estudio de tokens:**
  - en la preview muestra métricas sin rótulo: «99 PageSpeed», «28ms» y «12.4x Eficiencia en frontier». Producción ya lo rotula «Vista de ejemplo · componente en vivo» y vuelve con T19;
  - muestra botones falsos: «Iniciar Despliegue» y «Next.js 16 Edge Node · Production Cluster v3.4.0»;
  - usa jerga: «refracción de superficie», «Deep Space» y «Hyperglow Neón»;
  - ofrece paletas violeta, ámbar y titanio que contradicen la marca.
- **Voseo:** «Sintetizá», «Explorá», «Exportá», «Abrí», «Tocá» y «¿Querés esta estética…?».
- **Promesa sin prueba:** «Cero intermediarios, 100% fiel a lo diseñado».

**Lo que comunica:** que Mario diseña sistemas visuales. Sirve como demo del Lab (T11), sin cifras y con la marca propia.

### 3.4 `/casos-de-exito` (7.233 px)

**Tramos:**

| Tramo | Altura |
|---|---|
| Encabezado | 395 |
| Reel de 6 destacados | **4.590** |
| Archivo de 9 | 959 |

**Lo bueno:**
- «Trabajo que se puede abrir.»
- «Cada ficha deja claro su estado.»
- El índice «Ir directo a un caso».
- El archivo marca «Implementación local» en Cana Vacations.

**Lo que abruma:**
- El índice lista 15 casos y 14 dicen «(film insignia)».
- Cada caso lleva el rótulo «CREAR · CONSTRUIR · ESCALAR». Es una taxonomía interna que no le dice nada al visitante.
- No hay filtro por necesidad. T14 lo plantea por rubro.
- Voseo: «Scrolleá ↓» y «¿Qué querés hacer posible?».

**A verificar (Codex):** al inicio del texto de `main` aparece «00:00 / 01:00». Puede ser un contador de progreso sin rótulo.

### 3.5 Caso: `/casos-de-exito/lb-elite-wash-detail` (5.331 px)

**Orden actual:**
1. Título.
2. «Cómo lo resolví» (film).
3. «Bajo el capó», con componentes, conexiones y recorridos guiados (empieza a unos 1.557 px).
4. «En pantalla grande y en el bolsillo».
5. «¿Querés algo así para tu negocio?».

**Lo que comunica:** el film y «Bajo el capó» son las mejores pruebas técnicas del sitio. El diagrama interactivo es oro para el colega y la agencia.

**Lo que falta o sobra:**
- **No hay un «Pruébalo tú».** T03 verificó rutas que cualquiera puede abrir: el cotizador de L&B y la app de cuadrilla (`/cuadrilla`); la reserva en 6 pasos de New Brothers, su CRM demo (`/admin-login`) y el asistente IA (`/admin/asistente`); el formulario sin texto libre de Fenix.
- **«Bajo el capó» llega segundo.** Para el dueño de negocio es pesado tan arriba.
- **El CTA tiene voseo.**

### 3.6 `/aplicar` (1.671 px)

- **Title y h1:** «Contame qué querés mover.» Tiene voseo, y en inglés el calco «Tell me what you want to move» suena a mudanza (T12).
- **Validaciones:** mezclan voseo («Ingresá tu nombre») y tuteo («Elige el momento del proyecto»).
- **Opciones de equipo:** no está la agencia.

### 3.7 Global

- **Menú:** «Trabajo · Sistemas · Estudio», más «Perfil» en el menú de utilidades. Nombra áreas internas de Mario, no lo que necesita el visitante. **Dos de los cuatro servicios que se venden (agentes y contenido) no tienen página.**
- **Pie:**
  - «Diseño, producto y sistemas bajo una sola dirección.» es el posicionamiento viejo;
  - «Iniciar Proyecto», «Casos de Éxito» y «Estudio de Diseño» no coinciden con el menú.
- **Vínculo de accesibilidad:** «Saltar al contenido principal» aparece en español también en `/en` (T12).

### 3.8 Efectos: qué comunica cada uno (propuesta de inventario para T18)

| Efecto | Dónde | ¿Qué entiende el visitante gracias a él? | Propuesta |
|---|---|---|---|
| Partículas WebGL que desfilan logos de herramientas | Fondo del héroe y de páginas internas | Que hay muchas herramientas, nada sobre su problema | **Se baja:** campo quieto en reposo y glifo del servicio solo al enfocar (D8) |
| Glifo del servicio al enfocar un chip | Héroe | Que cada servicio es distinto | **Queda** |
| `DecodeText` en el eyebrow | Héroe | — | Queda (700 ms) |
| `SplitReveal` en cada h2 | Todo el sitio | Ritmo, pero repetido en cada sección pierde valor | **Se baja:** solo en el h1 de cada página |
| `Magnetic` en botones | Héroe y casos | — | Se baja: solo en el CTA principal |
| Escenario fijo con el reel del caso | `#servicios` | La promesa y su prueba a la vez | **Queda** |
| Riel de 14 films con hover | `#proyectos` | Prueba, pero en volumen | **Se va del home** (pasa a `/casos-de-exito`) |
| Órbita radial e insignias | Home y `/estudio` | Una lista de herramientas | **Se va** del home y de `/estudio`. Una versión simple pasa a `/cv` |
| Entrada del monograma (`LogoOvertureSection`) | `#perfil` | Identidad | Queda **corta**, una pantalla como máximo, o solo en la cortina |
| Manifiesto CREAR / CONSTRUIR / ESCALAR con fotos | `#perfil` (3.781 px) | Nada que no diga el héroe | **Se va** |
| Barra flotante con píldora animada | Home | Navegación duplicada | D9 |
| Cortina de cambio de página con el monograma | Global | Identidad | Queda |
| Film de apertura con scroll | `/sistemas` | La historia de la orquestación | Queda **más corto**; es la base de M1 |
| `TickerNumber` | Telemetría de `/sistemas` | Objetivos que cuentan desde «00», como si fueran mediciones | **Se va** de la telemetría; los objetivos se dicen en texto. En el encabezado de casos («15 casos») queda, porque es un dato |
| Bandeja omnicanal | `/sistemas` | La demo de un agente con un CRM, con montos e «intención» de muestra | **Se rehace como M2** (sin cifras) o se va |
| Estudio de *design tokens* | `/estudio` | Que diseña sistemas visuales | **Pasa al Lab** (T11), sin cifras |
| «Bajo el capó» | Casos | Arquitectura real | Queda, **plegado** |
| Film del caso con capítulos | Casos | Cómo se resolvió | Queda |

---

## 4. Narrativa propuesta del home

**El recorrido en una línea:** qué construyo → qué necesitas → pruébalo → así se conecta → cómo trabajo → hablemos.

**Regla:** un tramo, una idea y un paso siguiente.

| # | Tramo propuesto | Idea única | Viene de | Qué pasa con lo actual | Altura objetivo (1440) |
|---|---|---|---|---|---|
| 1 | **Héroe** | Qué construyo y para quién (D1) | `#hero` (828) | **Queda:** título y eyebrow de D1. Con T20 y T23 cambian tres cosas: la bajada pasa a dos frases sin contradicción (ver la regla 2 de la sección 7), se suma el enlace «¿Buscas a alguien para tu equipo? Ver CV →» y el fondo queda quieto (D8) | ~830 |
| 2 | **¿Qué necesitas resolver?** | Cuatro puertas, con su prueba al lado | `#servicios` (3.275) | **Queda el efecto:** el escenario fijo con el reel. **Se recorta el texto:** título, una frase, 3 entregables y una línea de «Para quién». **Se suma** «Ver cómo funciona →», que lleva a la página del servicio. «Hablemos de esto» ×4 pasa a un solo CTA al final del tramo | ~3.000 (sin rediseño) |
| 3 | **Pruébalo tú** | Tres sistemas que puedes abrir hoy | `#proyectos` (2.041) | **Se fusiona con T04:** 3 tarjetas verificadas (Fenix, L&B y New Brothers). Cada una tiene su estado, un botón «Pruébalo» con la ruta de T03 y «Ver el film · 1:15». **El riel de 14 films se va** a `/casos-de-exito`. **El índice de 6 se va**: lo reemplaza «Ver los 15 casos» | ~1.300 |
| 4 | **Así se conecta una consulta** | La orquestación, mostrada | `#orquestacion` (1.433) | **La órbita se va.** Su versión simple pasa a `/cv` (T06). **En la Fase C entra M1:** una consulta de punta a punta, rotulada «Ejemplo». En la Fase A el tramo no existe | 0 en la Fase A; ~1.000 con M1 |
| 5 | **Cómo trabajo** | La capa humana con hechos | `#perfil` (4.605) + `#metodo` (845) | **Se fusionan** (D4, «ambas»): la entrada del monograma en una pantalla como máximo, una foto real (D13), tres frases verificables y **3 pasos**: diagnóstico, construcción o instalación, y traspaso y mantenimiento. No lleva plazos, «sin compromiso» ni «velocidad extrema». **El manifiesto CREAR / CONSTRUIR / ESCALAR se va.** Enlaza a la oficina de agentes (T10) como prueba de que coordina modelos y herramientas | ~1.600 |
| 6 | **Hablemos** | Dos caminos claros | `#contacto` (1.230) | **Queda** el contacto con dos caminos. El brief **se pliega**: se abre al elegir «Consultar por un proyecto». «Consultar por un puesto» ofrece «Ver CV» y «Copiar correo» | ~900 |
| — | Barra flotante | — | `IslandBar` | D9: se reduce a un solo botón «Hablemos» después del héroe | — |
| — | Pie | — | 384 | Textos al día (T23) | 384 |

**Total estimado:**
- **Fase A:** entre 8.000 y 8.700 px, sin M1 y con el tramo 2 sin rediseño.
- **Fase C:** entre 9.000 y 9.700 px, con M1.

Ambos números son estimaciones. El criterio de «listo» es medirlo en la preview.
- **A 390 px:** hoy son 16.707. Lo que más baja es el perfil (−4.589), el riel y el método. La meta orientativa es quedar por debajo de 12.000, y hay que medirlo.

**Lo que no cambia:** la marca «pared», el monograma, el héroe de D1, el escenario de servicios, los films de cada caso y el contacto con dos caminos.

---

## 5. Revelar de a poco: el mapa del sitio propuesto

**Tres niveles de profundidad**, cada uno con el mismo paso final (Hablemos):

| Nivel | Dónde | Qué muestra | Cómo se profundiza |
|---|---|---|---|
| 1 · Entender | Home | Una frase y una prueba por servicio | «Ver cómo funciona →» lleva a la página del servicio |
| 2 · Ver funcionar | Página de servicio | Qué resuelve, para quién es (y para quién no), cómo funciona (momento interactivo o film), casos con «Pruébalo», cómo se contrata | «Ver el caso →» |
| 3 · Comprobar | Página de caso | «Pruébalo tú», el film con capítulos y «Bajo el capó» plegado | «Ver arquitectura» se despliega ahí mismo; el resto ya está en la página |

**Reglas:**
- En el home no hay acordeones. El único contenido plegado es el brief.
- «Ver más» lleva a una página, no despliega contenido. Así el home queda corto y cada página tiene una URL que se puede pegar en una propuesta.

**Mapa:**

```
/                          Home · 6 tramos
├── Servicios (menú)
│   ├── /estudio           → «Webs y landings»        se reencuadra (T27) · Lab enlazado
│   ├── /agentes           → «Agentes de IA»          nueva (T07) · demo guiada M2 (T32)
│   ├── /sistemas          → «Automatización y CRM»   se reencuadra (T27) · film más corto
│   └── /fabricas          → «Contenido con IA»       nueva (T08) · M3 (T33) · galería T09
├── /casos-de-exito        «Casos» · filtro por servicio (T14 ajustada) · riel de films
│   ├── /casos-de-exito/<caso>              Pruébalo · film · Bajo el capó plegado (T29)
│   └── /casos-de-exito/oficina-de-agentes  (T10)
├── /cv                    «Sobre mí · CV» (T06) · datos rápidos · PDF · stack (órbita simple)
├── /aplicar               brief (también se abre desde el contacto)
└── Pie: /lab (T11) · /privacidad · /terminos · /cookies
```

**Menú propuesto:** «Servicios ▾» (4) · «Casos» · «Sobre mí · CV» · [Hablemos]. Las URLs `/sistemas` y `/estudio` se mantienen con etiquetas nuevas (D10).

**Recorridos por el mapa:**
- **Dueño de negocio:** `/` → la puerta de su problema → la página del servicio (prueba el momento interactivo) → un caso parecido («Pruébalo») → WhatsApp o brief.
- **Reclutador:** `/` (eyebrow) → «Ver CV» → `/cv` (PDF) → oficina de agentes o un caso → «Consultar por un puesto».
- **Agencia o colega:** `/` → «Casos» → un caso → «Ver arquitectura» → Lab → «Consultar por un proyecto».

---

## 6. Momentos interactivos

Son cuatro. Cada uno demuestra un servicio y **reutiliza algo que ya existe**.

### M1 · «Así entra una consulta» (home, tramo 4)

- **Qué demuestra:** la orquestación de D1. Una consulta entra por la web o WhatsApp, el agente responde con los datos del negocio, el CRM la registra, una persona recibe aviso cuando hace falta y el seguimiento sale solo. Es web, agente y CRM trabajando juntos.
- **A quién:** al dueño de negocio, que ve su día resuelto. Al reclutador, que ve criterio de operaciones.
- **Cómo:** 4 o 5 pasos que el visitante avanza con un botón o con las flechas, sin scroll secuestrado. En cada paso se ilumina la pieza que actúa y una línea dice qué pasa.
- **Qué cuesta:** **bajo o medio.** Reutiliza los estados y el arte del film de apertura de `/sistemas` («Hoy → La grieta → Conexión → Sistema»). Claude escribe los pasos y Codex hace un componente nuevo y liviano.
- **Riesgo:** que parezca una métrica. Va rotulado «Ejemplo», sin tiempos, porcentajes ni montos.
- **Movimiento reducido:** los pasos se muestran como una lista estática numerada y el cambio de paso no tiene transición.

### M2 · Agente de prueba guiado (`/agentes`, D6)

- **Qué demuestra:**
  - el agente responde desde los datos de un negocio de ejemplo;
  - sabe decir «eso no lo sé»;
  - pasa la conversación a una persona.

  Es lo que piden los clientes en Freelancer: demo en vivo y traspaso a una persona.
- **A quién:** al dueño de negocio.
- **Cómo, versión 1 (recomendada):** una **demo guiada** con respuestas escritas de antemano. El visitante elige entre 4 o 5 preguntas: horario, precio, reservar, una pregunta fuera de alcance y «quiero hablar con alguien». Va rotulada «Demo guiada: respuestas escritas para mostrar cómo se comporta el agente».
- **Versión 2:** chat en vivo con un modelo, solo después de decidir D6, con límite de uso y de costo y con el texto de privacidad actualizado (T17), porque procesa lo que escribe el visitante.
- **Qué cuesta:** la versión 1 es **baja o media**: reutiliza la interfaz de chat de `OmnichannelInboxSimulator.tsx`, sin las cifras inventadas. La versión 2 es **alta**: backend, costo por token, protección contra abuso y textos legales.
- **Riesgo:**
  - la versión 1 puede parecer «de mentira» si no se rotula;
  - la versión 2 puede inventar respuestas o recibir abuso, y tiene un costo variable.
- **Movimiento reducido:** sin animación de escritura; cada respuesta aparece entera.

### M3 · «Del brief a la pieza» (`/fabricas`, D11)

- **Qué demuestra:** cómo trabaja una fábrica de contenido. Un brief pasa a guion, arte y revisión humana hasta la pieza publicada. Muestra que la IA produce y que una persona decide.
- **A quién:** a marcas y equipos de marketing, y a reclutadores de puestos de contenido con IA.
- **Cómo:** el visitante elige uno de 2 o 3 briefs **reales del propio sistema de contenido de Mario** (`contenido/piezas/*`: brief, copy, diseño y pieza final) y avanza por las etapas.
- **Generación en vivo: no.** Es cara, impredecible y no agrega comprensión.
- **Permiso:** Mario autorizó como prueba «su sistema de contenido» (`guion.md`, §6, 28/10). Cuando lleguen las apps de D3, cada una suma su propio ejemplo.
- **Qué cuesta:** **bajo o medio.** Gemini elige las piezas y verifica que no tengan datos de clientes, Claude escribe y Codex hace un paso a paso con imágenes ya renderizadas.
- **Riesgo:**
  - que una pieza muestre datos de un cliente (se revisa cuadro por cuadro);
  - que se confunda con un generador automático (el rótulo dice «Revisión humana antes de publicar»).
- **Movimiento reducido:** etapas en secuencia estática, sin fundidos.

### M4 · «Pruébalo tú» en cada caso (páginas de caso y tarjetas del home)

- **Qué demuestra:** que el software existe y funciona. Es la prueba más fuerte del sitio y hoy no se ofrece.
- **A quién:** a los tres. El dueño entra al CRM demo, el reclutador ve algo construido y el colega abre la arquitectura.
- **Cómo:** arriba de cada caso, 1 a 3 botones con la ruta exacta y una línea de qué va a ver. Por ejemplo:
  - L&B: «Abre el cotizador» y «Abre la app de la cuadrilla en tu teléfono»;
  - New Brothers: «Reserva un turno de prueba» y «Entra al CRM demo»;
  - Fenix: «Mira el formulario sin texto libre».

  Después va el film, y al final «Bajo el capó», plegado, con «Ver arquitectura».
- **Qué cuesta:** **bajo.** Es un reordenamiento de `CaseStudy.tsx`, un campo de datos nuevo (`tryIt`) y una verificación de Gemini.
- **Riesgo:**
  - una ruta que pida login o token (hay que confirmar si `/cuadrilla` necesita `?t=`);
  - datos reales de clientes visibles en un demo;
  - un sitio de cliente que cambia.

  Gemini lo verifica antes (T28), y cada botón dice «Demo» si lo es.
- **Movimiento reducido:** no cambia nada; son enlaces.

**Descartados por el planificador, con su razón:**
- **La órbita de capacidades como momento:** enumera, no demuestra.
- **La bandeja omnicanal como está:** repite M1 y tiene cifras inventadas. Su interfaz de chat se reutiliza en M2.
- **El estudio de tokens en una página de servicio:** demuestra una capacidad que no es uno de los 4 servicios. Pasa al Lab.
- **Un generador de contenido en vivo:** caro, impredecible y con riesgo de marca.
- **Un cotizador de precios:** depende de D2, y sin precios decididos sería promesa.
- **Un «antes y después» de una web con el material de `public/service-demos/website-care-v2/`** (archivos `*-before` y `*-after`): queda como opción para `/estudio` **si** Gemini confirma de dónde sale y que hay permiso. Si es una recreación, se rotula «Ejemplo».

---

## 7. Principios de comunicación

Son doce reglas para todo el sitio. Los ejemplos de «antes» son textos reales del 1/11; los «después» son propuestas que Claude ajusta en el brief.

| # | Regla | Antes (real) | Después (propuesta) |
|---|---|---|---|
| 1 | **El título dice una sola cosa**, en 12 palabras o menos, con un verbo de oficio | «Un menú de capacidades conectadas en vivo.» (`#orquestacion`) | «Así entra una consulta, de la web al CRM.» |
| 2 | **Una idea por frase, sin contradicciones** (respeta D1) | «Coordino personas, herramientas y modelos de IA para que funcionen como un equipo. Hablas conmigo y lo construyo yo.» (héroe) | «Hablas conmigo y lo construyo yo. Coordino a tu equipo, las herramientas y los modelos de IA para que trabajen juntos.» |
| 3 | **Una idea por pantalla.** Si se repite, se va | «Una sola dirección» cuatro veces en 4.605 px de `#perfil` | Una pantalla: foto, «Hablas conmigo. Lo construyo yo. Si algo falla, me escribes a mí.» y los 3 pasos |
| 4 | **Español neutro con tuteo e inglés idiomático** | «Contame qué querés mover.» (`/aplicar`), «¿Querés algo así para tu negocio?» (casos), «Tell me what you want to move.» | «Cuéntame qué quieres construir o automatizar.», «¿Quieres algo así para tu negocio?», «Tell me what you want to build or automate.» |
| 5 | **Ninguna cifra sin fuente.** El ejemplo se rotula al lado del número, y si la cifra no ayuda a entender, se va | «24/7 · Operación sin pausa», «Respuesta en 18s con IA», «evita perder un 40% de prospectos fríos» (preview de `/sistemas`; producción ya rotula parte); «$2800 USD» e «Intención» en la demo | Cifras con fuente: «44 páginas bilingües» (sitemap de Fenix, T03) o «88 servicios en el cotizador» (L&B, T03). En una demo, «Ejemplo · datos de muestra», sin montos ni porcentajes |
| 6 | **Primero el resultado, después la herramienta.** El nombre de una herramienta nunca es un título | «Desarrollo Web & E-commerce Next.js» (producción); «Ecosistema central:» y 11 logos | «Un agente que atiende, responde y agenda por ti», y debajo «Con Claude, GPT u OpenClaw, según tu caso». Las herramientas en lista van en `/cv` |
| 7 | **La prueba va pegada a la promesa, y se puede abrir** | «Trabajo real, en producción. Sitios y sistemas operando hoy.» y 20 entradas: 14 films y 6 filas con «Film insignia» | «Tres sistemas que puedes abrir hoy.» Cada tarjeta tiene su estado y «Pruébalo» |
| 8 | **La capa humana se muestra con hechos verificables, no con adjetivos** | «Acompañamiento real», «Sin compromiso», «Velocidad extrema», «para que nunca haya sorpresas» (`#metodo`) | «Hablas conmigo. Lo construyo yo. Las cuentas quedan a tu nombre. Si algo falla, me escribes a mí.» |
| 9 | **«Para quién» nombra una situación, no un tipo de empresa** (filtra, no persigue) | «Empresas, estudios y marcas que necesitan una web que explique bien lo que hacen.» | «Para negocios que reciben consultas y pierden ventas porque la web no explica lo que hacen.» |
| 10 | **Un paso siguiente por tramo, con un verbo concreto.** El contacto dice qué pasa después | 5 enlaces a WhatsApp, «Hablemos de esto» ×4, «Iniciar Proyecto», «¿Trabajamos juntos?» | Servicio: «Ver cómo funciona». Caso: «Pruébalo». Cierre: dos caminos y «Te respondo yo». Sin plazos que Mario no haya confirmado |
| 11 | **Los rótulos dicen un dato o no van.** La letra mono es para datos | «CREAR · CONSTRUIR · ESCALAR» en cada caso, «Orquestación del Ecosistema», «01.3 · Estudio de design tokens & estética», «Execution Blueprint» | «Implementado · Salud · 2025» o ningún rótulo (está pendiente en Impeccable, puntos 1 a 3) |
| 12 | **La jerga vive en «Bajo el capó».** Cada efecto responde «¿qué entiende el visitante gracias a esto?» | «CRM sin base de datos», «balanceo determinista», «refracción de superficie»; las partículas desfilan logos | «Las reservas y los cobros viven en su CRM, sin una base de datos aparte que mantener.» La arquitectura va en el panel plegado. Las partículas responden al foco |

---

## 8. Tarjetas propuestas (T19 en adelante)

Estado de todas: `propuesta`, hasta que Claude las pase al tablero. Cuando una tarea cambia textos o diseño, Gemini hace la crítica cruzada sin leer el brief, como pide el protocolo.

**Calidad común a todas:**
- ES y EN;
- 390 px sin desborde;
- teclado;
- `prefers-reduced-motion` con `useReducedMotionSafe`;
- `npm run lint`, `npm test` y build en verde;
- sin colores nuevos.

### Fase A · Menos ruido (no construye nada nuevo)

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T19** | **Poner `triada/web` al día y despejar la base.** (1) Traer a `triada/web` los 9 commits de `origin/main` que le faltan (marca «pared», SEO por página, rótulos «Ejemplo», films por capacidad e Impeccable) y resolver los choques con T01, T02, T05 y T17. (2) Decidir qué pasa con el trabajo sin commitear del checkout principal: unos 50 archivos de `web/src` (`films/services/`, `seo`, cambios en `HomeExperience.tsx`, `TechParticleField.tsx`, `IslandBar.tsx`, `footer.tsx` y otros), más `public/service-demos/`, `public/marca/` y `public/og/` | **Claude** | Mario decide qué del trabajo sin commitear entra | Ninguno de `src/` fuera de la fusión. La salida es una rama `triada/claude/T19-*` desde `triada/web` y una nota en el tablero. El checkout principal no se toca: se trabaja en un worktree | `git rev-list --count triada/web..origin/main` da 0. La preview muestra la marca «pared» y los rótulos «Ejemplo» como producción, más T01, T02, T05 y T17. Lint, tests y build en verde. Queda escrito qué del trabajo sin commitear se integra y qué no | — | propuesta |
| **T20** | **Brief del recorrido nuevo**: textos exactos ES y EN | **Claude** | Gemini critica la preview | `docs/triada/briefs/T20-recorrido.md`, `src/data/solutionsData.ts` (`WORKFLOW_STAGES` a 3 pasos), `src/config/site.ts` | Están todos los textos del home: bajada del héroe, enlace al CV, títulos de los 6 tramos, servicios recortados, «Cómo trabajo» y contacto. También menú, pie y la opción «agencia» del brief. Pasan las 12 reglas de la sección 7 y no queda nada de la lista negra | D4 | propuesta |
| **T21** | **Tramo «Cómo trabajo»**: fusiona perfil y método. La entrada del monograma dura una pantalla como máximo, va una foto (D13), tres frases y 3 pasos. El manifiesto deja de montarse | **Codex** | Claude, textos (T20) | `HomeExperience.tsx` (solo `#perfil` y `#metodo`), `home/WorkflowSection.tsx`, `films/LogoOvertureSection.tsx` (solo duración y alto), `home/HowIWorkSection.tsx` (nuevo). Si `AuthorManifestoScene.tsx` queda sin uso, lo anota en la entrega | El tramo mide 1.800 px o menos en escritorio, con los textos de T20. La entrada del monograma no deja una pantalla vacía. Con movimiento reducido se ve el monograma quieto | T19, T20, D4, D13 | propuesta |
| **T22** | **Sacar del home la órbita y el riel de films.** El riel pasa a `/casos-de-exito` | **Codex** | — | `HomeExperience.tsx` (dejar de montar `OrchestrationWheelSection` y `FilmRail`), `WorkExperience.tsx` (montar `FilmRail`), `IslandBar.tsx` (quitar el ancla «Stack») | El home no monta ni la órbita ni el riel, y `/casos-de-exito` muestra el riel. La órbita no se borra: queda para T06. El home mide 9.000 px o menos en escritorio, junto con T21 | T19, D4 | propuesta |
| **T23** | **Caminos claros:** menú por necesidad, «Ver CV» en el héroe, una sola entrada a WhatsApp, la barra flotante según D9 y el pie al día | **Codex** | Claude, textos (T20) | `sections/navbar.tsx`, `layout/IslandBar.tsx`, `shared/WhatsAppFab.tsx`, `sections/footer.tsx`, `HomeExperience.tsx` (solo los botones del héroe) | El menú es «Servicios ▾ · Casos · Sobre mí · CV · Hablemos» y funciona con teclado. Hay 2 enlaces a WhatsApp en el home como máximo. «Ver CV» lleva a `/cv`; mientras T06 no exista, va al camino «puesto». El pie usa las mismas etiquetas que el menú | T19, T20, D9, D10 | propuesta |
| **T24** | **Partículas sin desfile de logos:** en reposo, campo quieto o monograma; al enfocar un chip, el glifo del servicio | **Codex** | Claude decide los glifos | `shared/TechParticleField.tsx`, `lib/particleSequence.ts`. Si hace falta tocar `src/data/particleSceneConfig.ts`, lo pide en la entrega (es de Claude) | Detrás del título no desfila ningún logo de herramienta y los chips siguen dibujando su glifo. El teléfono rinde igual o mejor, medido según la memoria de ruido de Lighthouse | T19, D8 | propuesta |
| **T25** | **Pasada de texto en todo el sitio:** cifras sin fuente, voseo y calcos. Aplica T12 | **Claude** escribe; **Codex** aplica en los componentes | Gemini revisa | Claude: `docs/triada/briefs/T25-texto.md`, `src/data/omnichannelInboxData.ts`, `src/data/designTokenData.ts`, `src/data/projectCases.ts` (`stack` bilingüe). Codex: `SystemsExperience.tsx` (telemetría), `systems/OmnichannelInboxSimulator.tsx`, `estudio/InteractiveDesignTokenStudio.tsx`, `estudio/CapabilitiesOrbit.tsx`, `StudioExperience.tsx`, `WorkExperience.tsx`, `CaseStudy.tsx`, `app/aplicar/page.tsx` y su par `en`, `AplicarOS.tsx` (solo textos), `app/layout.tsx` (vínculo para saltar al contenido) | Después de T19, un `grep` no encuentra «24/7», «<5 min», «18s», «40%», «99 PageSpeed» ni «12.4x» sin el rótulo «Ejemplo». La demo de `/sistemas` deja de mostrar montos e «Intención». No quedan formas de voseo (querés, tocá, contame, scrolleá, ingresá, explorá…) fuera de las citas históricas. Se resuelve la lista de T12 | T12 ✓, T19 | propuesta |

### Fase B · Revelar de a poco

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T26** | **Plantilla de página de servicio.** Secciones: qué resuelve, para quién (y para quién no), cómo funciona (momento o film), prueba (casos con «Pruébalo»), cómo se contrata (diagnóstico → instalación → mantenimiento) y contacto | **Codex** | Claude define los datos | `src/components/service/ServicePage.tsx` (nuevo) y su test. Los datos van en `src/data/servicePages.ts` (Claude) | La usan T07, T08 y T27. Sin precios hasta D2. Cada sección se puede omitir por datos | T20 | propuesta |
| **T27** | **`/sistemas` como «Automatización y CRM» y `/estudio` como «Webs y landings»**, con la plantilla. En `/sistemas`, el film de apertura se acorta. En `/estudio` sale la órbita y el estudio de tokens pasa al Lab | **Claude**, textos → **Codex** | Gemini, la crítica cruzada | `SystemsExperience.tsx`, `StudioExperience.tsx`, `films/ScrollFilm.tsx` (solo el largo del tramo), `app/sistemas/**`, `app/estudio/**` y sus pares `en`. Claude: `src/data/servicePages.ts` | Cada página dice en su primera pantalla qué se contrata y para quién. El film de apertura mide 2.500 px o menos. La bandeja omnicanal se va o espera a T32. Las URLs no cambian (D10) | T25, T26, D10 | propuesta |
| **T28** | **Verificar las rutas «Pruébalo»** de los 3 casos de portada: que abran sin cuenta propia, que no muestren datos reales de clientes y qué ve el visitante. Confirmar si `/cuadrilla` pide token | **Gemini** | — | `docs/triada/gemini/T28-pruebalo.md` y capturas en `docs/triada/gemini/T28/` | Cada ruta tiene URL, captura y la marca «abre», «Demo» o «no usar» | T03 ✓ | propuesta |
| **T29** | **Página de caso en tres niveles:** «Pruébalo tú» arriba, después el film y al final «Bajo el capó» plegado con «Ver arquitectura» (M4) | **Codex** | Claude: el campo `tryIt` en `projectCases.ts` | `premium/CaseStudy.tsx`, `premium/UnderTheHood.tsx` (solo el plegado) | Los 3 casos de portada tienen «Pruébalo» con rutas de T28; los demás muestran la sección solo si hay datos. «Ver arquitectura» es un disclosure accesible con `aria-expanded`. Con movimiento reducido, se despliega sin animación | T19, T28 | propuesta |
| **T30** | **Contacto revelado:** primero los dos caminos; el brief se abre al elegir «proyecto»; «puesto» ofrece «Ver CV» y «Copiar correo» | **Codex** | Claude, textos (T20) | `HomeExperience.tsx` (solo `#contacto`), `AplicarOS.tsx` (solo la opción «agencia», si Claude la pide) | Ningún camino depende solo de `mailto:`. El brief no ocupa el home hasta que alguien lo pide. El foco va al primer campo al abrirlo | T19, T20, T06 | propuesta |
| — | **Ajuste a T14:** el filtro de `/casos-de-exito` es primero **por servicio** (4 opciones) y después por rubro | Claude reescribe la tarjeta | — | — | — | — | — |

### Fase C · Momentos que demuestran

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T31** | **M1 · «Así entra una consulta»** en el home (tramo 4) | **Codex** | Claude: pasos y textos. Gemini: crítica | `home/ConsultaFlow.tsx` (nuevo), `HomeExperience.tsx` (montarlo). Claude: `src/data/consultaFlow.ts` | Tiene 4 o 5 pasos, avanza con botón y flechas, sin scroll secuestrado. Va rotulado «Ejemplo», sin cifras. Con movimiento reducido es una lista estática. El home mide 10.000 px o menos | T22, T20 | propuesta |
| **T32** | **M2 · agente de prueba guiado** en `/agentes`, versión 1 sin modelo en vivo | **Codex** | Claude: guion con ramas (horario, precio, reserva, fuera de alcance y traspaso a una persona) | `premium/agentes/AgentDemo.tsx` (nuevo; reutiliza la interfaz de chat de `systems/OmnichannelInboxSimulator.tsx`), `app/agentes/**`. Claude: `src/data/agentDemoScript.ts` | La demo muestra el traspaso a una persona, va rotulada «Demo guiada» y no tiene cifras. Se usa con teclado y lector de pantalla (`aria-live`). Con movimiento reducido no hay animación de escritura | T07, T26, D6 | propuesta |
| **T33** | **M3 · «Del brief a la pieza»** en `/fabricas` | **Gemini** elige 2 o 3 piezas propias y sus etapas → **Claude** escribe → **Codex** arma | — | Gemini: `docs/triada/gemini/T33-piezas.md` y `public/portfolio/fabrica/**`. Codex: `premium/fabricas/BriefToPiece.tsx` (nuevo), `app/fabricas/**`. Claude: `src/data/briefToPiece.ts` | Cada etapa usa material real del sistema de contenido, sin datos de clientes, y muestra la revisión humana. Las imágenes cargan diferido | T08, T26, D11 | propuesta |

### Fase D · Comprobar

| ID | Tarea | Dueño | Apoyo | Archivos permitidos | Listo cuando | Depende | Estado |
|---|---|---|---|---|---|---|---|
| **T34** | **Prueba de 5 segundos y de recorrido con personas reales**, antes y después de la Fase A: 2 dueños de negocio, 1 reclutador o empresa y 1 colega o agencia. Preguntas: qué hace Mario, para quién y qué harías ahora | **Gemini** arma el guion y junta las respuestas | **Mario** consigue a las personas | `docs/triada/gemini/T34-prueba.md` | Hay respuestas textuales por audiencia y una lista de lo que no se entendió. Es la única evidencia de comportamiento mientras no haya analítica (D12) | Fase A en la preview | propuesta |

### Ajustes a tarjetas existentes

| Tarjeta | Ajuste propuesto |
|---|---|
| **T04** | Las 3 tarjetas llevan «Pruébalo» (de T28) y el film adentro. **El riel ya no queda en el home** (lo saca T22) |
| **T06** | `/cv` recibe la órbita simplificada como «Stack» y el enlace desde el héroe. La ubicación se dice sin nombrar el país (D7), por ejemplo «Remoto · UTC−3». La etiqueta del menú es «Sobre mí · CV» |
| **T07 / T08** | Usan la plantilla T26. T07 incluye M2 (T32) y T08, M3 (T33) y la galería de T09 |
| **T10** | Se enlaza desde «Cómo trabajo» y desde `/agentes` como prueba de que Mario coordina modelos y herramientas |
| **T11** | Recibe el estudio de *design tokens* sin cifras y con la marca «pared». `/estudio` («Webs y landings») enlaza al Lab |
| **T15** | La reemplazan T21 y T22 |
| **T18** | El inventario parte de la tabla 3.8. `SplitReveal` queda solo en h1 y `Magnetic`, solo en el CTA principal |

---

## 9. Decisiones que necesita Mario

### Decisiones ya abiertas que este plan concreta

| ID | Decisión | Propuesta concreta | Recomendación | Desbloquea |
|---|---|---|---|---|
| **D4** | Acortar el home | La narrativa de la sección 4: 6 tramos, perfil y método fusionados en «Cómo trabajo», y la órbita y el riel fuera del home (no se borran) | **Sí**, como está en la sección 4 | T20, T21, T22 |
| **D6** | Demo de un agente | Primero una demo guiada con respuestas escritas (M2, versión 1); después el chat en vivo con límite de uso y de costo | **Guiada primero:** no cuesta nada por visita y no inventa respuestas. La versión en vivo, cuando quieras pagar su uso | T32 |
| **D2** | Precios | Las páginas de servicio tienen un lugar para «Cómo se contrata» | Igual que en el tablero. Sin D2 se publica la escalera sin montos | T26, T07 |

### Decisiones nuevas

| ID | Decisión | Opciones | Recomendación | Desbloquea |
|---|---|---|---|---|
| **D8** | **Partículas del fondo** | a) Como hoy, con el desfile de logos · b) Campo quieto en reposo y glifo del servicio al enfocar · c) Quitarlas | **b):** conserva la firma y el efecto que comunica, y saca el que distrae | T24 |
| **D9** | **Barra flotante (`IslandBar`)** | a) Se queda como está · b) Se reduce a un solo botón «Hablemos» que aparece después del héroe · c) Se quita | **b):** con 6 tramos las anclas sobran, pero un acceso fijo al contacto ayuda en el teléfono | T23 |
| **D10** | **Menú y URLs** | a) Mantener `/sistemas` y `/estudio` con etiquetas nuevas («Automatización y CRM», «Webs y landings») · b) Rutas nuevas (`/automatizacion`, `/webs`) con redirección 301 | **a) ahora:** sin riesgo de SEO ni enlaces rotos. b) más adelante, si se ve necesario | T23, T27 |
| **D11** | **¿`/fabricas` sale antes de las apps (D3)?** | a) Esperar a las apps · b) Salir con tu propio sistema de contenido como primera prueba (M3) y la galería de video (T09) | **b):** el mercado ya pide muestras y tu sistema existe; cada app suma su página después | T33, T08 |
| **D12** | **Medición** | a) Sin analítica; prueba con personas (T34) · b) Analítica sin cookies, con el texto de privacidad y cookies actualizado (T17) | **a) por ahora.** b) solo si quieres saber hasta dónde llega la gente, y después de publicar la Fase A | T34 |
| **D13** | **Tu cara en «Cómo trabajo»** | a) Una foto real · b) Solo el monograma · c) Un video corto tuyo (30 s) | **a) ahora:** la capa humana se muestra mejor con una cara. c) más adelante, si quieres grabarlo | T21 |

**Orden sugerido:** D4, D10 y D9 desbloquean casi toda la Fase A; D8 puede ir en paralelo. D11 y D6 hacen falta recién en la Fase C.

---

## 10. El reporte de Gemini del 1/11: dónde cae cada punto

Gemini resumió sus tres entregas (crítica de T01 y T02, T03 y T12). Este plan ya se había escrito leyéndolas, así que no hay tarjetas nuevas. Esta tabla dice dónde cae cada sugerencia y en qué puntos el plan no coincide.

| Sugerencia de Gemini | Dónde cae | Postura del plan |
|---|---|---|
| `stack` bilingüe en 4 casos (`projectCases.ts`) | T25 (Claude) | De acuerdo |
| Fenix: aclarar que los 109 claims y los 1.096 videos son herramientas internas | Ajuste a T04 (Claude, `projectCases.ts`) | De acuerdo. Se suma a la ficha y a la tarjeta del home |
| L&B: destacar la app de cuadrilla (`/cuadrilla`) | T28 → T29 («Pruébalo tú») | De acuerdo, **con una condición:** el propio T03 dice que la app lee `GET /api/crew?t=<token>`. T28 confirma si un visitante puede abrirla sin token antes de ponerle un botón |
| New Brothers como prueba de «Agentes de IA» por `/admin/asistente` | T20 y T25 (rótulo de la prueba en `solutionsData.ts`) | **Desacuerdo parcial.** T03 muestra un panel interno para enseñar respuestas, no un agente que atiende a clientes en un canal. Hasta que existan M2 (T32) o el caso de la oficina de agentes (T10), la prueba se rotula como lo que es: «asistente con base de conocimiento editable, en el panel demo». No va como «agente que atiende por WhatsApp» |
| Nueva bajada del héroe: «…Integro herramientas y modelos para que operen sin fricción con tu equipo…» | T20 (Claude) | **No se adopta tal cual:** quita «personas», y D1 pide decir que Mario orquesta tecnología, personas y modelos. «Sin fricción» además es relleno. El plan propone resolver la contradicción con «tu equipo» (regla 2 de la sección 7) |
| «Websites & landing pages»; «Let's work together.»; *resume* en el pedido de CV | T20 (Claude) | De acuerdo. En EN: «I'll share my resume and availability» |
| `/en/aplicar`: «Tell me what you want to move» y «reply with judgment» | T25 | De acuerdo. Ya estaba en la lista de archivos de T25 |
| Vínculo para saltar al contenido en `layout.tsx` y eyebrow de `/sistemas` en EN | T25 (Codex) | De acuerdo |
| Estudio de tokens: «Corner Radius» y «Chat on WhatsApp» | T25 (Codex) | De acuerdo, aunque el componente después pasa al Lab (T11 y T27). El cambio es barato y no se pierde |
| Alternativa al `mailto:` de «Consultar por un puesto» | T30 (Codex) | De acuerdo: «Ver CV» y «Copiar correo» |
| Desbloquear T04 | T04, ajustada | Sí, **después de T19**, y con el ajuste de este plan: sin riel en el home y con «Pruébalo» de T28 |

**Estado del tablero:** hay dos copias que no coinciden.
- La del checkout principal, sin commitear, tiene T03 y T12 en `para revisar`.
- La de `triada/web` (commiteada) todavía dice `pendiente`.

Claude debería unificarlas cuando haga T19, para que todos lean el mismo tablero.
