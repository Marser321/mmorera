# Crítica Externa de la Preview · Integración 2 (Sesión 4)

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Mirada crítica externa, Tríada Claude · Gemini · Codex)
- **Entorno evaluado:** Preview en vivo en `http://localhost:3012` (rama `triada/web`, commit `593a1fc`)
- **Rutas auditadas:** `/`, `/casos-de-exito`, `/casos-de-exito/fenix-medical-center`, `/en`
- **Resoluciones comprobadas:** Pantalla de escritorio (1440 × 900 px) y teléfono móvil (390 × 844 px)
- **Protocolo:** Lectura en frío como visitante externo, sin consultar previamente los briefs ni el plan interno. Voz en español neutro con tuteo estricto (sin voseo).

---

## 1. Confirmación de Versión y Métricas de Altura

Antes de emitir la crítica, se auditó el entorno local para confirmar que no se tratara de una preview obsoleta:

```
document.documentElement.scrollHeight a 1440 px: 7.202 px (aprobado: unos 7.200 px)
document.documentElement.scrollHeight a 390 px:  9.053 px (reducción del 40,7% frente a los 15.267 px de la sesión 3)
```

- **Verificación de componentes:**
  - El tramo antiguo `#perfil` («Perfil & Filosofía») con sus 6 diapositivas sticky ha desaparecido.
  - El tramo antiguo `#metodo` («Del problema a un sistema vivo») ha desaparecido.
  - Se encuentra montado el nuevo tramo **«Cómo trabajo»** (`#perfil`), con el monograma quieto, 3 frases directas y 3 etapas operativas (Diagnóstico, Construcción, Traspaso y mantenimiento).
  - La sección `#proyectos` despliega las 3 tarjetas **«Pruébalo tú»** (Fenix Medical Center, L&B Elite Wash & Detail y New Brothers Barbería) con sus accesos interactivos y films.
  - El formulario de contacto (`#contacto`) presenta los dos caminos («¿Un puesto o un proyecto?») con el brief interactivo de 3 pasos plegado por defecto.
  - La preview es legítima, actual y corresponde plenamente a los cambios integrados de T21, T22, T23, T29 y T30.

---

## 2. Las Tres Preguntas de la Crítica

### A. ¿El recorrido se entiende de punta a punta?

**Sí. Por primera vez la web cuenta una historia ejecutiva coherente y sin laberintos.**

El recorrido mental de un visitante que busca contratar o evaluar a Mario se articula ahora de forma natural:

1. **Héroe (884 px a 1440):** El titular (*«Orquesto la tecnología de tu negocio: web, agentes de IA y contenido»*) despeja cualquier duda de identidad en menos de 3 segundos. No se presenta como un programador aislado ni como una agencia inflada de personal: se posiciona como un director técnico que automatiza operaciones y construye activos digitales de alta gama.
2. **Servicios (3.282 px a 1440):** Cuatro bloques temáticos bien delimitados (Webs, Agentes de IA, Automatización/CRM y Fábricas de contenido). Cada uno formula un problema de negocio real antes de enunciar la solución técnica.
3. **Proyectos «Pruébalo tú» (1.168 px a 1440):** Este tramo es el punto de inflexión. Pasar de una galería de capturas estáticas a tres sistemas vivos donde el visitante puede pulsar *«Cotizar por vehículo»*, *«Probar reserva en 6 pasos»* o entrar al *«CRM demo»* valida inmediatamente que lo prometido en los servicios existe en producción.
4. **Cómo trabajo (715 px a 1440):** Al sustituir el manifiesto egocéntrico por las tres fases (*Diagnóstico → Construcción → Traspaso y mantenimiento*), el visitante entiende cómo será el trato comercial: hablas con él, construyes con él y el código/cuentas quedan a tu nombre.
5. **Contacto (672 px a 1440):** La bifurcación inicial (*«Consultar por un puesto»* vs *«Consultar por un proyecto»*) clasifica de inmediato el perfil del visitante sin abrumarlo con un formulario kilométrico desde el primer segundo.

