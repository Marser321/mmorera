# T06 · Página `/cv` («Sobre mí · CV», D14)

**Ya hecho por Claude:**
- **PDF:** `public/cv/mario-morera-cv-es.pdf` y `public/cv/mario-morera-cv-en.pdf`, generados con `scripts/build-cv-web.py`. Tienen el mismo diseño y la misma base factual que los CV del 27/10, con el título de D1 y sin nombrar el país (D7).
- **SEO:** `pageMetadata("cv", …)` en `src/data/seo/paginas.ts`.

**Voz:** español neutro con tuteo e inglés claro; se copia tal cual.

## Rutas y metadatos

- `src/app/cv/page.tsx` y `src/app/en/cv/page.tsx`, con `pageMetadata("cv", "es" | "en")`.
- Sumar las dos rutas a `src/app/sitemap.ts`.

## Textos

| Bloque | ES | EN |
|---|---|---|
| Eyebrow | Sobre mí · CV | About · Resume |
| H1 | Mario Morera, AI Automation & Operations | Mario Morera, AI Automation & Operations |
| Bajada | Orquesto la tecnología de negocios y equipos: webs, automatizaciones, agentes de IA y contenido con IA. Trabajo en remoto y hablas directo conmigo. | I orchestrate technology for businesses and teams: websites, automations, AI agents and AI content. I work remotely and you talk to me directly. |
| Botón principal | Descargar CV (PDF, español) | Download resume (PDF, English) |
| Enlace secundario | También en inglés (PDF) | Also in Spanish (PDF) |
| Datos rápidos · título | Datos rápidos | Quick facts |
| Rol | AI Automation & Operations | AI Automation & Operations |
| Experiencia | 6 años en desarrollo web e integraciones | 6 years in web development and integrations |
| Idiomas | Español nativo · inglés conversacional | Native Spanish · conversational English |
| Modalidad | Remoto (UTC−3) · jornada completa o proyectos | Remote (UTC−3) · full-time or projects |
| Contacto | mario@mmorera.agency · LinkedIn | mario@mmorera.agency · LinkedIn |
| Con qué trabajo · título | Con qué trabajo | What I work with |
| Casos · título | Casos que puedes abrir | Cases you can open |
| Casos · enlace | Ver todos los casos | See all cases |
| Cierre · título | ¿Buscas a alguien para tu equipo? | Hiring for your team? |
| Cierre · texto | Escríbeme y te respondo yo. | Write to me and I'll reply myself. |
| Cierre · acciones | Escribirme · Copiar correo | Email me · Copy email |

## Qué va en cada bloque

- **Los dos PDF:** cada página ofrece primero el de su idioma y después el otro. Los enlaces abren en una pestaña nueva y no fuerzan la descarga.
- **«Con qué trabajo»:** reutiliza `OrchestrationWheelSection` en versión simple, sin la palabra «Orquestación del ecosistema» ni los niveles de dominio. Si queda pesado en el teléfono, alcanza con una lista de las 9 familias y sus herramientas, con los datos de `skillOrbit`. Elige lo más liviano y explícalo.
- **Los casos:** las 3 tarjetas de `TryItCards`, o sus títulos con el enlace a cada caso.
- **LinkedIn:** `https://www.linkedin.com/in/mario-sergio-morera-escobar-9a16521a4` (la URL de los CV de Mario).
- **Copiar correo:** el mismo patrón del contacto del home (T30), con su aviso para cuando no se puede copiar.

## Lo que se conecta al terminar

- El `cvLink` del héroe (`CV_DESTINATION`) pasa a `/cv`.
- En el menú, «Sobre mí · CV» lleva a `/cv`.
- En el contacto, aparece «Ver CV» en el camino «Consultar por un puesto».

## Listo cuando

- `/cv` y `/en/cv` se ven a 390 y 1440 px, con teclado y movimiento reducido.
- Los PDF abren.
- El héroe, el menú y el contacto llevan a `/cv`.
- No se nombra el país en el texto. El test `publicContent` lo controla.
