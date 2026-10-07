import { Fraunces, Inter, Manrope, Montserrat, Oswald, Outfit } from "next/font/google";

/**
 * Tipografías de las marcas de los clientes, solo para sus films.
 * preload:false: el @font-face existe pero el archivo se descarga recién
 * cuando un film de esa marca pinta texto con la familia.
 */
const oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--ff-brand-oswald", display: "swap", preload: false });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--ff-brand-inter", display: "swap", preload: false });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--ff-brand-fraunces", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--ff-brand-manrope", display: "swap", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--ff-brand-montserrat", display: "swap", preload: false });
const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--ff-brand-outfit", display: "swap", preload: false });

/** Clases que declaran las variables --ff-brand-* en el contenedor del film. */
export const BRAND_FONT_VARIABLES = [oswald, inter, fraunces, manrope, montserrat, outfit].map((font) => font.variable).join(" ");

