# Inventario de cinemáticas (2026-10-08)

El estado sale de los registros reales (`FLAGSHIP_FILMS`, `slugs.ts`, `FilmCanvas.tsx`, `filmsRoot.tsx`, `systemsFilms.ts`) y de los archivos en disco (`public/portfolio/films/`, `renders/`, `docs/films/dossiers/`). Incluye el trabajo de Gemini **sin commitear**: los 8 films nuevos, sus kits, dossiers, marcas, cuadros fijos y renders.

## Tabla

| id/slug | componente | kind | dónde se ve en el sitio | FLAGSHIP_FILMS | FLAGSHIP_SLUGS | STILLS / SECONDS | FLAGSHIP_LOADERS | filmsRoot | stills og/hero | FilmRail / ProjectIndex / WorkExperience | caseSeo (OG) | render MP4 | dossier |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `fenix-medical-center` | FenixFilm | flagship | /casos-de-exito/fenix-medical-center | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / ✅ / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ fenix.md |
| `lb-elite-wash-detail` | LbWashFilm | flagship | /casos-de-exito/lb-elite-wash-detail | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / ✅ / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ lb-wash.md |
| `new-brothers-barberia` | NewBrothersFilm | flagship | /casos-de-exito/new-brothers-barberia | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / ✅ / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ otros-casos.md § New Brothers |
| `truckers-choice` | TruckersFilm | flagship | /casos-de-exito/truckers-choice | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / ✅ / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ truckers-choice.md |
| `rangel-oviedo-group` | RangelOviedoFilm | flagship | /casos-de-exito/rangel-oviedo-group | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / ✅ / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ rangel-oviedo-group.md |
| `mr-studio-tattoo` | MrStudioFilm | flagship | /casos-de-exito/mr-studio-tattoo | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / ✅ / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ mr-studio.md |
| `autohub-360` | Autohub360Film | flagship | /casos-de-exito/autohub-360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ autohub-360.md |
| `lnb-saas` | LnbSaasFilm | flagship | /casos-de-exito/lnb-saas | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ lnb-saas.md |
| `hub-profesional-ai` | HubProfesionalFilm | flagship | /casos-de-exito/hub-profesional-ai | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ hub-profesional-ai.md |
| `evowrap` | EvowrapFilm | flagship | /casos-de-exito/evowrap | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ evowrap.md |
| `ad-media-solution` | AdMediaFilm | flagship | /casos-de-exito/ad-media-solution | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ ad-media.md |
| `punta-360` | Punta360Film | flagship | /casos-de-exito/punta-360 | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ punta-360.md |
| `america-tramites` | AmericaTramitesFilm | flagship | /casos-de-exito/america-tramites | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ america-tramites.md |
| `doge-sm` | DogeSmFilm | flagship | /casos-de-exito/doge-sm | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ / — archivo / ✅ | ✅ cuadro del film | ✅ 4/4 | ✅ doge-sm.md |
| `cana-vacations` | CaseFilm (plantilla) | case | /casos-de-exito/cana-vacations (film **oculto**: `cinematicPending`) | ❌ | ❌ | ❌ | ❌ | ❌ | — | ❌ / — archivo / ✅ | ⚠️ portada | ❌ | ❌ |
| `opening` | SystemsOpening | opening | /sistemas (ScrollFilm, avanza con el scroll), 20 s | — | — | — | — | ❌ | — | — | — | ❌ | — |
| `use-case-barber-crm` | UseCaseFilm | use-case | /sistemas (UseCaseFilmRoom), 36 s | — | — | — | — | ❌ | — | — | — | ❌ | — |
| `use-case-after-hours-lead` | UseCaseFilm | use-case | /sistemas (UseCaseFilmRoom), 36 s | — | — | — | — | ❌ | — | — | — | ❌ | — |
| `use-case-cold-lead-revival` | UseCaseFilm | use-case | /sistemas (UseCaseFilmRoom), 36 s | — | — | — | — | ❌ | — | — | — | ❌ | — |
| `logo` | LogoOverture | logo | home, #perfil (LogoOvertureSection), 11 s | — | — | — | — | ❌ (solo en `remotionRoot.tsx`, sin versionar) | — | — | — | ❌ | — |
| `brand-launch` | BrandLaunchReel | brand-launch | ninguna página (solo export, 9:16 1080×1920), 16 s | — | — | — | — | ❌ (solo en `remotionRoot.tsx`, sin versionar) | — | — | — | ❌ | — |
| `linkedin-launch` | LinkedInLaunchReel | linkedin-launch | ninguna página (solo export, 4:5 1080×1350), 18 s | — | — | — | — | ❌ (solo en `remotionRoot.tsx`, sin versionar) | — | — | — | ❌ | — |

