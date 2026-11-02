# T08 · Página `/fabricas` («Contenido con IA», D11)

**Ya hecho por Claude:**
- `SERVICE_PAGES.fabricas` en `src/data/servicePages.ts`: héroe, para quién es (y para quién no), qué incluye, herramientas, el título y la bajada de «Del brief a la pieza», cómo trabajamos y cierre;
- `pageMetadata("fabricas", …)` en `paginas.ts`.

**Voz:** español neutro con tuteo e inglés claro.

## Rutas

- `src/app/fabricas/page.tsx` y `src/app/en/fabricas/page.tsx`, con la plantilla `ServicePage`.
- Sumarlas al sitemap.
- Cuando estén listas, el menú «Servicios ▾ → Contenido con IA» y el «Ver cómo funciona →» de ese servicio en el home pasan de `/#servicios` a `/fabricas`.

## El slot «Cómo funciona»: dos piezas

### 1. «Del brief a la pieza» (M3, T33)

- **Componente:** `premium/fabricas/BriefToPiece.tsx`.
- **Contrato:** define el tipo en `src/types/briefToPiece.ts`:
  ```ts
  { slug: string; title: LocalizedText; stages: {
      stage: "brief" | "guion" | "arte" | "revision" | "final";
      who: "ia" | "persona" | "herramienta";
      label: LocalizedText; summary: LocalizedText; image: { src: string; alt: LocalizedText };
  }[] }[]
  ```
  Los datos van en `src/data/briefToPiece.ts`, que es mío. Los cargo cuando Gemini rehaga T33. Mientras tanto, usa un fixture de test.
- **Comportamiento:**
  - el visitante elige una pieza (pestañas, si hay más de una) y avanza las 5 etapas con botón o flechas;
  - cada etapa muestra su imagen, una línea y quién la hizo: «IA», «Persona» o «Herramienta», rotulado;
  - sin scroll secuestrado;
  - con movimiento reducido, sin transiciones.
- **Textos de la interfaz:**

  | Clave | ES | EN |
  |---|---|---|
  | Etapas | Brief · Guion · Arte · Revisión humana · Pieza final | Brief · Script · Art · Human review · Final piece |
  | Quién | IA · Persona · Herramienta | AI · Person · Tool |
  | Botones | Anterior · Siguiente | Previous · Next |

### 2. Galería «Video y contenido con IA» (T09)

- **Componente:** `premium/fabricas/VideoGallery.tsx`.
- **Comportamiento:**
  - una grilla de piezas verticales con su póster;
  - el video se carga solo al pedirlo;
  - con movimiento reducido, sin autoplay;
  - cada pieza muestra su duración y sus herramientas.
- **Datos:** `src/data/videoGallery.ts`, que cargo yo cuando Gemini rehaga T09.
- **Videos:** los que pesen más de 4 MB se comprimen con ffmpeg (H.264, ancho de 720 px, sin audio si no lo tienen) antes de entrar a `public/portfolio/video-ia/`.
- **Textos:**

  | Clave | ES | EN |
  |---|---|---|
  | Título del bloque | Piezas hechas con este sistema | Pieces made with this system |
  | Botón | Ver el video · {duración} | Watch the video · {duration} |

## Listo cuando

- `/fabricas` y `/en/fabricas` se ven a 390 y 1440 px, con teclado y movimiento reducido.
- «Del brief a la pieza» y la galería funcionan con los fixtures.
- La ruta **no se enlaza desde el menú** hasta que yo cargue los datos reales.
