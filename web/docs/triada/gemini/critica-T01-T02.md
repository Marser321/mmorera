# Crítica Externa: Héroe, Servicios y Contacto (T01 & T02)

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Mirada crítica externa, Tríada Claude · Gemini · Codex)
- **Fuentes auditadas:** Preview en vivo en `http://localhost:3011`, textos de `HomeExperience.tsx` y `solutionsData.ts` (integración `e47d3d7` y `9512a53` en `triada/web`).
- **Restricción de protocolo:** Evaluación a ciegas sin consultar el brief interno `T01.md`.

---

## 1. Qué entendió cada lector en los primeros 5 segundos

### Perfil A: Dueño de negocio sin equipo técnico (clínica, taller, servicios locales)
> *"Entiendo que hace páginas web, me puede armar un bot de WhatsApp para responder mensajes y ordenar las citas. Pero cuando leo 'Orquesto la tecnología... coordino modelos de IA para que funcionen como un equipo', me suena a consultoría corporativa abstracta o a que me va a salir una fortuna. Si entro buscando solucionar el caos de turnos de mi negocio, 'orquestar' me aleja; quiero saber en cuánto tiempo está listo y cómo me ayuda a no perder clientes."*

- **Punto fuerte:** "Agentes que atienden por ti" y "Formularios, agenda y CRM conectados" tocan dolores directos y reales.
- **Fricción:** "¿Consultar por un puesto?" en el contacto lo descoloca: duda si Mario es una agencia/proveedor o un profesional buscando empleo en relación de dependencia. El brief de 3 pasos en el contacto le resulta intimidante si solo quería un estimado rápido por WhatsApp.

---

### Perfil B: Reclutador técnico / Hiring Manager buscando "AI Automation"
> *"Buen eyebrow: 'AI Automation & Operations'. Encaja perfecto con la búsqueda booleana. El título 'Orquesto la tecnología de tu negocio' y 'Hablas conmigo y lo construyo yo' me aclaran que trabaja de forma autónoma y resolutiva, pero el tono le habla a un cliente final ('tu negocio'), no a una empresa buscando un ingeniero para sumarse a un squad o liderar operaciones internas."*

- **Punto fuerte:** El botón "Consultar por un puesto" con la promesa "Te comparto mi CV y disponibilidad" es un acierto enorme que resuelve su objetivo en un clic.
- **Fricción:** En la primera pantalla no ve el stack técnico clave (¿n8n, Python, LangChain, Claude API, OpenAI, Supabase, Next.js?). "Rendimiento medido antes de entregar" le suena vago. Le falta un botón directo para ver o descargar el CV sin tener que disparar un cliente de correo `mailto:`.

---

### Perfil C: Colega desarrollador / Lead Dev
> *"El posicionamiento es ambicioso: promete hacer diseño UI a medida, desarrollo frontend Next.js, agentes autónomos, CRM empresarial y pipelines de video/contenido con IA, todo solo ('lo construyo yo'). En desarrollo web sé que Next.js 16 y Tailwind son sólidos, pero en agentes de IA y CRM quiero ver arquitectura: ¿cómo resuelve la memoria, el tool calling, el context window y la latencia? ¿Son agentes con código propio o wrappers rápidos de n8n/GHL?"*

- **Punto fuerte:** El mensaje es honesto al eliminar las promesas sin fundamento (fuera el '95+ PageSpeed garantizado' o el '<5 minutos'). La estructura de asociar cada servicio a un caso real en vivo (`proofSlug`) es impecable.
- **Fricción:** Enlazar la barbería *New Brothers* como prueba de "Agentes de IA instalados" despierta dudas si en el sitio en vivo solo hay un sistema de turnos tradicional sin modelos de lenguaje activos.

---

## 2. Clasificación texto por texto y reescritura neutra

Cada elemento se etiqueta como:
- **`persona`**: Tono honesto, específico, suena a Mario y genera confianza inmediata.
- **`plantilla`**: Frase genérica intercambiable con cualquier agencia de marketing o plantilla de Framer.
- **`relleno`**: Conceptos abstractos o palabras que no aportan valor concreto y diluyen el mensaje.

