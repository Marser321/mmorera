# Dossier · América Trámites

> **Estado:** verificado el 2026-10-07 contra el sitio publicado en `https://atreact.vercel.app/` y el repositorio local `Desktop\temp_atreact`.
> - Lectura del HTML servido, de su CSS compilado (`/assets/index-44aAmVww.css`) y paquetes JavaScript públicos.
> - Recorrido en solo lectura: el navegador bloqueó todo pedido que no fuera GET. El formulario de contacto se capturó vacío.
>
> **Cliente:** América Trámites: servicios educativos y de asistencia administrativa para organizar y preparar documentos para la comunidad hispana (Miami Gardens, FL).
>
> **Fuente local y aclaración con el portfolio:** el portfolio anterior (`projectCases.ts`) catalogaba el proyecto como "formularios guiados para procesos consulares con documentación y carga de documentos por etapas". La inspección del sitio en vivo y del código fuente confirma que se trata de un portal bilingüe/hispano de asistencia administrativa con un clasificador interactivo de intenciones, catálogo de trámites por familias, centro educativo con microguías y un formulario contextual de contacto. No existe subida de archivos ni backend de tramitación consular. El film cuenta lo que el sitio efectivamente publica.

---

## 1. Identidad (CSS servido)

- **Colores que pinta el sitio** (clases compiladas y variables en `:root`):
  - Fondo oscuro `#050B14` (`--color-bg-dark`).
  - Superficies oscuras `#0A1322` (`--color-bg-dark-soft`).
  - Superficie elevada `#0D192C` (`--color-surface-dark-elevated`).
  - Líneas y bordes `#1E293B` (`--color-border-dark`).
  - Texto principal `#F8FAFC` (`--color-text-on-dark`); secundario `#94A3B8` / `#CBD5E1`.
  - Acento rojo de acción `#BE0000` (`--color-brand-red`, botones y llamadas de acción).
  - Acento suave `#DC2626` y profundo `#990000` (hover de botones).
  - Azul institucional `#000B6B` (`--color-brand-blue`, utilizado en el logo y detalles).
  - Texto sobre acento `#FFFFFF`.
- **Tipografía:** fuente del sistema `system-ui, -apple-system, sans-serif` en `:root`, mapeada a Montserrat (display) e Inter (cuerpo) en las composiciones de film.
- **Logo:** `CeoLogo` compilado en `App.tsx`.
  - Isotipo (`mark.png`): 600×600 px, PNG con canal alfa (tipo 6), cinta azul `#000B6B` con polígono rojo `#BE0000` formando la "A" emblemática.
  - Wordmark (`wordmark.png`): 750×220 px, PNG con canal alfa (tipo 6) con tipografía institucional "AMÉRICA TRÁMITES".

---

## 2. Lo que dice el sitio en vivo

- **Hero principal:** "America Tramites · Dos rutas claras para la comunidad hispana: aprende a preparar formularios migratorios con responsabilidad o recibe apoyo administrativo para ordenar tu trámite sin confundirlo con asesoría legal."
- **Pilares de responsabilidad ética y legal:**
  1. "Límites visibles: No somos abogados ni reemplazamos una consulta legal."
  2. "Clasificación responsable: Si existe complejidad legal, la ruta correcta es escalar."
  3. "Canal directo: WhatsApp permite iniciar con contexto y menos fricción."
- **Clasificador interactivo (`#quiz`):** "¿Qué necesita lograr hoy?" con 3 rutas de navegación según la intención de la persona.

---

## 3. Catálogo y estructura verificada

### 3 rutas guiadas por intención
El clasificador de entrada y la navegación guían a los usuarios por 3 caminos:
1. **Emprender:** ruta profesional para operadores y preparadores administrativos comunitarios.
2. **Trámites:** catálogo interactivo para clasificar necesidades documentales.
3. **Aprender:** centro educativo con microguías gratuitas y formaciones.

### 4 trámites administrativos en el catálogo (`/tramites`)
Organizados en 3 familias de servicio:
1. **Asilo político** (Migratorios): orden de evidencias, preparación administrativa y detección de alertas legales.
2. **TPS** (Renovaciones): checklist según trámite, pruebas de identidad y nacionalidad.
3. **Permisos de trabajo** (Renovaciones): autorización de empleo, revisión básica y respaldos personales.
4. **Creación de compañías** (Negocios): organización de datos, registro inicial y responsabilidades básicas.

