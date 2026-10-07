# Dossier · Mr. Studio Tattoo

> **Estado:** Verificado a partir del producto en vivo (`https://www.mrstudiotattoo.com/`) y especificación técnica de arquitectura en Lovable.
> **Cliente:** Mr. Studio Tattoo (Miami, Florida).
> **Especialidad:** Realismo, Micro-realismo, Fine Line, Black & Grey y Lettering de autor.

---

## 1. Identidad y Posicionamiento

- **Qué es:** Estudio de tatuajes premium en Miami con múltiples artistas residentes y catálogo de alta gama.
- **Diferencial estético:** Interfaz oscura y refinada (`#000000` / `#0A0A0A` con acento flúor menta `#71F3A2`), donde la interfaz cede el protagonismo a las piezas fotográficas de alta resolución de cada artista.
- **Stack tecnológico:** **Lovable** (React, Vite, Tailwind CSS, Lucide Icons, Framer Motion, Radix UI).
- **Assets en el repositorio:**
  - `web/public/portfolio/mrstudio-tattoo-cover.jpg`
  - `web/public/portfolio/brands/mr-studio-tattoo/cover.jpg`
  - Capturas de escritorio y móvil en `web/public/portfolio/shots/mr-studio-tattoo-*.jpg`
  - Video reel en `web/public/portfolio/reels/mr-studio-tattoo.mp4`

---

## 2. Los Superpoderes Técnicos e Interactivos

### A. Selector Corporal Anatómico Interactivo (Interactive Body Placement Selector)
A diferencia de los formularios tradicionales de agencias que usan selectores desplegables de texto genérico, Mr. Studio Tattoo cuenta con un **mapa anatómico interactivo del cuerpo humano**:
1. **Modelado visual frontal y dorsal**: El usuario puede rotar entre vista frontal y posterior.
2. **Puntos anatómicos activos**:
   - Extremidades superiores: Antebrazo interno/externo, bíceps, hombro, muñeca, mano.
   - Tronco: Pecho, costillas (alta sensibilidad), abdomen, cuello.
   - Espalda: Omóplato, columna vertebral, espalda completa.
   - Extremidades inferiores: Muslo, rodilla, pantorrilla, tobillo.
3. **Cálculo de complejidad por zona**: La selección anatómica condiciona la estimación de dolor, sesiones estimadas y tamaño mínimo para que los detalles no se deformen con el movimiento muscular.

### B. Agenda Multi-Paso Calificada con Cobro de Seña (Retainer Fee)
El sistema elimina la fuga de tiempo en DMs de Instagram mediante un embudo en 5 pasos deterministas:
1. **Zona anatómica**: Definida con el selector corporal.
2. **Estilo y Referencias**: Filtrado por Realismo, Micro-realismo, Fine Line o Geométrico, con cargador de imágenes de referencia.
3. **Selección de Artista**: El sistema sugiere o permite elegir al tatuador residente con el portafolio más alineado a la técnica deseada.
4. **Dimensiones y Sesión**: Estimación del tiempo necesario (sesión media, sesión completa o múltiples jornadas).
5. **Seña / Depósito de Reserva**: Pago directo de anticipo (retainer deposit) para bloquear el día en el calendario del artista. Si no hay seña, no hay turno reservado.

---

## 3. Escena Protagonista para el Film de Remotion

- **Tipo de escena:** `body-selector` (o `tattoo-studio`).
- **Mecánica visual para el animador:**
  - Renderizado de la silueta anatómica estilizada con líneas vectoriales oscuras y acento menta `#71F3A2`.
  - Pulso interactivo al "hacer clic" en una zona (ej. antebrazo o espalda) que se ilumina con halo brillante.
  - Apertura del panel de estilo que empalma la foto de la pieza de tatuaje real terminada sobre esa misma zona corporal.
  - Transición fluida a la pasarela de confirmación de seña y agenda con el artista.
