---
name: cyclic-multiagent-auditor
description: "Habilidad recurrente de Auditoría Cíclica Multi-Agente para identificar deficiencias en UX/UI, Conversión B2B, SEO, Accesibilidad, Performance, Deuda Técnica y cumplimiento de InsForge. Se activa con 'Lanzar auditoría cíclica', 'Ejecutar auditoría multi-agente' o 'Iniciar escaneo de deficiencias'."
---

# Goal
Realizar una auditoría integral, cíclica y masiva de la plataforma web de la agencia mediante la simulación de múltiples perspectivas de agentes auditores especializados. El resultado es un reporte unificado de deficiencias, asignación de severidad (Crítico, Mejora, OK), sugerencia de soluciones de código y registro en el historial para evitar regresiones.

# Instructions

## Fase 1: Recopilación y Ejecución del Análisis Estático
1. Ejecutar el comando de análisis estático del proyecto:
   ```bash
   npm run --prefix web audit:multiagent
   ```
2. Leer la salida del script y revisar los componentes que presenten fallos o advertencias técnicas.
3. Leer los archivos principales de configuración de la app (`next.config.ts`, `tailwind.config.ts`, `globals.css` u homólogos) para validar el diseño del sistema.

## Fase 2: Simulación de Agentes Especializados

### 1. Agente UX/UI (Perspectiva Estética)
- **Consistencia Visual:** Evaluar que todas las interfaces cumplan con el modo oscuro "Deep Space" de la agencia, evitando colores primarios planos e inarmónicos y promoviendo el uso de degradados suaves, tipografía Outfit/Inter y sutiles micro-animaciones.
- **Mobile-First:** Verificar que los elementos interactivos tengan al menos 44px de tamaño, y que las secciones críticas estén posicionadas para facilidad de uso táctil (thumb-zone).

### 2. Agente de Copys y Conversión B2B
- **Claridad de Propuesta de Valor:** Revisar el Hero y subpáginas. ¿Se entiende de inmediato qué hace la agencia y qué ROI operativo promete?
- **Modelo "Enseñar a Pescar":** Comprobar que en la sección de precios y copys se resalte que el cliente adquiere el conocimiento y las herramientas sin crear dependencia a largo plazo.
- **CTAs:** Comprobar la visibilidad, contraste, y que no existan enlaces rotos o sin definir (`href="#"`).

### 3. Agente SEO y Semántica
- **Jerarquía:** Validar la existencia de un solo `<h1>` por página y el uso adecuado de títulos (`<h2>`, `<h3>`).
- **Metadatos:** Inspeccionar que cada página de ruta tenga etiquetas de título y descripción únicas.
- **Unique IDs:** Asegurar que los componentes principales posean IDs descriptivos y únicos para pruebas automatizadas.

### 4. Agente de Accesibilidad (a11y)
- **Estándar WCAG 2.2:** Validar que los contrastes de texto/fondo sean legibles (mínimo 4.5:1), que los inputs tengan etiquetas visibles y que toda acción sea ejecutable mediante teclado.
- **Atributos:** Verificar la presencia de atributos `alt` en imágenes y descripciones accesibles en botones interactivos.

### 5. Agente de Rendimiento y Core Web Vitals (CWV)
- **Optimización de Media:** Asegurar el uso de componentes eficientes como `next/image` en lugar de etiquetas `<img>` desoptimizadas.
- **Carga Diferida:** Evaluar el uso de lazy loading o dynamic imports en componentes no críticos (por ejemplo, evitar importar la librería `mermaid` en páginas de cara al usuario final si no es estrictamente necesario).

### 6. Agente de Deuda Técnica y Cumplimiento del SDK InsForge
- **Deuda Técnica:** Buscar usos excesivos de `@ts-ignore`, variables no tipadas y archivos huérfanos o redundantes en la estructura del código.
- **Validación del SDK de InsForge:**
  - Garantizar que todas las operaciones de base de datos utilicen el formato de arreglo requerido para inserciones (`[{...}]`).
  - Verificar que el cliente de InsForge se instale e inicialice de forma correcta empleando las variables de entorno oficiales pre-configuradas.

## Fase 3: Compilación y Registro de Resultados
1. Recopilar todos los hallazgos en un informe unificado.
2. Actualizar el historial de auditoría en `.agent/skills/cyclic-multiagent-auditor/multiagent-audit-history.md`.
3. Proponer al usuario las soluciones de código exactas para las 3 deficiencias de mayor impacto detectadas.

# Constraints
- Las auditorías son informativas; no modificar código de la app de forma directa sin la aprobación explícita del usuario.
- Toda la comunicación e informe debe ser en Español Rioplatense/Latino.
- Mantener siempre alineación con las guías estéticas de `ui-ux-pro-max` y las directrices de datos del SDK de InsForge.
