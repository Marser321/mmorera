# Plan: condensar y refrescar mmorera.agency (noviembre 2026)

Fecha: 16/11/2026 · Estado: **propuesta, sin implementar** · Rama: `claude/plan-condensar-2026-11` (desde `origin/main` en `08d473b`).

Fuentes:
- El pedido de Mario del 16/11: menos ruido y menos sobrecarga, lo técnico en una sola página, las cinemáticas nuevas (barberías, CRM de lavaderos, app de carga), más IA, mejor carga y, más adelante, su VPS.
- `docs/MEJORAS-DESDE-EL-MERCADO.md`, «Ronda 16/11/2026». Esa sección está en la copia local de `main` y todavía no se commiteó: no figura en `origin/main`.
- El recorrido del sitio publicado, página por página, y Lighthouse contra producción (sección 1.3).

Regla de siempre: se reestructura y no se recorta. Las cinemáticas, las partículas y el menú de capacidades se quedan. Lo que sobra se mueve a una rama propia.

---

## 0. En corto (para aprobar)

1. **La home queda en cinco bloques:** obertura de partículas, cinco puertas de servicio (hoy faltan Campañas), tres fichas de prueba (lavadero, barbería y carga), la película de autor y el contacto. Lo demás pasa a ramas.
2. **Una sola página técnica nueva**, `/como-lo-construyo` (en inglés, `/en/how-i-build`), titulada «How I build AI automation». Junta el stack, las arquitecturas de cada caso, MCP, RAG y evaluaciones, el manejo de errores y la aprobación humana, y el alojamiento. Salen de la home, de /sistemas y de la parte de arriba de cada caso.
3. **Tres ramas por rubro**, cortas y con su cinemática: barberías, lavaderos móviles y transporte. Siguen el molde de `/casos-de-uso/recorridos-inmobiliarios` y usan las ediciones por rubro del tráiler de Automatización y CRM (T56).
4. **Cada caso arranca con una ficha:** antes, después, un número, «qué falló y cómo se resolvió» y dónde aprueba una persona. El film va después y lo técnico, al final, plegado.
5. **Inglés primero en títulos y metadatos**, con «AI automation» como término principal. «Orquestación» queda para el relato.
6. **Carga:** los arreglos de la sección 1.3, en tareas chicas y medidas una por una.
7. **VPS:** en la sección 4 está lo que hace falta. Es una fase aparte que va después de condensar, y no se despliega nada sin tu OK.

---

## 1. Diagnóstico

### 1.1 Mapa del sitio publicado

Son 21 páginas públicas en español y sus espejos en `/en`. Las `*.dev.tsx` (`/radar`, `/films-lab`, `/portfolio-preview`) solo existen en desarrollo.

