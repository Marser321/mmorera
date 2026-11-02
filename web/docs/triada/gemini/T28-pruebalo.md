# Verificación de Rutas «Pruébalo tú» (T28)

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Verificación funcional, privacidad de datos y visualización móvil)
- **Repositorio de capturas:** `web/docs/triada/gemini/T28/`
- **Criterio de clasificación:**
  - **«abre»**: Funciona directamente para cualquier visitante, sin cuenta previa, con interfaz interactiva y sin fricción.
  - **«Demo»**: Abre mediante un acceso público de demostración claramente rotulado como muestra.
  - **«no usar»**: Requiere token privado, redirige a una pantalla de autenticación o muestra un estado de error al ingresar sin credenciales.

---

## 1. Resumen de Rutas y Recomendación

| Caso | Ruta evaluada | ¿Abre sin cuenta? | ¿Expone datos reales? | Texto base para el botón | Vista móvil (390 px) | Marca |
|---|---|---|---|---|---|---|
| **L&B Elite Wash** | `https://l-b-five.vercel.app/#quoter` | Sí | No (solo catálogo y reglas) | «Cotizar por vehículo» | Fluida, sin desborde | **abre** |
| **L&B Elite Wash** | `https://l-b-five.vercel.app/cuadrilla` | Abre con error (falta token) | No (sin token no muestra nada) | «Ver app de cuadrilla» *(requiere token)* | Mensaje de advertencia | **no usar** *(sin token demo)* |
| **New Brothers** | `https://nb-barber.vercel.app/reservar` | Sí | No (solo servicios y catálogo) | «Probar reserva en 6 pasos» | Adaptada y táctil | **abre** |
| **New Brothers** | `https://nb-barber.vercel.app/admin-login` | Sí (botón demo público) | No (datos de muestra y tablas limpias) | «Entrar directo al CRM demo» | Dashboard colapsado en columna | **Demo** |
| **New Brothers** | `https://nb-barber.vercel.app/admin/asistente` | No directa (redirige a login) | No (1 pregunta de muestra simulada) | «Ver asistente con conocimiento» | Pestañas y editor de respuestas | **no usar** *(como enlace directo)* |
| **Fenix Medical** | `https://fenixmedicalcenters.com/es/contacto` *(y `/en/contacto`)* | Sí | No (formulario vacío) | «Ver formulario sin texto libre» | Campos accesibles de 48 px | **abre** |

---

## 2. Detalle por Ruta

### 2.1. L&B Elite Wash & Detail · Cotizador por Vehículo
- **Ruta:** `https://l-b-five.vercel.app/#quoter`
- **¿Abre sin cuenta propia?:** Sí. Carga de manera inmediata en cualquier navegador sin solicitar registro ni inicio de sesión.
- **¿Muestra nombres, teléfonos, emails o montos de clientes reales?:** No. El cotizador opera sobre reglas deterministas de catálogo: muestra tipos de carrocería (Sedán, SUV, Truck, Van), paquetes de servicios (*Detailing*, *Wash*, *Paint Correction*) y add-ons con precios públicos de lista. No hay historiales de clientes ni datos personales.
- **Qué ve el visitante, en una línea:** Un cotizador interactivo paso a paso que calcula el importe estimado y la duración de la visita según el vehículo elegido.
- **Cómo se ve a 390 px:** Excelente respuesta móvil. Los botones de selección de vehículo son táctiles y amplios, las tarjetas de servicios se apilan verticalmente sin desbordar el ancho de pantalla y el resumen del estimado se mantiene visible al pie.
- **Captura:** `01_lb_quoter_390.png`
- **Marca:** **«abre»**

---

### 2.2. L&B Elite Wash & Detail · App de Cuadrilla
- **Ruta:** `https://l-b-five.vercel.app/cuadrilla`
- **¿Abre sin cuenta propia?:** La página responde con código HTTP 200, pero **requiere obligatoriamente un token firmado en la URL** (`?t=<token>` o `/c/<token>`).
- **¿Qué ve alguien que entra sin token?:** Una pantalla vacía con la cabecera «Hoy» y una caja de error en tono ámbar que dice textualmente:
  > *«Falta el enlace de la cuadrilla.»*
  El código de `cuadrilla.html` comprueba la presencia del token (`if (!token) return message('Falta el enlace de la cuadrilla.', true);`) y detiene la ejecución sin llamar a la API ni renderizar la lista de paradas.
