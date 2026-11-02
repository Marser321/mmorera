# Auditoría Integral de la Versión en Inglés (/en) · T12

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Auditoría lingüística, terminológica y de coherencia en `/en`)
- **Alcance auditado:**
  - `http://localhost:3011/en` (Home en inglés)
  - `/en/casos-de-exito` y los 15 casos individuales en `[slug]`
  - `/en/sistemas`
  - `/en/estudio`
  - `/en/aplicar`
  - Archivos de soporte: `src/data/projectCases.ts`, `src/data/solutionsData.ts`, `src/app/layout.tsx`, `SystemsExperience.tsx`, `StudioExperience.tsx`, `AplicarOS.tsx`.

---

## 1. Resumen Ejecutivo de Hallazgos

| Tipo de Problema | Cantidad | Impacto | Ejemplos Principales |
|---|---|---|---|
| **Filtraciones de español en `/en` (Leaks)** | 7 | **Alto** | Accesibilidad raíz (`Saltar al contenido principal`), eyebrow de Sistemas (`CRM / IA / Automatización`), tags de stack no localizados (`Reserva por pasos`, `Validación en cliente`). |
| **Calcos del español / Traducción a máquina** | 8 | **Medio-Alto** | *"Tell me what you want to move"* (calco de "qué querés mover", suena a flete/mudanza), *"reply with judgment"*, *"Mario Morera Thesis"*, *"Quote this architecture"*. |
| **Inconsistencias y términos poco idiomáticos** | 6 | **Medio** | *"Websites & landings"* (en inglés se dice *landing pages*), *"Inquire on WhatsApp"*, mezcla de ortografía US/UK (*catalog* vs *catalogue*). |

Todas las rutas respondieron con **HTTP 200** (cero páginas rotas o 404 en la navegación `/en`).

---

## 2. Filtraciones Directas de Español en Rutas `/en`

Son textos que se renderizan en español cuando el usuario navega en inglés:

### 2.1. Enlace de Accesibilidad Raíz (`layout.tsx`)
- **Ubicación:** `web/src/app/layout.tsx` (Línea 63)
- **Texto en `/en`:** `Saltar al contenido principal`
- **Problema:** El enlace para lectores de pantalla (`sr-only`) está hardcodeado en español en el layout raíz compartido. Un usuario ciego angloparlante o navegación por teclado en `/en` escucha español al primer tabulador.
- **Corrección recomendada:** Detectar ruta/idioma o usar componente con `useLanguage()`:
  - En inglés: `Skip to main content`

### 2.2. Eyebrow de Sistemas (`SystemsExperience.tsx`)
- **Ubicación:** `web/src/components/premium/SystemsExperience.tsx` (Línea 57)
- **Texto en `/en`:** `SYSTEMS · CRM / IA / AUTOMATIZACIÓN`
- **Código actual:** `{isEs ? "Sistemas" : "Systems"} · CRM / IA / Automatización`
- **Problema:** La parte de las disciplinas está fija fuera del ternario.
- **Corrección recomendada:**
  - En inglés: `Systems · CRM / AI / Automation`

### 2.3. Etiquetas de Tecnologías (Stack) no localizadas en `projectCases.ts`
El array `stack` en `src/data/projectCases.ts` es de tipo `string[]` simple (no `LocalizedText`). Como consecuencia, varios casos muestran píldoras en español en `/en`:
1. **Mr. Studio Tattoo (`/en/casos-de-exito/mr-studio-tattoo`):**
   - Muestra: `Reserva por pasos` y `Consentimiento digital`
   - Debe ser: `Multi-step booking` y `Digital consent`
2. **Truckers Choice (`/en/casos-de-exito/truckers-choice`):**
   - Muestra: `Cotización por pasos`
   - Debe ser: `Multi-step quoting`
3. **América Trámites (`/en/casos-de-exito/america-tramites`):**
   - Muestra: `Validación en cliente`
   - Debe ser: `Client-side validation`
4. **Doge SM (`/en/casos-de-exito/doge-sm`):**
   - Muestra: `Catálogo de tienda`
   - Debe ser: `E-commerce store catalog`