| Ruta | Qué tiene hoy | Diagnóstico |
| --- | --- | --- |
| `/` | Obertura de partículas, cuatro servicios, seis casos con film, una tira «Crear · Construir · Escalar», la película de autor, «Cómo trabajo» y un bloque de contacto doble (puesto o proyecto, con el brief embebido) | **Sobrecarga.** El título «¿Qué necesitas resolver?» aparece dos veces en el texto (uno es para lectores de pantalla y se duplica en el recorrido). Hay tres enlaces sueltos que compiten (casos de uso, Lab y «Ver todos») y la tira Crear/Construir/Escalar no se explica sola. Faltan Campañas y los recorridos 360 entre los servicios. Seis casos con film es mucho para la home. |
| `/estudio` | Servicio de webs y landings, film por caso, «Cómo lo resolví» y casos | Bien armada. Solo hay que pasar el copy a inglés primero. |
| `/agentes` | Servicio de agentes, una conversación de ejemplo y un CRM demo | Bien. Le falta una ficha con número. |
| `/sistemas` | Servicio de automatización y CRM, mapa operativo (ScrollFilm), sala de casos de uso con nodos, tres sistemas y «Cómo trabajamos» | **Hay que ordenarla.** Mezcla venta («Para quién es») con herramientas (n8n, Make, GoHighLevel) y detalles de arquitectura («CRM sin base de datos», «balanceo determinista»). Tres capas de casos seguidas (casos de uso, sistemas y el enlace a todos). |
| `/fabricas` | Contenido con IA, siete estilos, tráiler de la fábrica y galería | Le falta el argumento que pide el mercado: «de 10 h a 2 h por ciclo, con tu voz y tu aprobación». Hoy se lee como «videos con IA». |
| `/campanas` | Campañas de Meta y Google con IA y su cinemática | Es la página más larga (unas 1.200 palabras en el HTML). Se puede partir en servicio y rama. |
| `/capacidades` y `/capacidades/<familia>` | Menú de nueve capacidades, con film, casos y «Con qué la trabajo» | Se queda (Mario la valora). Las listas de herramientas se repiten en tres lugares: acá, en /sistemas y en los chips de cada caso. |
| `/casos-de-uso` y `/casos-de-uso/<caso>` | Casos de uso contados como films | Bien. La rama de recorridos 360 ya es el molde de una página por rubro. |
| `/casos-de-exito` | Archivo con tres «sistemas que puedes abrir», destacados y archivo (43 imágenes en el HTML) | **Pesa** (es la página más pesada, ver 1.3). Tiene tres niveles de listado seguidos. |
| `/casos-de-exito/<caso>` | Chips de stack arriba, film por capítulos («Cero Postgres», «Ingeniería y firma»), «Ver arquitectura», rol y stack, galería en tres pantallas, casos parecidos | **Técnica arriba.** Lo primero que se lee es `VANILLA JS · GOHIGHLEVEL · SERVERLESS API`. No hay antes y después, ni un número, ni «qué falló». |
| `/sobre-mi` | Película de autor, CV, datos rápidos, «Con qué trabajo» y casos | El título «Diseño, código e IA…» sale dos veces en el HTML. «Con qué trabajo» es técnico y se puede ir a la página técnica. |
| `/lab`, `/lab/bandeja`, `/lab/identidad-visual` | Demos que se pueden tocar | Bien como ramas. Hoy se llega desde un enlace suelto de la home. |
| `/aplicar` | Brief de proyecto | Bien. |
| Legales (`/privacidad`, `/terminos`, `/cookies`) | Textos legales | Sin cambios. |

### 1.2 Qué es técnico y le interesa a pocos

Esto se junta en la página técnica. En su lugar original queda una línea con enlace.

- **Chips de stack arriba de cada caso** (`CaseStudy.tsx`): pasan a la ficha técnica, abajo y plegados.
- **Capítulos de arquitectura en los films** («Cero Postgres», «Ingeniería y firma» en L&B): el film se queda. En la página técnica se suma un índice «Arquitecturas» que abre cada `ArchitectureExplorer` con su caso.
- **«Con qué la trabajo»** (capacidades), **«Herramientas»** (/sistemas) y **«Con qué trabajo»** (/sobre-mi): pasan a una tabla única del stack por familia en la página técnica. En capacidades queda una línea de herramientas y el enlace.
- **Lo que pide el mercado y hoy no está:** MCP, RAG con datos del cliente, evaluación de salidas, manejo de errores, logs y la aprobación humana antes de publicar o enviar. Va todo junto en la página técnica y no en la home.
- **Lo que se queda en las páginas de servicio:** el problema, para quién es, qué incluye, la prueba y cómo trabajamos. Las herramientas se nombran en una sola línea.

### 1.3 Carga (Lighthouse contra producción)

Lighthouse 13.5 en modo móvil (el que trae por defecto: 4G lento y CPU ×4), contra `https://mmorera.agency`. Se midió contra producción y no en local, para esquivar el ruido de OneDrive y del CPU cargado. Fueron dos rondas intercaladas (todas las páginas en la ronda 1 y después todas en la ronda 2). Se muestra la mediana o el par de valores.

