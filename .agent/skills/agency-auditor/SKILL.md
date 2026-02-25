---
name: agency-auditor
description: "Habilidad recurrente de Auditoría Experta para landing pages de agencias de IA/automatización. Se activa con 'Auditar la landing page', 'Revisar la web de la agencia' o 'Optimizar el catálogo de servicios'. Diseñada para ejecutarse periódicamente e ir mejorando la app."
---

# Goal
Realizar una auditoría integral de la landing page de la agencia (NEXO / MMORERA) evaluando tres dimensiones: **UX/UI y Conversión**, **Catálogo de Servicios Premium** y **Modelo de Negocio "Enseñar a Pescar"**. El resultado es un informe accionable con mejoras priorizadas y preguntas estratégicas para refinar continuamente la app.

# Instructions

## Fase 1: Recopilación y Contexto
1. Leer el archivo `page.tsx` principal para entender el flujo actual de secciones.
2. Listar todos los componentes en `src/components/sections/` y `src/components/interactive/`.
3. Si existe un archivo de estilos globales (`globals.css`), leerlo para entender la paleta de colores y tipografía.
4. Consultar la skill `ui-ux-pro-max` para verificar alineación con los estándares estéticos.

## Fase 2: Auditoría UX/UI y Conversión
5. **Jerarquía Visual y Legibilidad**: Evaluar espacio en blanco, consistencia de fuentes y si el diseño guía hacia la conversión. Revisar cada sección del Hero al Footer.
6. **Claridad del Mensaje**: Verificar que la propuesta de valor sea evidente en la primera sección (Hero). Detectar puntos de fricción que maten la conversión.
7. **Llamados a la Acción (CTAs)**: Evaluar si son prominentes, claros y están bien ubicados. Verificar contraste, tamaño y urgencia.
8. **Mobile-First**: Dado que el 80%+ del tráfico es móvil, auditar la experiencia táctil: tamaños de botones (44px+), scroll, carga, y navegación thumb-zone.
9. Documentar hallazgos con severidad (🔴 Crítico, 🟡 Mejora, 🟢 OK).

## Fase 3: Auditoría del Catálogo de Servicios (Framework Premium)
10. Verificar que el catálogo incluya estos niveles de servicio:
    - **Lead Magnets Interactivos** (Primera Etapa): Mini-apps gratuitas como calculadoras de ROI o calificadores de leads usando herramientas no-code.
    - **Servicios "Caballo de Troya"**: Automatizaciones de bajo costo y cero fricción (centralización de facturas con OCR vía Telegram, recordatorios de citas por WhatsApp).
    - **Arquitectura 80/20 en n8n**: Verificar que el desarrollo técnico no se sobrecomplique y se base en los 15 nodos fundamentales.
    - **Sistemas de Alto Valor**: Para clientes corporativos, sistemas RAG que se actualizan solos (bases de conocimiento con sanitización de datos).
    - **Velocidad de Implementación**: Metodologías ágiles para desplegar infraestructuras y cerrar ventas en <20 minutos.
11. Comparar contra los componentes existentes (`ServicesCatalog`, `PricingSection`, `ROICalculator`) y sugerir ajustes.

## Fase 4: Modelo de Negocio "Enseñar a Pescar"
12. Verificar que la sección de precios (`PricingSection`) incluya:
    - **Planes Flexibles**: Opciones de pago trimestral, semestral y anual con beneficios progresivos.
    - **Filosofía "Enseñar a Pescar"**: Periodo de prueba/capacitación de 3-6 meses donde la agencia construye el sistema Y capacita al personal del cliente.
    - **Beneficio Percibido**: Copys persuasivos destacando que "la empresa se queda con las herramientas y el conocimiento".
13. Proponer textos de copy alternativos si los actuales no comunican este modelo.

## Fase 5: Generación del Informe
14. Compilar todos los hallazgos en un informe estructurado con:
    - Puntaje general (de 1 a 10) por dimensión.
    - Top 5 mejoras de mayor impacto priorizadas.
    - Código sugerido para las 2-3 mejoras más urgentes.
15. Terminar con 2-3 preguntas estratégicas para el usuario:
    - Ej: "¿Querés que profundice en la estructura de precios de los planes trimestrales?"
    - Ej: "¿Necesitás copys persuasivos para vender la capacitación de 6 meses?"
    - Ej: "¿Te gustaría que evalúe cómo integrar un Lead Magnet interactivo en tu landing actual?"

## Fase 6: Modo Recurrente
16. Al finalizar cada auditoría, actualizar un archivo de historial en `.agent/skills/agency-auditor/audit-history.md` con:
    - Fecha de auditoría.
    - Puntaje por dimensión.
    - Top mejoras implementadas y pendientes.
17. En la próxima ejecución, leer el historial para comparar progreso y evitar repetir sugerencias ya implementadas.

# Constraints
- Nunca modificar código directamente sin confirmación del usuario. La auditoría es consultiva.
- Siempre priorizar Mobile-First en las recomendaciones.
- El idioma de todo el informe debe ser Español Rioplatense/Latino.
- No sobresimplificar los diagnósticos: cada hallazgo debe tener contexto y justificación.
- Mantener alineación con la estética "Deep Space" / Dark Mode premium definida en `ui-ux-pro-max`.
- Las sugerencias de copy deben ser persuasivas, transparentes y orientadas a la filosofía "Enseñar a Pescar" (no crear dependencia).
- Cada auditoría debe ser documentada en el historial para permitir seguimiento de progreso.
