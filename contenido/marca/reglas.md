# Reglas (no negociables)

El validador (`npx tsx scripts/check-pieza.ts`) aplica las automáticas. Las demás las revisa quien escribe y Mario al aprobar.

## Honestidad

- **Sin cifras de resultado inventadas:** nada de porcentajes de mejora, ROI, "duplicamos", "garantizado". El validador rechaza `%`, `ROI`, "garantiz…" y "duplic…/triplic…".
- **Solo números verificables:** los del sitio y sus dossiers (`web/docs/films/dossiers/`), que describen lo construido. Por ejemplo, "26 tablas con seguridad por fila" (New Brothers) o "142 precios en el catálogo" (L&B).
- **Las métricas de negocio de un cliente no son resultados del trabajo de Mario.** No se presentan como tales.
- **Datos de ejemplo:** si una pieza muestra datos de muestra (un lead inventado, un flujo de ejemplo), lleva `"ejemplo": true` y alguna pantalla lo dice ("datos de ejemplo"). El validador lo exige.
- **Proyectos que no llegaron a operar del todo:** se presentan como trabajo de diseño y desarrollo, sin hablar de resultados.

## Clientes y casos

- **Enlace al caso:** `mmorera.agency/casos-de-exito/<slug>`. Con `#film-<capítulo>` abre el film en ese momento.
- **Fénix Medical Center:** sin testimonios, sin costos y sin mencionar "FENIX OS".
- **No se habla mal de un cliente.** Los problemas son del sistema anterior, no de las personas.
- **Nada privado:** sin capturas con datos de clientes reales, teléfonos, emails ni nombres de pacientes o usuarios.

## Marca

- **No se nombra el país** en piezas públicas: el validador lo bloquea igual que en el sitio.
- **No aparece la cara de Mario** (ver `identidad.md`).
- **Sin logos de terceros** en las imágenes generadas. Las herramientas (Next.js, Remotion, GoHighLevel…) se nombran en texto.

## Opiniones

- **Postura propuesta:** una pieza con `"postura": true` es una opinión de Mario. Claude o Gemini escriben una postura propuesta con su fundamento, y **Mario la ajusta antes de aprobar**. Nadie publica una opinión que Mario no revisó.
- **Polémica sí, falta de respeto no.** Se discute una práctica ("pedir una web sin pensar el sistema"), nunca a una persona o a una empresa con nombre.

## Sorteos

- **Antes de anunciar,** Mario confirma premio, alcance, fecha de cierre y bases.
- **Las bases dicen:**
  - quién puede participar;
  - cómo se elige al ganador y cuándo se anuncia;
  - cómo se entrega el premio;
  - que la plataforma no patrocina ni administra el sorteo (Instagram, TikTok, etc.).
- **Sin pedir datos sensibles.** El contacto con el ganador es por mensaje directo y lo hace Mario.
