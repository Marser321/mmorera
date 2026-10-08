import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { Composition, continueRender, delayRender, registerRoot } from "remotion";
import { FLAGSHIP_FILMS } from "@/data/films/flagships";
import { FILM_FORMATS, FILM_FPS, type FilmLanguage } from "@/data/films/filmTypes";
import { AdMediaFilm } from "@/components/films/compositions/AdMediaFilm";
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
 * idioma: <slug>-<landscape|portrait>-<es|en>.
 *
 * En el sitio las fuentes llegan con next/font (variables --ff-*); acá se
 * cargan de Google Fonts y el render espera a que estén listas.
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

/** Familias del sitio (--ff-display/body/mono) y de las marcas de los clientes (--ff-brand-*). */
const FONTS = [
  { variable: "--ff-display", family: "Unbounded", weights: "400;500;700;900" },
  { variable: "--ff-body", family: "Familjen Grotesk", weights: "400;500;600;700" },
  { variable: "--ff-mono", family: "Space Mono", weights: "400;700" },
  { variable: "--ff-brand-oswald", family: "Oswald", weights: "400;500;600;700" },
  { variable: "--ff-brand-inter", family: "Inter", weights: "400;500;600;700" },
  { variable: "--ff-brand-fraunces", family: "Fraunces", weights: "400;500;600;700" },
  { variable: "--ff-brand-manrope", family: "Manrope", weights: "400;500;600;700;800" },
  { variable: "--ff-brand-montserrat", family: "Montserrat", weights: "400;500;600;700" },
  { variable: "--ff-brand-anton", family: "Anton", weights: "400" },
  { variable: "--ff-brand-outfit", family: "Outfit", weights: "400;500;600;700" },
  { variable: "--ff-brand-playfair-display", family: "Playfair Display", weights: "400;500;600;700" },
  { variable: "--ff-brand-orbitron", family: "Orbitron", weights: "400;500;600;700;800;900" },
  { variable: "--ff-brand-geist", family: "Geist", weights: "400;500;600;700" },
  { variable: "--ff-brand-michroma", family: "Michroma", weights: "400" },
];

const FONTS_URL = `https://fonts.googleapis.com/css2?${FONTS.map((font) => `family=${font.family.replace(/ /g, "+")}:wght@${font.weights}`).join("&")}&display=block`;
const FONT_VARIABLES = Object.fromEntries(FONTS.map((font) => [font.variable, `"${font.family}"`]));

/** Carga las fuentes una vez y frena el render hasta que el navegador las tiene. */
function FontGate({ children }: { children: ReactNode }) {
  const [handle] = useState(() => delayRender("Fuentes de los films"));
  useEffect(() => {
    let link = document.querySelector<HTMLLinkElement>("link[data-film-fonts]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_URL;
      link.dataset.filmFonts = "true";
      document.head.appendChild(link);
    }
    const families = FONTS.map((font) => `16px "${font.family}"`);
    const ready = () => Promise.all(families.map((family) => document.fonts.load(family))).then(() => document.fonts.ready);
    if (link.sheet) void ready().then(() => continueRender(handle));
    else link.addEventListener("load", () => void ready().then(() => continueRender(handle)), { once: true });
  }, [handle]);
  return <div style={{ ...FONT_VARIABLES, position: "absolute", inset: 0 }}>{children}</div>;
}

function FlagshipRender({ slug, language }: { slug: string; language: FilmLanguage }) {
  const Film = FILMS[slug];
  return <FontGate>{Film ? <Film language={language} /> : null}</FontGate>;
}

export function FilmsRoot() {
  return (
    <>
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
