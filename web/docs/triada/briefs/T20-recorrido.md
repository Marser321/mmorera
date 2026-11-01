# T20 · Textos del recorrido nuevo (D4)

**Fuente:** [`../PLAN-experiencia.md`](../PLAN-experiencia.md), secciones 4 y 7. **Voz:** español neutro con tuteo e inglés claro. Quien implementa copia estos textos tal cual. Si falta alguno, deja `TODO(Claude)`.

**Quién usa cada parte:** T21 («Cómo trabajo»), T23 (menú, pie y héroe), T30 (contacto), T26 y T27 (páginas de servicio), y T04 (proyectos).

## 0. Ya hecho por Claude en `src/data/solutionsData.ts`

Ya están en los datos, no hay que tocar nada:
- **Servicios con 3 entregables cada uno:**
  - se van «Rendimiento medido antes de entregar», «Agente conectado a tus canales», «Avisos a tu equipo…» y «Variantes para probar qué funciona»;
  - el entregable de contenido pasa a «Guiones, carruseles y piezas de video a partir de un brief».
- **«Ideal para» de Webs** pasa a nombrar una situación: «Negocios que reciben consultas y pierden ventas porque su web no explica lo que hacen.»
- **Etiquetas en EN:** «Web presence» y «Connected workflows».

## 1. Héroe (`HomeExperience.tsx`, `copy`; T23)

El eyebrow y el título no cambian (D1).

| Clave | ES | EN |
|---|---|---|
| `intro` | Diseño y conecto tu web, tus automatizaciones, agentes que atienden por ti y sistemas que producen contenido. Hablas conmigo y lo construyo yo; coordino a tu equipo, las herramientas y los modelos de IA para que trabajen juntos. | I design and connect your website, your automations, agents that answer for you and systems that produce content. You talk to me and I build it; I coordinate your team, the tools and the AI models so they work together. |
| `services[web-ecommerce].label` | Webs y landings | Websites & landing pages |
| `cvLink` (nuevo, enlace de texto bajo los botones) | ¿Buscas a alguien para tu equipo? Ver CV → | Hiring for your team? View my resume → |

`cvLink` lleva a `/cv` (o `/en/cv`). Mientras T06 no exista, lleva a `#contacto`.

## 2. Tramo «¿Qué necesitas resolver?» (`ServicesSection.tsx`; T23)

| Clave | ES | EN |
|---|---|---|
| `eyebrow` | Servicios | Services |
| `title` | ¿Qué necesitas resolver? | What do you need solved? |
| `intro` | Cuatro cosas que hago y conecto entre sí. Cada una, al lado del caso más cercano que ya construí. | Four things I build and connect. Each one next to the closest case I've already built. |
| `howItWorks` (enlace por servicio) | Ver cómo funciona → | See how it works → |
| `talk` (un solo CTA al final del tramo, reemplaza «Hablemos de esto» ×4) | Hablemos de tu caso | Let's talk about your case |

**A dónde lleva «Ver cómo funciona»:**
- Webs → `/estudio`.
- Automatización y CRM → `/sistemas`.
- Agentes de IA → `/agentes` cuando exista (T07). Mientras tanto, el enlace no se muestra.
- Contenido con IA → `/fabricas` cuando exista (T08). Mientras tanto, el enlace no se muestra.

## 3. Tramo «Pruébalo tú» (`#proyectos`; T04)

| Clave | ES | EN |
|---|---|---|
| `archiveEyebrow` | Proyectos | Projects |
| `archiveTitle` | Tres sistemas que puedes abrir hoy. | Three systems you can open today. |
| `archiveBody` | Cada tarjeta dice qué es: implementado o demo. Ábrelo y pruébalo. | Each card says what it is: live or demo. Open it and try it. |
| `archiveCta` | Ver todos los casos | See all cases |
| `tryIt` (botón de cada tarjeta) | Pruébalo | Try it |
| `watchFilm` | Ver el film · {duración} | Watch the film · {duration} |

Las rutas y el texto de cada botón «Pruébalo» salen de T28 (Gemini) y van en `projectCases.ts` (Claude).

## 4. Tramo «Cómo trabajo» (T21; fusiona `#perfil` y `#metodo`)

