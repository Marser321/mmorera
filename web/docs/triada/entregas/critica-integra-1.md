# Entrega · Crítica de la Preview Integrada 1 (`critica-integra-1`)

- **Tarea:** Crítica en frío de la preview en vivo integrada (`triada/web` con T22, T24, T13, T25 y datos de T28).
- **Dueño:** Gemini
- **Estado:** Para revisar
- **Fecha:** 1 de noviembre de 2026

---

## 1. Qué se hizo

- Se realizó una navegación y auditoría a ciegas como visitante externo sobre `http://localhost:3012`, sin consultar previamente el plan ni los briefs internos.
- Se inspeccionaron las cinco rutas obligatorias a dos resoluciones estándar:
  - **Escritorio:** 1440 × 900 px
  - **Móvil:** 390 × 844 px
  - **Rutas:** `/` (Home ES), `/casos-de-exito`, `/casos-de-exito/mr-studio-tattoo`, `/sistemas` y `/en` (Home EN).
- Se midieron las alturas exactas de scroll:
  - Home ES: 12.901 px (desktop) / 15.267 px (móvil).
  - Casos de éxito: 7.983 px (desktop) / 5.748 px (móvil).
  - Sistemas: 9.420 px (desktop) / 6.718 px (móvil).
  - Mr. Studio Tattoo: 5.069 px (desktop) / 6.322 px (móvil).
  - Home EN: 12.853 px (desktop) / 13.709 px (móvil).
- Se auditó el comportamiento dinámico del botón flotante «Hablemos» a lo largo de todo el scroll y su impacto en pantallas móviles.
- Se identificaron fugas de idioma bidireccionales (español en `/en` e inglés en `/`).
- Se clasificaron los textos clave bajo el estándar `persona`, `plantilla` o `relleno`, aportando reescrituras concretas en español neutro con tuteo.

---

## 2. Dónde quedó

- **Informe de crítica completo:** [`web/docs/triada/gemini/critica-integra-1.md`](../gemini/critica-integra-1.md)
- **Capturas de pantalla en alta resolución y diagnósticos:** Carpeta de scratch de la sesión (`b61768db-e914-443c-8137-29b856ee0d71/scratch/screenshots/`).

---

## 3. Qué no se pudo verificar

- **Tarjetas «Pruébalo tú» en la interfaz visible:** Si bien los datos de rutas verificados en T28 ya forman parte de los modelos de datos de los casos, los componentes visuales o botones de acción interactiva inmediata en la portada aún no están desplegados en el DOM visible (pendiente de la tarea de armado de tarjetas).
- **Selector anatómico embebido en Mr. Studio Tattoo:** La ficha del caso enlaza a la web externa activa (`mrstudiotattoo.com`) y muestra un acordeón descriptivo de 3 pasos, pero no cuenta con un simulador local en sandbox.

---

## 4. Sugerencias para Claude y Codex

1. **Avanzar con la sustitución de `#perfil` y `#metodo` por «Cómo trabajo»:**
   La auditoría confirma que el Home móvil sigue midiendo más de 15.200 px (apenas un 1,2% menos que los 15.448 px de T34). La fatiga se concentra en el carrusel sticky de 6 láminas de `#perfil` y en el desglose técnico de `#metodo`. La fusión planificada es la solución adecuada.
2. **Corregir la disparidad del botón flotante entre páginas:**
   En Home se muestra la cápsula «Hablemos» centrada al fondo que hace scroll a `#contacto`; en `/casos-de-exito`, `/sistemas` y fichas individuales se muestra un botón circular verde de WhatsApp. Se sugiere unificar la experiencia para que el visitante no pierda la vía de contacto estructurada al cambiar de sección.
3. **Subsanar las 3 fugas de idioma:**
   - En `/en`: corregir `Mario Morera · Perfil` a `Mario Morera · Profile` y traducir los `keywords` del `<head>` (actualmente en español).
   - En `/`: traducir badges `LIVE` a `En vivo` y el rótulo `FLAGSHIP FILM` a `Caso insignia`.
4. **Retocar el micro-copy del Héroe:**
   Eliminar `↳ PASA POR UN SERVICIO` (y en inglés `↳ HOVER A SERVICE`) ya que en dispositivos móviles induce a confusión por la inexistencia de interacción hover.
