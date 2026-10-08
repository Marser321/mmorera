# Media kit de los casos · guía para agentes

Material listo para subir los casos de éxito a portfolios y redes: Upwork, Fiverr, LinkedIn, Behance, Dribbble, Contra, Instagram, TikTok, YouTube y X.

- **Carpeta:** `C:\Users\morer\OneDrive\Desktop\MMORERA\web\media-kit\`. Está fuera de git.
- **Índice:** `media-kit/INDEX.md`, con cada archivo, su medida, su duración y su peso. La misma lista en JSON está en `media-kit/manifest.json`.

## 1. Qué hay por caso

`media-kit/<caso>/<es|en>/`:

| Carpeta | Qué trae | Para qué |
|---|---|---|
| `videos/film-16x9.mp4` | El film completo, 1920×1080, 70–80 s | YouTube, Behance, Upwork, sitio, LinkedIn horizontal |
| `videos/film-4x5.mp4` | El film completo, 1080×1350 | Feed de LinkedIn e Instagram |
| `videos/film-9x16.mp4` | El film completo, 1080×1920 | Reels y TikTok |
| `videos/clip-<escena>-{16x9,4x5,9x16,1x1}.mp4` | La escena protagonista (13–21 s) en 4 formatos | Shorts, Reels, posts, Dribbble |
| `videos/clip-arquitectura-16x9.mp4` | La escena de arquitectura (solo los casos con sistema) | Explicar la ingeniería |
| `imagenes/portada-{16x9,4x5,1x1,4x3}.jpg` | La apertura del film con la marca del cliente | Portadas y miniaturas |
| `imagenes/og-1200x630.jpg` | Vista previa al compartir | LinkedIn Destacados, X, WhatsApp |
| `imagenes/capitulo-NN-<id>-{16x9,4x5}.jpg` | Un cuadro por capítulo, con todo armado | Galerías o carruseles que explican el caso paso a paso |
| `imagenes/arquitectura-N-16x9.jpg` | Tres momentos de la escena de arquitectura | Carrusel técnico |
| `diagrama/arquitectura-<idioma>.png` y `-oscuro.png` | El diagrama de Archify a alta resolución, claro y oscuro | Upwork, Behance, LinkedIn: "cómo está construido" |
| `diagrama/arquitectura-<idioma>.html` | El mismo diagrama, interactivo | Para abrir en el navegador o adjuntar |
| `textos.md` | Título, resumen, rol, stack, desafío, decisiones, resultado, enlaces y los capítulos con su explicación | Descripciones y textos de cada publicación |

**Casos con diagrama de Archify:** Fenix Medical Center, L&B Elite Wash, New Brothers y AD Media Solution. Los demás son sitios y productos de frontend sin sistema propio para diagramar.

### Films por capacidad (perfil, no un caso)

Nueve films cortos (21,5–26 s), uno por capacidad de /estudio:
- **Familias:** IA aplicada, Automatización, Backend & datos, Experiencias web, Commerce, Marketing & medición, CRM & operación, Dirección visual e Infraestructura.
- **Qué cuentan:** qué resuelve la capacidad, con qué herramientas y qué casos la demuestran.
- **Para qué sirven:** secciones de habilidades o servicios (LinkedIn, Upwork, Contra, Fiverr) y posts que presentan un servicio y no un cliente.

Desde `web/`:

```bash
npx tsx scripts/render-films.ts --capabilities                 # los 9, 16:9 y 4:5, es y en
npx tsx scripts/render-films.ts capability-crm --languages en  # uno solo
```

- **Salida:** `renders/capability-<familia>/capability-<familia>-<landscape|portrait>-<es|en>.mp4` (16:9 a 1920×1080, 4:5 a 1080×1350).
- **Ids:** `capability-ai`, `-automation`, `-backend`, `-web`, `-commerce`, `-marketing`, `-crm`, `-media` e `-infrastructure`.
- Con `--stills 100,300` saca cuadros PNG para miniaturas.

## 2. Pedir otro formato o recorte (el agente lo genera solo)

Desde `C:\Users\morer\OneDrive\Desktop\MMORERA\web`:

```bash
npx tsx scripts/export-media.ts presets
```

Lista los formatos por plataforma: `instagram-reel`, `youtube-short`, `tiktok`, `linkedin-video`, `fiverr-video`, `dribbble-video`, `upwork-video`, `behance-video`, `x-video`, `gif-16x9`, `gif-4x3`, `og`, `linkedin-featured`, `behance-cover`, `fiverr-gig-image`, `upwork-thumbnail` y los genéricos `video-*` e `image-*`.

```bash
npx tsx scripts/export-media.ts info <caso>
```

Muestra las escenas y los capítulos del film, con sus tiempos y sus textos.

**Ejemplos:**

```bash
# Short de YouTube (máx. 60 s) con la escena protagonista, en inglés
npx tsx scripts/export-media.ts preset youtube-short truckers-choice --lang en

# Video de Fiverr (máx. 75 s) del capítulo de arquitectura
npx tsx scripts/export-media.ts preset fiverr-video fenix-medical-center --chapter architecture

# GIF de 8 s para Behance desde el segundo 20
npx tsx scripts/export-media.ts preset gif-4x3 mr-studio-tattoo --from 20 --to 28

# Imagen 4:3 para Upwork del capítulo del cotizador, en español
npx tsx scripts/export-media.ts preset upwork-thumbnail lb-elite-wash-detail --at chapter:cotizador

# Cualquier cuadro exacto (segundo 33,5) en 1:1
npx tsx scripts/export-media.ts frame ad-media-solution --preset image-1x1 --at 33.5
```

**Opciones:**
- `--lang es|en`
- `--scene <id>`, `--chapter <id>` o `--from <s> --to <s>` para elegir el tramo
- `--fit pad|cover`:
  - `pad` (por defecto en los formatos que no son nativos) encaja el film entero sobre un fondo desenfocado de él mismo, así no se corta texto.
  - `cover` recorta al centro.
- `--out <ruta>`: dónde guardar el archivo.

**Comportamiento por defecto:**
- Si un formato tiene duración máxima y no se indica tramo, se usa la escena protagonista.
- La salida por defecto es `media-kit/<caso>/<idioma>/pedidos/`.
- `INDEX.md` se actualiza solo.

**Regenerar el kit completo de un caso:**

```bash
npx tsx scripts/export-media.ts kit <caso>
```

Tarda unos 90 s por caso, con los dos idiomas.

## 3. Lo que necesita a Claude

Pedidos que no son recortes ni cambios de formato del material existente:
- Una versión vertical **nativa** (rediseñada para 9:16, no encajada).
- Textos, subtítulos o llamados a la acción encima del video.
- Música o voz en off.
- Un film nuevo, o cambios de copia en un film.

Para eso, dejá un archivo en `docs/media/pedidos/AAAA-MM-DD-<caso>.md` con:
- La plataforma.
- El formato y la duración.
- El idioma.
- Qué tramo o idea.
- La fecha límite.

Claude lo toma de ahí.

## 4. Reglas al publicar

- **Son proyectos diseñados y programados por Mario.** Algunos no llegaron a operar del todo por razones ajenas a su trabajo: se presentan como trabajo de diseño y desarrollo.
- **No agregues cifras de resultados, ventas ni conversiones** que no estén en `textos.md`. Los datos de ejemplo que aparecen en los films están rotulados así.
- **Enlace de cada caso:** `https://mmorera.agency/casos-de-exito/<caso>`. Con `#film` abre directo en el film, y con `#film-<capítulo>` en un capítulo.