- **¿Muestra nombres, teléfonos, emails o montos de clientes reales?:** Sin token no muestra absolutamente ningún dato. Con un token de producción activo, la aplicación consultaría `GET /api/crew?t=<token>` en GoHighLevel y mostraría direcciones y nombres reales de clientes del día.
- **Qué ve el visitante, en una línea:** Un aviso estático de error indicando que falta el enlace de la cuadrilla.
- **Cómo se ve a 390 px:** Fondo oscuro, cabecera minimalista y recuadro de advertencia.
- **Captura:** `02_lb_cuadrilla_sin_token_390.png`
- **Marca:** **«no usar»**
  > *Nota de integración:* Para poder incluir un botón a la app de cuadrilla en la web, sería necesario crear una ruta de demostración fija (por ejemplo `https://l-b-five.vercel.app/cuadrilla?t=demo`) respaldada por un endpoint o mock que devuelva 2 o 3 paradas ficticias preconfiguradas. Mientras eso no exista en el backend de L&B, el enlace directo defrauda la expectativa del visitante.

---

### 2.3. New Brothers Barbería · Flujo de Reserva en 6 Pasos
- **Ruta:** `https://nb-barber.vercel.app/reservar`
- **¿Abre sin cuenta propia?:** Sí. Se accede directamente al flujo guiado de reserva.
- **¿Muestra nombres, teléfonos, emails o montos de clientes reales?:** No. Únicamente expone la oferta de servicios de la barbería (Corte Clásico $450, Diseño de Barba $350, Coloración, etc.), duraciones estimadas y los perfiles de los barberos del equipo. El formulario de datos personales se solicita recién en el paso final antes de confirmar (no se envió ningún dato durante la prueba).
- **Qué ve el visitante, en una línea:** Una experiencia de agendamiento guiada en 6 pasos para elegir sucursal, corte, barbero, fecha y hora.
- **Cómo se ve a 390 px:** Muy pulida. Los elementos cuentan con áreas de contacto generosas, selector de pasos claramente visible y navegación inferior fija sin conflicto con la barra del navegador.
- **Captura:** `03_nb_reservar_step1_390.png`
- **Marca:** **«abre»**

---

### 2.4. New Brothers Barbería · Acceso Público al CRM Demo
- **Ruta:** `https://nb-barber.vercel.app/admin-login` (hacia `https://nb-barber.vercel.app/admin/dashboard`)
- **¿Abre sin cuenta propia?:** Sí. En `/admin-login` existe un bloque destacado diseñado para demostraciones públicas:
  > *«Cuenta admin pública — Entrá directo al CRM demo de New Brothers: agenda, clientes, caja, productos y reportes.»*
  Al pulsar el botón **«Entrar al panel administrativo»**, se ejecuta una autenticación automática mediante `POST /api/demo-admin/login`, estableciendo una sesión demo en Supabase y redirigiendo al dashboard en `/admin/dashboard`.
- **¿Muestra nombres, teléfonos, emails o montos de clientes reales?:** No. El entorno demo está configurado de forma limpia:
  - En Dashboard: 0 citas hoy, 0 citas en el mes, $0 ingresos, 0 clientes inactivos.
  - En Clientes (`/admin/clientes`): La lista se encuentra vacía con el mensaje *«Tu cartera de clientes empieza acá»*. No hay correos ni teléfonos reales de clientes.
  - En Punto de Venta (`/admin/pos`) y Liquidaciones: Se muestran únicamente productos de muestra ficticios (*Beard Elixir*, *Carbon Daily Shampoo*, *Classic Pomade*) y nombres ficticios de barberos (*Carlos*). Se percibe de inmediato como un espacio de demostración seguro.
- **Qué ve el visitante, en una línea:** El centro de mando operativo de una barbería con métricas en tiempo real, agenda, control de caja y punto de venta.
- **Cómo se ve a 390 px:** Las tarjetas métricas se apilan ordenadamente en una sola columna, el menú superior permite alternar tema claro/oscuro y los accesos rápidos son completamente legibles sin scroll horizontal. Al entrar por primera vez aparece un diálogo de bienvenida («Centro de Mando») que se puede cerrar con un toque.
- **Capturas:** `04_nb_admin_login_390.png` y `04_nb_crm_demo_dashboard_390.png`
- **Marca:** **«Demo»**

---

### 2.5. New Brothers Barbería · Asistente IA con Base de Conocimiento
- **Ruta:** `https://nb-barber.vercel.app/admin/asistente`
- **¿Abre sin cuenta propia?:** **No de forma directa.** Si un visitante ingresa directamente la URL sin haber iniciado sesión previamente, el middleware de Next.js intercepta la petición y redirige a `https://nb-barber.vercel.app/admin-login`.
  Sin embargo, una vez que el usuario hace clic en «Entrar al panel administrativo» en la pantalla de login demo, la sesión de cookie queda almacenada y entonces sí puede navegar con normalidad a `/admin/asistente`.