Todas las propuestas de reescritura usan **español neutro con tuteo (sin voseo)**.

---

### A. Héroe (Pantalla principal)

| Elemento | Texto Actual | Clasificación | Crítica / Motivo | Reescritura propuesta (Neutro tuteo) |
|---|---|---|---|---|
| **Eyebrow** | `Mario Morera · AI Automation & Operations` | **`persona`** | Nítido, profesional, alineado con la demanda del mercado internacional. | *Mantener.* |
| **Título H1** | `Orquesto la tecnología de tu negocio: web, agentes de IA y contenido.` | **`plantilla`** | "Orquesto la tecnología" es abstracto y suena a consultoría teórica. No expresa el beneficio tangible de forma contundente. | `Diseño y automatizo los sistemas de tu negocio: web, agentes de IA y contenido.` |
| **Intro / Bajada** | `Diseño y conecto tu sitio, tus automatizaciones, agentes que atienden por ti y sistemas que producen contenido. Coordino personas, herramientas y modelos de IA para que funcionen como un equipo. Hablas conmigo y lo construyo yo.` | **`relleno`** (parcial) | "Coordino personas..." se contradice directamente con "lo construyo yo" en la misma frase. Si trabaja solo de punta a punta, coordinar personas confunde (¿tiene equipo o subcontrata?). | `Diseño y conecto tu web, tus automatizaciones y agentes de IA que responden por ti. Integro herramientas y modelos para que operen sin fricción con tu equipo. Hablas directo conmigo y lo construyo yo.` |
| **Servicios (chips)** | `Webs y landings` · `Agentes de IA` · `Automatización y CRM` · `Contenido con IA` | **`persona`** | Categorías limpias, comprensibles y sin tecnicismos innecesarios. | *Mantener.* |
| **Hint interactivo** | `↳ Pasa por un servicio` | **`persona`** | Buena micro-interacción en escritorio, aunque invisible en pantallas táctiles sin hover. | `Explora cada servicio` (o dejarlo visible fijo en móvil). |
| **CTA Primario** | `Ver proyectos` | **`plantilla`** | Solo invita a mirar el pasado. Quien ya tiene una necesidad urgente no quiere solo navegar una galería, quiere una solución. | `Explorar proyectos` o `Ver soluciones en vivo` |
| **CTA Secundario** | `Hablar por WhatsApp` | **`persona`** | Canal directo, reduce al mínimo la fricción de contacto en LatAm y España. | *Mantener.* |

---

### B. Sección Servicios

#### 01. Webs y landings
- **Tag:** `Presencia` → **`plantilla`**. Sugerencia: `Desarrollo Web`.
- **Headline:** `Sitios rápidos y claros, pensados para que la persona entienda y te escriba.` → **`persona`**. Muy claro y centrado en conversión.
- **Descripción:** `Desarrollo a medida con Next.js, TypeScript y Tailwind: diseño propio, versión bilingüe y SEO técnico cuidado. Lo diseño y lo programo yo.` → **`persona`**. Excelente balance entre stack y autoría.
- **Entregables:**
  - `Diseño a medida, sin plantillas genéricas` → **`plantilla`**. Reescritura: *"Diseño visual exclusivo adaptado a la identidad de tu marca."*
  - `Rendimiento medido antes de entregar` → **`relleno`**. Decir solo "medido" suena tímido tras quitar el 95+. Reescritura: *"Optimización técnica para carga ultrarrápida en dispositivos móviles."*
  - `Catálogo o CMS para que actualices el contenido` → **`persona`**.
  - `Versión bilingüe y adaptada al teléfono` → **`persona`**.
- **Ideal para:** `Empresas, estudios y marcas que necesitan una web que explique bien lo que hacen.` → **`plantilla`**. Reescritura: *"Negocios y firmas que necesitan presentar sus servicios con autoridad y convertir visitas en clientes."*
- **Caso enlazado:** `L&B Elite Wash & Detail`. Coherente y comprobable.

