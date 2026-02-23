# Referencia de Diseños Sobrios y Patrones UI
*Extraído de las maquetas de Stitch para futura implementación en Antigravity.*

Este documento recopila los patrones de diseño más limpios, estructurados y "sobrios" encontrados en las maquetas generadas. El objetivo es mantener una estética futurista (Deep Space / Glassmorphism) pero con una usabilidad profesional, ideal para paneles de administración, configuraciones y analíticas.

## 1. Tarjetas de Métricas (Analytics Cards)
Ideales para el Dashboard General y el Panel de SEO. Mantienen la información clara sin abusar de los efectos visuales.

**Características clave:**
- **Fondo:** Glassmorphism sutil (`bg-white/5`, `backdrop-blur-xl`).
- **Bordes:** Finos y semi-transparentes (`border-white/10`).
- **Estructura:** 
  - Título descriptivo en gris (`text-slate-400`, `text-sm`).
  - Valor principal destacado (`text-3xl`, `font-bold`, `text-white`).
  - Badge de tendencia (`bg-emerald-500/10 text-emerald-400` con icono de flecha).
- **Detalle visual:** Mini-gráficos de barras integrados en la base de la tarjeta usando opacidades progresivas (`bg-primary/20` hasta `bg-primary`).

## 2. Tablas de Datos Estructuradas (Data Tracking)
Visto en el "Rastreo de Competidores". Excelente para mostrar listas de clientes, inventario o métricas comparativas.

**Características clave:**
- **Cabecera:** Fondo oscuro sólido (`bg-slate-800/50`), texto en mayúsculas (`text-xs uppercase text-slate-300`).
- **Filas:** Separadores sutiles (`divide-y divide-slate-700/50`) y efecto hover (`hover:bg-slate-800/30`).
- **Visualización de datos:** En lugar de solo números, usar barras de progreso horizontales dentro de las celdas de la tabla para representar porcentajes o autoridad (ej. `w-16 h-1.5 bg-slate-700` con un relleno `bg-blue-500`).

## 3. Formularios y Configuración (Settings & Profile)
Visto en "Identidad Digital IA". Un enfoque muy limpio para la entrada de datos.

**Características clave:**
- **Inputs:** Fondo semi-transparente (`bg-white/5`), bordes sutiles que se iluminan al hacer focus (`focus:ring-2 focus:ring-primary/50`).
- **Iconografía:** Iconos integrados dentro del input a la izquierda (`pl-11` para el texto, icono en posición absoluta).
- **Toggles (Switches):** Diseño personalizado usando la clase `peer` de Tailwind para cambiar el color de fondo al activarse (`peer-checked:bg-primary`).
- **Zonas de Drop (Upload):** Bordes punteados (`border-dashed border-slate-600`) con un hover sutil para indicar interactividad.

## 4. Onboarding y Selección (Radio Cards / Chips)
Visto en la "Guía de Bienvenida". Perfecto para flujos de configuración inicial o selección de servicios.

**Características clave:**
- **Estructura:** Inputs de tipo radio ocultos (`sr-only peer`).
- **Tarjetas:** Contenedores que actúan como labels. Al ser seleccionados (`peer-checked`), cambian su borde al color primario y añaden un fondo muy tenue (`bg-primary/5`).
- **Feedback visual:** Un pequeño círculo con un checkmark (`material-symbols-outlined`) que aparece en la esquina superior derecha mediante una animación de escala (`scale-0 peer-checked:scale-100`).

## 5. Feed de Actividad y Notificaciones (System Feed)
Visto en el "Dashboard General". Útil para historiales de acciones, logs del sistema o actividad de la IA.

**Características clave:**
- **Layout:** Lista vertical simple con espaciado moderado (`space-y-4`).
- **Indicadores de estado:** Pequeños puntos de colores (`size-2 rounded-full`) que representan el tipo de evento. Se les puede añadir un `shadow-[0_0_8px_color]` o `animate-pulse` para eventos críticos o en vivo.
- **Tipografía:** Mensaje principal en blanco/gris claro (`text-slate-300 text-sm`) y el timestamp debajo en un gris más oscuro (`text-slate-500 text-xs`).

## 6. Niveles de Precios / Partners (Tiers)
Visto en "Relaciones con Inversores". Diseño jerárquico claro para suscripciones o roles.

**Características clave:**
- **Diferenciación visual:** El plan intermedio/recomendado (ej. "Oro") tiene bordes y sombras de un color distinto (ej. `border-yellow-500/30`) y un elemento decorativo de fondo para destacarlo del resto.
- **Listas de features:** Iconos de check (`check_circle`) alineados a la izquierda con el texto en un color secundario (`text-slate-300`).

---
*Nota para el desarrollo:* Estos patrones priorizan la legibilidad y la jerarquía de la información. Al implementarlos en React/Next.js, encapsularemos estos comportamientos en componentes reutilizables (ej. `<MetricCard />`, `<RadioCard />`, `<ActivityFeed />`) usando Shadcn/UI como base y extendiendo sus estilos con las utilidades de Tailwind definidas en nuestro `globals.css`.
