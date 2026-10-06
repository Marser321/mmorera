import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { BlurTravel } from "../scenes/brand/camera";
import { CinematicPlate } from "../scenes/brand/CinematicPlate";
import { SampleBadge } from "../scenes/brand/flat";
import { ManifestoBeats } from "../scenes/brand/ManifestoBeats";
import { MechanismTriptych } from "../scenes/brand/MechanismTriptych";
import { ScrollReel } from "../scenes/brand/ScrollReel";
import { ShotStack } from "../scenes/brand/ShotStack";
import type { LabDemo } from "./types";

/**
 * Demos del laboratorio: grupo "media". Cada escena nueva registra acá una
 * demo con datos rotulados. Los textos son de ejemplo (rotulados como tales);
 * los medios son los reales de cada marca, con su medida nativa.
 */

const FENIX = "/portfolio/brands/fenix-medical-center";
const BACKDROPS = "/portfolio/backdrops";

const ASSETS = {
  corridor: { src: `${FENIX}/scenes/amb-00-umbral-apertura-v2--16x9.mp4`, w: 1920, h: 1080, fps: 24, seconds: 10 },
  corridorPoster: `${FENIX}/scenes/amb-00-umbral-apertura-v2--16x9-poster.webp`,
  chamber: { src: `${FENIX}/scenes/hdr-v1-tratamientos-camara-hiperbarica--16x9.mp4`, w: 1920, h: 1080, fps: 30, seconds: 10 },
  chamberPoster: `${FENIX}/scenes/hdr-v1-tratamientos-camara-hiperbarica--16x9-poster.webp`,
  plasma: { src: `${FENIX}/scenes/mec-hbot-02-plasma-saturado.webp`, w: 1280, h: 720 },
  diffusion: { src: `${FENIX}/scenes/mec-hbot-05-difusion-tisular.webp`, w: 1280, h: 720 },
  angiogenesis: { src: `${FENIX}/scenes/mec-hbot-08-angiogenesis.webp`, w: 1280, h: 720 },
  bookingDay: { src: `${FENIX}/shots/booking-1-dia.png`, w: 488, h: 636 },
  bookingTime: { src: `${FENIX}/shots/booking-2-hora.png`, w: 488, h: 418 },
  bookingDetails: { src: `${FENIX}/shots/booking-3-datos.png`, w: 488, h: 791 },
  siteHbot: { src: `${FENIX}/shots/site-hbot.jpg`, w: 1600, h: 906 },
  adReel: { src: "/portfolio/reels/ad-media-solution.mp4", w: 1280, h: 800, fps: 30, seconds: 6.2 },
  adReelPoster: "/portfolio/reels/ad-media-solution-poster.jpg",
} as const;

const SAMPLE: Record<FilmLanguage, string> = { es: "Datos de ejemplo", en: "Sample data" };

/** Caja de la escena: la zona útil menos una banda al pie para el rótulo de ejemplo. */
function frameFor(format: FilmFormatName): { box: Box; badge: { left: number; top: number; fontSize: number } } {
  const safe = safeArea(format);
  const badgeH = format === "portrait" ? 40 : 32;
  const gap = format === "portrait" ? 24 : 18;
  return {
    box: { ...safe, h: safe.h - badgeH - gap },
    badge: { left: safe.x, top: safe.y + safe.h - badgeH, fontSize: format === "portrait" ? 19 : 14 },
  };
}

function Badge({ language, format }: { language: FilmLanguage; format: FilmFormatName }) {
  const { badge } = frameFor(format);
  return <SampleBadge label={SAMPLE[language]} style={{ left: badge.left, top: badge.top, fontSize: badge.fontSize }} />;
}

const T = (language: FilmLanguage, es: string, en: string) => (language === "es" ? es : en);

