import type { ComponentType } from "react";
import { Composition, registerRoot } from "remotion";
import { SocialCarruselVideo, SocialReelCaso, SocialReelComparacion, SocialReelConteo, SocialReelEncuesta, SocialReelTexto, SocialSlide } from "@/components/social/SocialCompositions";
import { carruselComposition, REEL_CASO, REEL_COMPARACION, REEL_CONTEO, REEL_ENCUESTA, REEL_TEXTO, slideComposition, type CarruselVideoProps, type ReelCasoProps, type ReelComparacionProps, type ReelConteoProps, type ReelEncuestaProps, type ReelTextoProps, type SlideProps } from "@/data/social/render";
import { carruselVideoFrames, reelCasoBeats, reelComparacionBeats, reelConteoBeats, reelEncuestaBeats, reelTextoBeats, SLIDE_STILL_FRAMES, totalFrames } from "@/data/social/timing";
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
const ReelConteo = withFonts(SocialReelConteo);
const ReelComparacion = withFonts(SocialReelComparacion);
const ReelEncuesta = withFonts(SocialReelEncuesta);

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
const SAMPLE_CONTEO: ReelConteoProps = {
  salida: {
    id: "muestra-conteo",
    plantilla: "reel-conteo",
    para: ["instagram"],
    gancho: "Tres decisiones de *arquitectura*",
    items: [
      { titulo: "Cero dependencias innecesarias", texto: "Menos capas implican menos puntos de fallo." },
      { titulo: "Modelos de datos verificados", texto: "Las interfaces se definen antes de codificar." },
      { titulo: "Cortes al milisegundo", texto: "El ritmo visual acompaña el cambio de idea." },
    ],
    remate: "Menos ruido. *Más precisión técnica.*",
    cta: "Seguime para más criterio de ingeniería",
  },
};
const SAMPLE_COMPARACION: ReelComparacionProps = {
  salida: {
    id: "muestra-comparacion",
    plantilla: "reel-comparacion",
    para: ["instagram"],
    gancho: "Dos maneras de *pensar un formulario*",
    antes: { rotulo: "Antes", texto: "Un correo estático que nadie revisa a tiempo." },
    despues: { rotulo: "Después", texto: "Un flujo conectado que valida y clasifica en vivo." },
    remate: "La diferencia es *un sistema real*.",
    cta: "Guardalo para tu próximo desarrollo",
  },
};
const SAMPLE_ENCUESTA: ReelEncuestaProps = {
  salida: {
    id: "muestra-encuesta",
    plantilla: "reel-encuesta",
    para: ["instagram"],
    pregunta: "¿Qué componente te lleva *más tiempo*?",
    opciones: ["Validación de esquemas", "Diseño de animaciones", "Pipes de integración", "Testing automatizado"],
    cta: "Comentá tu letra para ver cómo resolverlo",
  },
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
      <Composition
        id={REEL_CONTEO}
        component={ReelConteo}
        durationInFrames={totalFrames(reelConteoBeats(SAMPLE_CONTEO.salida))}
        calculateMetadata={({ props }: { props: ReelConteoProps }) => ({ durationInFrames: totalFrames(reelConteoBeats(props.salida)) })}
        fps={SOCIAL_FPS}
        width={SOCIAL_FORMATS.reel.width}
        height={SOCIAL_FORMATS.reel.height}
        defaultProps={SAMPLE_CONTEO}
      />
      <Composition
        id={REEL_COMPARACION}
        component={ReelComparacion}
        durationInFrames={totalFrames(reelComparacionBeats(SAMPLE_COMPARACION.salida))}
        calculateMetadata={({ props }: { props: ReelComparacionProps }) => ({ durationInFrames: totalFrames(reelComparacionBeats(props.salida)) })}
        fps={SOCIAL_FPS}
        width={SOCIAL_FORMATS.reel.width}
        height={SOCIAL_FORMATS.reel.height}
        defaultProps={SAMPLE_COMPARACION}
      />
      <Composition
        id={REEL_ENCUESTA}
        component={ReelEncuesta}
        durationInFrames={totalFrames(reelEncuestaBeats(SAMPLE_ENCUESTA.salida))}
        calculateMetadata={({ props }: { props: ReelEncuestaProps }) => ({ durationInFrames: totalFrames(reelEncuestaBeats(props.salida)) })}
        fps={SOCIAL_FPS}
        width={SOCIAL_FORMATS.reel.width}
        height={SOCIAL_FORMATS.reel.height}
        defaultProps={SAMPLE_ENCUESTA}
      />
    </>
  );
}

registerRoot(SocialRoot);
