# T33 · Piezas para «Del brief a la pieza» (M3)

Documento de desglose etapa por etapa para el componente interactivo de `/fabricas` (decisión **D11**).

- **Dueño:** Gemini
- **Fecha:** 1 de noviembre de 2026
- **Voz:** Español neutro con tuteo, sin voseo.
- **Regla:** Sin datos de clientes, con atribución verificada de IA vs. Persona según los archivos fuente.

---

## 1. Resumen de las 3 piezas elegidas

Para demostrar la versatilidad de la fábrica de contenido, se seleccionaron tres formatos y posturas distintas:
1. **Pieza de opinión / metodología:** `tres-ias-y-yo` (Cómo se reparte el trabajo entre herramientas y persona).
2. **Pieza de servicio / caso para agencias:** `agencias-landing-entrega` (Cuándo está terminada una landing con pruebas de entrega).
3. **Pieza de carrusel de marca / trabajo directo:** `hablas-conmigo` (Continuidad técnica: la misma persona escucha el pedido y escribe el código).

---

## 2. Desglose detallado pieza por pieza

---

### Pieza 1 · «Tres IAs, una persona que decide» (`tres-ias-y-yo`)
- **Tipo:** Opinión y metodología de trabajo.
- **Formato:** Carrusel de 5 láminas (4:5, 1080×1350 px).
- **Directorio de origen:** `contenido/piezas/2026-10-28-tres-ias-y-yo/`
- **Directorio de activos web:** [`web/public/portfolio/fabrica/tres-ias-y-yo/`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/)
- **Confirmación de privacidad:** Sin datos de clientes. Expone el organigrama metodológico del estudio.

#### Etapa 1: Brief
- **Archivo de origen:** `contenido/piezas/2026-10-28-tres-ias-y-yo/brief.md`
- **Extracto resumido:**
  > Responsable de marketing que abre una herramienta creyendo que una sola IA simplifica todo el proceso.
  > Insight: Separar la generación técnica de la aprobación humana hace visible quién responde por el resultado final.
- **Quién lo hizo:** **Persona** (Mario Morera formuló el insight de marca y definió la estructura del reparto).
- **Imagen representativa:** [`01-brief.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/01-brief.png)

#### Etapa 2: Guion y Copy
- **Archivo de origen:** `contenido/piezas/2026-10-28-tres-ias-y-yo/copy.md` y tabla de guion en `brief.md`.
- **Extracto resumido:**
  > «01 Gancho: Tres IAs, una persona que decide. El cuarto lugar no lo ocupa otra herramienta.
  > 02 Giro: Producir no alcanza para aprobar. La última decisión tiene nombre y puede frenar la pieza.
  > 03 Prueba: Guion Claude, Placa ChatGPT, Navegador modelo chico, Aprobación Mario.»
- **Quién lo hizo:** **IA** (Claude Opus redactó el guion de 5 láminas siguiendo la fórmula editorial del estudio).
- **Imagen representativa:** [`02-guion.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/02-guion.png)

#### Etapa 3: Arte y Diseño
- **Archivo de origen:** `contenido/piezas/2026-10-28-tres-ias-y-yo/diseno.html` e `imagenes/portada.png`.
- **Extracto resumido:**
  > Dirección de placa: «Lápiz sin inscripción, regla metálica y lupa alineados sobre concreto oscuro; un cuarto lugar vacío. Sin texto en la imagen.»
  > Maquetación en HTML puro con tipografía local sobre tokens oscuros de `kit.css`.
- **Quién lo hizo:** **IA y Código** (ChatGPT generó la placa fotográfica sin texto; el modelo/Codex compuso `diseno.html`).
- **Imágenes representativas:** 
  - Captura del diseño HTML compuesto: [`03-arte-diseno.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/03-arte-diseno.png)
  - Placa fotográfica original de ChatGPT: [`03-placa-chatgpt.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/03-placa-chatgpt.png)

#### Etapa 4: Revisión Humana
- **Archivo de origen:** `contenido/piezas/2026-10-28-tres-ias-y-yo/brief.md` (§ «Única auditoría de copy · antes del arte»).
- **Extracto resumido:**
  > Auditoría de audiencia: Puntaje 10/10 en freno, curiosidad, novedad, guardado y veracidad.
  > Se corrigió el gancho engañoso inicial para no atribuir falsamente tres IAs a la tanda. Mario confirmó la postura antes de enviar a render.
