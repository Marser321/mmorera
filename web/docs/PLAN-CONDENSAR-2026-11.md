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
7. **Atribución a AD Media (regla fija, pedida por Mario el 16/11):** los casos que vendió AD Media Solution, aunque los haya construido Mario solo, llevan una línea chica y tenue, nunca como titular, logo ni elemento destacado. AD Media no se usa para vender (tarea C10).
8. **Equipo de modelos frontera (pedido del 16/11):** mostrar con trabajo real, sin logos, qué hizo cada modelo en cada caso y cómo se auditan entre sí. Es la sección 8 y la tarea C14.
9. **VPS:** en la sección 4 está lo que hace falta. Es una fase aparte que va después de condensar, y no se despliega nada sin tu OK.

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

**`/sistemas` ordenada:** hero, para quién es, qué incluye, mapa operativo (ScrollFilm), sala de casos de uso, **dos o tres fichas de prueba** (L&B, New Brothers y Fenix; AD Media no se usa como prueba de venta) y cómo trabajamos. La línea de herramientas y los detalles de arquitectura pasan a la página técnica. Se saca el bloque «Sistemas que ya construí», que repite los casos de uso.

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
// Aparte de proof, en ProjectCase:
soldVia?: "ad-media";       // Fenix, Truckers Choice y L&B (confirmado por Mario el 16/11)
```

**Atribución discreta (regla fija):** si `soldVia` vale `"ad-media"`, la página del caso muestra al pie una sola línea tenue en texto chico, como «Proyecto realizado para clientes de AD Media Solution» o «Built for clients of AD Media Solution». Va en el color de texto secundario de la marca y sin enlace, logo ni insignia. No aparece en la ficha de arriba, en los títulos, en los metadatos, en las tarjetas de la home ni en las ramas por rubro. Un test cuida que la línea salga en cada caso marcado y que «AD Media» no figure en ningún `title`, `summary` ni `metadata`.

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
| C10 | Atribución discreta a AD Media: campo `soldVia`, línea al pie de cada caso marcado y test. Además, sacar AD Media de las pruebas de venta: hoy figura en «Sistemas que ya construí» (/sistemas), en «Casos que lo demuestran» (/capacidades/automatizacion), en «Casos parecidos» y como caso propio `ad-media-solution` | `data/projectCases.ts`, `CaseStudy.tsx`, `data/capabilityCases.ts`, `data/servicePages` | Cada caso marcado lleva su línea al pie y AD Media no aparece en ningún titular, tarjeta ni metadato. Conviene hacerla junto con C2 o antes |
| C14 | **Equipo de modelos en cada caso y en la página técnica** (sección 8): bloque «El equipo detrás de cada entrega» en `/como-lo-construyo` y campo `crew` en `ProjectCase` con una línea corta en la ficha. Solo se publica lo que tenga registro | `data/projectCases.ts`, `CaseStudy.tsx`, página técnica | Cada caso con registro muestra quién construyó, quién auditó y quién hizo las escenas; los casos sin registro no muestran la línea |
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
8. **AD Media:** ~~¿cuál es la lista exacta?~~ **Respondida el 16/11:** pasaron por AD Media **Fenix Medical Center, Truckers Choice y L&B Elite Wash & Detail**. **New Brothers es de Mario** y no lleva línea. Sigue abierto: ¿qué pasa con el caso propio `ad-media-solution`, que hoy presenta a AD Media como cliente («socio de ingeniería de marca blanca»)? ¿Se archiva, se oculta o queda sin nombrar la agencia? ¿Y qué texto preferís para la línea, en español y en inglés?

---

## 7. Segunda ronda de Mario (16/11): CRM en motion, entradas con cinemática y la web de viajes

Lo que pidió:
- Mostrar en el sitio **la parte del CRM**, de forma visual e impactante. Para eso se reeditan las cinemáticas que ya existen y se les suma **motion graphics de muy alto nivel** encima, para que representen los servicios.
- **Al pasar por un caso, que se vea su cinemática.** Hoy, al pasar por Fenix en la home, no aparece nada, y es de las más atractivas.
- Sumar **una versión propia de la web de viajes que hizo para Milagros Ortiz** (vendida por AD Media). La versión tiene que tener otro nombre y otros pasajes, recuperar el efecto del avión que pasa (a Milagros no le gustó y lo sacó) y conservar lo de abajo: las imágenes, las postales y los efectos de profundidad.

### 7.1 Lo que encontré

- **Por qué Fenix no muestra nada al pasar:** la tira flotante de `ProjectIndex` reproduce `media.reel`, que sale de `src/data/caseMedia.generated.json` (lo arma `scripts/capture-case-reels.ts`). **Fenix es el único caso destacado sin reel** en ese manifiesto y en `public/portfolio/reels/`: nunca se le grabó. Su film sí existe (`web/renders/fenix-medical-center/*.mp4`, cuatro versiones). También falta la tira de los otros cinco destacados: hoy muestran **la grabación del sitio en vivo con scroll, no la cinemática**.
- **La web de viajes** está en `Desktop/Milagros Ortiz/web`, un repo sin remoto, con 112 commits.
  - El avión se sacó en la V12 (`096331b`, «más Europa, sin avión y con más naranja»). La **última versión con avión es la V11 (`d68cb5a`)**.
  - Los efectos están en `src/components/cinematic/` (`PlaneCurtain`, `PlaneSilhouette`, `OpeningSequence`, `RouteChip`, `TransitionLayer`), `src/components/flight/` (`FlightStage`, `FlightRail`), `src/components/depth/DepthScene.tsx`, las postales de `editorial/EditorialDestinos.tsx` y el armador de viaje de `trip/`.
  - Las imágenes de destinos y las nubes se **generaron** (con gpt-image-2 y Flow, y sus prompts quedaron en `LOCKS.md`), así que se pueden reusar.
  - **No se pueden reusar** el logo y los `brand-v*` de Milagros, la sección de fundadora, la galería de clips de Milagros (sale ella), su WhatsApp ni su analítica.
- En el sitio ya hay un caso de viajes de archivo, **Cana Vacations**, sin film (`cinematicPending`) y con una portada PNG de 1,47 MB. La versión nueva podría ocupar ese lugar (pregunta 10).

### 7.2 Tareas nuevas

| # | Tarea | Toca | Listo cuando |
| --- | --- | --- | --- |
| C11 | **Entrada con cinemática al pasar por un caso.** Primer paso, rápido: grabar el reel de Fenix con `capture-case-reels.ts`. Paso de fondo: que la tira de los casos destacados reproduzca un **corte de 6 s del film insignia** en lugar del scroll del sitio, en WebM y MP4 de menos de 1 MB cada uno, con póster y `preload="none"`. El corte sale de C12 | `ProjectIndex.tsx`, `caseMedia`, `public/portfolio/reels/` | Al pasar por Fenix (y por cada destacado) arranca su cinemática |
| C12 | **CRM en motion graphics.** Reeditar en Remotion los films que ya existen (New Brothers, L&B, Fenix y Truckers) con una capa de motion encima: tipografía cinética con la marca «pared», recortes de la interfaz real del CRM con llamadas, contadores del número de cada ficha, transiciones entre escenas y la señal `#71F3A2`. Primero **un prototipo de 15–20 s sobre Fenix** para que Mario lo apruebe, y después el resto. De ahí salen tres piezas: los cortes de 6 s (C11), la cabecera de `/sistemas` y de cada rama por rubro, y una pieza de 30–45 s «AI automation & CRM» | `src/components/films/`, `src/remotion/`, `renders/` | Mario aprueba el prototipo y las piezas quedan renderizadas en ES y EN, 16:9 y 9:16 |
| C13 | **Web de viajes propia** (rama aparte, fuera de `web/`). Repo nuevo desde la V11 de Milagros. Lleva marca y nombre inventados, otros pasajes (otra aerolínea ficticia, otras rutas y otros chips de ruta) y otra paleta, para que no se parezca. Recupera el avión que pasa, la profundidad y las postales. Se le saca todo lo de Milagros (logo, fundadora, clips, WhatsApp y analítica). Se publica como demo propia (por ejemplo `viajes.mmorera.agency` o una URL de Vercel) y en el sitio entra como caso «concepto», con reel, galería y una rama `/casos-de-uso/agencias-de-viaje` | repo nuevo, `projectCases.ts`, `caseMedia` | La demo está en línea sin rastros de Milagros, y el caso tiene su cinemática de entrada |

Orden sugerido: **C11 primer paso** (el reel de Fenix, una tarea chica que se ve enseguida), después **el prototipo de C12** y en paralelo **C13**, que es un repo aparte y no pisa archivos de `web/`. El resto de C12 va cuando Mario apruebe el prototipo.

Disco: Remotion deja unos 400 MB en TEMP por corrida y C: tiene unos 7,5 GB libres. Antes de cada tanda de render hay que limpiar TEMP.

### 7.3 Preguntas nuevas

9. **«La parte del CRM»:** ¿son los CRM de los casos (New Brothers, L&B y Fenix) reeditados con motion, o también la demo del CRM Oficio?
10. **Web de viajes:**
    - ¿Qué nombre y qué rubro le damos? Por ejemplo, una agencia de viajes ficticia que no sea de Europa.
    - ¿Partimos de la V11 (`d68cb5a`, la última con avión)?
    - ¿Reemplaza al caso Cana Vacations o va aparte?
    - Como se vendió por AD Media y se hizo para una clienta, ¿la mostramos como «concepto propio», sin nombrar a Milagros ni a AD Media?
11. **Prioridad:** ¿arrancamos por el reel de Fenix y el prototipo de motion, o primero la web de viajes?

### 7.4 Avance de C13 (16/11): Vespera, demo de viajes

Mario lo pidió primero. Decidió que la web de Milagros quede intacta (la sigue trabajando) y que la copia sea un proyecto distinto, de portfolio y sin la línea de AD Media.

- **Dónde está:** `C:\Users\morer\viajes-demo`, un repo local nuevo y sin historial de la clienta (no tiene remoto en GitHub). **Publicado el 16/11 con el OK de Mario** en https://vespera-demo-psi.vercel.app, en el proyecto `vespera-demo` de Vercel. No se indexa y no usa ningún dominio propio.
- **Qué es:** Vespera, una agencia de viajes ficticia de «Europa para dos».
  - La portada es la cinemática del vuelo de la V11: la ventanilla, el avión que pasa y el aterrizaje en cada ciudad, con su tarjeta de destino y su sello.
  - Sigue «Tu ruta», con el globo y la tarjeta de embarque «Tú + 1» desde Nueva York.
  - Después vienen las postales en profundidad con cielo de atardecer, «Lo que recibes» y el pie como pasaje: puerta B12, embarque a las 19:40 y asientos 2A y 2B.
  - La paleta es noche índigo con champán y coral, y el sello está dibujado en SVG.
- **Qué se sacó:** el logo, la firma, la fundadora, los clips y las fotos de Milagros (donde sale ella u otras personas), las preguntas frecuentes, el WhatsApp, la analítica, las páginas legales, el estudio de revisión y las pruebas de QA del proyecto original. Los botones llevan a mmorera.agency, el sitio no se indexa y el pie avisa que es una demo con marca ficticia.
- **Verificado:** compila sin errores, pasan 86 de 100 pruebas (ninguna falla y el resto queda omitido) y el build de producción sale bien. Se recorrió en el navegador a 1440 px. El teléfono todavía no se revisó.
- **Falta:**
  1. Pulido «más guau», el pedido de Mario.
  2. Revisión en el teléfono.
  4. Grabar el reel y las capturas para sumarlo al sitio como caso (C11 y C13).

### 7.5 Tráiler de Vespera (pedido de Mario, 16/11, hay que hacerlo)

Mario aprobó la demo («muy completa, para la demo está genial») y pidió dejar anotado el video. Es el tráiler animado de este proyecto, como el de los demás casos de la web. Lleva las mejores escenas:

1. **La cinemática de entrada:** la ventanilla y las nubes.
2. **El avión viajando:** el avión de perfil cruzando el cielo.
3. **Los destinos entrando:** la llegada a Venecia, París y Granada, que según Mario es «muy atractiva».
4. **Las transiciones con el avión:** el avión cenital entre ciudades, los sellos y la tarjeta de cada destino.
5. **El cierre:** la postal con el avión que rompe el marco, más el pasaje (B12 · 19:40 · 2A · 2B).

Cómo hacerlo:
- Se graba la demo en vivo con Playwright, scroll guiado y a 60 fps, o se arma en Remotion con los clips de `public/media/flow/v1` (ventanilla, avión y seis ciudades, ya generados) y las capas de las postales.
- Formatos: 16:9 y 9:16, en ES y EN, más un corte de 6 s para la entrada al pasar por el caso (C11).
- Antes de renderizar hay que mirar el espacio en disco.
- **El recorrido intermedio** (la sección «Tu ruta», con el globo y la tarjeta de embarque) se puede pulir aparte. En el tráiler va poco o nada.

---

## 8. El equipo de modelos frontera (pedido de Mario, 16/11)

### 8.1 Lo que pidió

Mario no trabaja con una sola herramienta.
- **Modelos:** coordina un equipo de modelos frontera (Claude Code, Codex y Gemini) con roles distintos que se auditan entre sí. Unos rinden más en frontend, otros en backend y otros en seguridad.
- **Imágenes y cinemáticas:** usa los modelos de Flow.
- **Editores:** cambia según el proyecto entre Antigravity, VS Code y Cursor.
- **Acceso:** paga el nivel más alto de estos modelos y quiere que se entienda que su trabajo vale más por eso.

Hoy mucha gente le atribuye todo a una herramienta («lo hizo Claude Code»), y la web no lo aclara. Lo quiere mostrar **con trabajo real, no con logos**: qué herramienta hizo qué en cada caso, por qué las combina y cómo se revisan antes de entregar.

### 8.2 Evidencia que ya existe (de acá sale el contenido, sin inventar)

- **La web misma:** el tablero de la tríada (`web/docs/triada/TABLERO.md`), con decisiones, dueños y estados por tarjeta. También están las entregas por tarea (`web/docs/triada/entregas/`), los arranques de Codex (`web/docs/triada/codex/`) y los prompts por modelo (`PROMPT-codex.md`, `PROMPT-gemini.md`). Ahí se ve quién construyó, quién auditó y quién integró cada pieza. Solo Claude integra a `main`.
- **Los films de los casos:** Gemini arma los kits verificados (`docs/films/kits/`, `GEMINI_FILMS.md`, `check-case-kit`) y Claude los anima en Remotion (`docs/films/CLAUDE_ANIMATION_PLAYBOOK.md`).
- **Las escenas generadas:** las cinemáticas de Vespera (ventanilla, avión y ciudades) y las placas de la fábrica de contenido salen de Flow y de generadores de imagen.
- **El trabajo para clientes:** la QA con informes de Codex y la revisión de Claude sobre lo que entregó otro modelo. Se puede contar sin nombrar al cliente.

### 8.3 Propuesta

**a) En la página técnica (`/como-lo-construyo`), un bloque corto.** Título «The team behind every build» (ES: «El equipo detrás de cada entrega»). Lleva tres piezas:
- Una tabla de roles en texto, sin logos. Los roles exactos los confirma Mario (pregunta 12):

  | Modelo o herramienta | Rol | Lo audita |
  | --- | --- | --- |
  | Claude Code | Arquitectura, integración, animación en código y revisión final | Codex o Gemini, según la tarea |
  | Codex | Implementación por tareas, pruebas y QA | Claude |
  | Gemini | Investigación, kits verificados y crítica externa | Claude |
  | Flow (Google) | Escenas, cinemáticas e imágenes | Mario, cuadro por cuadro |
  | Antigravity, VS Code o Cursor | El editor que pide cada proyecto | — |

- Un diagrama del circuito: brief → un modelo construye → otro audita → Mario aprueba → entrega.
- **Un ejemplo real:** una tarjeta del tablero contada en tres líneas (quién la hizo, qué encontró la auditoría y qué se cambió). Encaja con lo que pide el mercado: «un fallo honesto y qué se cambió» (Ronda 16/11).

**b) En cada caso, una línea, sin logos y discreta.** Va debajo de la ficha de antes y después, por ejemplo «Built by Claude Code · audited by Codex · scenes by Flow». Sale de un campo nuevo en `ProjectCase`:

```ts
crew?: { tool: "Claude Code" | "Codex" | "Gemini" | "Flow" | string; role: LocalizedText; evidence: string }[];
// evidence: ruta al registro (tarjeta del tablero, entrega o kit). Sin evidencia no se publica la línea (test).
```

**c) El argumento, en una frase de la home o de /sobre-mi, sin cifras de cuánto paga.** EN: «A team of frontier models, each in its lane, checking each other's work, and one person accountable for what ships.» ES: «Un equipo de modelos frontera, cada uno en lo suyo, que se revisan entre sí, y una persona que responde por lo que se entrega.» Se apoya en la «capa humana» del posicionamiento.

Cuidados:
- No ocupar más que una línea por caso, para no sumar ruido (sección 1).
- En formularios y textos, para agentes nombrar solo el Vercel AI SDK. No decir LangChain, LangGraph, CrewAI ni Mastra.
- No mostrar logos de marcas ajenas como si fueran clientes o socios.

### 8.4 Preguntas nuevas

12. **Roles:** ¿qué modelo usás hoy para frontend, cuál para backend y cuál para seguridad? ¿Y cuál audita a cuál? La tabla de 8.3 es un borrador.
13. **Casos con línea:** ¿qué casos tienen registro de quién hizo qué? Hoy hay evidencia de la propia web (la tríada), de los films de los casos y de Vespera. Para los casos viejos, ¿lo reconstruimos con vos o los dejamos sin línea?
14. **El costo:** ¿querés decir explícitamente que pagás el nivel más alto de acceso, o alcanza con «modelos frontera», que lo da a entender sin hablar de plata?