| Página | Puntaje (R1 / R2) | LCP (s) | TBT (ms) | Peso total | JS | Imágenes y video | JS sin usar |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 85 / 78 | 4,2 / 5,8 | 148 / 114 | 1,3 MB | 361 KB | 837 KB | ~197 KB |
| `/sistemas` | 89 / 97 | 3,7 / 2,5 | 111 / 70 | 0,9 MB | 365 KB | 420 KB | ~200–250 KB |
| `/casos-de-exito` | 84 / 90 | 4,2 / 3,6 | 149 / 106 | **2,8 MB** | 449 KB | **2,2 MB** | ~220 KB |
| `/fabricas` | 89 / 94 | 3,7 / 3,0 | 77 / 56 | 0,9 MB | 331 KB | 475 KB | ~275–300 KB |
| `/campanas` | 88 / 87 | 3,8 / 3,8 | 89 / 137 | 0,6 MB | 325 KB | 151 KB | ~200–240 KB |
| `/capacidades` | 76 / 89 | 4,1 / 3,7 | **365** / 56 | 0,9 / 0,7 MB | 597 / 314 KB | 216 KB | ~160–245 KB |
| `/en` | **61** / 85 | **6,2** / 4,2 | **566** / 112 | 1,6 / 1,3 MB | 645 / 362 KB | 833 KB | ~160–200 KB |

Cómo leerlo:
- **CLS está bien en todas** (0 a 0,04) y FCP está entre 1,0 y 1,3 s. El problema es el **LCP**: entre 2,5 y 6,2 s, cuando la meta es 2,5 s. Solo `/sistemas` llega, y en una sola ronda.
- **La primera corrida de `/capacidades` y `/en` bajó un chunk de 280 KB** (`3i_rf2rhjw1qf.js`) que en la segunda ya no estaba. Es un chunk grande que se carga al entrar en frío, y explica los TBT de 365 y 566 ms. Hay que ver qué trae (probablemente three.js o Remotion) y cargarlo más tarde.
- **`/casos-de-exito` pesa 2,8 MB**. De eso, **1,47 MB es una sola portada en PNG** (`portfolio/brands/cana-vacations/atlas-litoral-cana-cover.png`) de un caso de archivo. En WebP o AVIF bajaría a menos de 150 KB.
- **`/social/grano.png` (141 KB) se pide en todas las páginas.** Es la textura de grano: se puede reemplazar por una más chica en WebP o por un ruido en SVG o CSS.
- **Los pósters de los reels de la home** (Rangel 165 KB, L&B 103 KB y siguientes) están en JPG y a tamaño completo. Con tres casos en la home en vez de seis, y en WebP, bajan a la mitad.
- **JS sin usar: entre 160 y 300 KB por página**, de unos 330–360 KB que se bajan. Es el lugar más claro para mejorar el TBT y el LCP en teléfono.

Lo que se ve en el código:
- **`images.unoptimized: true`** en `next.config.ts`: todas las imágenes salen en su tamaño original (`public/portfolio` ocupa 160 MB). Es lo que más pesa en `/casos-de-exito`.
- **Videos con `preload="auto"`**: `AuthorTrailer` (home) y `AuthorManifestoScene` (/sobre-mi). La película de autor pesa unos 3,6 MB por versión. En Lighthouse no entró en la carga inicial porque se monta más abajo. Pero en cuanto se monta, el navegador la empieza a bajar entera, aunque nadie la reproduzca.
- **Remotion Player** entra en todas las páginas con film (`FilmCanvas`, `ScrollFilm`, `UseCaseFilmRoom`, `CaseFilmSection`, `CapabilityFilmPanel`, `CampanasFilmRoom`). Ya se carga con `dynamic()`, pero se monta cuando la página carga y no cuando el film entra en pantalla.
- **three.js** para las partículas (`OrchestrationCore`, `TechParticleField`). Se queda, pero conviene montarlo cuando entra en pantalla y con una versión liviana en teléfono.
- **El tráiler de la fábrica** pesa 6,3–6,5 MB por versión. Ya usa `preload="none"`, así que está bien.

---

## 2. Inventario del contenido nuevo

