# Contenido · la fuente de las redes de Mario Morera

Esta carpeta es de donde salen todas las publicaciones: LinkedIn, Instagram, TikTok, YouTube Shorts y X, en español y a diario. Todo lo que se publica nace acá, se valida acá y queda registrado acá.

## Cómo se conecta todo

```
marca/        cómo se ve y cómo habla la marca (lo leen todos antes de crear)
   │
ramas/        los cinco temas: casos · criterio · sistemas · oficio · comunidad
   │
calendario/   qué sale cada día: una pieza madre por día, con sus versiones por plataforma
   │
piezas/<AAAA-MM-DD>-<slug>/
   pieza.json   los datos que anima el código (textos, diapositivas, pulsos, imágenes)
   copy.md      el texto de cada plataforma, listo para pegar
   chatgpt.md   los pedidos para que ChatGPT diseñe sus diapositivas (se genera solo)
   imagenes/    lo que genera ChatGPT: diapositivas gpt-*.png y fotos sueltas (no va a git)
   salida/      los PNG y MP4 renderizados (no va a git)
   │
agentes/      el manual de cada agente: publicador, imágenes y Gemini
encargos/     tandas de trabajo para Gemini, cada una con su criterio de "listo"
metricas/     cómo le fue a cada pieza
REVISION.md   lo que espera tu aprobación (se genera solo)
```

Cada pieza declara:
- su `rama` y su `serie`;
- su `fuente`: un caso del sitio, una capacidad, el propio sitio o una experiencia de Mario;
- sus `salidas`: una por formato, cada una con las plataformas donde va.

El calendario apunta a las piezas por su id.

## Estados de una pieza

| Estado | Qué significa | Quién lo marca |
|---|---|---|
| `idea` | Está en el calendario, falta escribirla | Claude o Gemini |
| `borrador` | Datos y copy escritos; pueden faltar imágenes o renders | Claude o Gemini |
| `listo` | Valida sin errores, tiene imágenes y renders, y pasó la revisión visual | Claude o Gemini (`contenido.ts listo`) |
| `aprobado` | Mario la vio y la quiere publicada | **Solo Mario** (o Claude cuando Mario lo pide en el chat) |
| `publicado` | Está en todas sus plataformas, con la URL registrada | El agente publicador |

**El agente publicador solo publica piezas `aprobado`.** Nunca aprueba ni cambia una pieza.

## Comandos (desde `web/`)

```bash
npx tsx scripts/check-pieza.ts <id>            # valida una pieza (o --todas)
npx tsx scripts/render-social.ts <id>          # renderiza PNG y MP4 en salida/ (--stills: solo PNG)
npx tsx scripts/contenido.ts estado            # resumen de todas las piezas
npx tsx scripts/contenido.ts listo <id>        # borrador → listo
npx tsx scripts/contenido.ts revision          # escribe REVISION.md
npx tsx scripts/contenido.ts aprobar <id>      # listo → aprobado (Mario)
npx tsx scripts/contenido.ts hoy               # qué publicar hoy, plataforma por plataforma
npx tsx scripts/contenido.ts publicado <id> <plataforma> <url>
```

## Plantillas animadas

Las plantillas están en `web/src/components/social/` y sus datos en `web/src/data/social/`. Hay ejemplos de `pieza.json` en `plantillas/`.

| Plantilla | Formato | Para qué |
|---|---|---|
| `reel-texto` | 9:16 | Gancho → pulsos → remate invertido → firma. Lento con pulso. |
| `reel-caso` | 9:16 | El problema de un caso, 3 decisiones sobre cuadros de su film, enlace al caso. |
| `carrusel` | 4:5 o 1:1 | De 3 a 10 diapositivas. Tipos: portada, texto, lista, cita, comparación, imagen y cierre. Con `video: true` también sale como reel. |
| `desafio` | 4:5 | El "desafío del mes" de LinkedIn: contexto → problema → decisión → resultado → aprendizaje. |
| `imagen` | cualquiera | Una sola diapositiva: tarjeta de opinión, encuesta, sorteo, etc. |

**Las piezas estáticas** (carrusel, desafío, imagen) las diseña **ChatGPT** completas, con `marca/chatgpt-diseno.md`. El código genera siempre una versión de respaldo. Para trabajar con ellas:

```bash
npx tsx scripts/chatgpt-prompts.ts <id>                 # escribe los pedidos en piezas/<id>/chatgpt.md
npx tsx scripts/contenido.ts chatgpt                    # qué falta
npx tsx scripts/contenido.ts importar <id> <salida>     # trae las descargas, recorta y nombra
```

Si la versión de ChatGPT está completa, el publicador usa esa; si no, la de código.

## Relación con `content-os/` (anterior)

`content-os/` (sin versionar) es un sistema anterior: un radar de noticias de IA y plantillas de guion para videos grabados a cámara.

- **Sirve para ideas de la rama criterio:** lo que trae el radar va a `ideas.md`.
- **No sirve como fuente de casos.** Su `docs/matriz-social-autoridad.md` tiene datos sin verificar (un nombre equivocado y cifras sin fuente). Para los casos, las fuentes son solo los dossiers de `web/docs/films/dossiers/` y `web/src/data/capabilityCases.ts`.
- **El publicador es `agentes/publicador.md`,** no el `publisher_agent.py` de content-os.

## Prompts listos para pegar

- **Gemini:** `agentes/PROMPT-gemini.md` (producción de piezas y plantillas animadas nuevas).
- **Agente del navegador:** `agentes/PROMPT-navegador.md`, con dos prompts: A, diseño en ChatGPT; B, publicación diaria.

## Quién hace qué

- **Mario:** aprueba, ajusta su postura en las opiniones, confirma premios y bases de los sorteos.
- **Claude:** construye y cuida las plantillas, escribe y revisa piezas, revisa lo que hace Gemini.
- **Gemini:** produce piezas a partir del calendario con las plantillas, las valida y las renderiza (`agentes/gemini.md`).
- **El agente del navegador:**
  - diseña en ChatGPT los carruseles y piezas estáticas, y genera las fotos (`agentes/chatgpt.md`);
  - publica lo aprobado (`agentes/publicador.md`).
