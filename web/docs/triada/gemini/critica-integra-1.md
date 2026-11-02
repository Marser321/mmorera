# Crítica Externa de la Preview · Integración 1 (Sesión 3)

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Mirada crítica externa, Tríada Claude · Gemini · Codex)
- **Entorno evaluado:** Preview en vivo en `http://localhost:3012`
- **Rutas auditadas:** `/`, `/casos-de-exito`, `/casos-de-exito/mr-studio-tattoo`, `/sistemas`, `/en`
- **Resoluciones comprobadas:** Pantalla de escritorio (1440 × 900 px) y teléfono móvil (390 × 844 px)
- **Protocolo:** Lectura en frío como visitante externo, sin consultar previamente los briefs ni el plan interno. Voz en español neutro con tuteo estricto (sin voseo).

---

## 1. Qué se entiende más rápido que en las capturas de T34

Frente a las capturas iniciales registradas en T34 antes de la entrega de Codex (T22, T24, T13, T25), la experiencia de llegada presenta saltos de claridad evidentes:

1. **Descompresión radical del Héroe:**
   - *Antes (T34):* El fondo de partículas proyectaba un desfile continuo de logos tecnológicos flotantes (Next.js, Tailwind, etc.) que distraía la vista y evocaba una plantilla genérica de desarrollador frontend. La órbita de capacidades forzaba una interacción con nodos antes de explicar el valor.
   - *Ahora:* El fondo de pared mate con grano sutil (`#0B0B0A`) enfoca toda la atención en el titular. Se lee sin esfuerzo en los primeros 3 segundos: Mario diseña y conecta la tecnología del negocio (web, agentes de IA y contenido) trabajando directamente con él, sin intermediarios.

2. **Supresión del riel de 14 films en la portada:**
   - *Antes (T34):* El home albergaba un carrusel interminable de 14 videos que competía con los 6 proyectos insignia y provocaba parálisis de elección.
   - *Ahora:* Al trasladar la videoteca completa a `/casos-de-exito`, el home recupera una progresión lógica: qué hago (4 servicios) → qué tengo funcionando (6 casos) → cómo lo hago → contacto.

3. **Consistencia de tono y erradicación del voseo:**
   - La redacción ahora utiliza un tuteo neutro e impecable (*«tu negocio»*, *«hablas conmigo y lo construyo yo»*, *«elige lo que necesitas resolver»*), evitando los modismos rioplatenses que descolocaban a clientes y reclutadores en EE.UU., México o España.

4. **Traducción al inglés profesional en `/en`:**
   - La versión en inglés abandonó construcciones rígidas. El encabezado *«I orchestrate your business technology: web, AI agents and content»* y el cierre *«You talk to me, and I build it»* transmiten solvencia ejecutiva y autoridad técnica.

---

## 2. Qué se perdió o quedó suelto

1. **Micro-copy huérfano en el Héroe móvil (`↳ PASA POR UN SERVICIO`):**
   - En la primera pantalla móvil (390 px) aparece la indicación `↳ PASA POR UN SERVICIO`. En pantallas táctiles el concepto de «pasar por encima» (*hover*) no existe físicamente. El usuario pulsa la frase esperando una acción o filtro y no ocurre nada, porque es solo un texto estático que apunta hacia la sección siguiente.
   - En `/en` dice `↳ HOVER A SERVICE`, repitiendo el mismo error de usabilidad en dispositivos táctiles.

2. **Los 14 films en `/casos-de-exito` perdieron su gancho visual:**
   - Al mudar el riel a `/casos-de-exito` bajo el título *«Cada caso, contado como un film. Experiencias, productos y sistemas»*, los proyectos secundarios se convirtieron en tarjetas predominantemente tipográficas (*Cana Vacations*, *AutoHub 360*, *La Nueva Brasil*, *EvoWrap*, etc.).
   - Al llamarse «Films», el visitante espera ver miniaturas cinematográficas o fotogramas en movimiento. Al ser cajas de texto estáticas que enlazan a anclas internas (`#film`), el impacto sensorial del material audiovisual queda diluido.

3. **La promesa interactiva queda trunca en Mr. Studio Tattoo:**
   - En la ficha de *Mr. Studio Tattoo* (`/casos-de-exito/mr-studio-tattoo`), el llamado principal es *«Ver en vivo»*, que redirige al dominio comercial del cliente (`mrstudiotattoo.com`).
   - A diferencia de *L&B Elite Wash* (cotizador interactivo) o *New Brothers Barbería* (reserva y CRM demo), el caso de tatuajes no cuenta con un simulador local del selector anatómico. El usuario interesado en probar el sistema de 10 pasos tiene que abandonar la web de Mario e interactuar con el negocio real en Miami, lo que genera fricción y riesgo de abandono.

---

## 3. Dónde el Home sigue abrumando (Validación del recorte pendiente)

A pesar de las mejoras en el héroe, la altura vertical del Home sigue siendo kilométrica:
- **Escritorio (1440 px):** 12.901 px de altura total.
- **Móvil (390 px):** 15.267 px de altura total (en T34 medía 15.448 px; la reducción ha sido apenas del 1,2%).