| Pieza | Dónde está | Estado | Dónde va |
| --- | --- | --- | --- |
| **New Brothers Barbería** (reserva en 6 pasos y CRM propio) | `components/films/compositions/NewBrothersFilm.tsx`, `data/films/flagships/newBrothers.ts`, bundle `data/architecture/bundles/new-brothers-barberia.ts`, renders `web/renders/new-brothers-barberia/*.mp4` (4), dossier en `docs/films/dossiers/otros-casos.md` | Publicado como caso destacado y como caso de uso en /sistemas (`barber-crm`) | Rama «barberías» y ficha de la home |
| **Edición «barbería» del tráiler de Automatización y CRM** | Rama `triada/claude/T56-trailers-servicios`: `components/films/servicios/sistemas/copy.ts` (variante `barberia`) y `scripts/render-service-trailers.ts --variant barberia` | En revisión y **sin publicar**. También hay ediciones `inmobiliaria` y `clinica` | Cabecera de la rama «barberías» (y la inmobiliaria para la rama de recorridos) |
| **Tráilers de servicio** (agentes, sistemas y estudio) | Rama T56: `components/films/servicios/*`, `remotion/serviceTrailersRoot.tsx` | En revisión y sin publicar | Cada puerta de servicio en la home y la cabecera de cada página de servicio |
| **L&B Elite Wash & Detail** (CRM del lavadero, sin base de datos, 4 camionetas) | `LbWashFilm.tsx`, `data/architecture/lb-wash-architecture*.json` (6 diseños), bundle `lb-elite-wash-detail.ts`, renders `web/renders/lb-elite-wash-detail/*.mp4` (4), dossier `docs/films/dossiers/lb-wash.md`, exportación 720p en `output/portfolio-v1/platform-exports/golance-video/` | Publicado como caso destacado | Rama «lavaderos y servicios móviles» y ficha de la home. Su arquitectura va a la página técnica |
| **Truckers Choice** (seguros, permisos y cotización en 3 pasos, bilingüe) | `TruckersFilm.tsx` y su layout con tests, `data/films/flagships/truckersChoice.ts`, renders `web/renders/truckers-choice/*.mp4` (5, uno es un recorte), dossier `docs/films/dossiers/truckers-choice.md`, borrador `contenido/articulos-linkedin/borrador-truckers-choice-bilingue.md` | Publicado como caso destacado. El formulario sigue en modo vista previa | Rama «transporte» y ficha de la home |
| **Fábrica de contenido** (tráiler de 60 s y siete estilos) | `public/portfolio/video-ia/fabrica-trailer-{es,en}{,-16x9}.mp4`, `components/premium/fabricas/*`, renders `web/renders/content-trailer`, `web/renders/muestras` | Publicado en /fabricas | Se queda. Cambia el argumento a «de 10 h a 2 h por ciclo» |
| **Films de capacidades** (las nueve) | `web/renders/capability-*` y `CapabilityFilmPanel` | Publicados en /capacidades | Se quedan |
| **Agentes y campañas con IA** | `/agentes` (conversación de ejemplo y CRM demo) y `/campanas` (`CampanasFilmRoom`) | Publicados | Nueva rama «AI automation» (sección 3) que los junta con la fábrica |
| **Piezas de redes sobre barbería y CRM** | `contenido/piezas/2026-10-20-barberia-sistema`, `contenido/piezas/2026-10-28-crm-que-nadie-carga` | Publicadas en redes | No van a la web: las muestras salen de las webs y no de los carruseles |

Duda: el pedido dice «app de carga». Lo único que hay en el repo es **Truckers Choice**, que es de seguros y permisos para transportistas y no una app de cargas. Si se refiere a otra app (por ejemplo, un tablero de cargas o un despacho), todavía no tiene film, dossier ni capturas (pregunta 1).

---

## 3. Estructura propuesta

### 3.1 Menú (cinco entradas y el contacto)

| ES | EN | Contiene |
| --- | --- | --- |
| Servicios | Services | Las cinco puertas: webs, agentes, automatización y CRM, contenido y campañas |
| Casos | Work | `/casos-de-exito` y las ramas por rubro |
| IA | AI automation | Nueva rama corta `/ia` (`/en/ai-automation`) |
| Cómo lo construyo | How I build | La página técnica nueva |
| Sobre mí · CV | About · CV | Sin cambios |
| Hablemos | Let's talk | `/aplicar` y WhatsApp |

Capacidades, casos de uso y Lab se quedan, pero se llega a ellos desde Servicios y Casos, y no desde la home.

### 3.2 Páginas

