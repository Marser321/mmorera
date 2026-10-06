import { AbsoluteFill } from "remotion";
import { brandCssVars, CASE_BRANDS } from "@/data/brands/caseBrands";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea } from "@/lib/filmLayout";
import { BrandProvider } from "../scenes/brand/context";
import { Letterbox } from "../scenes/case/shared";
import { useFilmLayout } from "../scenes/theme";
import { DEMOS_CRM } from "./demos-crm";
import { DEMOS_DATA } from "./demos-data";
import { DEMOS_MEDIA } from "./demos-media";

export const LAB_DEMOS = { ...DEMOS_MEDIA, ...DEMOS_DATA, ...DEMOS_CRM };

export type SceneLabProps = { scene: string; brand: string; language: FilmLanguage; guides: boolean };

/**
 * Composición del laboratorio de escenas (solo desarrollo): muestra una escena
 * de la biblioteca aislada, con la marca elegida y, opcionalmente, la zona útil
 * marcada para comprobar que nada sale de ella.
 */
export function SceneLab({ scene, brand: brandSlug, language, guides }: SceneLabProps) {
  const { portrait, width, height } = useFilmLayout();
  const demo = LAB_DEMOS[scene];
  const brand = CASE_BRANDS[brandSlug] ?? CASE_BRANDS["fenix-medical-center"];
  const format = portrait ? "portrait" : "landscape";
  const safe = safeArea(format);
  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill style={{ ...brandCssVars(brand), background: brand.palette.bg, overflow: "hidden", fontFamily: brand.fonts.body, color: brand.palette.text }}>
        {demo ? demo.render({ language, format, portrait, width, height }) : null}
        <Letterbox portrait={portrait} />
        {guides ? <div style={{ position: "absolute", left: safe.x, top: safe.y, width: safe.w, height: safe.h, outline: "1px dashed rgba(255,0,80,0.6)", zIndex: 30, pointerEvents: "none" }} /> : null}
      </AbsoluteFill>
    </BrandProvider>
  );
}
