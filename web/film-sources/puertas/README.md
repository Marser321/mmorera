# Planos de los films de las puertas (home, escena 02)

Los usa `npx tsx scripts/render-doors.ts`. Son recortes exactos de cinemáticas que ya existían, a 24 cuadros por segundo y sin cuadros repetidos. El reloj y el encuadre de cada uno están en `src/components/films/puertas/timing.ts`.

**Un color por puerta** (Mario, 16/11: «armonizar es transmitir»). Cada film sale de un proyecto que destaca por su color, y ninguno se repite.

| Puerta | Color | Archivo | Origen | Cuadros del original |
| --- | --- | --- | --- | --- |
| 01 Webs | Azul | `webs-0`, `webs-1` | Video de portada de L&B (`l-b-five.vercel.app/assets/video/hero-desktop.mp4`), sin sus cuadros repetidos | 36–103 y 96–235 de los 240 únicos |
| 01 Webs | | `webs-ui-hero.jpg`, `webs-ui-cotizador.jpg` | Capturas del sitio de L&B a 2×, reducidas a 1600×1000 | Portada y `#quoter` |
| 02 Agentes | Dorado | `agentes-0`, `agentes-1` | Cinemática de barbería de Oficio (`lava`: `apps/admin/public/brand/barber/film/film-16x9.mp4`) | 122–189 y 272–411 |
| 03 Sistemas | Verde | `sistemas-0`, `sistemas-1` | Escenas de te_Cargo (`tecargo/presentation/incoming/bodega-wide.mp4` y `bodega-detail.mp4`) | 4–71 y 2–141 |
| 04 Contenido | Coral | `contenido-0`, `contenido-1` | Escenas de Vespera, generadas con IA (`viajes-demo/public/media/flow/v1/airplane-16x9.mp4` y `arr-venice-16x9.mp4`) | 38–105 y 2–141 |

Notas:
- El plano 0 de cada puerta trae 8 cuadros de entrada: se funden sobre el final del film para que se repita sin salto.
- En `webs`, los dos planos son tramos seguidos de la misma toma, así que el fundido entre ellos no se ve.
- Ningún plano muestra caras. En la barbería se ve a una persona de espaldas.
- Para cambiar un plano: recortar con `ffmpeg -vf "select='between(n\,A\,B)',setpts=N/24/TB" -r 24`, actualizar `frames` en `timing.ts` y borrar su carpeta en `public/render-cache/puertas/`.
