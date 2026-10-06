# Dossiers · New Brothers (hecho), AD Media y LNB (pendientes)

## New Brothers Barbería: film insignia hecho
- **Código:** `D:\Barberia` (paquete `nb-barber`, Next 16 + Supabase). No está en la nube. Los datos ya están volcados en `web/src/data/films/flagships/newBrothers.ts`, con fuentes en comentarios.
- **Qué es:** un mini-CRM propio, sin CRM externo.
  - 26 tablas, todas con RLS.
  - 4 roles: cliente, barbero, gerente y admin.
  - Panel con 14 secciones: Dashboard, Citas, Clientes, Mensajes, Productos, Pedidos, Punto de venta, Caja, Liquidaciones, Sucursales, Barberos, Servicios, Configuración y Asistente IA.
  - Reserva en 6 pasos.
  - Funciones de base como `book_appointment` (bloqueo de fila), `close_cash_day` y `close_barber_settlement`.
  - Asistente IA con cadena Gemini → OpenAI → reglas locales.
- **No tiene:** Stripe, seña, recordatorios automáticos 2 h antes ni bloqueo de 10 min. **No volver a afirmarlo** (`newBrothersHonesty.test.ts`).
  - El cobro se hace en mostrador: efectivo, tarjeta, transferencia o Mercado Pago.
  - WhatsApp es click-to-chat.
- **Panel demo público:** capturas en `web/public/portfolio/panels/` (vía `scripts/capture-panel-shots.ts`). El demo está vacío de clientes: sin datos personales.

## AD Media Solution: pendiente de análisis profundo
- **Código local:** `D:\1B Ecritorio Mac\AD Media Solution` (paquete `solution-agency-web`). No está en la nube. **Sitio en vivo:** https://admediasolution.vercel.app.
- **Qué es:** una agencia de "Arquitectura de Ingresos y CRM" para el mercado hispano de EE. UU.
  - **Servicios:** CRM y automatización (GoHighLevel), Meta y Google Ads, social media y desarrollo web.
  - **Páginas:** `/servicios` (+ `[slug]`), `/casos`, `/about-us`, `/equipo`, `/comunidad`, `/planificacion` (agenda) y `/logos`.
  - **Relacionados:** un monorepo de herramientas GHL (`inteligencia-ghl`) y un bot de soporte GHL (documentación).
- **Marca** (ya en `caseBrands.ts`): navy `#020617`, superficie `#0f172a`, azul eléctrico `#0066FF` / `#0044CC`, celeste `#7DD3FC`, texto `#F8FAFC` / `#94A3B8`. Tipografía Montserrat. Logos en `web/public/portfolio/brands/ad-media-solution/`.
- **Cuidado:** `caseTopologyData.ts` todavía le atribuye métricas no verificadas ("Speed-to-Lead <30s", "+65% Citas"). Revisarlas antes de usarlas.

## LNB: pendiente (Mario va a compartir la carpeta)
- En el portfolio aparece como "LNB SaaS" (`lnb-saas`), descrito como dashboard de inventario y finanzas. **Eso no coincide:** el producto real es **La Nueva Brasil**, panadería, café y pastelería en Punta del Este (https://lnb-saass.vercel.app).
  - **Lado cliente:** Pizza, Burger, Empanada, Cake, Beach Express, Lunch Studio, Kitchen Live Monitor, el programa de puntos "Crumb Club" y la suscripción "LNB Pass".
  - **`/admin`:** Dashboard, Analytics, Products, Orders, Promotions, Customers, Ingredientes AI y Settings.
- **Sin código local encontrado**; hay notas en `C:\Users\morer\OneDrive\Desktop\MMorera-Freelance-KB\projects\lnb-saas.md`.
- **Marca:** no confirmada.

## Resto de los casos
Sin código local. Hacer el análisis profundo a partir del sitio en vivo (`liveUrl` en `projectCases.ts`): recorrer rutas, extraer paleta y tipografía del CSS servido, capturar paneles o flujos y escribir un JSON de Archify.

Si algo no se puede verificar, el film lo rotula "reimaginado a partir del recorrido público" y no inventa métricas.