#### 02. Agentes de IA instalados para tu negocio
- **Tag:** `Agentes de IA` → **`persona`**.
- **Headline:** `Un agente que atiende, responde y agenda por ti, con una persona cuando hace falta.` → **`persona`**. Es la mejor promesa de la web: aborda directamente el miedo a que el bot se descarrile o alucine.
- **Descripción:** `Instalo y configuro agentes con Claude, GPT u OpenClaw conectados a WhatsApp, a tu web o a tu agenda. Las cuentas quedan a tu nombre, con documentación y traspaso a tu equipo cuando el agente no puede resolver.` → **`persona`**. Da en el clavo con lo que pide el mercado: control del cliente, cuentas propias y traspaso humano.
- **Entregables:**
  - `Agente conectado a tus canales (WhatsApp, web, correo)` → **`persona`**.
  - `Respuestas desde tus datos, que puedes editar sin programar` → **`persona`**.
  - `Traspaso a una persona cuando hace falta` → **`persona`**.
  - `Cuentas a tu nombre y documentación de entrega` → **`persona`**.
- **Ideal para:** `Negocios de servicios y equipos sin personal técnico que quieren delegar la atención repetitiva.` → **`persona`**.
- **Caso enlazado:** `New Brothers Barbería`. **ALERTA CRÍTICA:** Si la barbería solo cuenta con un selector de turnos online y no tiene un agente conversacional con IA corriendo en vivo, este enlace resulta falso o confuso. Debe verificarse en T03 o rotularse como Demo/Concepto si aún no está desplegado con LLM.

#### 03. Automatización y CRM
- **Tag:** `Procesos conectados` → **`persona`**.
- **Headline:** `Formularios, agenda y CRM conectados, para que ninguna consulta quede sin seguimiento.` → **`persona`**. Directo al dolor comercial.
- **Descripción:** `Flujos con n8n, Make o GoHighLevel según tu proceso: cada consulta entra al CRM, se avisa a quien corresponde y el seguimiento sale solo. Para flujos livianos, también construyo herramientas a medida.` → **`persona`**. Nombrar herramientas reales (n8n, Make, GoHighLevel) da confianza técnica inmediata.
- **Entregables:**
  - `Seguimiento automático de cada consulta` → **`persona`**.
  - `Pipeline para ver en qué etapa está cada cliente` → **`persona`**.
  - `Reservas y agenda conectadas al CRM` → **`persona`**.
  - `Avisos a tu equipo cuando algo necesita una persona` → **`persona`**.
- **Ideal para:** `Negocios que reciben consultas por varios canales y necesitan ordenarlas.` → **`persona`**.
- **Caso enlazado:** `Rangel Oviedo Group`. Coherente con CRM y funnel inmobiliario.

#### 04. Fábricas de contenido con IA
- **Tag:** `Fábricas de contenido` → **`persona`**.
- **Headline:** `Sistemas que producen piezas y videos para tu marca, con tu criterio en cada entrega.` → **`persona`**.
- **Descripción:** `Conecto modelos de lenguaje, generación de imagen y video y edición por código en un flujo que convierte un brief en posts, carruseles y reels. Una persona revisa cada pieza antes de publicarla.` → **`persona`**. Enfatiza el control humano, eliminando el estigma del spam de IA.
- **Entregables:**
  - `Flujo de producción de contenido con IA para tu marca` → **`plantilla`** (repite el titular). Reescritura: *"Generación de guiones, carruseles y piezas audiovisuales a partir de un brief."*
  - `Plantillas de diseño y video consistentes` → **`persona`**.
  - `Variantes para probar qué funciona` → **`relleno`** (demasiado vago). Reescritura: *"Múltiples ganchos y adaptaciones de formato para redes sociales."*
  - `Revisión humana antes de publicar` → **`persona`**.
- **Ideal para:** `Marcas y equipos de marketing que necesitan constancia sin perder calidad.` → **`persona`**.
- **Caso enlazado:** `AD Media Solution`.

---

### C. Sección Contacto y Dos Caminos (T02)

