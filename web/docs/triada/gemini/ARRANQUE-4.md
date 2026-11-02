# Arranque de Gemini · sesión 4 (1/11/2026)

Pegar en Antigravity, con la carpeta MMORERA abierta, **después** del prompt fijo `web/docs/triada/PROMPT-gemini.md`.

---

Gracias por la crítica. Te cuento qué pasó con ella:
- **Miraste una versión anterior.** Todavía tenía `#perfil`, `#metodo` y el índice de 6 proyectos, y medía 15.267 px en el teléfono. Cuando la abriste, ya se había integrado T21: el home actual mide **unos 7.200 px a 1440 px** y tiene «Cómo trabajo», las tarjetas «Pruébalo tú», el menú «Servicios ▾» y el brief plegado.
- **Lo que siguió vigente ya se usó:**
  - las `keywords` en español en `/en` (corregido);
  - los dos patrones de botón flotante, la cápsula pegada al borde en el teléfono y el rótulo «Live» (van a Codex en T37);
  - Mr. Studio sin «Pruébalo» (es tu T38).

**Voz:** español neutro con tuteo, sin voseo.

## 1. T38 · Más rutas «Pruébalo tú»

Mismo método que T28. Para cada ruta:
- ¿Abre sin cuenta?
- ¿Muestra datos reales de personas?
- Qué ve el visitante, en una línea.
- Cómo se ve a 390 px.
- Una captura.
- Tu marca: «abre», «Demo» o «no usar».

**No confirmes reservas, no envíes formularios y no inicies pagos.** Llega hasta el paso anterior a confirmar.

| Caso | Sitio (de `web/src/data/projectCases.ts`) | Qué se quiere mostrar |
|---|---|---|
| Mr. Studio Tattoo | `https://www.mrstudiotattoo.com/` | La reserva guiada en 10 pasos, con selector anatómico. Busca la ruta directa al flujo |
| Truckers Choice | `https://truckers-choice-web-site.vercel.app/` (y `/en`) | La cotización en 3 pasos |
| Rangel Oviedo Group | `https://rangeloviedo-tor8.vercel.app/` | El diagnóstico por 4 perfiles |

**Salida:** `web/docs/triada/gemini/T38-pruebalo.md`, las capturas en `web/docs/triada/gemini/T38/` y la nota en `entregas/T38.md`.

## 2. Crítica en frío de la versión actual

**Antes de empezar, confirma que miras la versión correcta.** En `http://localhost:3012`, `document.documentElement.scrollHeight` a 1440 px debe dar **unos 7.200**. Si ves «Perfil & Filosofía» o un tramo «Metodología», la preview está vieja: pídele a Mario que la reinicie.

Con el mismo criterio que antes (sin leer el plan ni los briefs), recorre `/`, `/casos-de-exito`, Fenix y `/en`, a 1440 y 390 px. Marca:
- si el recorrido se entiende de punta a punta;
- dónde todavía cansa (el tramo de servicios hoy mide unos 3.300 px y es casi la mitad del home);
- qué falta para que alguien escriba.

**Salida:** `web/docs/triada/gemini/critica-integra-2.md`.

## 3. T34, cuando Mario te pase las respuestas

Igual que antes: consolídalas en la sección 4 de `T34-prueba.md`.

**Recordatorios:** no toques `web/src/`, no hagas commits en `main` y no inventes cifras. En el tablero, cambia solo el estado de tus tarjetas.
