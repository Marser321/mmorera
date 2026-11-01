# Rama · Casos

**Qué:** el trabajo real, contado desde la decisión y no desde el resultado. Cada caso del sitio tiene un film, un dossier con cifras verificadas y capítulos enlazables.

**Día fijo:** martes.

## Series

- **Desafío del mes:** un problema concreto de un proyecto, la decisión que se tomó y lo que se aprendió. Formato `desafio` en LinkedIn y `carrusel` o `reel-caso` en el resto.
- **Detrás del caso:** las 3 decisiones que definieron un proyecto. Formato `reel-caso`.
- **Un detalle:** una sola pieza del sistema explicada (el cotizador, la app de la cuadrilla, la reserva en 3 pasos). Formato `carrusel`.

## Fuentes

- **Los 14 casos con film** (`web/src/data/films/flagships/slugs.ts`):
  - Fénix, L&B, New Brothers, AD Media, Mr. Studio Tattoo, Truckers Choice;
  - Rangel Oviedo, América Trámites, EvoWrap, AutoHub 360, DOGE.S.M, Punta 360;
  - La Nueva Brasil, Hub Profesional.
- **Los datos verificados:** `web/docs/films/dossiers/<caso>.md` y las líneas de `web/src/data/capabilityCases.ts`.
- **Los cuadros del film:** `web/public/portfolio/films/<slug>/og-es.jpg` y `hero-es.jpg`. Los usa `reel-caso`.

## Se conecta con

- **Sistemas:** el mismo caso explicado por su arquitectura (Archify).
- **Criterio:** la opinión que nace de lo que pasó en el caso.
- **El sitio:** cada pieza enlaza a `mmorera.agency/casos-de-exito/<slug>#film-<capítulo>`.

## Ganchos que funcionan

- "Una barbería no necesitaba una web. Necesitaba un sistema."
- "Cero Postgres: el CRM era la base de datos."
- "Un formulario médico no debería tocar datos de salud."