### Las dos zonas de asfixia detectadas:

1. **El bloque `#perfil` («Perfil & Filosofía»):**
   - Emplea un contenedor sticky (`h-[100svh]`) que «atrapa» la pantalla durante 6 diapositivas completas con declaraciones conceptuales (*«Crear, Construir, Escalar»*, *«El artesano que usa robots»*, *«Una sola dirección»*).
   - En móvil, el usuario percibe que la barra de desplazamiento avanza pero la pantalla no cambia de sección: solo rotan párrafos de auto-definición. Transmite un tono autorreferencial y pretencioso que frena el impulso de compra.

2. **El bloque `#metodo` («Del problema a un sistema vivo en producción»):**
   - Desarrolla 4 fases con lenguaje puramente de ingeniería (*«Diagnóstico & Criterio»*, *«Dirección de Arte & Arquitectura»*, *«Construcción en Producción (Next.js)»*, *«Despliegue & Operación Continua»*).
   - Son más de 3.500 px de texto denso que le hablan a otro desarrollador y no al dueño de negocio que busca contratar una solución.

> **Validación del plan:** La fusión planificada de `#perfil` y `#metodo` en un único tramo sintético **«Cómo trabajo»** es absolutamente prioritaria. Eliminará cerca de 5.000 px de scroll muerto y evitará la deserción antes de llegar al formulario de contacto.

3. **Ausencia de las tarjetas «Pruébalo tú» en portada:**
   - La sección `#proyectos` expone 6 casos reales pero se percibe todavía como un catálogo estático de capturas de pantalla. Hasta que no se rendericen las tarjetas con botones de prueba directa (*«Probar reserva en 6 pasos»*, *«Cotizar carrocería»*, etc.), el visitante no experimenta la diferencia entre una agencia tradicional que muestra fotos y un constructor de sistemas interactivos en vivo.

---

## 4. Análisis del botón flotante («Hablemos»)

Se auditó el comportamiento dinámico del botón flotante en ambos viewports a lo largo de todo el scroll:

```
Scroll 0 - 800 px:    Oculto (opacity: 0, inert, pointer-events: none) -> Acierto: no tapa el héroe.
Scroll 1.000 - 12.000 px: Visible (opacity: 1, pointer-events: auto) -> Centrado abajo con enlace a #contacto.
Scroll > 12.500 px:   Oculto (opacity: 0, inert) -> Acierto: desaparece al entrar al formulario real.
```

### ¿Ayuda o molesta en el teléfono (390 px)?

- **Dónde ayuda:**
  En una página móvil de más de 15.000 px, este botón es indispensable. Ofrece una salida inmediata hacia la acción en el momento exacto en que el visitante se convence tras ver un caso de éxito, sin exigirle 12 swipes seguidos para encontrar el formulario.
- **Dónde molesta o genera conflicto:**
  1. **Invasión del área inferior móvil:** La cápsula tiene 134 px de ancho y 48 px de alto, anclada a 12 px del fondo (`bottom-3`). En iPhones con barra de inicio inferior (Home Indicator) y navegadores móviles con barra de herramientas dinámica (Safari/Chrome), el botón queda muy pegado a la zona de deslizamiento gestual.
  2. **Ocultamiento de texto en lectura pausada:** Al hacer scroll lento leyendo las descripciones de los casos o del método, la cápsula negra opaca tapa la última línea de texto de las tarjetas o los tags inferiores.
  3. **Inconsistencia grave entre rutas del sitio:**
     - En `/` y `/en`: cápsula centrada inferior *«Hablemos»* con ancla a `#contacto`.
     - En `/casos-de-exito`, `/sistemas` y en los casos individuales: **la cápsula «Hablemos» no existe**. En su lugar, aparece un botón circular flotante verde de WhatsApp en la esquina inferior derecha (`https://wa.me/59892323675`).
     - Este doble estándar desconcierta: si el usuario navega a un caso de éxito pierde el acceso al formulario de contacto estructurado y se ve empujado exclusivamente a WhatsApp.

---

## 5. Fugas lingüísticas detectadas

### A. Fugas de español en la versión en inglés (`/en`)
1. **Texto visible en la sección `#perfil`:**
   - Aparece el rótulo en español: `Mario Morera · Perfil`.
   - *Corrección:* Debe decir `Mario Morera · Profile`.
2. **Metadatos en la cabecera HTML (`<head>`):**
   - La etiqueta `keywords` contiene términos en español:
     `content="AI Automation,AI Operations,Agentes de IA,Automatización,CRM,Contenido con IA,Mario Morera"`
   - *Corrección:* Traducir las palabras clave al inglés: `AI Agents, Automation, CRM, AI Content Pipelines`.

### B. Fugas de inglés en la versión en español (`/`)
1. **Insignias y badges con la palabra `LIVE`:**
   - En las tarjetas de proyectos y sistemas se lee `LIVE` en mayúsculas (ej. `l-b-five.vercel.app LIVE`).
   - *Corrección:* En español debe decir `En vivo` o `Activo`.
