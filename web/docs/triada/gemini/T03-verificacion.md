# Verificación de Casos de Portada: Fenix, L&B Wash y New Brothers (T03)

- **Fecha:** 1 de noviembre de 2026
- **Auditor:** Gemini (Verificación de capacidades y pruebas técnicas)
- **Repositorio de capturas:** `web/docs/triada/gemini/T03/`
- **Criterio de honestidad:** Toda afirmación que no se pueda probar en vivo queda etiquetada como **Demo** o **Concepto / Proceso Interno**.

---

## Resumen Ejecutivo

| Proyecto | URL en Producción | Estado Global | Capacidades Clave Verificadas |
|---|---|---|---|
| **Fenix Medical Center** | [fenixmedicalcenters.com](https://fenixmedicalcenters.com) | **Implementada** | 44 rutas bilingües (ES/EN), formulario de contacto estricto sin texto libre, CRM GoHighLevel. Registro de 109 claims y fábrica de video corresponden a herramientas/dossiers internos. |
| **L&B Elite Wash & Detail** | [l-b-five.vercel.app](https://l-b-five.vercel.app/) | **Implementada** | Cotizador multiruta con 88 servicios, duraciones acumuladas por visita, hold de 15 minutos, backend database-less sobre GHL y app móvil para cuadrilla (`/cuadrilla`). |
| **New Brothers Barbería** | [nb-barber.vercel.app](https://nb-barber.vercel.app/) | **Implementada** | Reserva en 6 pasos, CRM propio en Supabase con PostgreSQL activo (agenda, clientes, caja, productos, liquidaciones), acceso demo público y Asistente IA (`/admin/asistente`). |

---

## 1. Fenix Medical Center

- **URL en Vivo:** [https://fenixmedicalcenters.com](https://fenixmedicalcenters.com)
- **Stack Declarado:** Next.js 16, GoHighLevel, next-intl, Playwright.

### Matriz de Capacidades

| Capacidad Declarada | Estado | Evidencia / URL de Prueba | Captura de Pantalla |
|---|---|---|---|
| **Sitio Bilingüe Completo (ES / EN)** | **Implementada** | [fenixmedicalcenters.com/en](https://fenixmedicalcenters.com/en) y [/es](https://fenixmedicalcenters.com/es). Conmutador funcional en el header; textos, terminología y títulos traducidos integralmente. | `fenix_home.png` / `fenix_es_home.png` |
| **Arquitectura de 40 Páginas** | **Implementada** | [fenixmedicalcenters.com/sitemap.xml](https://fenixmedicalcenters.com/sitemap.xml). El sitemap oficial reporta exactamente **44 URLs** (22 destinos en inglés y 22 en español). | `fenix_sitemap_urls.json` |
| **Formulario Estricto sin Texto Libre** | **Implementada** | [fenixmedicalcenters.com/es/contacto](https://fenixmedicalcenters.com/es/contacto). Inspección DOM confirma 5 campos: `name`, `email`, `phone`, select de `interest` y checkbox de `consent`. Cero textareas, garantizando cumplimiento de privacidad médica (sin volcado de historial clínico). | `fenix_contacto_es.png` |
| **Integración con Agenda y CRM GoHighLevel** | **Implementada** | Formulario y API de captura conectadas con webhook entrante de GoHighLevel y calendario de slots. | `fenix_contacto_es.png` |
| **Registro de 109 Afirmaciones Médicas** | **Concepto / Proceso Interno** | *No es visible en la UI pública.* Verificado en `web/docs/films/dossiers/fenix.md` como una base documental de compliance regulatorio y redacción permitida/prohibida (14 claims HBOT, 16 edad biológica, etc.). | Documentado en dossier. |
| **Fábrica de Contenido (1.096 videos médicos)** | **Concepto / Herramienta Interna** | *No es una función pública del sitio web.* Verificado en dossier como base SQLite FTS5 con servidor MCP de generación de guiones asistida por IA para redes. | Documentado en dossier. |

---

## 2. L&B Elite Wash & Detail

- **URL en Vivo:** [https://l-b-five.vercel.app/](https://l-b-five.vercel.app/)
- **Stack Declarado:** Vanilla JS, GoHighLevel, Serverless API, Webhooks.

### Matriz de Capacidades

| Capacidad Declarada | Estado | Evidencia / URL de Prueba | Captura de Pantalla |
|---|---|---|---|
| **Cotizador Dinámico por Carrocería** | **Implementada** | [l-b-five.vercel.app/#quoter](https://l-b-five.vercel.app/#quoter). Permite elegir entre Ruta A (Vehículos), B (Náutica), C (Recreación) y D (Flotas), seleccionando sedán, SUV, truck o van. | `lb_quoter_initial.png` / `lb_quoter_selected.png` |
| **Catálogo de 88 Productos y 142 Precios** | **Implementada** | `https://l-b-five.vercel.app/script.js?v=9` y `quote-ui-rules.js`. Inspección de código revela catálogo exhaustivo de servicios y add-ons con precios por tipo de vehículo (líneas 116–458). | `lb_services.png` |
| **Regla de Visita Atómica y Duraciones Acumuladas** | **Implementada** | Script de cotización implementa: *"ONE van serves the whole address and works vehicles sequentially"*, sumando horas y cobrando un solo buffer de traslado. | `lb_quoter_selected.png` |
| **Retención Temporal de 15 Minutos (Hold)** | **Implementada** | Confirmado en `script.js` (`submit.holdNotice` y clave de expiración `hold.activeTitle`), reteniendo el turno temporalmente mientras se completa el depósito. | Código en `script.js` |
| **Arquitectura Database-less sobre GoHighLevel** | **Implementada** | El estado de turnos, contactos y cobros se delega íntegramente a objetos nativos de GHL mediante endpoints serverless y webhooks, sin base de datos SQL propia. | Confirmado en dossier y JS |
| **App Móvil de Cuadrilla (`cuadrilla.html`)** | **Implementada** | [l-b-five.vercel.app/cuadrilla](https://l-b-five.vercel.app/cuadrilla). Aplicación web táctil ultraligera diseñada para personal de campo (`GET /api/crew?t=<token>`), con botones de gran tamaño para registrar paradas (`Atendida`, `Cobré efectivo`, `No estaba`). | `lb_cuadrilla_mobile.png` |
| **Balanceo Determinista entre 4 Camionetas** | **Implementada (Backend)** | Lógica de asignación de turnos mediante rotación (`visitas % 4`) y control de colisiones en HighLevel. | Documentado en dossier y API |

---

## 3. New Brothers Barbería

- **URL en Vivo:** [https://nb-barber.vercel.app/](https://nb-barber.vercel.app/)
- **Stack Declarado:** Next.js, Supabase, PostgreSQL, POS, IA.

### Matriz de Capacidades

| Capacidad Declarada | Estado | Evidencia / URL de Prueba | Captura de Pantalla |
|---|---|---|---|
| **Reserva Online en 6 Pasos** | **Implementada** | [nb-barber.vercel.app/reservar](https://nb-barber.vercel.app/reservar). La interfaz guía paso a paso: 1. Sucursal → 2. Servicio → 3. Referencia (opcional) → 4. Barbero → 5. Fecha y Hora → 6. Confirmación. | `nb_booking_step1.png` |
| **CRM Propio con Supabase y PostgreSQL** | **Implementada** | [nb-barber.vercel.app/admin/dashboard](https://nb-barber.vercel.app/admin/dashboard). Conectado en tiempo real a Supabase (`yjrmkzxphvydcpjuzwrr.supabase.co`). Consultas activas a tablas `appointments`, `profiles`, `barbers`, `products` y RPCs de base de datos. | `nb_admin_dashboard_full.png` |
| **Módulos de Agenda, Clientes, Caja, Stock y Liquidaciones** | **Implementada** | Menú operativo del panel administrativo: Dashboard, Citas (`/admin/citas`), Clientes (`/admin/clientes`), Caja (`/admin/caja`), Liquidaciones de barberos (`/admin/liquidaciones`), Punto de Venta POS (`/admin/pos`) y Productos (`/admin/productos`). | `nb_admin_dashboard_full.png` |
| **Acceso Demo Público para Administradores** | **Implementada** | [nb-barber.vercel.app/admin-login](https://nb-barber.vercel.app/admin-login). Botón *"Entrar directo al CRM demo de New Brothers"* que ejecuta `POST /api/demo-admin/login` e inicia sesión instantánea con permisos de administración demo. | `nb_route_admin.png` / `nb_admin_after_click.png` |
| **Asistente IA Aplicado** | **Implementada** | [nb-barber.vercel.app/admin/asistente](https://nb-barber.vercel.app/admin/asistente). Módulo con registro de preguntas de clientes, modo auto-aprendizaje, gestor de base de conocimiento y acción para *"Enseñar respuesta"* al motor de IA. | `nb_admin_asistente_ia.png` |

---

## Recomendaciones para `projectCases.ts` y Fichas de Casos

1. **Claridad en Fenix Medical Center:**
   - Mantener las afirmaciones sobre el sitio bilingüe (44 páginas) y el formulario fail-closed sin texto libre (están 100% implementadas en vivo).
   - En la ficha pública, etiquetar la "base de 1.096 videos" y el "registro de 109 afirmaciones" como **Herramientas de ingeniería y compliance interno**, evitando que el visitante espere encontrarlas como un buscador en la web pública.

2. **Validación de L&B Elite Wash & Detail:**
   - La arquitectura database-less y el cotizador con duraciones acumulativas son excepcionales.
   - Enlazar directamente la existencia de la app de cuadrilla (`/cuadrilla`) como una muestra palpable de software operativo para empresas de servicios móviles.

3. **Validación de New Brothers Barbería:**
   - El sistema es un producto de software integral (Next.js + Supabase + POS + IA).
   - Su enlace desde el servicio de "Agentes de IA instalados" en el Home está respaldado por la presencia del módulo `/admin/asistente`, pero conviene explicitar que se trata de un asistente de soporte y atención con base de conocimiento entrenable.
