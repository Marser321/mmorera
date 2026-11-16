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

## El tráiler de un caso (Vespera)

Mario pidió que la demo de agencia de viajes tenga protagonismo, sobre todo por sus detalles cinemáticos: la ventanilla, el avión que viaja, los destinos que entran y las transiciones con el avión.

- **El caso abre con su tráiler**, a todo el ancho y antes de la ficha (`trailer` en `projectCases.ts`, `CaseTrailer.tsx`). Se reproduce solo mientras se ve, sin sonido, y se puede pausar.
- **Se hace en Remotion** con los clips de la demo (`src/components/films/vespera/`, `scripts/render-vespera.ts`), a sus 24 cuadros por segundo y sin acelerar nada.
- **El avión cenital es la transición:** cruza a velocidad pareja y la ciudad que sigue aparece por detrás de sus alas.
- **Sin frases:** nombres en su idioma, códigos y números. Un solo render sirve para los dos idiomas.
- **El reel de la tarjeta** es un corte de seis segundos de las mismas escenas.
- Los planos de origen están en `film-sources/vespera/README.md`.
