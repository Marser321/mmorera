import type { ComponentType } from "react";
import { Composition, registerRoot } from "remotion";
import { FontGate } from "./FontGate";
import { capabilityDuration, capabilityFilmId } from "@/data/films/capabilityFilms";
import { FLAGSHIP_FILMS } from "@/data/films/flagships";
import { FAMILIES, type Family } from "@/data/techStack";
import { FILM_FORMATS, FILM_FPS, type FilmLanguage } from "@/data/films/filmTypes";
import { AdMediaFilm } from "@/components/films/compositions/AdMediaFilm";
import { CapabilityFilm } from "@/components/films/compositions/CapabilityFilm";
import { AmericaTramitesFilm } from "@/components/films/compositions/AmericaTramitesFilm";
import { Autohub360Film } from "@/components/films/compositions/Autohub360Film";
import { DogeSmFilm } from "@/components/films/compositions/DogeSmFilm";
import { EvowrapFilm } from "@/components/films/compositions/EvowrapFilm";
import { FenixFilm } from "@/components/films/compositions/FenixFilm";
import { HubProfesionalFilm } from "@/components/films/compositions/HubProfesionalFilm";
import { LbWashFilm } from "@/components/films/compositions/LbWashFilm";
import { LnbSaasFilm } from "@/components/films/compositions/LnbSaasFilm";
import { MrStudioFilm } from "@/components/films/compositions/MrStudioFilm";
import { NewBrothersFilm } from "@/components/films/compositions/NewBrothersFilm";
import { Punta360Film } from "@/components/films/compositions/Punta360Film";
import { RangelOviedoFilm } from "@/components/films/compositions/RangelOviedoFilm";
import { TruckersFilm } from "@/components/films/compositions/TruckersFilm";

/**
 * Raíz de Remotion para exportar los films insignia a MP4 (portfolio y redes),
 * fuera de Next: `npx remotion render src/remotion/filmsRoot.tsx <id> …` o
 * `npx tsx scripts/render-films.ts`. Cada film queda registrado por formato e
 * idioma: <slug>-<landscape|portrait>-<es|en>, y los films por capacidad de
 * /estudio como capability-<familia>-<formato>-<idioma>.
 *
 * En el sitio las fuentes llegan con next/font (variables --ff-*); acá las
 * carga FontGate desde Google Fonts y el render espera a que estén listas.
 */

const FILMS: Record<string, ComponentType<{ language: FilmLanguage }>> = {
  "ad-media-solution": AdMediaFilm,
  "america-tramites": AmericaTramitesFilm,
  "autohub-360": Autohub360Film,
  "doge-sm": DogeSmFilm,
  evowrap: EvowrapFilm,
  "fenix-medical-center": FenixFilm,
  "hub-profesional-ai": HubProfesionalFilm,
  "lb-elite-wash-detail": LbWashFilm,
  "lnb-saas": LnbSaasFilm,
  "mr-studio-tattoo": MrStudioFilm,
  "new-brothers-barberia": NewBrothersFilm,
  "punta-360": Punta360Film,
  "rangel-oviedo-group": RangelOviedoFilm,
  "truckers-choice": TruckersFilm,
};

function FlagshipRender({ slug, language }: { slug: string; language: FilmLanguage }) {
  const Film = FILMS[slug];
  return <FontGate>{Film ? <Film language={language} /> : null}</FontGate>;
}

function CapabilityRender({ family, language }: { family: Family; language: FilmLanguage }) {
  return (
    <FontGate>
      <CapabilityFilm family={family} language={language} />
    </FontGate>
  );
}

export function FilmsRoot() {
  return (
    <>
      {FAMILIES.flatMap((family) =>
        (["landscape", "portrait"] as const).flatMap((format) =>
          (["es", "en"] as const).map((language) => (
            <Composition
              key={`${capabilityFilmId(family.id)}-${format}-${language}`}
              id={`${capabilityFilmId(family.id)}-${format}-${language}`}
              component={CapabilityRender}
              durationInFrames={capabilityDuration(family.id)}
              fps={FILM_FPS}
              width={FILM_FORMATS[format].width}
              height={FILM_FORMATS[format].height}
              defaultProps={{ family: family.id, language }}
            />
          )),
        ),
      )}
      {Object.values(FLAGSHIP_FILMS).flatMap((film) =>
        (["landscape", "portrait"] as const).flatMap((format) =>
          (["es", "en"] as const).map((language) => (
            <Composition
              key={`${film.slug}-${format}-${language}`}
              id={`${film.slug}-${format}-${language}`}
              component={FlagshipRender}
              durationInFrames={film.durationInFrames}
              fps={FILM_FPS}
              width={FILM_FORMATS[format].width}
              height={FILM_FORMATS[format].height}
              defaultProps={{ slug: film.slug, language }}
            />
          )),
        ),
      )}
    </>
  );
}

registerRoot(FilmsRoot);