- **Quién lo hizo:** **Persona** (Mario Morera auditó el texto contra la lista negra de humo y validó la exactitud de la oferta).
- **Imagen representativa:** [`04-revision-humana.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/04-revision-humana.png)

#### Etapa 5: Pieza Final
- **Archivo de origen:** `contenido/piezas/2026-10-28-tres-ias-y-yo/salida/lamina-01.png` y `carrusel.pdf`.
- **Extracto resumido:**
  > Carrusel completo de 5 láminas en alta resolución para Instagram y documento paginado PDF para LinkedIn.
- **Quién lo hizo:** **Herramienta / Sistema** (Renderizado headless automatizado de HTML a imagen y ensamblado de PDF).
- **Imagen representativa:** [`05-pieza-final.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/tres-ias-y-yo/05-pieza-final.png)

---

### Pieza 2 · «¿Cuándo está terminada una landing?» (`agencias-landing-entrega`)
- **Tipo:** Pieza de caso y servicio B2B para agencias.
- **Formato:** Carrusel editorial de 6 láminas (4:5, 1080×1350 px).
- **Directorio de origen:** `contenido/piezas/2026-10-28-agencias-landing-entrega/`
- **Directorio de activos web:** [`web/public/portfolio/fabrica/agencias-landing-entrega/`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/agencias-landing-entrega/)
- **Confirmación de privacidad:** Sin datos de clientes. Criterio de entrega técnica para agencias aliadas.

#### Etapa 1: Brief
- **Archivo de origen:** `contenido/piezas/2026-10-28-agencias-landing-entrega/brief.md` y `REVISION-2026-10-28.md`.
- **Extracto resumido:**
  > Responsable de agencia con diseño y copy aprobados que necesita recibir una landing terminada sin sorpresas.
  > Insight: Una landing está terminada cuando pasa pruebas comprobables acordadas desde el primer día (formulario, responsive, eventos de conversión).
- **Quién lo hizo:** **Persona** (Mario Morera estructuró el encuadre comercial y la escena de compra de agencias).
- **Imagen representativa:** [`01-brief.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/agencias-landing-entrega/01-brief.png)

#### Etapa 2: Guion y Copy
- **Archivo de origen:** `contenido/piezas/2026-10-28-agencias-landing-entrega/copy.md` y `brief.md`.
- **Extracto resumido:**
  > ««Ya está lista.» ¿Según qué? Si nadie lo escribió antes, la respuesta cambia en cada revisión.
  > Para muchos equipos, significa que se parece al diseño. Pero eso no dice si el formulario envía ni adónde llega la consulta.
  > Implemento landings para agencias con "terminado" escrito y probado desde el arranque.»
- **Quién lo hizo:** **IA** (Claude Opus desarrolló la narrativa y las listas de comprobación técnica para redes).
- **Imagen representativa:** [`02-guion.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/agencias-landing-entrega/02-guion.png)

#### Etapa 3: Arte y Diseño
- **Archivo de origen:** `contenido/piezas/2026-10-28-agencias-landing-entrega/diseno.html`.
- **Extracto resumido:**
  > Composición editorial pura sin imagen raster por IA.
  > Fondos negro mate `#0B0B0A` y marfil `#ECE7DD`, cajas tipográficas estructuradas y monograma vectorial oficial.
- **Quién lo hizo:** **Código / IA** (Codex estructuró la plantilla HTML basada estrictamente en el kit de diseño institucional).
- **Imagen representativa:** [`03-arte-diseno.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/agencias-landing-entrega/03-arte-diseno.png)

#### Etapa 4: Revisión Humana
- **Archivo de origen:** `contenido/piezas/2026-10-28-agencias-landing-entrega/REVISION-2026-10-28.md`.
- **Extracto resumido:**
  > Lectura independiente calificada 9/10. Ajustes obligatorios aplicados por Mario: redacción más precisa sobre pruebas comprobables y sustitución del término ambiguo «entregable» por «qué recibe la persona».
- **Quién lo hizo:** **Persona** (Mario Morera revisó el borrador, aplicó correcciones léxicas y fijó el alcance comercial).
- **Imagen representativa:** [`04-revision-humana.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/agencias-landing-entrega/04-revision-humana.png)

#### Etapa 5: Pieza Final
- **Archivo de origen:** `contenido/piezas/2026-10-28-agencias-landing-entrega/salida/lamina-01.png` y `carrusel.pdf`.
- **Extracto resumido:**
  > Carrusel editorial de 6 láminas de alto impacto visual y PDF optimizado para lectores de documentos en LinkedIn.
