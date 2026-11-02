# Crítica en frío · Páginas de servicio `/sistemas` y `/estudio`

Auditoría externa realizada desde la perspectiva de un visitante primerizo (dueño de negocio y director de operaciones) en `http://localhost:3012`, evaluada a 1440 px y 390 px, en español y en inglés, sin consultar los briefs previos.

- **Autor:** Gemini (verificador y crítico externo)
- **Fecha:** 1 de noviembre de 2026
- **Voz:** Español neutro con tuteo, sin voseo.
- **Rutas auditadas:**
  - `/sistemas` (ES) y `/en/sistemas` (EN) — *«Automatización y CRM»*
  - `/estudio` (ES) y `/en/estudio` (EN) — *«Webs y landings»*
- **Evidencia visual:** Capturas en [`web/docs/triada/gemini/critica-servicios/`](file:///c:/Users/morer/OneDrive/Desktop/MMORERA/web/docs/triada/gemini/critica-servicios/)

---

## 1. Métricas de longitud y peso en pantalla

| Página | Altura escritorio (1440 px) | Altura móvil (390 px) | Diagnóstico de extensión |
|---|---|---|---|
| **`/sistemas`** | **7.194 px** | **6.475 px** | **Extensa.** El tramo del mapa operativo y los casos interactivos alargan la página antes de llegar a las pruebas y al contacto. |
| **`/estudio`** | **4.566 px** | **5.483 px** | **Equilibrada.** Es un 36 % más corta que `/sistemas`. Se recorre con agilidad y los casos aparecen rápidamente. |
| **`/en/sistemas`** | **7.194 px** | **6.391 px** | Idéntica estructura y altura balanceada con la versión en español. |
| **`/en/estudio`** | **4.566 px** | **5.332 px** | Idéntica estructura, excelente ritmo de lectura. |

---

## 2. Primera pantalla: ¿Queda claro qué se contrata y para quién?

### `/sistemas` (Automatización y CRM)
- **Titular:** *«Que ninguna consulta quede sin seguimiento.»*
- **Bajada:** *«Conecto tus formularios, tu agenda, WhatsApp y tu CRM para que cada consulta entre ordenada, le llegue a quien corresponde y el seguimiento salga solo.»*
- **Evaluación en escritorio (1440 px):** **Sobresaliente.**
  - En un solo golpe de vista, el visitante entiende qué dolor resuelve: consultas que se pierden entre WhatsApp, correo y planillas.
  - La tarjeta integrada al héroe (*Para quién es · Para quién no · Qué incluye*) responde las tres preguntas que un tomador de decisiones se hace antes de hacer scroll.
- **Evaluación en móvil (390 px):** **Buena, con desplazamiento menor.**
  - En el primer pantallazo entran el eyebrow, el H1, la bajada y el botón primario «Hablemos de tu proceso».
  - La tarjeta con los tres puntos de «Qué incluye» y el stack (n8n, Make, GoHighLevel) queda debajo del pliegue (requiere medio scroll). La promesa sigue siendo clara desde el segundo cero.

### `/estudio` (Webs y landings)
- **Titular:** *«Una web que explica lo que haces y hace que te escriban.»*
- **Bajada:** *«Diseño y programo sitios y landings a medida: claros, rápidos en el teléfono, en dos idiomas si hace falta y fáciles de actualizar. Lo diseño y lo programo yo.»*
- **Evaluación en escritorio (1440 px):** **Sobresaliente.**
  - Elimina el humo de «diseño web moderno» y ataca el problema comercial de fondo: la web que no convierte porque nadie entiende qué vende la empresa.
  - La autoría directa (*«Lo diseño y lo programo yo»*) establece de inmediato la ventaja frente a agencias tradicionales con capas de cuentas y becarios.
- **Evaluación en móvil (390 px):** **Muy buena.**
  - La tipografía escala sin desbordes. El H1 y el botón «Hablemos de tu web» ocupan el primer tercio; «Para quién es» aparece inmediatamente después.

---

## 3. «Para quién no»: ¿Filtra bien o espanta?

### En `/sistemas`:
> *«Si recibes pocas consultas por semana y las respondes sin problema, todavía no lo necesitas.»*

- **Veredicto:** **Filtra con maestría y genera confianza.**
  - **Por qué funciona:** No es una frase arrogante. Transmite honestidad técnica: Mario no va a armar una arquitectura compleja de automatizaciones para un negocio que tiene 3 mensajes por semana y no los sufre.
  - **Efecto en el cliente objetivo:** En una empresa con 15 a 40 consultas diarias desordenadas, esta frase actúa como un **disparador de autoselección**: *«Yo sí tengo este caos todos los días, esto está hecho exactamente para mí»*.
  - **Ajuste fino sugerido:** Cambiar *«por semana»* por *«al día»*, ya que muchas empresas de servicios con 5 consultas semanales de alto ticket sí necesitan un CRM impecable para no perder ventas de 10.000 USD. Ejemplo:
    > *«Si recibes muy pocas consultas y las respondes al instante sin planillas, todavía no lo necesitas.»*

### En `/estudio`:
> *«Si tu web ya funciona y solo quieres cambiar textos, no hace falta rehacerla.»*

- **Veredicto:** **Filtra bien a clientes de bajo valor, pero roza un descarte falso.**
  - **Por qué funciona:** Protege a Mario de encargos de mantenimiento menor o retoques de WordPress de 20 dólares.
  - **Riesgo detectado:** Un cliente cuya web está activa (no da error 404), pero no le genera ni una sola venta porque el texto y la estructura son pésimos, podría interpretar: *«Mi web técnicamente funciona, entonces Mario no me la puede rehacer»*.
  - **Reescritura sugerida en español:**
    > *«Si tu web actual ya te genera consultas constantes y solo necesitas cambiar un párrafo, no te conviene rehacerla desde cero.»*
  - **En inglés:**
    > *«If your current site already brings steady enquiries and you only need small text tweaks, you don't need a rebuild.»*

---

## 4. Qué sobra y qué falta

### En `/sistemas`:
- **Qué sobra (Redundancia crítica de casos):**
  - La sección «02 · CASOS DE USO / TOCA UN NODO PARA INSPECCIONARLO» vuelve a explicar el caso de **New Brothers Barbería** (Problema, Diagnóstico, Sistema, Resultado con 5 pasos), y exactamente dos pantallas más abajo, en «Sistemas que ya construí», vuelve a figurar New Brothers con sus botones de prueba interactiva.
  - **Recomendación:** Eliminar el visor interactivo de nodos o simplificarlo a un solo diagrama conceptual de flujo de datos, dejando que los casos reales se muestren una sola vez en «Sistemas que ya construí». Esto acortaría la página en unos 1.500 px.
- **Qué falta:**
  - **Expectativa de tiempos del proceso:** En la sección «Cómo trabajamos» (Diagnóstico → Construcción → Traspaso), no hay ninguna indicación de plazo. Un comprador B2B necesita saber si un sistema de CRM toma 10 días o 6 meses. Se sugiere agregar en el diagnóstico: *«Un primer flujo de recepción y seguimiento suele quedar operando en 1 a 2 semanas»*.
  - **Traspaso de cuentas:** Es un acierto enorme haber incluido *«con las cuentas a tu nombre»*. Debería tener aún más relieve tipográfico, porque es el miedo número uno de quien contrata automatizaciones en Make o GoHighLevel.

### En `/estudio`:
- **Qué sobra:**
  - La sección «Cada caso, contado como un film» tiene un slider de capítulos (Mr. Studio Tattoo, Truckers Choice, L&B) que duplica exactamente las tarjetas interactivas de «Webs que ya construí» ubicadas inmediatamente debajo.
  - **Recomendación:** Unificar ambos bloques: que la tarjeta del caso contenga la miniatura del film junto con los botones «Pruébalo tú», en lugar de tener dos bloques independientes para los mismos 3 clientes.
- **Qué falta:**
  - **Claridad sobre costos de mantenimiento y hosting:** Muchos clientes le temen a los costos mensuales de servidores. Se sugiere una línea breve en «Qué incluye»: *«Alojado en tu cuenta de Vercel sin costos mensuales fijos de servidor para la mayoría de los sitios»*.
  - **Mención a migraciones:** Dejar en claro si Mario rediseña desde un WordPress viejo conservando el dominio y el SEO existente.

---

## 5. Auditoría de la versión en inglés (`/en/sistemas` y `/en/estudio`)

1. **Naturalidad del idioma:** La traducción es impecable, con tono natural y sin construcciones forzadas.
   - *«So no enquiry goes without follow-up»* transmite urgencia y profesionalismo sin jerga corporativa vacía.
   - *«A website that explains what you do and gets people to reach out»* tiene un gancho conversacional superior al promedio del mercado de agencias en EE. UU.
2. **Defecto menor de espaciado en botones interactivos:**
   - En `/en/sistemas`, en la tarjeta de New Brothers Barbería, el texto del botón se renderiza como:
     `Try the 6-step bookingDemo` (la palabra *Demo* está pegada al final de *booking* sin espacio).
   - En `/sistemas` (ES) sucede lo mismo: `Prueba la reserva en 6 pasosDemo`.
   - **Fix sugerido para Codex:** Añadir un espacio o un margen izquierdo (`ml-1.5`) al badge o etiqueta `Demo` dentro del componente `TryItButtons.tsx`.
3. **Botón de contacto en escritorio:**
   - En ambas páginas, el botón del héroe (*«Hablemos de tu proceso»* / *«Hablemos de tu web»*) tiene `href="#contacto"`. Al pulsarlo en escritorio, la pantalla salta abruptamente hasta el pie de página, omitiendo todos los casos y las pruebas intermedias.
   - Sería más persuasivo que el botón realice un scroll suave (`scroll-behavior: smooth`) o que ofrezca un selector rápido para saltar al brief sin perder la opción de ver los casos.

---

## 6. Conclusión ejecutiva

La transformación de `/sistemas` y `/estudio` en páginas de servicio es un acierto rotundo frente a las versiones conceptuales previas:
- Se eliminaron las métricas infladas y los diagramas abstractos incomprensibles.
- El cliente sabe en los primeros 5 segundos qué servicio se ofrece, qué herramientas se usan y quién lo construye.
- `/estudio` está en un punto óptimo de longitud (4.566 px).
- `/sistemas` se beneficiará de recortar la duplicación del caso New Brothers para acercar su altura a los 5.000 px.
