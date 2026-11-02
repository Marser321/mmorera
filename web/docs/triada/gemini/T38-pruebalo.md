# Verificación de Más Rutas «Pruébalo tú» (T38)

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Verificación funcional, privacidad de datos y comportamiento táctil)
- **Repositorio de capturas:** `web/docs/triada/gemini/T38/`
- **Voz:** Español neutro con tuteo estricto (sin voseo).
- **Criterio de clasificación:**
  - **«abre»**: Funciona directamente para cualquier visitante, sin cuenta previa, con interfaz interactiva y sin fricción ni exposición de datos privados.
  - **«Demo»**: Abre mediante un acceso público de demostración o entorno de prueba claramente rotulado.
  - **«no usar»**: Requiere autenticación privada, token en URL o arroja error de acceso.

---

## 1. Resumen de Rutas y Recomendación

| Caso | Ruta evaluada | ¿Abre sin cuenta? | ¿Expone datos reales? | Texto base para el botón | Vista móvil (390 px) | Marca |
|---|---|---|---|---|---|---|
| **Mr. Studio Tattoo** | `https://www.mrstudiotattoo.com/booking` | Sí | No (solo catálogo, artistas y calendario) | «Probar reserva en 10 pasos» / «Ver selector anatómico» | Fluida, selector anatómico interactivo | **abre** |
| **Truckers Choice** | `https://truckers-choice-web-site.vercel.app/es/contact` *(y `/en/contact`)* | Sí | No (formulario limpio de cálculo y solicitud) | «Probar cotización en 3 pasos» | Chips táctiles y campos ordenados | **abre** |
| **Rangel Oviedo Group** | `https://rangeloviedo-tor8.vercel.app/#perfiles` | Sí | No (matriz editorial de perfiles de inversión) | «Ver diagnóstico por 4 perfiles» | Tarjetas apiladas con llamada directa | **abre** |

---

## 2. Detalle por Caso y Ruta

### 2.1. Mr. Studio Tattoo · Flujo de Reserva Guiada en 10 Pasos con Selector Anatómico
- **Ruta directa verificada:** `https://www.mrstudiotattoo.com/booking`
- **¿Abre sin cuenta propia?:** Sí. Carga de forma instantánea en cualquier navegador de escritorio o móvil sin solicitar registro previo, credenciales ni inicio de sesión.
- **¿Muestra nombres, teléfonos, correos o montos de clientes reales?:** No. La aplicación opera sobre la oferta artística del estudio:
  - Exposición pública de los perfiles de artistas del estudio (Misael Ink, Tony 'El Verdugo', Annaliet, Alejandro, Ramsés 'El Faraón', Khris).
  - Catálogo de tamaños de obra (*Chico* <8 cm, *Mediano* 8–15 cm, *Grande* >15 cm).
  - Selector de estilo y zonas del cuerpo.
  - No hay historiales de clientes, datos personales expuestos ni información médica previa. Los datos del solicitante se solicitan en los pasos finales antes del consentimiento formal (no se envió ningún formulario durante la prueba).
- **Qué ve el visitante, en una línea:** Una experiencia inmersiva de agendamiento en 10 pasos que guía la elección del artista, el tamaño del diseño y la ubicación corporal exacta en un modelo anatómico interactivo.
- **Cómo se ve a 390 px:** Impecable en dispositivo móvil. 
  - La cabecera fija exhibe el indicador de progreso (`PASO X DE 10`) y el selector de idioma.
  - En el **Paso 5**, el selector anatómico despliega un modelo SVG interactivo con pestañas para alternar entre vista de **Frente** y **Espalda**, resaltando visualmente las zonas activas al tocarlas.
  - Incluye además una lista accesible alternativa para selección por teclado/lector de pantalla (Cabeza, Cuello, Pecho, Abdomen, Costados, Hombros, etc.).
  - Botones inferiores flotantes de navegación («Atrás» / «Continuar») con área táctil cómoda de 48 px.
- **Capturas:** `01_mrstudio_step1_390.png` (Paso 1: Fecha de nacimiento) y `01_mrstudio_step5_390.png` (Paso 5: Selector anatómico interactivo frente/espalda).
- **Marca:** **«abre»**
- **Recomendación para Claude y Codex:** Esta ruta es el reemplazo ideal para la ausencia de botón interactivo señalada en la crítica anterior. Enlazar directamente a `https://www.mrstudiotattoo.com/booking` con el texto: **«Probar reserva en 10 pasos»** o **«Ver selector anatómico»**.

---

### 2.2. Truckers Choice · Cotización Bilingüe en 3 Pasos
- **Rutas verificadas:**
  - Versión en español: `https://truckers-choice-web-site.vercel.app/es/contact`
  - Versión en inglés: `https://truckers-choice-web-site.vercel.app/en/contact`
