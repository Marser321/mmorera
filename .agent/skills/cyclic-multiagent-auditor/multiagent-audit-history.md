# 📋 Historial de Auditorías — Cyclic Multi-Agent Auditor

Este archivo se actualiza de manera periódica al ejecutar la skill `cyclic-multiagent-auditor`.
Permite registrar la evolución del sitio, catalogar las deficiencias detectadas y dar seguimiento a su resolución para evitar regresiones.

---

## Registro de Ejecuciones

| # | Fecha | UX/UI | SEO | A11y | Perf | Código & SDK | Hallazgo Principal | Estado |
|---|---|---|---|---|---|---|---|---|
| 0 | 2026-06-01 | — | — | — | — | — | Primera instalación y calibración del sistema. | 🟢 Calibrado |
| 1 | 2026-06-01 | 7.0 | 6.0 | 10.0 | 10.0 | 10.0 | Falta de metadatos SEO y 54 advertencias de colores Tailwind planos ad-hoc. | 🔴 Deficiencias |
| 2 | 2026-06-01 | 8.0 | 10.0 | 10.0 | 10.0 | 10.0 | Resueltos metadatos SEO principales, branding unificado y corregidos falsos positivos. | 🟡 Pendientes colores ad-hoc |
| 3 | 2026-07-18 | 9.5 | 10.0 | 10.0 | 10.0 | 9.5 | Purga de 68 archivos huérfanos pre-rebrand (51→9 hallazgos); los 9 restantes son decisiones de diseño documentadas. | 🟢 Saneado |

---

## Deficiencias Registradas (Acumuladas)

### 🔴 Críticas (Acción Inmediata)
- *Ninguna crítica pendiente.*

### 🟡 Mejoras Recomendadas
- *Ninguna pendiente.*

### ⚪ Hallazgos Aceptados (por diseño — no corregir)
1. **Semáforo macOS en `PortfolioReel.tsx` y `ProjectCaseDialog.tsx`:** los puntos `bg-red/yellow/green-500` reproducen los controles de ventana macOS del reel — los colores literales son intencionales.
2. **Hex inline en `SocialShareImage.tsx`:** la imagen OG se genera con `ImageResponse`, que no soporta variables CSS del tema; los hex son obligatorios ahí.
3. **`bg-cyan-500/5` en `SistemasBlueprint.tsx` y `text-red-500` en `projectsData.ts`:** viven en la ruta interna de QA `/portfolio-preview`, sin exposición pública.

### 🟢 Solucionadas/OK
- **Instalación y Configuración:** Sistema de auditoría cíclica instalado correctamente y script de soporte `web/scripts/multiagent-static-audit.mjs` calibrado.
- **Falta de Metadatos SEO en Páginas Principales:** Solucionado mediante la exportación de metadatos en `src/app/page.tsx` y la creación de `src/app/portfolio-preview/layout.tsx`.
- **Branding MMorera -> Nexus.AI:** Unificado el branding corporativo de metadatos y JSON-LD en `src/app/layout.tsx`.
- **Falso positivo de Parallax:** Corregida la expresión regular en el script de auditoría para evitar falsas alarmas con variables de posición.
- **Accesibilidad y Código:** 0 incidencias de accesibilidad detectadas y 100% de cumplimiento con las reglas del SDK de InsForge y directivas de TypeScript.
- **Deuda técnica pre-rebrand (2026-07-18):** eliminados 68 archivos huérfanos sin importadores (47 de `sections/`, `interactive/` completa, 9 de `ui/`, `shared/AnimatedCard|GenerativeField|ServiceModal`, `track/`, `data/projects.ts`, `lib/chat-api.ts` + test y `lib/mdx.ts`). Esto resolvió los "colores planos ad-hoc" acumulados: eran todos código muerto.
- **Poster de `BackgroundVideo` con `next/image` (2026-07-18):** se quitó el `eslint-disable` de `<img>`; la optimización global sigue `unoptimized: true` a propósito (caché de imágenes envenenable por AppleDouble en el volumen externo) — revisar al desplegar en Vercel.
- **Falso positivo SEO del script (2026-07-18):** el auditor ahora reconoce metadata heredada del `layout.tsx` del mismo directorio (caso home y `/portfolio-preview`).

---

## Notas del Sistema
- La puntuación e identificación de deficiencias se actualiza al correr la skill o mediante la automatización programada.
