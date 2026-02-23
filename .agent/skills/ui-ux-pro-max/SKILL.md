---
name: ui-ux-pro-max
description: "Habilidad base para mantener la estética 'Deep Space' y/o diseño oscuro elegante (Dark Mode masculino y moderno) junto con esquemas de color y tipografía consistentes en los proyectos."
---

# Goal
Garantizar que toda la interfaz de usuario y el diseño (UI/UX) sigan una estética premium "Dark Mode" elegante, masculina y tecnológica (como "Deep Space" o diseño para barberías modernas), utilizando Next.js 15, Tailwind CSS y Shadcn/UI.

# Instructions
1. **Esquema de Color**: Implementar un diseño "Dark Mode" por defecto. Usar paletas de colores profundas (ej:, Charcoal, Negro, Blanco puro para contrastes, y acentos neón discretos o metálicos) para mantener la elegancia.
2. **Tipografía**: Utilizar fuentes modernas (ej: Inter, Roboto, Outfit). Asegurar que los encabezados tengan una tipografía audaz y legible. Escalar la tipografía adecuadamente usando enfoques responsivos.
3. **Estética**: Emplear fondos atmosféricos, sutiles efectos de "glassmorphism" en elementos sobrepuestos (como navbars o modales), y evitar lo genérico.
4. **Mobile-First**: Dado que los clientes usan en su gran mayoría dispositivos móviles, la interfaz móvil es la prioridad absoluta ("Thumb Zone" navigation adaptada, elementos táctiles de tamaño apropiado 44px+).
5. **Efectos Premium y Dinámicos ("Everything Reacts")**: Agregar retroalimentación táctil, estados de hover claros en desktop y de active en mobile, profundidad visual y micro-animaciones (movimientos suaves, destellos sutiles) utilizando Tailwind en lugar de librerías pesadas cuando sea posible.

# Constraints
- Nunca usar un fondo blanco brillante; siempre forzar el modo oscuro (Dark Mode).
- No utilizar colores genéricos básicos (rojo puro, azul puro sin ajustes de saturación/luminosidad).
- Mantener el diseño elegante, masculino, moderno y que se sienta "caro".
- Diseñar primero siempre pensando en la vista móvil antes de expandir a escritorio.
