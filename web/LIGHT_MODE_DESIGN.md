# Modo claro "Master Print" — sistema de diseño y reglas

El modo oscuro es la sala de color a oscuras (**Deep Space**). El modo claro es el
**master impreso a plena luz**: el positivo de la misma película. No es un tema
aparte — es la misma identidad revelada en positivo.

## Principios (no negociables)

1. **Inversión de anclas, no paleta nueva.** Grafito `#070809` ↔ marfil `#F3F0E8`.
   El marfil que en dark es texto, en light es papel. El grafito que en dark es
   fondo, en light es tinta.
2. **La luz se vuelve tinta.** Todo lo que en dark brilla (glow, additive,
   text-shadow luminoso) en light se dibuja con densidad de tinta y sombra.
   Nunca "bajarle opacidad al glow": reemplazar la técnica.
3. **La profundidad se vuelve papel.** En dark la jerarquía es luminancia
   (más cerca = más claro). En light es **elevación**: superficies más blancas
   que el fondo + doble sombra (contacto + ambiente) + highlight superior.
4. **Acentos gemelos "print", no los mismos hex.** Los neones de dark son
   ilegibles sobre marfil. Cada acento tiene su gemelo profundo con el mismo
   carácter tonal y contraste AA (≥4.5:1 sobre `#F3F0E8` para texto).

## Tokens (definidos en `globals.css`)

`:root` = dark (como siempre). `html.light` los redefine. **Nunca** agregar un
hex crudo nuevo en componentes: usar tokens semánticos de Tailwind
(`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`,
`text-accent`, `text-signal`, `track-create|build|scale`) o `var(--...)`.

| Token | Dark (Deep Space) | Light (Master Print) |
|---|---|---|
| `--color-background` | `#070809` | `#F3F0E8` |
| `--color-foreground` | `#F3F0E8` | `#14171A` |
| `--color-card` | `#0D1114` | `#FBFAF4` |
| `--color-muted-foreground` | `oklch(0.65 0.015 260)` | `oklch(0.44 0.015 260)` |
| `--color-border` | `oklch(0.3 0.02 260)` | `oklch(0.84 0.012 90)` |
| `--color-accent` (cian) | `#55D8FF` | `#0A7EA4` |
| `--color-signal` (verde) | `#71F3A2` | `#0E7A46` |
| `--color-track-create` | `#B68CFF` | `#6D43CC` |
| `--color-track-build` | `#55D8FF` | `#0A7EA4` |
| `--color-track-scale` | `#71F3A2` | `#0E7A46` |
| `--color-ring` | `#55D8FF` | `#0A7EA4` |
| `--ink-rgb` (utilitario) | `243 240 232` | `20 23 26` |

`--ink-rgb` es "el color que dibuja sobre el fondo" (marfil en dark, grafito en
light). Sirve para bordes/velos con alpha: `rgb(var(--ink-rgb) / 0.12)`.

## Variante Tailwind `light:`

El sitio está escrito **dark-first**: lo no prefijado ES el modo oscuro.
`tailwind.config.ts` define la variante custom `light:` (`.light &`). Regla:

- Si el estilo ya usa un token semántico → no tocar (flipea solo).
- Si usa un literal dark (`bg-[#070809]/72`, `text-[#F3F0E8]`, `border-white/10`,
  `rgba(7,8,9,…)`, sombras negras): elegir según el caso —
  a) reemplazar por token si existe uno con esa semántica, o
  b) mantener el literal dark y sumar el gemelo `light:` explícito.
- `border-white/N` y `bg-white/N` (velos sobre dark) → `border-[rgb(var(--ink-rgb)/0.N)]`
  o su equivalente con token; en light el velo debe ser de tinta, no de blanco.

## Técnicas por familia

- **Glow / text-shadow luminoso** → en light: sin glow; usar peso tipográfico,
  color pleno del acento print o subrayado. `text-glow` ya tiene variante light
  (sombra de papel, no luz).
- **Sombras** → dark: negras profundas. Light: `0 1px 2px rgb(20 23 26 / 0.06),
  0 12px 32px rgb(20 23 26 / 0.10)` (contacto + ambiente). Nunca sombras negras
  al 0.3+ sobre marfil.
- **Glassmorphism** → `.glass`, `.glass-pro`, `.glass-card`, `.liquid-glass` ya
  tienen variante light en globals.css (cristal blanco, borde tinta, profundidad
  por sombra). No inventar glass ad-hoc en componentes.
- **Gradientes/scrims `rgba(7,8,9,…)`** → `color-mix(in srgb, var(--color-background) N%, transparent)`.
- **`mix-blend-screen`** (video/imagen que "solo aporta luces") → en light
  `mix-blend-multiply` (solo aporta tintas) + bajar opacidad ~30%.
- **WebGL** → base de partícula por uniform (`uBase`), `AdditiveBlending` en
  dark / `NormalBlending` en light. Acentos de escena mapeados con
  `PRINT_ACCENT` (ver `particleScenes.ts`).

## Cómo leer el tema en JS/React

`useTheme()` de `@/context/ThemeContext` → `{ theme: 'dark' | 'light', setTheme, toggle }`.
Para colores en canvas/WebGL usar los mapas exportados, no `getComputedStyle`.

## Qué NO cambia

- Las imágenes OG (`SocialShareImage`, opengraph/twitter) quedan dark siempre: son la marca.
- El modo default del sitio es dark. Light es elección del visitante (persistida
  en `localStorage['mm-theme']`, anti-FOUC inline en `layout.tsx`).
- `prefers-reduced-motion` y focus visible funcionan igual en ambos temas.

## Checklist de calidad por componente (para cada refinamiento)

- [ ] Cero `#hex`/`rgba()` dark sin gemelo light (buscar `7,8,9`, `#070809`, `#F3F0E8`, `white/`, `black/`, `rgba(0,0,0`).
- [ ] Texto sobre fondo: AA (4.5:1) en ambos temas; texto grande ≥3:1.
- [ ] La jerarquía de profundidad se percibe igual en light (elevación por sombra).
- [ ] Hovers/focus visibles en ambos temas.
- [ ] Sin flash al alternar tema en la página del componente.