**Home (condensada, cinco bloques):**
1. Obertura de partículas (>Σ→MM). Sin cambios, salvo que three.js se monte por partes.
2. «What do you need solved?»: cinco puertas, con Campañas sumada. Cada puerta muestra el póster de su tráiler (T56) y lo reproduce al pasar el cursor o al tocarla.
3. «Proof, not promises»: tres fichas (L&B, New Brothers, Truckers) con antes, después, un número y qué falló. Debajo, «See all work →». Los otros tres destacados pasan al archivo.
4. La película de autor, con `preload="none"` y su póster.
5. El contacto: puesto o proyecto. El brief se abre en `/aplicar` en lugar de estar embebido.

Sale de la home: la tira Crear/Construir/Escalar (pasa a /sobre-mi, junto al método), los enlaces sueltos a casos de uso y Lab (pasan a Casos) y «Cómo trabajo» completo (queda una línea y el enlace a la película).

**`/como-lo-construyo` · `/en/how-i-build`** (nueva y única página técnica). Título: **«How I build AI automation»**.
- El stack por familia, en una tabla que reemplaza las tres listas actuales.
- «Architectures»: un índice de los `ArchitectureExplorer` que existen hoy, uno por caso.
- «Agents in production»: MCP, RAG con datos del cliente, evaluación de salidas y herramientas.
- «When things fail»: reintentos, logs, alertas, aprobación humana antes de publicar o enviar, y las cuentas a nombre del cliente.
- «Where it runs»: Vercel hoy y el VPS después, más los encabezados de seguridad que ya están en `next.config.ts`.
- Un enlace a `/lab` para quien quiera tocar las demos.

**`/sistemas` ordenada:** hero, para quién es, qué incluye, mapa operativo (ScrollFilm), sala de casos de uso, **dos o tres fichas de prueba** (L&B, New Brothers y AD Media) y cómo trabajamos. La línea de herramientas y los detalles de arquitectura pasan a la página técnica. Se saca el bloque «Sistemas que ya construí», que repite los casos de uso.

**`/ia` · `/en/ai-automation`** (rama nueva y corta). Título: «AI automation for small teams». Tiene tres puertas: agentes (atienden, responden y agendan), fábrica de contenido («From 10 hours to 2 per content cycle, in your brand voice, with your approval») y campañas (con una persona que decide). Lleva el film de la capacidad «IA aplicada» y una línea hacia la página técnica.

**Ramas por rubro** (molde: `RecorridosDocument`). Cada una tiene la edición del tráiler por rubro, la ficha del caso, el caso de uso y «Quiero algo así»:
- `/casos-de-uso/barberias` · `/en/casos-de-uso/barbershops`: New Brothers y el caso de uso `barber-crm`.
- `/casos-de-uso/lavaderos` · `/en/casos-de-uso/mobile-detailing`: L&B. La regla «una visita, una camioneta» se cuenta como historia y no como arquitectura.
- `/casos-de-uso/transporte` · `/en/casos-de-uso/trucking`: Truckers Choice.

**Ficha de cada caso** (arriba de `/casos-de-exito/<caso>`). Se suma un bloque `proof` a `ProjectCase`:

```ts
proof: {
  before: LocalizedText;    // «Las reservas entraban por WhatsApp y se anotaban a mano»
  after: LocalizedText;     // «Reserva sola en 6 pasos, sin solapes»
  metric: { value: string; label: LocalizedText; verified: boolean };
  failed: LocalizedText;    // «qué falló y cómo se resolvió», en una línea
  humanApproval?: LocalizedText;
}
```

Orden de la página: la ficha, «Pruébalo tú», el film, la galería en tres pantallas y, al final y plegado, «Under the hood» (stack y arquitectura, con enlace a la página técnica). Si `metric.verified` es falso, no se publica el número.

Borradores de ficha. **Mario tiene que confirmar los números y los fallos** (pregunta 2):

