---
name: web-artifacts-builder
description: "Habilidad para construir componentes web asombrosos y artefactos UI complejos utilizando React (Next.js App Router), Tailwind CSS y Shadcn/UI."
---

# Goal
Crear componentes funcionales de React modulares, escalables, con un diseño premium y de alta disponibilidad, estructurando el código para evitar deudas técnicas y garantizando el alto rendimiento interactivo.

# Instructions
1. **Andamiaje del Componente**: Utilizar Next.js 15 (App Router). Definir componentes funcionales en React empleando TypeScript u orientando fuertemente el tipado de props. Mantener separación entre "Server Components" y "Client Components" (`"use client"` sólo cuando sea necesario manejar estado o interactividad visual profunda).
2. **Estilizado Consistente**: Emplear Tailwind CSS. Implementar variables CSS semánticas (ej: `bg-background`, `text-primary`, o colores definidos en `tailwind.config.ts`) en lugar de colores o medidas hardcodeadas.
3. **Manejo de UI Compleja (Shadcn/UI)**: Extender e integrar los componentes de Shadcn/UI según el diseño oscuro y elegante que se requiera. Usar `clsx` y `tailwind-merge` para componer clases dinámicas de Tailwind de manera limpia.
4. **Resiliencia de Datos (Alta Disponibilidad)**: Cuando el componente interactúa con backend (ej: Supabase para citas/horarios), asegurar un manejo pulido de los estados de carga (Loaders visualmente agradables) y de error. Prevenir flujos de interacción que puedan causar conflictos (ej: deshabilitar botones al enviar formulario para evitar doble carga).
5. **Mobile-First & Accesibilidad**: Validar que todo el UI sea operable vía "touch" sin frustración. Usar flex/grid pensando primero en columnas verticales para móvil antes de saltar a configuraciones `md:` o `lg:`.

# Constraints
- Todo el código, razonamiento y comentarios dentro de la arquitectura técnica deben estar en Español Rioplatense/Latino.
- Prohibido el uso de librerías de componentes complejas en desuso; atarse fuertemente a Tailwind CSS y componentes primitivos modulares para reducir el bundle de JavaScript.
- Nunca romper la regla del "Dark Mode" por defecto o del enfoque "Mobile-First".
