# Dossier · AutoHub 360

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://auto-indol-five.vercel.app/`.
> - Lectura del HTML servido, de su CSS compilado (`_next/static/chunks/*.css`) y paquetes JavaScript públicos.
> - Recorrido en solo lectura: el navegador bloqueó todo pedido que no fuera GET. No se enviaron formularios ni se iniciaron sesiones.
>
> **Cliente:** AutoHub: plataforma y concesionaria digital para agencias y automotoras que exhibe vehículos con visualización panorámica 360°, tasación de permutas y gestión operativa.
>
> **Fuente local y notas:** sin repositorio local disponible. Se verificó contra el sitio publicado en Vercel y notas de `Freelance-KB/projects/autohub-360.md`.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (CSS servido en `:root` y clases compiladas de Tailwind):
  - Fondo ultra oscuro `#020617` (`--background` en `:root`).
  - Superficie oscura `#0F172A` (`--surface` en paneles y tarjetas).
  - Superficie elevada `#1E293B` (`--surface-secondary` y borde elevado).
  - Líneas y separadores `#334155` (`--surface-tertiary` y `border-white/5`).
  - Texto principal `#F8FAFC` (`--foreground: #f8fafc`); texto secundario `#94A3B8` (`--muted: #94a3b8`).
  - Acento rojo primario `#DC2626` (`--brand-primary: 220 38 38`).
  - Acento suave `#EF4444` y profundo `#991B1B`.
  - Texto sobre acento `#FFFFFF`.
- **Tipografía:** Inter (`--ff-brand-inter`, interfaz técnica, títulos y catálogo).
- **Logo:**
  - Isotipo (`mark.png`): 600×600 px, PNG con canal alfa (tipo 6), squircle rojo `#DC2626` con silueta de automóvil en blanco trazada en líneas vectoriales.
  - Wordmark (`wordmark.png`): 600×140 px, texto "AutoHub" con "Auto" en blanco y "Hub" en rojo `#DC2626`.

---

## 2. Lo que muestra el sitio en vivo

- **Hero principal (`/`):** "Tu próximo auto te espera acá" con fondo oscuro, gradiente radial rojo y acceso directo al catálogo de unidades.
- **Catálogo de vehículos (`/catalogo`):** buscador por marca, modelo y año, selector de favoritos y grilla con 15 unidades disponibles con distintivos "360", "CERTIFICADO" y "GARANTIA 12M".
- **Ficha detallada del vehículo (`/catalogo/demo-1`):** ficha del Volkswagen Golf Trendline 1.6 con galería fotográfica, especificaciones técnicas completas, simulador de cuotas de financiamiento y botón destacado "Tour Interior 360°".
- **Visor panorámico Three.js (`/catalogo/demo-1`):** visor esférico equirectangular interactivo en WebGL con 8 puntos de interés rotulados sobre el habitáculo del vehículo.
- **Servicios VIP (`/servicios`):** producción de contenido digital para agencias con 3 líneas: Fotografía Profesional, Tour Interior 360° y Video Reels & Short-form.
- **Central de operaciones (`/admin`):** panel administrativo con 4 módulos de gestión (Inventario de Vehículos, Clientes CRM, Taller & Services, Facturación & Pagos), estado operativo del taller y registro de actividad comercial.

---

## 3. Catálogo y cifras verificadas

### 15 unidades en catálogo (`/catalogo`)
El encabezado del catálogo publicado declara: "Encontrá el vehículo perfecto entre nuestras 15 unidades disponibles", con 15 tarjetas interactivas de vehículos disponibles para consulta.

### 8 puntos de interés en el visor 360° (`/catalogo/demo-1`)
El botón de apertura del visor declara "Tour Interior 360° • 8 puntos de interés • Materiales • Equipamiento". El visor despliega 8 marcadores clasificados:
1. Cuero Nappa Premium (tipo: material, yaw: 0, pitch: 0)
2. Pantalla MBUX 12.3" (tipo: luxury, yaw: 45, pitch: 10)
3. Molduras de Aluminio Cepillado (tipo: material, yaw: 90, pitch: -5)
4. Iluminación Ambiental 64 Colores (tipo: luxury, yaw: 135, pitch: 15)
5. Fibra de Carbono AMG (tipo: material, yaw: 180, pitch: -10)
6. Volante Deportivo AMG (tipo: feature, yaw: 225, pitch: 5)
7. Techo Panorámico de Cristal (tipo: luxury, yaw: 270, pitch: 20)
8. Parlantes Burmester® (tipo: feature, yaw: 315, pitch: -15)

### 110 puntos verificados en inspección (`/catalogo/demo-1`)
En la sección "Garantia e inspeccion" de la ficha técnica se certifica: "Inspeccion multipunto con reporte digital y garantia mecanica basica. 110 puntos verificados".

### 4 módulos de gestión operativa (`/admin`)
En la central de operaciones se encuentran 4 módulos administrativos organizados:
1. Inventario de Vehículos
2. Clientes (CRM)
3. Taller & Services
4. Facturación & Pagos

### 3 servicios de producción digital (`/servicios`)
En la página de servicios para concesionarias se ofrecen 3 servicios de digitalización:
1. Fotografía Profesional
2. Tour Interior 360°
3. Video Reels & Short-form

### 64 colores de iluminación ambiental (`/catalogo/demo-1`)
El punto de interés número 4 del tour 360 documenta: "Iluminación Ambiental 64 Colores: Sistema de iluminación ambiental con 64 colores seleccionables y 10 programas de color".

---

## 4. Decisiones de portfolio

- **Se cuenta lo construido:** se muestra el catálogo interactivo, la experiencia esférica WebGL con Three.js, la navegación entre vehículos y la arquitectura de panel de gestión.
- **Datos de ejemplo:** los vehículos y valores expuestos corresponden a inventario demo configurado para ilustrar el funcionamiento de la concesionaria digital.
- **Sin resultados comerciales inventados:** no se atribuyen incrementos de ventas, porcentajes de conversión ni métricas financieras que no pertenezcan al desarrollo del software.