- **Quién lo hizo:** **Herramienta / Sistema** (Compilación automatizada desde el DOM HTML al motor gráfico Playwright).
- **Imagen representativa:** [`05-pieza-final.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/agencias-landing-entrega/05-pieza-final.png)

---

### Pieza 3 · «Hablás conmigo y lo construyo yo» (`hablas-conmigo`)
- **Tipo:** Carrusel de marca y postura de servicio.
- **Formato:** Carrusel de 5 láminas (4:5, 1080×1350 px).
- **Directorio de origen:** `contenido/piezas/2026-10-28-hablas-conmigo/`
- **Directorio de activos web:** [`web/public/portfolio/fabrica/hablas-conmigo/`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/)
- **Confirmación de privacidad:** Sin datos de clientes. Utiliza el rótulo expreso *«Ejemplo recreado · datos de ejemplo»*.

#### Etapa 1: Brief
- **Archivo de origen:** `contenido/piezas/2026-10-28-hablas-conmigo/brief.md`.
- **Extracto resumido:**
  > Responsable de empresa que debe repetir el contexto de un cambio a varias personas.
  > Insight: La continuidad técnica se demuestra cuando una duda de programación vuelve directamente a quien escuchó el pedido.
- **Quién lo hizo:** **Persona** (Mario Morera definió la propuesta de valor: interlocución directa sin intermediarios).
- **Imagen representativa:** [`01-brief.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/01-brief.png)

#### Etapa 2: Guion y Copy
- **Archivo de origen:** `contenido/piezas/2026-10-28-hablas-conmigo/copy.md` y tabla de guion en `brief.md`.
- **Extracto resumido:**
  > «01 Gancho: La misma persona escucha y escribe el código. La diferencia aparece cuando surge una duda.
  > 02 Giro: La duda técnica vuelve al motivo del pedido: ¿este campo hace falta? ¿cambia el presupuesto?
  > 03 Prueba: Recorrido recreado de una decisión técnica.»
- **Quién lo hizo:** **IA** (Claude Opus redactó la secuencia dialógica entre cliente y desarrollador).
- **Imagen representativa:** [`02-guion.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/02-guion.png)

#### Etapa 3: Arte y Diseño
- **Archivo de origen:** `contenido/piezas/2026-10-28-hablas-conmigo/diseno.html` e `imagenes/portada.png`.
- **Extracto resumido:**
  > Placa fotográfica: «Dos sillas sobrias enfrentadas de madera y metal mate, sin personas, sobre piso oscuro. Luz dura lateral.»
  > Composición en `diseno.html` con tipografía marfil en el tercio superior libre.
- **Quién lo hizo:** **IA y Código** (ChatGPT generó la placa fotográfica; Codex maquetó el HTML respetando la zona de resguardo).
- **Imágenes representativas:**
  - Captura del diseño HTML compuesto: [`03-arte-diseno.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/03-arte-diseno.png)
  - Placa fotográfica original de ChatGPT: [`03-placa-chatgpt.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/03-placa-chatgpt.png)

#### Etapa 4: Revisión Humana
- **Archivo de origen:** `contenido/piezas/2026-10-28-hablas-conmigo/brief.md` (§ «Única auditoría de copy · antes del arte»).
- **Extracto resumido:**
  > Control de veracidad: Exigencia de rotular «Ejemplo recreado · datos de ejemplo» en las láminas de prueba para evitar cualquier confusión con casos o números de clientes reales. Mario confirma la postura.
- **Quién lo hizo:** **Persona** (Mario Morera verificó la integridad del mensaje y la ausencia de reclamos engañosos).
- **Imagen representativa:** [`04-revision-humana.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/04-revision-humana.png)

#### Etapa 5: Pieza Final
- **Archivo de origen:** `contenido/piezas/2026-10-28-hablas-conmigo/salida/lamina-01.png` y `carrusel.pdf`.
- **Extracto resumido:**
  > Carrusel exportado con la portada still life y el desarrollo tipográfico contrastado en 1080×1350 px.
- **Quién lo hizo:** **Herramienta / Sistema** (Renderizado y ensamblado final).
- **Imagen representativa:** [`05-pieza-final.png`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/public/portfolio/fabrica/hablas-conmigo/05-pieza-final.png)

---

## 3. Guía de integración para Claude y Codex

- **Estructura para `briefToPiece.ts`:**
  Cada una de las 3 piezas cuenta con los 5 pasos listados (`brief`, `guion`, `arte`, `revision`, `final`), sus textos descriptivos en 2 o 3 líneas, su archivo fuente comprobable y sus imágenes vinculables en `/portfolio/fabrica/<pieza>/...`.
- **Optimización de carga:** Todas las imágenes fueron exportadas en PNG nítido con un ancho máximo de 1080 px, preparadas para carga diferida (`loading="lazy"`).