| Caso | Antes | Después | Número | Qué falló (borrador) |
| --- | --- | --- | --- | --- |
| L&B | Cotizaciones a mano, 4 camionetas coordinadas por mensaje | Cotiza solo, con 88 servicios y 142 precios, y bloquea el turno 15 minutos hasta el pago | 4 domicilios en simultáneo sin choques | La base de datos propia se desincronizaba con el CRM: se sacó y el CRM quedó como único registro |
| New Brothers | Reservas, caja y clientes por mensajes sueltos | Reserva en 6 pasos y agenda, caja y liquidaciones en un panel | ¿horas por semana? | A confirmar |
| Truckers | Seguros, DOT, placas y permisos dispersos y en un solo idioma | 30 trámites en 6 líneas, en inglés y en español | Cotización en 3 pasos | El formulario sigue en vista previa: falta conectarlo (se dice tal cual) |

### 3.3 Copy y metadatos en inglés

- `pageMetadata` (`lib/seo`): los títulos en inglés llevan «AI automation». Por ejemplo, la home queda «Mario Morera — AI Automation Engineer · Web, CRM & Agents»; /sistemas, «AI Automation & CRM for Small Businesses»; /agentes, «AI Agents That Answer, Book and Hand Off».
- En español, «automatización con IA» en los títulos y «orquesto» en el relato.
- Hay que revisar `sitemap.ts` y los `alternates` cuando se sumen las rutas nuevas.
- **Duda de idioma por defecto:** si la búsqueda está en EE. UU., ¿la raíz `/` pasa a servir inglés? (pregunta 4). Cambiarlo afecta SEO y enlaces ya enviados, así que es una decisión aparte.

---

## 4. Pasar de Vercel al VPS (sin desplegar)

Lo que hay hoy: Next 16.4.5, páginas estáticas, una acción de servidor (`actions/submit-lead.ts`, que usa Resend, Telegram, Stripe e InsForge), encabezados y redirecciones en `next.config.ts`, `images.unoptimized: true`, sin `@vercel/*` en el código y sin `middleware` ni `proxy.ts`. `vercel.json` solo tiene el `ignoreCommand`.