- **¿Muestra nombres, teléfonos, emails o montos de clientes reales?:** No. La sección contiene un registro simulado con 1 pregunta de muestra (*«09/07/2026 21:09 · cual es la politica de cancelacion? · Respondida · Cliente · Motor de reglas»*) y una herramienta para «Enseñar» respuestas al asistente. No hay información confidencial de clientes reales.
- **Qué ve el visitante, en una línea:** El panel de administración del asistente conversacional con monitor de preguntas frecuentes y curación de base de conocimiento.
- **Cómo se ve a 390 px:** Pestañas superiores para alternar entre *Preguntas* y *Conocimiento*, switch de *Auto-aprendizaje: activo* y tarjetas con acciones de edición adaptadas a la pantalla.
- **Capturas:** `05_nb_asistente_direct_390.png` (redirección a login) y `05_nb_asistente_session_390.png` (pantalla tras la sesión demo).
- **Marca:** **«no usar»** *(como enlace directo)*
  > *Recomendación técnica:* Si se desea enlazar esta capacidad en la tarjeta del caso o en la página de servicio, no se debe poner el enlace directo a `/admin/asistente` porque provocará una redirección a `/admin-login` donde el botón demo lleva a `/admin/dashboard`. La opción recomendada es enlazar a `/admin-login` explicando que dentro del CRM se encuentra la sección de Asistente IA, o solicitar a desarrollo que `/admin-login` admita un parámetro de redirección (por ejemplo `/admin-login?next=/admin/asistente`).

---

### 2.6. Fenix Medical Center · Formulario sin Texto Libre
- **Rutas:**
  - Versión en español: `https://fenixmedicalcenters.com/es/contacto`
  - Versión en inglés: `https://fenixmedicalcenters.com/en/contacto`
- **Advertencia crítica sobre la URL en inglés:** La ruta `https://fenixmedicalcenters.com/en/contact` arroja un error **HTTP 404 (Not Found)**. El routing de next-intl en producción conserva la palabra en español tanto en el menú institucional como en el conmutador de idiomas: `https://fenixmedicalcenters.com/en/contacto` (responde HTTP 200). Cualquier botón en la versión en inglés de `mmorera.agency` debe apuntar obligatoriamente a `/en/contacto`.
- **¿Abre sin cuenta propia?:** Sí. Abre directamente en ambos idiomas.
- **¿Muestra nombres, teléfonos, emails o montos de clientes reales?:** No. Es un formulario institucional en blanco.
- **Qué ve el visitante, en una línea:** Un formulario estructurado de 5 campos (nombre, correo, teléfono, motivo de consulta en menú desplegable y casilla de consentimiento) diseñado para evitar el ingreso descontrolado de historias clínicas.
- **Cómo se ve a 390 px:** Formato vertical espacioso, tipografía legible, controles táctiles estándar y botón de envío claramente identificado.
- **Capturas:** `06_fenix_contacto_es_390.png` y `06_fenix_contacto_en_390.png`
- **Marca:** **«abre»**

---

## 3. Síntesis y Recomendaciones para Claude y Codex (Fase B · T29)

1. **Botones listos para implementar con marca «abre»:**
   - **L&B Elite Wash:** Botón hacia `https://l-b-five.vercel.app/#quoter` con texto sugerido: **«Cotizar por vehículo»** o **«Probar cotizador en vivo»**.
   - **New Brothers Barbería:** Botón hacia `https://nb-barber.vercel.app/reservar` con texto sugerido: **«Probar reserva en 6 pasos»**.
   - **Fenix Medical Center:** Botón hacia `https://fenixmedicalcenters.com/es/contacto` (y en EN hacia `https://fenixmedicalcenters.com/en/contacto`) con texto sugerido: **«Ver formulario sin texto libre»**.

2. **Botón listo con marca «Demo»:**
   - **New Brothers Barbería:** Botón hacia `https://nb-barber.vercel.app/admin-login` con texto sugerido: **«Entrar directo al CRM demo»**. Es un diferencial enorme: permite al visitante operar un CRM completo sin costo ni barreras.

3. **Rutas descartadas para enlaces directos («no usar»):**
   - **L&B `/cuadrilla`:** No enlazar directamente en portada mientras no exista un token demo público en L&B (actualmente muestra el error *«Falta el enlace de la cuadrilla»*).
   - **New Brothers `/admin/asistente`:** No enlazar directamente como URL pública porque el middleware fuerza el login a usuarios sin cookie. Presentarlo dentro de la narrativa del CRM demo o habilitar redirección tras login.