2. **Rótulo `FLAGSHIP FILM` en Fenix Medical Center:**
   - Se mantiene la etiqueta en inglés `FLAGSHIP FILM` en la portada y en el archivo de casos.
   - *Corrección:* Sustituir por `Caso insignia` o `Film principal`.
3. **Micro-copy de interacción:**
   - En `/en` se utiliza `↳ HOVER A SERVICE`. Debe adaptarse para contemplar dispositivos móviles (ej. `↳ Explore services below`).

---

## 6. Clasificación texto por texto y reescritura neutra

Siguiendo el protocolo, cada texto evaluado se clasifica como:
- **`persona`**: Tono auténtico, honesto, creíble y con voz propia.
- **`plantilla`**: Frase genérica e impersonal, común a cualquier agencia digital.
- **`relleno`**: Contenido conceptual abstracto que añade longitud y fatiga sin aportar valor.

Todas las propuestas de reescritura emplean **español neutro con tuteo (sin voseo)**.

| Ubicación | Texto actual | Clasificación | Motivo de la crítica | Reescritura propuesta (Neutro tuteo) |
|---|---|---|---|---|
| **Héroe (Home)** | *«Orquesto la tecnología de tu negocio: web, agentes de IA y contenido.»* | **`persona`** | Excelente síntesis. Claro, directo y define el abanico técnico en una sola línea. | Mantener tal como está. |
| **Héroe (Home)** | *«↳ PASA POR UN SERVICIO»* | **`relleno`** | En móviles no existe el hover. En escritorio añade ruido visual innecesario. | Eliminar el microtexto o cambiar por: *«Explora los servicios ↓»* |
| **Servicios (Home)** | *«Cuatro cosas que hago y conecto entre sí. Elige lo que necesitas resolver.»* | **`persona`** | Tono sobrio y seguro. Desmitifica la complejidad técnica. | Mantener tal como está. |
| **Perfil (`#perfil`)** | *«Una sola dirección: Crear, Construir, Escalar... El artesano que usa robots.»* | **`relleno`** | Tono de manifiesto publicitario. Suena egocéntrico y no resuelve inquietudes del cliente. | Reemplazar en «Cómo trabajo»: *«Diseño la arquitectura, programo el sistema y lo dejo operando en tu negocio en semanas, sin intermediarios.»* |
| **Método (`#metodo`)** | *«Del problema a un sistema vivo en producción... Construcción en Producción (Next.js)»* | **`plantilla`** | Jerga técnica de desarrollador. Al cliente de negocio no le importa el framework, sino la estabilidad del flujo. | Reemplazar en «Cómo trabajo»: *«1. Diagnóstico del flujo actual. 2. Desarrollo e integración en 2 a 4 semanas. 3. Puesta en marcha y soporte continuo.»* |
| **Mr. Studio Tattoo** | *«Estudio de tatuajes en Miami: reserva guiada en 10 pasos con selector anatómico, artista elegido y consentimiento según la edad.»* | **`persona`** | Impecable. Describe una solución de ingeniería real aplicada a un dolor operativo concreto. | Mantener tal como está. |
| **Fenix Medical** | *«FLAGSHIP FILM»* | **`relleno`** | Anglicismo innecesario en la versión en español que suena a catálogo de festival de cine. | *«Caso insignia»* o *«Film del proyecto»* |
| **Badges de estado** | *«LIVE»* | **`plantilla`** | Inconsistencia de idioma en la interfaz en español. | *«En vivo»* o *«Operando»* |
| **Bandeja (`/sistemas`)** | *«BANDEJA OMNICANAL & SPEED-TO-LEAD DATOS DE EJEMPLO Todos tus canales en un solo lugar.»* | **`persona`** | Ejemplar. El rótulo «DATOS DE EJEMPLO» respeta la política de honestidad radical sin engañar al visitante. | Mantener tal como está. |

---

## 7. Conclusiones y recomendaciones para Claude y Codex

1. **Aprobar sin dudas la Fase B de recorte (T30 / T31):**
   La preview demuestra que la permanencia de `#perfil` y `#metodo` es el principal causante de la fatiga del visitante móvil (15.267 px). Su reemplazo por el tramo unificado «Cómo trabajo» dejará el sitio en una extensión óptima.
2. **Unificar el botón flotante en todo el sitio:**
   Elegir un único criterio: si se usa la cápsula «Hablemos» con ancla a contacto, debe mantenerse consistente en todas las páginas, o bien añadir la opción de WhatsApp dentro de un menú flotante unificado, evitando que el usuario vea componentes distintos al cambiar de ruta.
3. **Corregir las fugas puntuales:**
   Cambiar `Perfil` por `Profile` en `/en`, traducir los `keywords` del head en inglés y reemplazar `LIVE` y `FLAGSHIP FILM` por español en la versión principal.
4. **Incorporar las tarjetas «Pruébalo tú» en portada:**
   Aprovechar los datos de casos verificados en T28 para que la sección de proyectos cobre vida funcional inmediatamente después de los servicios.