Cada trámite abre un modal interactivo con dos bloques concretos: "Qué podemos ordenar" y "Documentos comunes", enlazando directamente al formulario contextual.

### 6 semanas en el roadmap profesional (`/emprender`)
La ruta formativa "Seis semanas, un criterio operativo" desglosa 6 etapas consecutivas:
- Semana 01: Entienda el tablero completo.
- Semana 02: Lea la ruta administrativa.
- Semana 03: Organice permisos, soportes y tiempos.
- Semana 04: Prepare trámites frecuentes con precisión.
- Semana 05: Convierta el caos en expediente.
- Semana 06: Opere con límites responsables.

### 3 microguías educativas gratuitas (`/aprender`)
Recursos educativos desplegables con recomendaciones prácticas:
1. Su primer checklist documental (nivel inicial).
2. Cómo ordenar evidencia sin perderse (nivel organización).
3. Preparación administrativa y límites (nivel límites).

### 3 formaciones guiadas (`/aprender`)
1. Checklist migratorio inicial (sesión guiada + materiales).
2. Carpeta documental para TPS y renovaciones (clase práctica en vivo).
3. Documentos base para permiso de trabajo (taller introductorio).

### 3 pasos del método operativo (`/nosotros`)
1. **01 Escuchar:** entender la intención y el contexto disponible.
2. **02 Ordenar:** separar documentos, dudas y faltantes.
3. **03 Clasificar:** confirmar si avanza administrativamente o requiere derivación.

---

## 4. Formulario de contacto contextual (`/contacto`)

- El formulario lee el parámetro `?ruta=` y adapta su instrucción:
  - `emprender`: "Ruta profesional · Cuéntenos su experiencia actual y qué quiere construir..."
  - `tramites`: "Apoyo con trámites · Indique el trámite, los documentos disponibles y cualquier fecha importante."
  - `aprender`: "Centro educativo · Díganos qué quiere entender u organizar..."
- Campos: Nombre completo, Teléfono y Contexto inicial.
- Recorrido en solo lectura: capturado con campos vacíos.
- Al validar en el cliente, muestra confirmación y deriva a WhatsApp con mensaje contextualizado sin almacenar información en un backend.

---

## 5. Qué no afirmar

- No afirmar que el sitio ofrece carga de documentos en línea, portales de clientes ni procesamiento consular automatizado.
- No afirmar asesoría legal, representación jurídica ni garantías de aprobación migratoria.
- No afirmar cifras de clientes atendidos, porcentajes de éxito o métricas no publicadas en el sitio.

---

## 6. Reporte de verificación

1. **Salida del checker:** ✔ `america-tramites: 408 comprobaciones bien, 0 fallas, 0 avisos`.
2. **Verificado en vivo:**
   - 3 rutas de navegación e intención (Emprender, Trámites, Aprender).
   - Clasificador de intención interactivo (#quiz).
   - Catálogo interactivo de 4 trámites en 3 familias de servicio con modal de alcance y documentos requeridos.
   - Centro educativo con 3 microguías gratuitas y 3 formaciones guiadas.
   - Roadmap formativo de 6 semanas en /emprender.
   - Formulario contextual de 3 campos en /contacto con validación en cliente y derivación directa a WhatsApp.
   - Marca y paleta extraída del CSS compilado servido en producción.
3. **Diferencias con `projectCases.ts`:**
   - El portfolio lo describía como "formularios guiados para procesos consulares con documentación y carga de documentos por etapas".
   - El sitio real es un portal de asistencia administrativa y educativa ("América Trámites") en Miami Gardens, sin backend ni carga de archivos. Claude debe ajustar el summary y stack en `projectCases.ts` al animar.
4. **Protagonista elegida:** `staged-form`.
   - Representa el recorrido por etapas de la aplicación: enrutamiento interactivo por intención (#quiz), selección documental en el catálogo interactivo (/tramites) y captura contextualizada (/contacto) con derivación a WhatsApp.

