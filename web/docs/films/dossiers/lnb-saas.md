# Dossier del Film Insignia: La Nueva Brasil (LNB SaaS)

## 1. Resumen ejecutivo y contexto del negocio

**La Nueva Brasil** es una icónica panadería, confitería y cafetería de especialidad artesanal con sede en Punta del Este. Para responder al pico de demanda estacional y a clientes exigentes que buscan alta calidad sin perder tiempo en filas, se desarrolló **LNB SaaS**: una plataforma digital gastronómica integral que unifica:
- **The Cake Studio (`/studio`)**: Configurador interactivo por capas para personalizar tortas a medida (bizcochuelo, relleno, cobertura y decoración).
- **LNB Express (`/express`)**: Catálogo digital de cafetería de especialidad y panadería con pedidos en línea y retiro programado en 15 minutos sin filas.
- **Crumb Club (`/crumb-club`)**: Programa de fidelización con acumulación de puntos por compra, niveles de membresía (Fan LNB, LNB Lover) y canje directo de recompensas.
- **LNB Pass (`/subscription`)**: Modelo de suscripción recurrente mensual para café ilimitado y descuentos exclusivos en pastelería.
- **Craving Studios**: Módulos especializados para Pizza Studio, Burger Studio, Empanada Studio y Lunch Studio (catering para eventos y reuniones).
- **Kitchen Live (`/kitchen-live`)**: Sistema KDS (Kitchen Display System) en tiempo real para sincronizar las comandas entre barra y pastelería.

---

## 2. Relevamiento técnico del sitio en producción

- **URL en producción:** `https://lnb-saass.vercel.app/`
- **Fecha de relevamiento:** 2026-10-07
- **Modo:** Solo lectura estricto (GET HTTP).
- **Stack tecnológico detectado:**
  - Framework: Next.js (App Router) + React 18
  - Estilos: Tailwind CSS con paleta cálida gastronómica (stone-900, stone-800, amber-500, amber-600)
  - Tipografía: Playfair Display (titulares con elegancia artesanal) e Inter (cuerpo y datos operativos)
  - Animaciones y micro-interacciones: Framer Motion / Lucide Icons
- **Tokens de color verificados:**
  - Fondo (`bg`): `#1C1917` (stone-900 cálido / espresso tostado profundo)
  - Superficie (`surface`): `#292524` (stone-800)
  - Elevado (`raised`): `#44403C` (stone-700)
  - Línea (`line`): `#44403C`
  - Texto principal (`text`): `#F5F5F4` (stone-100)
  - Texto atenuado (`muted`): `#A8A29E` (stone-400)
  - Acento dorado / ámbar (`accent`): `#D97706` (amber-600 miel / corteza dorada)
  - Acento suave (`accentSoft`): `#FBBF24` (amber-400)
  - Acento profundo (`accentDeep`): `#B45309` (amber-700)
  - Sobre acento (`onAccent`): `#1C1917`

---

## 3. Cifras y métricas verificadas en producción

Todas las cifras provienen directamente de los textos y datos renderizados en el sitio web publicado:
1. `15` minutos (`15min`) — Tiempo promedio garantizado para retiro de pedidos express sin espera (`/`).
2. `50` productos (`+50`) — Productos activos en el catálogo de cafetería, panadería y postres (`/`).
3. `0` — Filas físicas en el local al ordenar con Beach Express (`/`).
4. `4.8` — Calificación promedio de clientes en el portal (`/`).
5. `15000` (`$15.000`/mes) — Plan LNB Start (5 cafés de especialidad al mes, 10% OFF en pastelería, fila express) (`/subscription`).
6. `28000` (`$28.000`/mes) — Plan LNB Club (Más elegido: 1 café diario de lun a vie, 15% OFF en tienda, vaso térmico) (`/subscription`).
7. `42000` (`$42.000`/mes) — Plan LNB Black (Café ilimitado todos los días, 20% OFF, torta de cumple gratis, acceso VIP) (`/subscription`).
8. `245` — Puntos acumulados en la tarjeta demo de Crumb Club (nivel Fan LNB, 55 pts para LNB Lover) (`/crumb-club`).
9. `12` — Visitas registradas en el historial de socio (`/crumb-club`).
10. `2450` (`$2450`) — Monto total ahorrado por beneficios del club (`/crumb-club`).
11. `4` — Craving Studios modulares integrados (Cake, Pizza, Burger, Empanadas) (`/`).
12. `3` — Fases interactivas de creación en The Cake Studio (Bizcochuelo, Relleno, Decoración) (`/studio`).

---

## 4. Arquitectura de sistemas

- `architecture.bundle: null`
- **Razón:** Plataforma gastronómica de cara al cliente y monitoreo de cocina con Next.js y Tailwind CSS, sin microservicios distribuidos ni backend complejo que requiera diagrama Archify.

---

## 5. Lo que el film NO debe afirmar (`doNotClaim`)

