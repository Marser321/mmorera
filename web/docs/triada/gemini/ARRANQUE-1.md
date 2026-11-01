# Arranque de Gemini · sesión 1 (1/11/2026)

Pegar en Antigravity, con la carpeta MMORERA abierta, **después** del prompt fijo `web/docs/triada/PROMPT-gemini.md`.

---

Hoy tienes 3 tarjetas sin bloqueo en `web/docs/triada/TABLERO.md`. Hazlas en este orden y deja una entrega por cada una en `web/docs/triada/entregas/<ID>.md`.

**1. Crítica de la preview de T01 + T02 (la más urgente).**
Si Mario tiene la preview abierta (http://localhost:3011), usa esa. Si no, lee los textos en `web/src/components/premium/HomeExperience.tsx` (objeto `copy`) y en `web/src/data/solutionsData.ts`, **sin leer** `web/docs/triada/briefs/T01.md`.
Lee el héroe, los 4 servicios y el contacto como lo haría un visitante: un dueño de negocio sin equipo técnico, un reclutador que busca *AI Automation* y un colega dev.
Escribe `web/docs/triada/gemini/critica-T01-T02.md`:
- cada texto marcado como persona, plantilla o relleno, con una reescritura en español neutro con tuteo;
- qué entendió cada uno de los 3 lectores en 5 segundos;
- qué le falta a la primera pantalla para que alguien escriba.

**2. T03: verificar los 3 casos de portada.**
Fenix Medical Center, L&B Elite Wash & Detail y New Brothers Barbería. Para cada uno:
- abre el sitio en vivo (las URL están en `web/src/data/projectCases.ts`);
- recorre lo que el caso dice que hace;
- marca cada capacidad como implementada (con URL y captura), Demo o Concepto.

Salida: `web/docs/triada/gemini/T03-verificacion.md` y las capturas en `web/docs/triada/gemini/T03/`.

**3. T12: auditoría del inglés.**
Recorre cada página de `/` y su par `/en`: home, /casos-de-exito y cada caso, /sistemas, /estudio y /aplicar. Lista lo que falta traducir o lo que suena traducido a máquina.

Salida: `web/docs/triada/gemini/T12-ingles.md`.

**Recordatorios:** no toques `web/src/`, no hagas commits en `main` y no inventes cifras. En el tablero, cambia solo el estado de tus tarjetas.
