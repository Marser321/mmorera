# Planos del tráiler y el reel de Vespera

Los usa `npx tsx scripts/render-vespera.ts`. Son los clips de la demo de agencia de viajes (`viajes-demo/public/media/flow/v1/*-16x9.mp4`), tal cual: 1280×720, 144 cuadros a 24 por segundo y sin cuadros repetidos. El reloj de cada escena está en `src/components/films/vespera/timing.ts`.

Todas las escenas son generadas con IA. No hay personas reales.

| Archivo | Qué es | Cuadros que usa el tráiler |
| --- | --- | --- |
| `window.mp4` | La ventanilla y el ala, hasta entrar en la nube | 52–139 |
| `airplane.mp4` | El avión de perfil sobre el mar de nubes | 14–113 |
| `arr-venice.mp4` | El campanario que asoma entre nubes rosadas | 36–107 |
| `venice.mp4` | El Gran Canal desde la lancha | 24–125 |
| `arr-paris.mp4` | La torre Eiffel sobre las nubes al atardecer | 40–99 |
| `paris.mp4` | El Sena con la torre al fondo | 24–125 |
| `arr-granada.mp4` | La colina de la Alhambra entre nubes | 40–99 |
| `granada.mp4` | El patio del palacio de Carlos V | 24–125 |
| `plane-top.webp` | El avión visto desde arriba (`flow/v1/plane/plane-top-lg.webp`) | La transición entre ciudades |
| `fonts/` | Cormorant y Plus Jakarta Sans, las fuentes de la demo (licencia OFL, incluida) | Tarjetas, sellos y pasaje |

Notas:
- Nunca se acelera un clip: un cuadro del film es un cuadro del clip.
- El avión cenital cruza a velocidad pareja y la escena nueva aparece por detrás de sus alas (`PLANE` en `timing.ts`, con las medidas de `plane-top.json` de la demo).
- El tráiler no lleva frases: los nombres van en su idioma (Venezia, Paris, Granada) y lo demás son códigos y números. Un solo render sirve para español e inglés.
- El reel de la tarjeta del caso es un corte de seis segundos de las mismas escenas, en 16:10.
