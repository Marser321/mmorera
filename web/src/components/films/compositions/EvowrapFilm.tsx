import { Sequence, useCurrentFrame, Img } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  EVO_ASSETS,
  EVO_CHAPTERS,
  EVO_COPY,
  EVO_FINISH_KEYS,
  EVO_FINISHES,
  EVO_HOST,
  EVO_TIMELINE,
} from "@/data/films/flagships/evowrap";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateOpening, ShotsBeat } from "./kit/KitScenes";
import { evoFinishSelectorLayout, evoTransformationLayout } from "./evowrapFilmLayout";

export type EvowrapFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["evowrap"];

/**
 * Escena de transformación: Comparador antes y después.
 * Deslizador interactivo sobre carrocería de superdeportivo.
 */
function TransformationScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = EVO_COPY[language];
  const layout = evoTransformationLayout(format, copy);

  // Animación suave del deslizador antes/después (recorre de 0.2 a 0.8 y se estabiliza al centro)
  const sweep = 0.5 + 0.3 * Math.sin(((frame - 20) / (duration - 40)) * Math.PI * 2);
  const wipeX = Math.max(0.15, Math.min(0.85, sweep));
  const dividerLeft = layout.frame.w * wipeX;

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={language === "es" ? "Transformación vehicular" : "Vehicle transformation"}
        title={copy.transformation.title}
        box={layout.title}
        format={format}
      />

      {/* Marco principal del comparador */}
      <div
        style={{
          ...boxStyle(layout.frame),
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${b.palette.line}`,
          backgroundColor: b.palette.bg,
          boxShadow: `0 24px 60px ${alpha("#000000", 60)}`,
        }}
      >
        {/* Capa ANTES (Ferrari de fábrica) */}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Img
            src={EVO_ASSETS.ferrariBefore.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              maxWidth: "none",
            }}
          />
        </div>

        {/* Capa DESPUÉS (Ferrari transformado con clip-path) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            clipPath: `polygon(${wipeX * 100}% 0%, 100% 0%, 100% 100%, ${wipeX * 100}% 100%)`,
          }}
        >
          <Img
            src={EVO_ASSETS.ferrariAfter.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              maxWidth: "none",
            }}
          />
        </div>

        {/* Línea divisoria del deslizador */}
        <div
          style={{
            position: "absolute",
            left: dividerLeft - 1,
            top: 0,
            bottom: 0,
            width: 3,
            backgroundColor: b.palette.accent,
            boxShadow: `0 0 16px ${alpha(b.palette.accent, 80)}`,
          }}
        />

        {/* Manija central del deslizador */}
        <div
          style={{
            position: "absolute",
            left: dividerLeft - 18,
            top: layout.frame.h / 2 - 18,
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor: b.palette.accent,
            border: `2px solid #FFFFFF`,
            boxShadow: `0 0 20px ${alpha(b.palette.accent, 90)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: b.palette.onAccent }} />
        </div>
      </div>

      {/* Badges de estado Antes / Después */}
      <div
        style={{
          ...boxStyle(layout.beforeBadge),
          borderRadius: 8,
          backgroundColor: alpha(b.palette.bg, 85),
          border: `1px solid ${b.palette.line}`,
          backdropFilter: "blur(8px)",
        }}
      />
      <BoxText
        block={layout.beforeLabel}
        style={{
          color: b.palette.muted,
          fontFamily: b.fonts.label,
          fontWeight: 600,
          textAlign: "center",
          letterSpacing: "0.06em",
        }}
      />

      <div
        style={{
          ...boxStyle(layout.afterBadge),
          borderRadius: 8,
          backgroundColor: alpha(b.palette.bg, 85),
          border: `1px solid ${b.palette.accent}`,
          boxShadow: `0 0 12px ${alpha(b.palette.accent, 40)}`,
          backdropFilter: "blur(8px)",
        }}
      />
      <BoxText
        block={layout.afterLabel}
        style={{
          color: b.palette.accentSoft,
          fontFamily: b.fonts.label,
          fontWeight: 700,
          textAlign: "center",
          letterSpacing: "0.06em",
        }}
      />

      {/* Nota inferior explicativa */}
      <BoxText
        block={layout.note}
        style={{
          color: b.palette.muted,
          fontFamily: b.fonts.body,
          textAlign: "center",
        }}
      />
    </Fade>
  );
}

/**
 * Escena protagonista: El configurador 3D interactivo.
 * Visualizador tridimensional con 8 acabados seleccionables en tiempo real.
 */
function FinishSelectorScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = EVO_COPY[language];
  const layout = evoFinishSelectorLayout(format, copy, language);

  // 8 acabados a lo largo de los 720 cuadros (~85 cuadros cada uno)
  const slotFrames = (duration - 40) / 8;
  const currentIndex = Math.max(0, Math.min(7, Math.floor((frame - 20) / slotFrames)));
  const activeKey = EVO_FINISH_KEYS[currentIndex];
  const activeDef = EVO_FINISHES.find((f) => f.id === activeKey)!;

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={language === "es" ? "Visualizador 3D" : "3D Visualizer"}
        title={copy.selector.title}
        box={layout.title}
        format={format}
      />

      {/* Ventana de visualizador 3D */}
      <div
        style={{
          ...boxStyle(layout.window.win),
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${b.palette.line}`,
          backgroundColor: b.palette.bg,
          boxShadow: `0 24px 60px ${alpha("#000000", 0.6)}`,
        }}
      >
        {/* Barra superior de navegador */}
        <div
          style={{
            height: layout.window.bar.h,
            backgroundColor: b.palette.surface,
            borderBottom: `1px solid ${b.palette.line}`,
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Botones de control de ventana */}
          <div style={{ display: "flex", gap: 6, marginLeft: 16 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: alpha(b.palette.muted, 40) }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: alpha(b.palette.muted, 40) }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: alpha(b.palette.muted, 40) }} />
          </div>
          <div
            style={{
              marginLeft: 20,
              padding: "3px 12px",
              borderRadius: 6,
              backgroundColor: alpha(b.palette.raised, 80),
              border: `1px solid ${alpha(b.palette.line, 60)}`,
              color: b.palette.muted,
              fontSize: layout.window.url.size,
              fontFamily: b.fonts.label,
            }}
          >
            {`${EVO_HOST}/visualizer`}
          </div>
        </div>

        {/* Pantalla con render del visualizador */}
        <div
          style={{
            height: layout.window.screen.h,
            position: "relative",
            overflow: "hidden",
            backgroundColor: "#050505",
          }}
        >
          <Img
            src={EVO_ASSETS.visualizer.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              maxWidth: "none",
            }}
          />

          {/* Velo de tono interactivo sutil simulando el cambio de color de carrocería */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 45% 55%, ${alpha(activeDef.colorHex, 35)} 0%, transparent 65%)`,
              mixBlendMode: "color-dodge",
              pointerEvents: "none",
            }}
          />

          {/* Badge interactivo con el acabado activo */}
          <div
            style={{
              position: "absolute",
              right: 16,
              top: 14,
              padding: "6px 14px",
              borderRadius: 8,
              backgroundColor: alpha(b.palette.bg, 88),
              border: `1px solid ${activeDef.colorHex}`,
              boxShadow: `0 0 16px ${alpha(activeDef.colorHex, 45)}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: activeDef.colorHex,
                border: "1px solid #FFF",
              }}
            />
            <span
              style={{
                color: b.palette.text,
                fontSize: layout.window.url.size,
                fontFamily: b.fonts.display,
                fontWeight: 600,
              }}
            >
              {activeDef.name[language]}
            </span>
          </div>
        </div>
      </div>

      {/* 8 Tarjetas de acabados */}
      {layout.cards.map((c, index) => {
        const isActive = index === currentIndex;
        const cardIn = progress(frame, 15 + index * 4, 30 + index * 4, EASE_IN_OUT);
        const def = EVO_FINISHES.find((f) => f.id === c.id)!;
        const glow = isActive ? 0.9 : 0;

        return (
          <div key={c.id} style={{ opacity: cardIn }}>
            {/* Panel de fondo */}
            <KitPanel box={c.card} glow={glow} />

            {/* Muestra circular de acabado (swatch) */}
            <div
              style={{
                ...boxStyle(c.swatch),
                borderRadius: 8,
                backgroundColor: def.colorHex,
                border: `2px solid ${isActive ? b.palette.accentSoft : alpha(b.palette.line, 80)}`,
                boxShadow: isActive ? `0 0 14px ${alpha(def.colorHex, 80)}` : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Reflejo metálico sutil en el swatch */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 6,
                  background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Textos absolutos con BoxText */}
            <BoxText
              block={c.codeBlock}
              style={{
                color: isActive ? b.palette.accentSoft : b.palette.muted,
                fontFamily: b.fonts.label,
                fontWeight: 700,
              }}
            />

            <BoxText
              block={c.nameBlock}
              style={{
                color: isActive ? b.palette.text : alpha(b.palette.text, 80),
                fontFamily: b.fonts.display,
                fontWeight: 600,
              }}
            />

            <BoxText
              block={c.metaBlock}
              style={{
                color: isActive ? b.palette.accentSoft : alpha(b.palette.muted, 90),
                fontFamily: b.fonts.body,
              }}
            />
          </div>
        );
      })}
    </Fade>
  );
}