**Veredicto:** El visitante ya no se siente atrapado en una demostración técnica infinita; recorre una propuesta de servicios moderna, tangible y orientada a resultados.

---

### B. ¿Dónde todavía cansa?

**El tramo de Servicios (`#servicios`) sigue siendo el cuello de botella del Home.**

A pesar del drástico recorte de la página, la sección de servicios mide **3.282 px a 1440 px**, lo que representa **el 45,6% de toda la altura del home**. En el teléfono móvil (390 px), esta sección supera los 4.100 px continuos de desplazamiento vertical.

#### Causas de la fatiga en Servicios:
1. **Sobrecarga de tarjetas de capacidades (12 bloques):**
   - Cada uno de los 4 servicios incluye: titular, bajada conceptual, 3 tarjetas de capacidades con subtítulos y explicaciones detalladas, chip de tags tecnológicos y botón hacia un caso de éxito.
   - Leer 12 tarjetas técnicas consecutivas en la página principal agota la atención. El visitante ya entendió el valor de Mario al terminar el segundo servicio; el tercero y el cuarto se perciben como un catálogo redundante de características de software.
2. **Duplicidad entre la portada y las páginas de servicio:**
   - La sección del home intenta explicar la arquitectura completa de cada servicio (telemetría, integraciones, Webhooks, LLMs, pipelines) en vez de vender la solución y derivar el detalle a la página correspondiente (`/sistemas`, `/estudio`, `/agentes`, `/fabricas`).
3. **Persistencia del micro-copy de hover en móvil:**
   - En la cabecera del servicio o al inicio de la sección móvil, la sugerencia de interactuar por paso de ratón (*hover*) sigue desconcertando a usuarios de pantalla táctil.

#### Propuesta de alivio para Claude y Codex:
- Reducir cada bloque de servicio a una estructura compacta: **Título del servicio + Promesa en 2 líneas + 3 viñetas concisas de entrega + Enlace a la página de servicio**.
- Dejar los esquemas técnicos, telemetría y explicaciones minuciosas para las páginas dedicadas de servicio que se implementarán con la plantilla de T26. Con esta sola medida, el home bajará de 7.200 px a cerca de 5.200 px en escritorio.

---

### C. ¿Qué falta para que alguien escriba?

El recorrido convence a nivel de capacidad técnica, pero todavía existen barreras que frenan la conversión inmediata de un lead:

1. **Fricción del brief interactivo para el visitante frío:**
   - El camino *«Consultar por un proyecto»* despliega el brief interactivo en 3 pasos (`AplicarOS`). Este formulario es excelente para filtrar y cualificar prospectos maduros, pero para un cliente que solo quiere consultar una duda rápida sobre presupuesto, plazos o viabilidad, completar 3 pasos con nombre, correo y sitio web se siente como una auditoría formal.
   - *Falta:* Un canal alternativo o un texto tranquilizador al pie del formulario: *«¿Prefieres una consulta rápida de 5 minutos antes de detallar tu proyecto? Escríbeme directo a WhatsApp»*.
2. **Inconsistencia desconcertante del botón flotante:**
   - En el **Home** (`/`) y en `/en`: aparece la cápsula centrada inferior *«Hablemos»* (anclada a `#contacto`).
   - En **/casos-de-exito** y en las fichas individuales (como `/casos-de-exito/fenix-medical-center`): la cápsula desaparece y es reemplazada por el botón circular flotante verde de WhatsApp en la esquina inferior derecha.
   - *Problema:* Si un cliente potencial está leyendo el caso de éxito de Fenix o L&B y decide contactar a Mario, pulsa el botón flotante esperando abrir el formulario estructurado del sitio y se le abre repentinamente la aplicación de WhatsApp. Esto crea dos experiencias disjuntas. La cápsula *«Hablemos»* debe ser el único estándar transversal en todo el sitio, tal como está previsto en T37.
