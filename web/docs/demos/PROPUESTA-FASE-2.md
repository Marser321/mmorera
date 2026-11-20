# /demos · Fase 2: escenas, adelantos y film de lanzamiento

Propuesta para revisar con Mario. No hay nada de esto construido todavía, salvo lo marcado como «ya está».

## Lo que ya está (fase 1)

- **`/demos`:** la portada, con una puerta por rubro. La puerta de gimnasios corre el adelanto al pasar el mouse.
- **`/demos/gimnasios`:** la edición premium, con cuatro tiempos:
  1. qué es, con el adelanto del film;
  2. las cuatro escenas (panel, app del socio, app del entrenador y web), con un clip que corre al pasar el mouse y que en el celular corre cuando la tarjeta queda a la vista;
  3. la demo embebida, en un marco con pestañas por escena, reinicio y pantalla completa (sobre toda la ventana, también en el teléfono);
  4. el cierre con Mario: WhatsApp con el origen en el texto, y el brief.
- **`/demos/consulta`:** la misma casa con el vocabulario de consulta (cliente, sesión, profesional), marcada como versión previa porque los datos de ejemplo siguen siendo de gimnasio.
- **El enlace de la app nunca aparece en el texto.** El marco carga solo cuando el visitante entra, y le pasa a la demo la marca de ejemplo (Atelier o Clínica Aura) y el rubro.
- **Origen de cada visita:** `?de=` queda registrado. Ver [REGISTRO-DE-VISITAS.md](REGISTRO-DE-VISITAS.md).
- **Fuera de los buscadores** (`noindex`) y fuera del menú, mientras se presentan a mano.

Los clips (`public/demos/gimnasios/`) se grabaron de la demo publicada con la marca Atelier. Pesan entre 80 y 540 KB cada uno, en MP4 H.264.

## Escenas: la página como un recorrido

La idea es que cada escena sea un capítulo corto y no una tarjeta, siguiendo el «reestructurar, no recortar»: más tramos cortos con una sola idea cada uno.

| # | Escena | Gesto central | Adelanto (4–6 s) |
|---|---|---|---|
| 1 | **El panel** | «Próxima llegada 12 min» baja a 0 y Elena aparece en la sala | Barras que crecen, anillo que se completa, la llegada |
| 2 | **La app del socio** | Mantener para confirmar → sello | Elige jueves, Pol, 13:00, mantiene y sale el sello |
| 3 | **La app del entrenador** | La ficha se abre y las series se marcan 1-2-3-4 | Marta llegó → ficha → series |
| 4 | **La web del negocio** | El parallax de la sala, de día a noche | La luz cruza la cal, se enciende la lámpara |
| 5 | **Tu marca** (nueva) | El monograma, el color y las palabras cambian solos | A → CA, nogal → salvia, «socio» → «cliente» |

Cómo se arma cada capítulo:
- A la izquierda, una línea y tres microgestos. A la derecha, el dispositivo en su marco.
- Al entrar en pantalla, el dispositivo sube 24 px y aparece, una sola vez. Solo `transform` y `opacity`.
- «Probar esta escena» abre el marco de la demo en ese recorrido, igual que hoy.

## Adelantos al pasar el mouse

**Con mouse:**
- El clip arranca a los 120 ms de quedarse encima, para que pasar de largo no lo dispare.
- La tarjeta se inclina 2° hacia el puntero (perspectiva fija, sin seguirlo cuadro a cuadro) y sube 4 px.
- Un anillo marca dónde ocurre el toque del clip (el botón «Mostrar pase», el día jueves…). Se sincroniza con marcas de tiempo por clip en `data/demos.ts`.
- Al salir, el clip se funde al póster en 300 ms y vuelve a cero.
- La etiqueta del cursor del sitio (`CursorLabel`) dice «Probar».

**En el teléfono:**
- El clip corre cuando la tarjeta está al 80 % a la vista. Corre uno solo a la vez.
- Un toque abre esa escena en el marco; el riel de escenas se puede deslizar de lado con *scroll snap*.
- Con «reducir movimiento», solo pósters.

**Presupuesto de rendimiento** (para su Snapdragon con Adreno):
- Un solo video decodificando a la vez.
- Clips de 960 px a ≤ 600 KB, con `preload="none"`.
- El marco de la demo carga solo a pedido.
- Nada de WebGL ni de `blur` en contenedores grandes.
- Se mide con Playwright `channel: 'chromium'` (GPU real), con el método A-B-B-A de las rondas de la premium: cuadros perdidos al pasar el mouse por las cuatro tarjetas y al abrir el marco.

## El film de lanzamiento

Va en el lugar del adelanto, arriba a la derecha:
- en escritorio, 16:9 mudo en bucle, con un botón «Ver con sonido» que lo abre a pantalla completa;
- en el celular, la versión 9:16.

El guion completo y el plan de tomas están en `mmorera-films/src/premium/GUION.md`, para revisar **antes de renderizar**. Lo central:

- **«La casa, en cada pantalla»**, unos 62 s en 16:9 y 9:16, con narrador y música.
- **Ocho tiempos:** silencio → llegada → la casa lo sabe (la sorpresa: el pase viaja del teléfono a la tableta y al panel) → el panel → reservar es un gesto → el entrenador → tu marca (segunda sorpresa: nombre, color y palabras cambian solos) → la web → cierre.
- **Material existente:** los planos de Flow de la v6 (`E:\medios\premium-v6\cine`: la luz, la llegada, la noche y el silencio), las grabaciones de `E:\Lavadero\artifacts\612\video` y las capturas nuevas de la demo con la marca Atelier.
- **Voz:** Raymond, como en los films anteriores (alternativa: Conchi, en castellano). Antes de generarla hay que mirar los créditos que quedan en ElevenLabs.
- **Disco:** C: tiene unos 15 GB libres. Cada render deja el paquete y el perfil de Chrome en TEMP: limpiar antes y sacar la salida a `E:\medios`.

## Decisiones para Mario

1. **Marcas de ejemplo:** «Atelier» (gimnasios) y «Clínica Aura» (consulta). El perfil del cliente de Barcelona sigue con «Nombre»; esto vive solo en las demos de la web.
2. **Tabla `demo_visitas`** en InsForge: crearla con el SQL de REGISTRO-DE-VISITAS.md.
3. **Menú y buscadores:** dejar /demos fuera del menú y con `noindex` mientras se presentan a mano, o sumarla al menú «Servicios».
4. **Consulta:** necesita datos de ejemplo propios en la premium (clientes, tratamientos, profesionales) y una web con imágenes de clínica. Es trabajo en Lava, aparte de este PR.
5. **Versión en inglés** (`/en/demos`): conviene cuando el film esté listo.
6. **Oficio** como tercera puerta (oficios y servicios), con su demo embebida igual que la premium.