| Clave | ES | EN |
|---|---|---|
| `eyebrow` | Cómo trabajo | How I work |
| `title` | Hablas conmigo y lo construyo yo. | You talk to me, and I build it. |
| `body` | Las cuentas y los accesos quedan a tu nombre. Te entrego el sistema documentado y explicado. Si algo falla, me escribes a mí. | Accounts and access stay in your name. You get the system documented and explained. If something breaks, you write to me. |
| Paso 01 · título | Diagnóstico | Diagnosis |
| Paso 01 · texto | Entiendo cómo trabajas hoy y dónde se pierde tiempo. Acordamos qué conviene construir primero, y qué no. | I learn how you work today and where time gets lost. We agree on what to build first, and what not to. |
| Paso 02 · título | Construcción | Build |
| Paso 02 · texto | Diseño, programo y conecto las piezas. Ves avances reales durante el trabajo. | I design, build and connect the pieces. You see real progress along the way. |
| Paso 03 · título | Traspaso y mantenimiento | Handover and maintenance |
| Paso 03 · texto | Te dejo el sistema funcionando, con las cuentas a tu nombre. Si quieres, sigo a cargo del mantenimiento. | I hand over a working system, with accounts in your name. If you want, I stay on for maintenance. |
| `proofLink` (cuando exista T10) | Mira cómo coordino agentes de IA en mi propio trabajo → | See how I coordinate AI agents in my own work → |

**Qué no lleva:**
- plazos;
- las insignias de producción («Sin compromiso», «Velocidad extrema»…);
- «una sola dirección»;
- el manifiesto CREAR / CONSTRUIR / ESCALAR.

`WORKFLOW_STAGES` pasa a estos 3 pasos cuando Codex arme T21. Claude cambia los datos en esa misma rama.

**Foto:** D13, pendiente. Mientras Mario no la elige, va solo el monograma.

## 5. Contacto (T30)

| Clave | ES | EN |
|---|---|---|
| `contactEyebrow` | Hablemos | Let's talk |
| `contactTitle` | ¿Un puesto o un proyecto? | A role or a project? |
| `contactBody` | Si buscas a alguien para tu equipo o tienes un proyecto concreto, elige el camino que corresponda. Te respondo yo. | Whether you're hiring for your team or have a specific project, pick the path that fits. I'll reply myself. |
| `roleHint` | Te comparto mi CV y disponibilidad | I'll share my resume and availability |
| `roleViewCv` | Ver CV | View resume |
| `roleCopyEmail` / aviso al copiar | Copiar correo / Correo copiado | Copy email / Email copied |
| `projectHint` | Brief de 2 minutos; se abre aquí | 2-minute brief; opens right here |
| `quickLine` | ¿Prefieres una consulta rápida? Escríbeme por WhatsApp. | Prefer a quick question? Message me on WhatsApp. |

**Opción nueva del brief** (`AplicarOS.tsx`, `teamContexts`; también en `TEAM_CONTEXT_VALUES` de `lib/leadValidation.ts`):

| `value` | ES | EN |
|---|---|---|
| `agency` | Soy una agencia o un equipo y quiero sumarte a un proyecto. | We're an agency or team and want to bring you onto a project. |

## 6. Menú (D10) y botón flotante (D9) (T23 y T22)

| Elemento | ES | EN | Destino |
|---|---|---|---|
| Menú | Servicios ▾ | Services ▾ | Abre las 4 entradas de abajo |
| ↳ | Webs y landings | Websites & landing pages | `/estudio` |
| ↳ | Agentes de IA | AI agents | `/agentes` (mientras no exista T07: `/#servicios`) |
| ↳ | Automatización y CRM | Automation & CRM | `/sistemas` |
| ↳ | Contenido con IA | AI content | `/fabricas` (mientras no exista T08: `/#servicios`) |
| Menú | Casos | Cases | `/casos-de-exito` |
| Menú | Sobre mí · CV | About · Resume | `/cv` (mientras no exista T06: `/#perfil`) |
| CTA | Hablemos | Let's talk | `/aplicar` (en el home, `#contacto`) |
| Botón flotante (D9) | Hablemos | Let's talk | `#contacto` |

## 7. Pie (T23)

| Clave | ES | EN |
|---|---|---|
| Frase bajo el nombre | AI Automation & Operations. Trabajas directo conmigo. | AI Automation & Operations. You work directly with me. |
| Enlaces | Casos · Automatización y CRM · Webs y landings · Cuéntame tu proyecto · Privacidad · Términos · Cookies | Cases · Automation & CRM · Websites & landing pages · Tell me about your project · Privacy · Terms · Cookies |

## Lo que este brief no cubre

- Los pasos de M1, «Así entra una consulta» (T31).
- Los héroes de `/sistemas` y `/estudio` como páginas de servicio (T27).
- El guion de la demo del agente (T32).

Van en sus propios briefs.