3. **Ausencia de compromiso explícito de respuesta:**
   - En ninguna parte del bloque de contacto se indica cuándo recibirá respuesta el usuario. Incluir una línea clara y humana (*«Respondo en menos de 24 horas laborables con una primera devolución o una ruta de trabajo»*) reduce drásticamente la tasa de rebote en formularios.
4. **Camino «Puesto» sin salida fluida:**
   - Quien selecciona *«Consultar por un puesto»* solo encuentra las opciones *«Copiar correo»* y *«Ver CV»* (que por el momento redirige al mismo bloque a la espera de T06).
   - *Falta:* Un botón directo a su perfil profesional verificado en LinkedIn y una indicación de su situación de contratación actual (por ejemplo: *«Disponible para roles remotos o contratos de liderazgo técnico»*).

---

## 3. Recorrido por Rutas Secundarias

### 3.1. `/casos-de-exito` (7.983 px escritorio / 5.748 px móvil)
- **Acierto:** El riel de films trasladado desde el home funciona mucho mejor aquí. La página actúa como una biblioteca audiovisual de trabajos.
- **Fricción:** Al final de la página vuelve a quedar el botón verde de WhatsApp desalineado del sistema de diseño principal. Además, cuando un visitante entra por primera vez a esta página desde Google o un enlace directo, no encuentra un resumen claro de servicios antes de ver la lista de proyectos.

### 3.2. `/casos-de-exito/fenix-medical-center` (4.512 px escritorio / 5.440 px móvil)
- **Acierto de diseño:** La nueva jerarquía en tres niveles de T29 es sobresaliente:
  1. Arriba: Sección **«Pruébalo tú»** con el enlace directo al formulario de citas sin texto libre en producción (`fenixmedicalcenters.com/es/contacto`).
  2. Al medio: El film cinematográfico de Remotion que contextualiza el desafío operativo de la clínica médica.
  3. Abajo: El bloque técnico **«Bajo el capó»** plegado mediante un botón accesible *«Ver arquitectura»* con `aria-expanded`. Quien no es ingeniero no se siente intimidado por diagramas de flujo; quien busca rigor técnico puede desplegarlo con un solo clic.

### 3.3. Versión en Inglés (`/en`) (7.202 px escritorio / 8.991 px móvil)
- **Acierto lingüístico:** Los calcos y modismos fueron completamente subsanados. La cadencia en inglés es profesional y concisa:
  - *«Three systems you can open today»*
  - *«You talk to me, and I build it. Accounts and access stay in your name, with no intermediaries and no proprietary lock-in.»*
  - *«A role or a project?»*
- **Detalle menor detectado:** En el héroe, durante la animación de carga, se proyecta momentáneamente una cadena cifrada (`OPER8+29&4`) que luego se estabiliza. En dispositivos con `prefers-reduced-motion` esta animación debe desactivarse para presentar el texto legible desde el frame cero.

---

## 4. Conclusión y Prioridades para la Tríada

La versión de la Integración 2 es cualitativamente superior a todo lo previo: es más corta, más rápida, cuenta con pruebas interactivas reales en sus casos insignia y elimina el discurso autorreferencial.

Para cerrar la brecha hacia una máquina de conversión comercial perfecta, los pasos inmediatos son:
1. **Unificar el botón flotante transversalmente (T37):** Reemplazar el botón suelto de WhatsApp en `/casos-de-exito` y páginas de casos por la cápsula *«Hablemos»*.
2. **Compactar Servicios en el Home:** Mover el peso técnico a las páginas de servicio (T26/T27) para dejar la sección del home por debajo de los 1.800 px.
3. **Publicar la página `/cv` (T06):** Para que el camino de contratación de talento tenga un destino real con PDF descargable.
4. **Incorporar las 3 nuevas rutas «Pruébalo tú» de T38:** Añadir los botones interactivos a Mr. Studio Tattoo (`/booking`), Truckers Choice (`/es/contact`) y Rangel Oviedo (`/#perfiles`).
