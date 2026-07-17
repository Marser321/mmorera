# Registro del rediseño premium

Implementación realizada sobre el árbol de trabajo existente, sin resetear, descartar ni sobrescribir en bloque los cambios previos del usuario.

## Fundación y configuración

- `.gitignore`
- `eslint.config.mjs`
- `next.config.ts`
- `package.json`
- `package-lock.json`
- `pnpm-lock.yaml`
- `postcss.config.mjs`
- `tailwind.config.ts`
- `playwright.config.ts`

## Identidad, SEO e internacionalización

- `src/config/site.ts`
- `src/types/site.ts`
- `src/context/LanguageContext.tsx`
- `src/app/layout.tsx`
- `src/app/opengraph-image.tsx`
- `src/app/twitter-image.tsx`
- `src/app/_components/SocialShareImage.tsx`
- `src/app/robots.ts`
- `src/app/sitemap.ts`
- `src/app/privacidad/page.tsx`
- `src/app/en/**`

## Experiencia principal

- `src/app/globals.css`
- `src/app/page.tsx`
- `src/app/template.tsx`
- `src/app/not-found.tsx`
- `src/components/sections/navbar.tsx`
- `src/components/sections/footer.tsx`
- `src/components/shared/GlobalBackground.tsx`
- `src/components/shared/TechParticleField.tsx`
- `src/components/premium/**`
- `src/data/particleScenes.ts`
- `src/data/trackModes.ts`

## Contenido y rutas

- `src/data/projectCases.ts`
- `src/app/casos-de-exito/page.tsx`
- `src/app/casos-de-exito/[slug]/page.tsx`
- `src/app/sistemas/page.tsx`
- `src/app/estudio/page.tsx`
- `src/app/aplicar/page.tsx`
- `src/components/portfolio-isolated/AplicarOS.tsx`

El contrato y el payload de `src/actions/submit-lead.ts` se conservaron. No se modificaron base de datos, autenticación ni infraestructura InsForge.

## Pruebas y ajustes de calidad

- `src/data/siteExperience.test.ts`
- `e2e/site.spec.ts`
- Ajustes menores de lint en `scripts/multiagent-static-audit.mjs`, `src/components/sections/contact-form.tsx`, `src/components/sections/portfolio-section.tsx` y `src/components/portfolio-isolated/projectsData.ts`.

## Verificación final

- ESLint: correcto.
- Tests unitarios: 13 correctos.
- TypeScript: correcto.
- Build de producción: correcto, 43 páginas generadas.
- Playwright: 7 escenarios correctos.
- QA visual: 390×844, 768×1024 y 1440×900.
- Contextos WebGL: uno en movimiento normal; ninguno con movimiento reducido.
- Metadatos AppleDouble: eliminados de Git y del código activo; ignorados en lint y pruebas.