export const DEMOS_MEDIA: Record<string, LabDemo> = {
  CinematicPlate: {
    duration: 240,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <CinematicPlate
          box={frameFor(format).box}
          asset={ASSETS.corridor}
          poster={ASSETS.corridorPoster}
          focal={{ x: 0.5, y: 0.42 }}
          duration={240}
          caption={{ kicker: T(language, "La llegada", "Arrival"), text: T(language, "La consulta empieza antes de entrar.", "The visit begins before you walk in.") }}
        />
        <Badge language={language} format={format} />
      </>
    ),
  },
  CinematicPlateChamber: {
    duration: 240,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <BlurTravel src={`${BACKDROPS}/hdr-v1-tratamientos-camara-hiperbarica--16x9-poster-blur.jpg`} duration={240} opacity={0.22} />
        <CinematicPlate box={frameFor(format).box} asset={ASSETS.chamber} poster={ASSETS.chamberPoster} focal={{ x: 0.6, y: 0.5 }} veilOpacity={0.4} duration={240} />
        <Badge language={language} format={format} />
      </>
    ),
  },
  ManifestoBeats: {
    duration: 330,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <ManifestoBeats
          box={frameFor(format).box}
          duration={330}
          beats={[
            { kicker: T(language, "El titular", "The headline"), text: T(language, "Tu médico de cabecera, que también conoce tu *plan de longevidad*.", "Your family doctor, who also knows your *longevity plan*."), from: 10, to: 88 },
            { kicker: T(language, "La ética", "The ethics"), text: T(language, "Normal es un rango.\nTu salud necesita *contexto*.", "Normal is a range.\nYour health needs *context*."), from: 92, to: 170 },
            { kicker: T(language, "La confianza", "The trust"), text: T(language, "Precios claros y un sitio en tu idioma.", "Clear prices and a site in your language."), from: 174, to: 248 },
            { text: T(language, "El compliance define la *tecnología*.", "Compliance shapes the *technology*."), from: 252, to: 326 },
          ]}
        />
        <Badge language={language} format={format} />
      </>
    ),
  },
  MechanismTriptych: {
    duration: 330,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <BlurTravel src={`${BACKDROPS}/mec-hbot-05-difusion-tisular-blur.jpg`} duration={330} opacity={0.16} />
        <MechanismTriptych
          box={frameFor(format).box}
          duration={330}
          stills={[ASSETS.plasma, ASSETS.diffusion, ASSETS.angiogenesis]}
          formula={{ kicker: T(language, "Ley de Henry", "Henry's law"), text: T(language, "Bajo presión, el oxígeno se disuelve en el *plasma*.", "Under pressure, oxygen dissolves into *plasma*.") }}
          captions={[
            { title: T(language, "Plasma saturado", "Saturated plasma"), body: T(language, "Bajo presión, el oxígeno también viaja disuelto en el plasma.", "Under pressure, oxygen also travels dissolved in the plasma.") },
            { title: T(language, "Difusión en el tejido", "Tissue diffusion"), body: T(language, "El oxígeno disuelto se difunde hacia el tejido que rodea al vaso.", "Dissolved oxygen diffuses into the tissue around the vessel.") },
            { title: T(language, "Angiogénesis", "Angiogenesis"), body: T(language, "Se estudia su papel en la formación de nuevos vasos.", "Its role in forming new vessels is being studied.") },
          ]}
        />
        <Badge language={language} format={format} />
      </>
    ),
  },
  ShotStack: {
    duration: 360,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <ShotStack
          box={frameFor(format).box}
          duration={360}
          shots={[
            { ...ASSETS.bookingDay, label: T(language, "Día", "Day") },
            { ...ASSETS.bookingTime, label: T(language, "Hora", "Time") },
            { ...ASSETS.bookingDetails, label: T(language, "Tus datos", "Your details") },
          ]}
        />
        <Badge language={language} format={format} />
      </>
    ),
  },
  ShotStackPhone: {
    duration: 360,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <ShotStack
          box={frameFor(format).box}
          duration={360}
          frame="phone"
          shots={[
            { ...ASSETS.bookingDay, label: T(language, "Elegí el día", "Pick a day") },
            { ...ASSETS.bookingTime, label: T(language, "Elegí la hora", "Pick a time") },
            { ...ASSETS.bookingDetails, label: T(language, "Tus datos", "Your details") },
          ]}
        />
        <Badge language={language} format={format} />
      </>
    ),
  },
  ScrollReel: {
    duration: 240,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <BlurTravel src={`${BACKDROPS}/hdr-v1-tratamientos-camara-hiperbarica--16x9-poster-blur.jpg`} duration={240} opacity={0.18} />
        <ScrollReel box={frameFor(format).box} asset={ASSETS.siteHbot} host="fenixmedicalcenters.com" path="/tratamientos/camara-hiperbarica" duration={240} />
        <Badge language={language} format={format} />
      </>
    ),
  },
  ScrollReelVideo: {
    duration: 240,
    brand: "ad-media-solution",
    render: ({ language, format }) => (
      <>
        <BlurTravel src={`${BACKDROPS}/ad-media-solution-poster-blur.jpg`} duration={240} opacity={0.2} />
        <ScrollReel box={frameFor(format).box} asset={ASSETS.adReel} poster={ASSETS.adReelPoster} host="admediasolution.vercel.app" path="/" duration={240} />
        <Badge language={language} format={format} />
      </>
    ),
  },
};
