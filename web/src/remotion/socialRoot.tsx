import type { ComponentType } from "react";
import { Composition, registerRoot } from "remotion";
import { SocialCarruselVideo, SocialReelCaso, SocialReelTexto, SocialSlide } from "@/components/social/SocialCompositions";
import { carruselComposition, REEL_CASO, REEL_TEXTO, slideComposition, type CarruselVideoProps, type ReelCasoProps, type ReelTextoProps, type SlideProps } from "@/data/social/render";
import { carruselVideoFrames, reelCasoBeats, reelTextoBeats, SLIDE_STILL_FRAMES, totalFrames } from "@/data/social/timing";
import { SOCIAL_FORMATS, SOCIAL_FPS, type Formato } from "@/data/social/types";
import { FontGate } from "./FontGate";

/**
 * Raíz de Remotion de las piezas de redes (contenido/piezas). No la carga el
 * sitio: la usa `scripts/render-social.ts`, que pasa los datos de cada pieza
 * como props. Las duraciones salen de los datos (calculateMetadata).
 */

function withFonts<P extends object>(Component: ComponentType<P>) {
  const Wrapped = (props: P) => (
    <FontGate>
      <Component {...props} />
    </FontGate>
  );
  Wrapped.displayName = `Fonts(${Component.displayName ?? Component.name})`;
  return Wrapped;
}

const Slide = withFonts(SocialSlide);
const Carrusel = withFonts(SocialCarruselVideo);
const ReelTexto = withFonts(SocialReelTexto);
const ReelCaso = withFonts(SocialReelCaso);

const FORMATOS: Formato[] = ["reel", "feed", "cuadrado"];

const SAMPLE_SLIDE: SlideProps = { formato: "feed", slide: { tipo: "portada", kicker: "Muestra", titulo: "Una pieza de *muestra*", bajada: "La reemplazan los datos de cada pieza." }, tono: "oscuro", imagenes: {} };
const SAMPLE_REEL: ReelTextoProps = {
  salida: { id: "muestra", plantilla: "reel-texto", para: ["instagram"], gancho: "Un reel de *muestra*", pulsos: [{ texto: "Primer pulso" }, { texto: "Segundo pulso" }], remate: "El remate", cta: "Seguime para más" },
};
const SAMPLE_CASO: ReelCasoProps = {
  salida: { id: "muestra", plantilla: "reel-caso", para: ["instagram"], caso: "new-brothers-barberia", gancho: "Un caso de muestra", decisiones: ["Primera", "Segunda", "Tercera"], cierre: "El cierre" },
  nombre: "New Brothers Barbería",
  placas: { og: "/portfolio/films/new-brothers-barberia/og-es.jpg", hero: "/portfolio/films/new-brothers-barberia/hero-es.jpg" },
};

export function SocialRoot() {
  return (
    <>
      {FORMATOS.map((formato) => (
        <Composition
          key={slideComposition(formato)}
          id={slideComposition(formato)}
          component={Slide}
          durationInFrames={SLIDE_STILL_FRAMES + 1}
          fps={SOCIAL_FPS}
          width={SOCIAL_FORMATS[formato].width}
          height={SOCIAL_FORMATS[formato].height}
          defaultProps={{ ...SAMPLE_SLIDE, formato }}
        />
      ))}
      {FORMATOS.map((formato) => (
        <Composition
          key={carruselComposition(formato)}
          id={carruselComposition(formato)}
          component={Carrusel}
          durationInFrames={carruselVideoFrames([SAMPLE_SLIDE.slide])}
          calculateMetadata={({ props }: { props: CarruselVideoProps }) => ({ durationInFrames: carruselVideoFrames(props.diapositivas) })}
          fps={SOCIAL_FPS}
          width={SOCIAL_FORMATS[formato].width}
          height={SOCIAL_FORMATS[formato].height}
          defaultProps={{ formato, diapositivas: [SAMPLE_SLIDE.slide], tono: "oscuro", imagenes: {} } as CarruselVideoProps}
        />
      ))}
      <Composition
        id={REEL_TEXTO}
        component={ReelTexto}
        durationInFrames={totalFrames(reelTextoBeats(SAMPLE_REEL.salida))}
        calculateMetadata={({ props }: { props: ReelTextoProps }) => ({ durationInFrames: totalFrames(reelTextoBeats(props.salida)) })}
        fps={SOCIAL_FPS}
        width={SOCIAL_FORMATS.reel.width}
        height={SOCIAL_FORMATS.reel.height}
        defaultProps={SAMPLE_REEL}
      />
      <Composition
        id={REEL_CASO}
        component={ReelCaso}
        durationInFrames={totalFrames(reelCasoBeats(SAMPLE_CASO.salida, SAMPLE_CASO.nombre))}
        calculateMetadata={({ props }: { props: ReelCasoProps }) => ({ durationInFrames: totalFrames(reelCasoBeats(props.salida, props.nombre)) })}
        fps={SOCIAL_FPS}
        width={SOCIAL_FORMATS.reel.width}
        height={SOCIAL_FORMATS.reel.height}
        defaultProps={SAMPLE_CASO}
      />
    </>
  );
}

registerRoot(SocialRoot);
