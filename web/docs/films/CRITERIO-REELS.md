# Criterio de los reels de cada caso (16/11/2026)

El reel es lo que se ve unos segundos al pasar el mouse por un caso en la home
y en las tarjetas. Mario pidió que sea dinámico, fluido y claro, «no tan slop,
con un poco más de criterio». Esto es lo que quedó.

## Qué muestra

- **Tres planos, unos 6 s**, unidos con fundidos de 0,4 s. Sin scroll de páginas
  con texto chico: a 460 px no se lee y tiembla.
- **Primero el cine:** si el sitio tiene video propio (Truckers, L&B, Rangel,
  Mr. Studio) o el caso tiene film (Fenix, te_Cargo, Oficio), ese clip abre el reel.
- **Después la interfaz:** una pantalla clave capturada a 2× (2560×1600), con un
  acercamiento lento.
- **Sin caras de personas** ni pop-ups. Arte de tatuaje, manos con guantes y
  espaldas sí.

## Cómo se arma (scripts/montaje-reel.sh)

- **Clips:** se sacan los cuadros repetidos que traen los videos generados
  (`mpdecimate`) y se re-temporiza a 30 cps parejos. Nunca acelerar y forzar
  cuadros por segundo: eso descarta o repite cuadros y se ve a saltos.
- **Capturas:** el acercamiento crece exactamente lo mismo en cada cuadro
  (base 8×, +8/+5 px por cuadro). Con tamaños redondeados el paso alterna y tiembla.
- **Salida:** H.264 CRF 20 y AV1 CRF 32, 1280×800, 30 cps. Con CRF 40 el texto
  en movimiento se manchaba.
- **Control:** medir la diferencia entre cuadros del WebM. Cero cuadros
  congelados en movimiento y pasos parejos.

## La ventana flotante (ProjectIndex)

Inclinación máxima de 3° con un resorte amortiguado. Con 9° el video rotado
titilaba al mover el mouse.

## Las puertas de servicio del home (escena 02)

Mario pidió que las cuatro puertas se vean parejas, con el estilo de la primera (el lavado de L&B a sangre), y después que cada una tenga su color: «armonizar es transmitir».

- **Los cuatro films se hacen en Remotion** (`src/components/films/puertas/`, `scripts/render-doors.ts`), con el mismo criterio de arriba: unos tres segundos de cine puro y después la interfaz.
- **Un color por puerta, de un proyecto que destaque por ese color:** azul (L&B), dorado (la barbería de Oficio), verde (te_Cargo) y coral (Vespera). No repetir material de un mismo proyecto en dos puertas: tres puertas doradas contra una azul se leían desparejas.
- **La interfaz va en la columna central** (500 px de un film de 1200): en pantallas de 1024 px la puerta abierta muestra menos de la mitad del ancho.
- **4:3 y sujeto arriba:** la puerta abierta mide entre 0,6 y 1,1 de ancho por alto y su mitad de abajo lleva el título.
- **Puerta cerrada = póster de cine puro.** Si quedara congelada en el cuadro donde se pausó, se verían textos cortados.
- **El color de la puerta** (`tone` en `timing.ts`) pinta también la línea sobre el título, la barra de avance y el punto de la lista del teléfono.
- Los planos de origen y sus cuadros exactos están en `film-sources/puertas/README.md`.