---

## 3. Calcos Sintácticos y Textos que Suenan Traducidos a Máquina

Frases traducidas literalmente palabra por palabra que pierden sentido o suenan extrañas para un angloparlante nativo:

### 3.1. Formulario de Aplicar (`/en/aplicar`)
- **Titular actual:** *"Tell me what you want to move."*
  - **Diagnóstico:** Calco directo del modismo rioplatense *"Contame qué querés mover"* (en el sentido de impulsar o desestancar un proyecto). En inglés, *"what you want to move"* se interpreta literalmente como una empresa de mudanzas o fletes (mover cajas/muebles).
  - **Corrección sugerida:** `Tell me what you want to build or automate.` o `Tell me what you're looking to launch.`
- **Bajada actual:** *"Three steps. Enough context to understand the project and reply with judgment."*
  - **Diagnóstico:** *"reply with judgment"* es traducción literal de *"responder con criterio"*. En inglés "with judgment" tiene connotación de juzgar/sentenciar moralmente.
  - **Corrección sugerida:** `Three steps. Enough context to understand your project and reply with an informed perspective.`

### 3.2. Panel de Decisiones y Radares (`TechRadarBackstageStudio.tsx`)
- **Etiqueta actual:** *"Mario Morera Thesis:"*
  - **Diagnóstico:** Calco de *"Criterio de Mario Morera:"*. En inglés suena a tesis universitaria.
  - **Corrección sugerida:** `Mario Morera's Take:` o `Mario's Architectural Verdict:`
- **Estudio actual:** *"Anti-Dispersion Blueprint Studio"* / *"Anti-Dispersion Studio & HUD"*
  - **Diagnóstico:** "Anti-dispersión" es un concepto propio del español. En inglés técnico de productividad o video se usa *Focus*, *Distraction-Free* o *High-Retention*.
  - **Corrección sugerida:** `Distraction-Free Recording HUD` / `High-Retention Blueprint Studio`
- **Botón de acción:** *"Send to my WhatsApp"*
  - **Diagnóstico:** Calco de "Enviar a mi WhatsApp". En inglés nativo se dice `Send via WhatsApp` o `Share to WhatsApp`.
- **Botón de cotización:** *"Quote this architecture"*
  - **Diagnóstico:** En inglés "to quote" significa citar texto o cotizar, pero como CTA suena forzado.
  - **Corrección sugerida:** `Request an estimate for this architecture` o `Get pricing for this stack`.

### 3.3. Estudio de Diseño (`InteractiveDesignTokenStudio.tsx`)
- **Control deslizante:** *"Corner Curvature"*
  - **Diagnóstico:** Calco de "Radio de Curvatura". En frontend/UI el estándar de la industria es `Corner Radius` o `Border Radius`.
- **Botón secundario:** *"Inquire on WhatsApp"*
  - **Diagnóstico:** "Inquire" es excesivamente formal y anticuado para un chat de WhatsApp.
  - **Corrección sugerida:** `Chat on WhatsApp` o `Message on WhatsApp`.

---

## 4. Calidad del Inglés en el Héroe y Servicios Nuevos (T01)

### 4.1. Héroe (`/en`)
- **Título actual:** *"I orchestrate your business technology: web, AI agents and content."*
  - **Evaluación:** Gramaticalmente correcto. Comunica la posición de D1 de forma concisa.
- **Bajada actual:** *"I design and connect your website, your automations, agents that answer for you and systems that produce content. I coordinate people, tools and AI models so they work as one team. You talk to me, and I build it."*
  - **Observación:** *"agents that answer for you"* suena un poco plano. Se sugiere: `AI agents that respond and book for you`.
- **Píldoras:** *"Websites & landings"*
  - **Observación:** En inglés la palabra *landings* en plural no se usa sola para páginas de aterrizaje; se dice `Websites & landing pages`.