**Notas de lectura de la tabla:**
- **ProjectIndex** lista solo los casos destacados (`status: "featured"`): por eso los de archivo llevan "—".
- **FilmRail** y **WorkExperience** (el índice "Ir directo a un caso") toman todos los casos con film.
- **`CinematicPlate` y `ScrollReel`** son escenas dentro de las composiciones, no cinemáticas aparte. Fuera de `compositions/` solo aparecen en `/films-lab`, que es solo de desarrollo.
- **Huérfanos:** no hay `*Film.tsx` sin registrar. Las 20 composiciones están en `FilmCanvas.tsx` o en `filmsRoot.tsx`.

## Huecos

1. **Los films que no son insignia no se pueden exportar.**
   - `filmsRoot.tsx` solo registra los 14 films insignia.
   - Faltan `opening`, los 3 casos de uso de /sistemas, `logo`, `brand-launch` y `linkedin-launch`. Estos tres últimos solo están en `src/remotionRoot.tsx`, una segunda raíz sin versionar del trabajo paralelo.
   - Propuesta: sumarlos todos a `filmsRoot.tsx` y que `render-films.ts` acepte `--kind`.
2. **`remotionRoot.tsx` tiene una duración distinta para el logo:** registra `LogoOverture` con 340 frames y el sitio usa `LOGO_OVERTURE_FRAMES = 330`. Al unificar, mandan los 330 del sitio.
3. **`brand-launch` y `linkedin-launch` tienen un formato fijo** (9:16 y 4:5): no son pares 16:9/4:5 como los demás. Propuesta: exportarlos solo en su formato nativo, en `es` y `en`.
4. **Los casos de uso, en el sitio, son interactivos:** nodo seleccionado e inspector. Para el MP4 se exportan sin selección, como se ven al reproducirse solos.
5. **El opening, en el sitio, avanza con el scroll.** El MP4 lo reproduce de corrido en sus 20 s.
6. **Cana Vacations no tiene film.**
   - Es un caso nuevo de archivo con `cinematicPending: true`: la página oculta el film. No hay dossier, kit ni marca.
   - La plantilla `CaseFilm` hoy no se ve en ninguna página: todos los casos visibles tienen film insignia.
   - Propuesta: no registrar `case-…` hasta que Cana Vacations tenga material, o pasarle a Gemini su kit.
7. **Un test falla:** `siteExperience.test.ts` espera `ARCHIVE_CASES.length === 8` y ahora hay 9 por Cana Vacations. El resto está en verde: 1040/1041 tests, `tsc` limpio, lint con 0 errores.
8. **Hub Profesional AI y LNB**, que figuraban bloqueados:
   - Gemini rehízo sus dossiers con lo que hoy muestran los sitios. Hub Profesional es un portal de plantillas para 6 especialidades, con "Mecánica Premium" por defecto. LNB es la plataforma de La Nueva Brasil (Cake Studio, Express, Crumb Club, LNB Pass, Kitchen Live).
   - También actualizó los casos en `projectCases.ts`.
   - Los MP4 ya están renderizados, pero **falta revisar que cada film coincida con su dossier**: se hace antes del render final (fase 3).
9. **Nada del trabajo de Gemini está commiteado ni desplegado.** Pendiente de revisión: los 8 films nuevos con sus layouts y tests, los kits, los dossiers, las marcas, los cuadros fijos, los registros, `projectCases.ts`, `CaseStudy.tsx`, `WorkExperience.tsx` y `types/site.ts`.
10. **Falta `renders/INDEX.md`.** Los 56 MP4 de los 14 films insignia existen; el índice se arma en la fase 3.
11. **Skills de Remotion:** ya están instaladas en `.claude/skills/remotion-*`. No hace falta correr `npx skills add`.