1. No afirmar que LNB es una franquicia industrial multinacional masiva (es pastelería artesanal y cafetería de especialidad con raíces tradicionales).
2. No inventar cifras de facturación corporativa o márgenes auditados de bolsa.
3. No prometer envíos con dron o entregas en alta mar que no estén respaldadas en la interfaz real.
4. No mencionar bajo ninguna circunstancia el nombre del país prohibido (utilizar "Punta del Este", "Costa Este", "Cono Sur").

---

## 6. Correcciones en datos del portfolio (`src/data/projectCases.ts`)

- Se renombró el título a "La Nueva Brasil" y se enriqueció el resumen técnico detallando The Cake Studio, Beach Express, Crumb Club y LNB Pass.
- Se fijó el color de acento `#D97706` representativo del horneado dorado y café de especialidad.

---

## 7. Reporte de finalización del film insignia (Fases B y C)

### 1. Salida de tests, comprobaciones de tipo y linter
- **Kit check (`check-case-kit.ts lnb-saas`):**
  `✔ lnb-saas: 472 comprobaciones bien, 0 fallas, 0 avisos`
- **Unit tests del film y geometría (`lnbSaas.test.ts`, `lnbSaasFilmLayout.test.ts`):**
  `✔ tests 10, pass 10, fail 0 (309 ms)`
- **Suite completa del proyecto (`npm test`):**
  `✔ tests 1031, pass 1031, fail 0 (5.1s)`
- **Typecheck (`npx tsc --noEmit`):**
  `Exit code 0` (0 errores de TypeScript).
- **Linter (`npx eslint`):**
  `Exit code 0` (0 errores, 0 advertencias).
- **E2E Playwright (`e2e/site.spec.ts`):**
  `1 passed (6.5s)` (reproducción y salto de capítulos sin errores).

### 2. Cuadros revisados en `.film-frames/lnb-saas/`
- `lnb-saas-landscape-es-100.png`: Apertura de marca con logo en partículas doradas sobre video de cafetería.
- `lnb-saas-landscape-es-330.png`: 4 Craving Studios (The Cake Studio, Pizza Lab, Burger Craft, Empanada Bar) con sus etiquetas y descripciones.
- `lnb-saas-landscape-es-550.png`: Protagonista The Cake Studio, Fase 01 Bizcochuelo Base (Vainilla Bourbon).
- `lnb-saas-landscape-es-750.png`: Protagonista The Cake Studio, Fase 02 Relleno Artesanal (Dulce de Leche & Frutos Rojos).
- `lnb-saas-landscape-es-980.png`: Protagonista The Cake Studio, Fase 03 Cobertura & Estilo (Merengue Italiano Dorado) con torta completa y 3 etapas.
- `lnb-saas-landscape-es-1320.png`: LNB Express (catálogo gastronómico con retiro en 15 min y monitor KDS de cocina).
- `lnb-saas-landscape-es-1600.png`: Fidelización (tarjeta Crumb Club con 245 pts y planes LNB Pass Start, Club y Black).
- `lnb-saas-landscape-es-1840.png`: Métricas operativas (FactsBeat).
- `lnb-saas-landscape-es-2050.png`: Firma y cierre institucional MM.
- Variantes portrait en inglés revisadas: `lnb-saas-portrait-en-330.png`, `lnb-saas-portrait-en-980.png`, `lnb-saas-portrait-en-1320.png`, `lnb-saas-portrait-en-1600.png`.

### 3. Decisiones de copia para revisión de Mario o Claude
- **Términos de ubicación:** Se aplicó estrictamente la prohibición del país vecino, utilizando exclusivamente "Punta del Este", "Costa Este" y "Cono Sur".
- **Sin garantías exageradas:** Se utilizaron "tiempo promedio reportado", "retiro express en 15 minutos sin filas" y métricas constatadas en el portal en vivo, sin promesas infladas de ROI ni descuentos ficticios.
- **Precios verificados de planes:** Plan LNB Start ($15.000/mes), Plan LNB Club ($28.000/mes) y Plan LNB Black ($42.000/mes).
- **Puntos y recompensas:** 245 puntos acumulados y $2.450 ahorrados tomados textualmente del estado de cuenta de la demo en producción.

### 4. Archivos MP4 generados (en `renders/lnb-saas/`)
- `lnb-saas-landscape-es.mp4`: 1920×1080, 71.50 s (2145 cuadros), 10.62 MB.
- `lnb-saas-landscape-en.mp4`: 1920×1080, 71.50 s (2145 cuadros), 10.48 MB.
- `lnb-saas-portrait-es.mp4`: 1080×1350, 71.50 s (2145 cuadros), 9.78 MB.
- `lnb-saas-portrait-en.mp4`: 1080×1350, 71.50 s (2145 cuadros), 9.66 MB.
- Cuadros de muestra extraídos con FFmpeg: `sample-open.jpg`, `sample-builder.jpg`, `sample-sign.jpg`.

