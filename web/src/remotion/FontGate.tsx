import { useEffect, useState, type ReactNode } from "react";
import { continueRender, delayRender } from "remotion";
import anton from "./fuentes/anton.woff2";
import familjen from "./fuentes/familjen-grotesk.woff2";
import fraunces from "./fuentes/fraunces.woff2";
import geist from "./fuentes/geist.woff2";
import inter from "./fuentes/inter.woff2";
import manrope from "./fuentes/manrope.woff2";
import michroma from "./fuentes/michroma.woff2";
import montserrat from "./fuentes/montserrat.woff2";
import orbitron from "./fuentes/orbitron.woff2";
import oswald from "./fuentes/oswald.woff2";
import outfit from "./fuentes/outfit.woff2";
import playfair from "./fuentes/playfair-display.woff2";
import spaceMono400 from "./fuentes/space-mono-400.woff2";
import spaceMono700 from "./fuentes/space-mono-700.woff2";
import unbounded from "./fuentes/unbounded.woff2";

/**
 * Fuentes para renderizar fuera de Next (films y piezas de redes): en el sitio
 * llegan con next/font como variables --ff-*; acá van en archivos locales
 * (src/remotion/fuentes, subconjunto latin, licencia OFL) para que el render
 * no dependa de la red. El render espera a que el navegador las tenga.
 *
 * Para sumar una familia: bajar el .woff2 latin de Google Fonts a fuentes/
 * y agregarla abajo.
 */

type Fuente = { variable: string; family: string; files: Array<{ src: string; weight: string }> };

/** Familias del sitio (--ff-display/body/mono) y de las marcas de los clientes (--ff-brand-*). */
const FONTS: Fuente[] = [
  { variable: "--ff-display", family: "Unbounded", files: [{ src: unbounded, weight: "200 900" }] },
  { variable: "--ff-body", family: "Familjen Grotesk", files: [{ src: familjen, weight: "400 700" }] },
  { variable: "--ff-mono", family: "Space Mono", files: [{ src: spaceMono400, weight: "400" }, { src: spaceMono700, weight: "700" }] },
  { variable: "--ff-brand-oswald", family: "Oswald", files: [{ src: oswald, weight: "200 700" }] },
  { variable: "--ff-brand-inter", family: "Inter", files: [{ src: inter, weight: "100 900" }] },
  { variable: "--ff-brand-fraunces", family: "Fraunces", files: [{ src: fraunces, weight: "100 900" }] },
  { variable: "--ff-brand-manrope", family: "Manrope", files: [{ src: manrope, weight: "200 800" }] },
  { variable: "--ff-brand-montserrat", family: "Montserrat", files: [{ src: montserrat, weight: "100 900" }] },
  { variable: "--ff-brand-anton", family: "Anton", files: [{ src: anton, weight: "400" }] },
  { variable: "--ff-brand-outfit", family: "Outfit", files: [{ src: outfit, weight: "100 900" }] },
  { variable: "--ff-brand-playfair-display", family: "Playfair Display", files: [{ src: playfair, weight: "400 900" }] },
  { variable: "--ff-brand-orbitron", family: "Orbitron", files: [{ src: orbitron, weight: "400 900" }] },
  { variable: "--ff-brand-geist", family: "Geist", files: [{ src: geist, weight: "100 900" }] },
  { variable: "--ff-brand-michroma", family: "Michroma", files: [{ src: michroma, weight: "400" }] },
];

const FONT_FACES = FONTS.flatMap((font) => font.files.map((file) => `@font-face{font-family:"${font.family}";src:url("${file.src}") format("woff2");font-weight:${file.weight};font-style:normal;font-display:block}`)).join("\n");
const FONT_VARIABLES = Object.fromEntries(FONTS.map((font) => [font.variable, `"${font.family}"`]));

/** Declara las fuentes una vez y frena el render hasta que el navegador las tiene. */
export function FontGate({ children }: { children: ReactNode }) {
  const [handle] = useState(() => delayRender("Fuentes de los films"));
  useEffect(() => {
    if (!document.querySelector("style[data-film-fonts]")) {
      const style = document.createElement("style");
      style.dataset.filmFonts = "true";
      style.textContent = FONT_FACES;
      document.head.appendChild(style);
    }
    // Cada peso que se usa, para que el navegador no espere a pintar para bajarlo.
    const loads = FONTS.flatMap((font) => ["400", "500", "700"].map((weight) => `${weight} 16px "${font.family}"`));
    void Promise.all(loads.map((spec) => document.fonts.load(spec)))
      .then(() => document.fonts.ready)
      .then(() => continueRender(handle));
  }, [handle]);
  return <div style={{ ...FONT_VARIABLES, position: "absolute", inset: 0 }}>{children}</div>;
}