- **Advertencia crítica sobre el enrutamiento:** Las rutas `https://truckers-choice-web-site.vercel.app/contacto` y `/es/contacto` arrojan un error **HTTP 404 (Not Found)**. El routing de la aplicación mantiene la palabra en inglés (`/contact`) para ambos idiomas, variando únicamente el prefijo de idioma (`/es/contact` y `/en/contact`). Cualquier botón debe apuntar estrictamente a estas rutas bilingües.
- **¿Abre sin cuenta propia?:** Sí. Se accede sin barreras ni solicitud de cuenta previa.
- **¿Muestra nombres, teléfonos, correos o montos de clientes reales?:** No. El cotizador interactivo es un formulario guiado por etapas:
  - **Paso 1:** Selección del servicio requerido mediante botones tipo chip (Corporaciones y LLC, Autoridad DOT y MC, IRP / Placas y Títulos, Permisos e Impuestos de Combustible, Seguro de Camiones, Cumplimiento DOT y Auditorías).
  - **Paso 2:** Parámetros operativos del negocio (Tipo de operación en selector desplegable: *Nueva operación*, *Operación existente*, *Renovación/corrección*; Estado base; Número de unidades).
  - **Paso 3:** Datos de contacto del interesado para recibir el estimado personalizado (no se envió ningún dato en la prueba).
  - No hay listados de pólizas activas ni datos confidenciales de transportistas.
- **Qué ve el visitante, en una línea:** Un asistente interactivo en 3 pasos para definir el tipo de servicio, el volumen de unidades y la ruta regulatoria requerida para una operación de transporte en EE.UU.
- **Cómo se ve a 390 px:** Muy limpio y funcional. Los chips de servicios se organizan en bloques táctiles de fácil pulsación con el pulgar, el selector desplegable es nativo del sistema móvil y los botones de avance activan estados deshabilitados claros hasta que el usuario completa los campos obligatorios.
- **Capturas:** `02_truckers_step1_es_390.png`, `02_truckers_step2_es_390.png`, `02_truckers_step3_es_390.png` y `02_truckers_contact_en_390.png`.
- **Marca:** **«abre»**
- **Recomendación para Claude y Codex:** Añadir en la tarjeta de Truckers Choice el botón interactivo hacia `https://truckers-choice-web-site.vercel.app/es/contact` (y en `/en` hacia `https://truckers-choice-web-site.vercel.app/en/contact`) con el texto: **«Probar cotización en 3 pasos»** o **«Cotizar permisos y seguros»**.

---

### 2.3. Rangel Oviedo Group · Diagnóstico Inmobiliario por 4 Perfiles
- **Ruta directa verificada:** `https://rangeloviedo-tor8.vercel.app/#perfiles`
- **¿Abre sin cuenta propia?:** Sí. Es un ancla directa en la página institucional que posiciona la pantalla en el bloque exacto del diagnóstico estratégico.
- **¿Muestra nombres, teléfonos, correos o montos de clientes reales?:** No. Expone la metodología de filtrado de riesgo de la firma dividida en 4 arquetipos de comprador:
  1. **Inversor internacional:** Tesis de entrada basada en rendimiento y estructuración, evitando listados impulsivos.
  2. **Compra familiar:** Análisis de zona, calidad de distritos escolares y proyección comunitaria.
  3. **Vendedor premium:** Posicionamiento narrativo, calificación de compradores y estrategia de negociación previa a listado.
  4. **Relocation a Texas:** Aterrizaje de decisiones de migración y timing antes de coordinar visitas físicas.
  - Cada perfil ofrece el botón de acción directa **«RECIBIR RUTA INICIAL»**, el cual conduce a la sección `#contacto` (asesoría privada o agenda en calendario).
- **Qué ve el visitante, en una línea:** Una matriz de diagnóstico estratégico que segmenta las necesidades del comprador antes de exponerlo al catálogo de propiedades en Texas.
- **Cómo se ve a 390 px:** Diseño editorial sofisticado en modo oscuro (`#0F1115` con acentos dorados). Las tarjetas se apilan ordenadamente en una sola columna con tipografía serif legible, contraste nítido y botones de llamada a la acción con ancho completo.
- **Capturas:** `03_rangel_perfiles_390.png` (vista móvil), `03_rangel_perfiles_1440.png` (vista escritorio) y `03_rangel_contacto_390.png` (formulario de asesoría privada).
- **Marca:** **«abre»**
- **Recomendación para Claude y Codex:** Enlazar en la tarjeta de Rangel Oviedo a `https://rangeloviedo-tor8.vercel.app/#perfiles` con el texto sugerido: **«Ver diagnóstico por 4 perfiles»** o **«Explorar rutas por perfil»**.

---

## 3. Síntesis y Recomendaciones para Claude y Codex

Con esta verificación quedan cubiertos los 6 casos de éxito principales con rutas interactivas reales marcadas **«abre»**:

1. **Fenix Medical Center:** `https://fenixmedicalcenters.com/es/contacto` (EN: `/en/contacto`) → *«Ver formulario sin texto libre»*
2. **L&B Elite Wash & Detail:** `https://l-b-five.vercel.app/#quoter` → *«Cotizar por vehículo»*
3. **New Brothers Barbería:** `https://nb-barber.vercel.app/reservar` → *«Probar reserva en 6 pasos»* (y demo CRM en `/admin-login`)
4. **Mr. Studio Tattoo:** `https://www.mrstudiotattoo.com/booking` → *«Probar reserva en 10 pasos»* (o *«Ver selector anatómico»*)
5. **Truckers Choice:** `https://truckers-choice-web-site.vercel.app/es/contact` (EN: `/en/contact`) → *«Probar cotización en 3 pasos»*
6. **Rangel Oviedo Group:** `https://rangeloviedo-tor8.vercel.app/#perfiles` → *«Ver diagnóstico por 4 perfiles»*

Todas las rutas abren sin autenticación previa, respetan la privacidad de los clientes de los negocios evaluados y demuestran capacidades interactivas tangibles a 390 px y en escritorio.