### 4.2. Servicios (`solutionsData.ts` en inglés)
- **Tag 01:** `Presence` → Algo ambiguo. Sugerencia: `Web Presence` o `Digital Presence`.
- **Entregable 01:** `Bilingual and built for the phone` → "built for the phone" suena coloquial infantil. Sugerencia estándar: `Mobile-first and fully responsive`.
- **Entregable 01:** `Performance measured before handoff` → "measured" queda vago. Sugerencia: `Performance-audited before delivery`.
- **Tag 03:** `Connected processes` → Calco de "Procesos conectados". Sugerencia idiomática: `Connected Workflows` o `Workflow Automation`.
- **Headline 04:** `Systems that produce posts and videos for your brand, with your judgment in every delivery.` → Muy buena redacción; *"with your judgment"* aquí sí funciona porque califica el criterio editorial de la marca.

### 4.3. Contacto (`HomeExperience.tsx`)
- **Título actual:** *"Shall we work together?"*
  - **Evaluación:** "Shall we..." suena formal/británico anticuado para una web de tecnología y automatización en 2026.
  - **Sugerencia:** `Let's work together.` o `Ready to build together?`
- **Hint de puesto:** *"I'll share my CV and availability"*
  - **Observación:** En el mercado estadounidense (US) se utiliza predominantemente *Resume*; en Europa y LatAm, *CV*.
  - **Sugerencia:** `I'll share my resume/CV and availability` o `View resume and availability`.

---

## 5. Auditoría de Casos de Éxito Individuales (`/en/casos-de-exito/[slug]`)

Se verificó el contenido en inglés de los 15 casos:

1. **`fenix-medical-center`:**
   - Inglés impecable. Terminología médica rigurosa (*hyperbaric oxygen, continuous clinical oversight, fail-closed switch, continuity of care*).
2. **`lb-elite-wash-detail`:**
   - Excelente tono técnico (*database-less architecture, dynamic body-type quoter, deterministic router, additive durations*).
   - *Detalle:* En constraints usa *catalogue* (UK) mientras el resto de la web usa *catalog* (US). Estandarizar a **`catalog`**.
3. **`new-brothers-barberia`:**
   - Bien adaptado como *New Brothers Barbershop*.
   - Frase: *"...schedule, clients, cash and barber payouts in one panel."* Sugerencia: cambiar *cash* por `cash register` o `POS register` para evitar ambigüedad con dinero físico.
4. **`truckers-choice`:**
   - Buena precisión en jerga regulatoria de transporte en EE.UU. (*DOT authority, filings, mirrored routes*).
5. **`rangel-oviedo-group`:**
   - Tono sofisticado acorde a Real Estate privado (*private advisory, multi-touch lead source tracking, residential curation*).
6. **`mr-studio-tattoo`:**
   - Bien adaptado (*anatomical selector, age-based consent, deposit charged on confirmation*).
7. **`cana-vacations`:**
   - Transparente y claro respecto al estado de implementación local (*local implementation, guided quote, active domain unverified*).

---

## 6. Checklist de Acciones Recomendadas

- [ ] **Para Claude (dueño de textos y datos):**
  1. Corregir los 4 textos de stack en `web/src/data/projectCases.ts` para que muestren su versión en inglés cuando corresponda (o convertir `stack` en array bilingüe).
  2. Ajustar el titular de `/en/aplicar`: cambiar *"Tell me what you want to move"* por *"Tell me what you want to build or automate"*.
  3. Cambiar *"Shall we work together?"* por *"Let's work together."* en `HomeExperience.tsx`.
  4. Homogeneizar ortografía a inglés estadounidense (cambiar *catalogue* por *catalog*).
- [ ] **Para Codex (código y componentes):**
  1. En `web/src/app/layout.tsx`: condicionar el texto de accesibilidad a `Skip to main content` cuando la ruta sea `/en`.
  2. En `web/src/components/premium/SystemsExperience.tsx`: incluir el fragmento de disciplinas dentro del ternario de idioma para emitir `CRM / AI / Automation`.
  3. En `InteractiveDesignTokenStudio.tsx`: renombrar `Corner Curvature` a `Corner Radius` y `Inquire on WhatsApp` a `Chat on WhatsApp`.
