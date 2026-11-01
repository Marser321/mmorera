# T27 · `/sistemas` y `/estudio` como páginas de servicio (D10)

**Depende de T26** (la plantilla `ServicePage`). Las URLs no cambian; cambian los textos y el orden. **Voz:** español neutro con tuteo e inglés claro; se copia tal cual.

Las dos páginas siguen la misma secuencia: **qué resuelve → para quién (y para quién no) → cómo funciona → prueba → cómo se contrata → hablemos.**

## A. `/sistemas` → «Automatización y CRM»

| Bloque | ES | EN |
|---|---|---|
| Eyebrow | Automatización y CRM | Automation & CRM |
| H1 | Que ninguna consulta quede sin seguimiento. | So no enquiry goes without follow-up. |
| Bajada | Conecto tus formularios, tu agenda, WhatsApp y tu CRM para que cada consulta entre ordenada, le llegue a quien corresponde y el seguimiento salga solo. | I connect your forms, calendar, WhatsApp and CRM so every enquiry comes in organized, reaches the right person and the follow-up goes out on its own. |
| CTA del héroe | Hablemos de tu proceso | Let's talk about your process |
| Para quién | Negocios que reciben consultas por varios canales y hoy las ordenan a mano. | Businesses that get enquiries across several channels and sort them by hand today. |
| Para quién no | Si recibes pocas consultas por semana y las respondes sin problema, todavía no lo necesitas. | If you get a few enquiries a week and answer them easily, you don't need this yet. |
| Herramientas (una línea, después del resultado) | Con n8n, Make o GoHighLevel según tu proceso, o una herramienta a medida si el flujo es liviano. | With n8n, Make or GoHighLevel depending on your process, or a custom tool when the flow is light. |
| Cómo funciona · título | De herramientas sueltas a un sistema. *(se conserva)* | From scattered tools to one system. *(kept)* |
| Casos de uso · título | Del problema al sistema, paso a paso. *(se conserva)* | From problem to system, step by step. *(kept)* |
| Prueba · título | Sistemas que ya construí | Systems I've already built |
| Prueba · casos | Rangel Oviedo Group · L&B Elite Wash & Detail · New Brothers Barbería (con sus «Pruébalo» cuando haya) | same |
| Cómo se contrata · título | Cómo trabajamos | How we work |
| Cómo se contrata · pasos | Los 3 pasos de T20 §4 (Diagnóstico · Construcción · Traspaso y mantenimiento) | same as T20 §4 |
| Cómo se contrata · precio | El alcance y el precio se definen después del diagnóstico. | Scope and price are set after the diagnosis. |
| Cierre | El sistema correcto se nota porque el trabajo deja de romperse entre herramientas. *(se conserva)* · CTA: Hablemos de tu caso | The right system shows when work stops breaking between tools. *(kept)* · CTA: Let's talk about your case |

**Se va de `/sistemas`:**
- la telemetría: sin números, los 4 rótulos quedan sueltos;
- la bandeja omnicanal: su chat se reutiliza en la demo del agente (T32).

**El film de apertura** se queda, acortado a 2.500 px o menos.

## B. `/estudio` → «Webs y landings»

| Bloque | ES | EN |
|---|---|---|
| Eyebrow | Webs y landings | Websites & landing pages |
| H1 | Una web que explica lo que haces y hace que te escriban. | A website that explains what you do and gets people to reach out. |
| Bajada | Diseño y programo sitios y landings a medida: claros, rápidos en el teléfono, en dos idiomas si hace falta y fáciles de actualizar. Lo diseño y lo programo yo. | I design and build custom websites and landing pages: clear, fast on the phone, bilingual when needed and easy to update. I design it and I build it. |
| CTA del héroe | Hablemos de tu web | Let's talk about your website |
| Para quién | Negocios que reciben consultas y pierden ventas porque su web no explica lo que hacen. | Businesses that get enquiries but lose sales because their site doesn't explain what they do. |
| Para quién no | Si tu web ya funciona y solo quieres cambiar textos, no hace falta rehacerla. | If your site already works and you only want to change the copy, there's no need to rebuild it. |
| Herramientas | Con Next.js, TypeScript y Tailwind, y un CMS cuando necesitas actualizar el contenido. | With Next.js, TypeScript and Tailwind, plus a CMS when you need to update content. |
| Cómo funciona · título | Cada caso, contado como un film | Each case, told as a film |
| Cómo funciona · bajada | El sitio real de cada cliente y cómo se resolvió, en poco más de un minuto. | Each client's live site and how it was solved, in just over a minute. |
| Prueba · casos | L&B Elite Wash & Detail · Mr. Studio Tattoo · Truckers Choice · Fenix Medical Center (con sus «Pruébalo» cuando haya) | same |
| Cómo se contrata | Igual que en `/sistemas` | same as `/sistemas` |
| Cierre · CTA | Hablemos de tu web | Let's talk about your website |

**Se va de `/estudio`:**
- la órbita de 9 familias: repite el home viejo;
- el estudio de *design tokens*: pasa al Lab (T11), sin cifras;
- el bloque «Una sola intención, de la dirección al código»: «Cero intermediarios, 100% fiel» es una promesa sin prueba.

**«Cómo funciona»** muestra films de casos de web (Mr. Studio, Truckers, L&B). Cuando exista el Lab, se enlaza desde ahí.

## SEO (`src/data/seo/paginas.ts`, lo cambia Claude con T27)

| Página | Título ES | Título EN |
|---|---|---|
| `sistemas` | Automatización y CRM para negocios | Automation & CRM for businesses |
| `estudio` | Webs y landings a medida | Custom websites & landing pages |

**Portadas:** el `titular` pasa al H1 nuevo de cada página y se regeneran con `scripts/og-images.ts`.

## Listo cuando

- Cada página dice en su primera pantalla qué se contrata y para quién.
- La telemetría, la bandeja, la órbita, el estudio de tokens y el bloque de «una sola intención» ya no se montan. No se borran.
- ES y EN a 390 px y a 1440 px, con teclado y movimiento reducido.
