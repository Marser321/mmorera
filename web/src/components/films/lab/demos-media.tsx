import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { BlurTravel } from "../scenes/brand/camera";
import { CinematicPlate } from "../scenes/brand/CinematicPlate";
import { SampleBadge } from "../scenes/brand/flat";
import { MEDIA_ASSETS as A, MEDIA_SAMPLE_LABEL, MEDIA_SAMPLES, MEDIA_URLS, mediaDemoFrame } from "../scenes/brand/layout/mediaSamples";
import { ManifestoBeats } from "../scenes/brand/ManifestoBeats";
import { MechanismTriptych } from "../scenes/brand/MechanismTriptych";
import { ScrollReel } from "../scenes/brand/ScrollReel";
import { ShotStack } from "../scenes/brand/ShotStack";
import type { LabDemo } from "./types";

/**
 * Demos del laboratorio: grupo "media". Cada escena nueva registra acá una
 * demo con datos rotulados. Los textos son de ejemplo (rótulo "Datos de
 * ejemplo"); los medios son los reales de cada marca, con su medida nativa.
 * Los mismos datos los verifica el test de geometría de cada escena.
 */

const BACKDROPS = "/portfolio/backdrops";

function Badge({ language, format }: { language: FilmLanguage; format: FilmFormatName }) {
  const { badge } = mediaDemoFrame(format);
  return <SampleBadge label={MEDIA_SAMPLE_LABEL[language]} style={{ left: badge.left, top: badge.top, fontSize: badge.fontSize }} />;
}

/** Tiempos de los beats de la demo (frames): cada uno sale antes de que entre el siguiente. */
const BEAT_TIMES = [
  [10, 88],
  [92, 170],
  [174, 248],
  [252, 326],
] as const;

export const DEMOS_MEDIA: Record<string, LabDemo> = {
  CinematicPlate: {
    duration: 240,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <CinematicPlate box={mediaDemoFrame(format).box} asset={A.corridor} poster={A.corridorPoster} focal={{ x: 0.5, y: 0.42 }} duration={240} caption={MEDIA_SAMPLES[language].plateCaption} />
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
        <CinematicPlate box={mediaDemoFrame(format).box} asset={A.chamber} poster={A.chamberPoster} focal={{ x: 0.6, y: 0.5 }} veilOpacity={0.4} duration={240} />
        <Badge language={language} format={format} />
      </>
    ),
  },
  ManifestoBeats: {
    duration: 330,
    brand: "fenix-medical-center",
    render: ({ language, format }) => (
      <>
        <ManifestoBeats box={mediaDemoFrame(format).box} duration={330} beats={MEDIA_SAMPLES[language].beats.map((beat, index) => ({ ...beat, from: BEAT_TIMES[index][0], to: BEAT_TIMES[index][1] }))} />
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
          box={mediaDemoFrame(format).box}
          duration={330}
          stills={[A.plasma, A.diffusion, A.angiogenesis]}
          formula={MEDIA_SAMPLES[language].formula}
          captions={MEDIA_SAMPLES[language].mechanism}
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
          box={mediaDemoFrame(format).box}
          duration={360}
          shots={[A.bookingDay, A.bookingTime, A.bookingDetails].map((shot, index) => ({ ...shot, label: MEDIA_SAMPLES[language].steps[index] }))}
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
          box={mediaDemoFrame(format).box}
          duration={360}
          frame="phone"
          shots={[A.bookingDay, A.bookingTime, A.bookingDetails].map((shot, index) => ({ ...shot, label: MEDIA_SAMPLES[language].phoneSteps[index] }))}
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
        <ScrollReel box={mediaDemoFrame(format).box} asset={A.siteHbot} host={MEDIA_URLS.fenix.host} path={MEDIA_URLS.fenix.path} duration={240} />
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
        <ScrollReel box={mediaDemoFrame(format).box} asset={A.adReel} poster={A.adReelPoster} host={MEDIA_URLS.adMedia.host} path={MEDIA_URLS.adMedia.path} duration={240} />
        <Badge language={language} format={format} />
      </>
    ),
  },
};
