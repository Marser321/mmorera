import { useEffect, useState, type ReactNode } from "react";
import { continueRender, delayRender } from "remotion";

/**
 * Fuentes para renderizar fuera de Next (films y piezas de redes): en el sitio
 * llegan con next/font como variables --ff-*; acá se cargan de Google Fonts
 * y el render espera a que el navegador las tenga.
 */

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
export function FontGate({ children }: { children: ReactNode }) {
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