export function EvowrapFilm({ language }: EvowrapFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const copy = EVO_COPY[language];
  const T = EVO_TIMELINE;
  const b = brand.palette;

  return (
    <KitFrame brand={brand} chapters={EVO_CHAPTERS}>
      {/* 1. Apertura con partículas y placa institucional */}
      <Sequence name="Identidad" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={T.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: EVO_ASSETS.porscheCeramic,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 371, h: 92 },
            markAspect: 1,
          }}
          asset={EVO_ASSETS.porscheCeramic}
          kicker={copy.opening.kicker}
          tagline={copy.opening.subtitle}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 2. Transformación: Comparador interactivo antes y después */}
      <Sequence
        name="Transformación"
        from={T.transformation.from}
        durationInFrames={T.transformation.duration}
        premountFor={fps}
      >
        <TransformationScene format={format} duration={T.transformation.duration} language={language} />
      </Sequence>

      {/* 3. Escena protagonista: Configurador 3D con 8 acabados */}
      <Sequence name="Configurador" from={T.selector.from} durationInFrames={T.selector.duration} premountFor={fps}>
        <FinishSelectorScene format={format} duration={T.selector.duration} language={language} />
      </Sequence>

      {/* 4. Especialidades: Cuatro líneas de servicio automotor */}
      <Sequence name="Servicios" from={T.services.from} durationInFrames={T.services.duration} premountFor={fps}>
        <ShotsBeat
          format={format}
          duration={T.services.duration}
          kicker={language === "es" ? "Especialidades de estudio" : "Studio specialties"}
          title={copy.services.title}
          shots={[
            {
              ...EVO_ASSETS.services,
              label: language === "es" ? "Catálogo de 4 líneas de especialidad" : "Catalog of 4 specialty lines",
            },
            {
              ...EVO_ASSETS.ppfInstall,
              label: language === "es" ? "Paint Protection Film autorregenerable" : "Self-healing Paint Protection Film",
            },
            {
              ...EVO_ASSETS.matteGtr,
              label: language === "es" ? "Color Change Wrap en vinilo fundido" : "Cast vinyl Color Change Wrap",
            },
          ]}
        />
      </Sequence>

      {/* 5. Cifras y especificaciones técnicas */}
      <Sequence name="Especificaciones" from={T.specs.from} durationInFrames={T.specs.duration} premountFor={fps}>
        <FactsBeat
          format={format}
          duration={T.specs.duration}
          language={language}
          kicker={language === "es" ? "Estructura verificada" : "Verified structure"}
          title={copy.specs.title}
          facts={copy.specs.facts}
        />
      </Sequence>

      {/* 6. Firma institucional */}
      <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
        <SignatureScene
          portrait={portrait}
          width={width}
          height={height}
          duration={T.signature.duration}
        />
      </Sequence>
    </KitFrame>
  );
}