| Elemento | Texto Actual | Clasificación | Crítica / Riesgo | Reescritura propuesta (Neutro tuteo) |
|---|---|---|---|---|
| **Eyebrow** | `CONTACTO` | **`plantilla`** | Simple, funcional. | `Hablemos` o `Contacto Directo` |
| **Título** | `¿Trabajamos juntos?` | **`plantilla`** | Es la frase por defecto del 90% de los portafolios web. | `¿Tienes un puesto en mente o un proyecto por construir?` |
| **Intro** | `Si buscas a alguien para tu equipo o tienes un proyecto concreto, escríbeme por el camino que corresponda. Te respondo yo.` | **`persona`** | Excelente. Resuelve la dualidad laboral vs freelance con naturalidad. | *Mantener.* |
| **Camino 1 (Puesto)** | `Consultar por un puesto` / `Te comparto mi CV y disponibilidad` | **`persona`** | Muy claro para reclutadores. **Riesgo técnico:** Dispara un enlace `mailto:`. Si el usuario no tiene cliente de correo de escritorio configurado (ej. Chrome en Windows sin handler de Outlook/Thunderbird), el clic no hace nada. | Agregar enlace visual alternativo: `Ver CV en línea` o botón de `Copiar email`. |
| **Camino 2 (Proyecto)** | `Consultar por un proyecto` / `Brief de 2 minutos, aquí abajo` | **`persona`** | Guía al visitante hacia el formulario interactivo `#brief`. | *Mantener.* |
| **Formulario AplicarOS** | *3 pasos: Tus datos → Contexto → Proyecto* | **`plantilla`** (en estructura) | La experiencia es elegante, pero para un cliente de negocio local que solo quiere saber el precio de un bot, responder preguntas sobre "Participan varias áreas" o "Fase de la idea" resulta burocrático. | Mantener el brief para proyectos complejos, pero incluir un acceso directo: *"¿Prefieres una consulta rápida? Escríbeme a WhatsApp"*. |

---

## 3. Qué le falta a la primera pantalla para que alguien escriba

Si un visitante llega hoy al home y se va sin escribir, se debe a estos 4 frenos concretos:

1. **Falta una referencia mínima de inversión o punto de partida:**
   El visitante no sabe si un proyecto con Mario cuesta 300, 3.000 o 30.000 dólares. El miedo a consultar y quedar fuera de presupuesto paraliza.
   *Solución:* Una línea sutil en el héroe o en servicios: *"Proyectos desde USD [X] o diagnóstico inicial sin costo para evaluar tu caso."*

2. **La contradicción entre "orquestador unipersonal" y "coordino personas":**
   En el subtítulo coexisten dos mensajes opuestos: "Coordino personas, herramientas y modelos..." vs "Hablas conmigo y lo construyo yo". Para una empresa sin equipo técnico esto confunde. Hay que dejar claro que Mario es quien construye el sistema e integra las herramientas para el equipo del cliente.

3. **Falta un enlace directo al CV descargable en el encabezado o héroe:**
   Un reclutador no siempre hace scroll hasta el pie de página ni quiere redactar un correo antes de ver el perfil formal. Necesita ver un botón o enlace sutil como `[ Ver CV / Experiencia ]` en la barra superior o bajo los botones principales.

4. **El botón primario del Héroe es pasivo (`Ver proyectos`):**
   El botón con fondo blanco sólido (el que más llama la atención visualmente) solo envía al usuario a mirar la sección de proyectos. Si el visitante ya está convencido por la propuesta de valor del héroe, debería haber un llamado a la acción más orientado a la solución: `Iniciar consulta` o `Ver soluciones`.

---

## 4. Conclusión para la tríada

- **Aprobado para mantener:** La transición de "Desarrollador web" a "AI Automation & Operations" es sólida y competitiva. La estructura de 4 servicios con casos asociados es el camino correcto.
- **Ajustes prioritarios para Claude y Codex:**
  1. Pulir la redacción del H1 e Intro del héroe para evitar la contradicción de "coordinar personas" si la promesa es "lo construyo yo".
  2. Resolver el talón de Aquiles del `mailto:` en "Consultar por un puesto" ofreciendo la opción de ver el CV directamente o copiar el correo.
  3. Auditar con rigor si *New Brothers Barbería* califica como prueba viva de "Agentes de IA" (se define en la tarea T03).