1. **Build:** `output: "standalone"` en `next.config.ts`. Después del build hay que copiar `.next/static` y `public/` junto a `.next/standalone`, porque el modo standalone no los incluye.
2. **Runtime:** Node 22 LTS y `node server.js` con un servicio de systemd (reinicio automático y logs en journald), o Docker si el VPS ya lo usa. Escucha en `127.0.0.1:3000`.
3. **Proxy y certificados:** **Caddy** (recomendado: saca y renueva Let's Encrypt solo, sirve HTTP/2 y HTTP/3, y maneja bien los rangos de video) o Nginx con certbot. Además:
   - `mmorera.agency` y `www` con redirección.
   - Caché larga e inmutable para `/_next/static/*`.
   - Caché media para `/portfolio/*` y `/videos/*`, servidos directo por el proxy y no por Node.
   - Compresión gzip/zstd para HTML, JS y CSS.
4. **Imágenes:** hoy no se optimizan. Hay dos caminos: dejarlo así y generar AVIF/WebP en el build con un script, o activar el optimizador de Next e instalar `sharp`. Lo primero es más simple en un VPS chico.
5. **Secretos:** las variables de `submit-lead` (Resend, Telegram, Stripe, InsForge y el correo de aviso) van en un `EnvironmentFile` con permisos 600, fuera del repo.
6. **Despliegue:** GitHub Actions con la secuencia `npm ci`, tests, `next build`, rsync a `/srv/mmorera/releases/<sha>`, cambio de enlace `current` y `systemctl reload`. Se guardan las últimas tres versiones para volver atrás en un comando.
7. **Previas:** se pierden las de Vercel. Se reemplazan con `staging.mmorera.agency`, con su propio servicio y protegido con clave.
8. **Corte de DNS:** se baja el TTL 48 h antes, se prueba el VPS con su IP o con `staging`, se cambia el registro A/AAAA y Vercel queda dos semanas de respaldo.
9. **Servidor:** firewall con 22, 80 y 443, solo llaves SSH, actualizaciones automáticas, fail2ban y un aviso externo de caída.
10. **CDN opcional:** Cloudflare delante del VPS para los 200 MB de medios (pregunta 5).
11. **Disco:** `public/` ocupa 208 MB y `web/renders/` 1,5 GB. Los renders no van al VPS. Si el sitio va a ser «el centro adonde llega todo», conviene un almacenamiento de objetos para videos (pregunta 5).

---

## 5. Orden de trabajo (tareas chicas, cada una con su OK)

Cada tarea es una rama desde `origin/main` y un PR. No se publica nada sin el OK de Mario.

| # | Tarea | Toca | Listo cuando |
| --- | --- | --- | --- |
| C1 | Mario revisa y publica T56 (tráilers y ediciones por rubro) | rama T56 | MP4 y pósters en `public/` |
| C2 | Bloque `proof` en `ProjectCase` con test (sin número si `verified` es falso) y las fichas de L&B, New Brothers y Truckers | `data/projectCases.ts`, `CaseStudy.tsx` | La ficha sale arriba y el stack, plegado abajo |
| C3 | Página técnica `/como-lo-construyo` y `/en/how-i-build`, con la tabla de stack, el índice de arquitecturas y la sección de agentes y fallos | `app/como-lo-construyo`, `data/` | Las tres listas de herramientas apuntan acá |
| C4 | Ordenar `/sistemas` | `data/servicePages`, `ServicePage` | Sin herramientas ni arquitectura y con fichas de prueba |
| C5 | Home en cinco bloques, con Campañas y las tres fichas | `HomeExperience.tsx` | Mismo diseño y menos secciones; Lighthouse no empeora |
| C6 | Tres ramas por rubro | `app/casos-de-uso/*` | Cada una con su tráiler, ficha y caso de uso |
| C7 | Rama `/ia` y el nuevo argumento de /fabricas | `app/ia`, `data/servicePages` | «10 h → 2 h» con aprobación humana |
| C8 | Menú nuevo y sitemap | `IslandBar`, `sitemap.ts` | Cinco entradas y el contacto |
| C9 | Metadatos en inglés con «AI automation» | `lib/seo` | Títulos y descripciones revisados |
| P0 | Portada de Cana Vacations en WebP o AVIF y el grano más liviano | `public/portfolio/brands/cana-vacations`, `public/social/grano.png` | `/casos-de-exito` baja de 2,8 MB a unos 1,4 MB |
| P1 | Películas de autor con `preload="none"` y póster | `AuthorTrailer`, `AuthorManifestoScene` | No se baja video hasta que alguien le da play |
| P2 | Identificar el chunk de 280 KB y montar Remotion Player y three.js al entrar en pantalla | `FilmCanvas`, `OrchestrationCore`, `TechParticleField` | TBT por debajo de 150 ms en frío en `/en` y `/capacidades` |
| P3 | Imágenes en AVIF/WebP con tamaños por pantalla | `public/portfolio`, script | `/casos-de-exito` pesa la mitad |
| V1–V4 | VPS: standalone, Caddy, Actions y DNS (sección 4) | infraestructura | Solo después de C1–C9 y con OK |

P0, P1 y P2 son chicas y se pueden adelantar: no cambian nada de lo que se ve. Cada una se mide con dos rondas intercaladas contra la previa de Vercel. C2 va antes que C5 y C6, porque las dos usan la ficha.

---

## 6. Preguntas para Mario

1. **«App de carga»:** ¿es Truckers Choice o es otra app (de cargas o despacho) que todavía no está en el repo?
2. **Números y fallos:** ¿qué número real tiene cada caso (horas ahorradas, reservas por semana, tiempo de respuesta) y qué falló en New Brothers y en Truckers? Sin número confirmado, la ficha sale sin número.
3. **Página técnica:** ¿te sirve el nombre «Cómo lo construyo / How I build» y que tenga su propia entrada en el menú, o la querés solo en el pie?
4. **Idioma por defecto:** ¿la raíz `/` pasa a inglés por la búsqueda en EE. UU., o sigue en español?
5. **VPS:** ¿qué proveedor y qué tamaño tiene? ¿Usa Docker? ¿Querés Cloudflare delante y un almacenamiento aparte para los videos?
6. **Home:** ¿te parece bien dejar tres casos en la home (lavadero, barbería y carga) y pasar Fénix, Rangel Oviedo y Mr. Studio al archivo?
7. **T56:** ¿publicamos los tráilers de servicio antes de condensar, para que la home nueva ya los use?
