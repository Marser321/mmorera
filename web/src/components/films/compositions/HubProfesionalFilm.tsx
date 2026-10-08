import { Img, Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  HUB_PROFESIONAL_ASSETS,
  HUB_PROFESIONAL_CHAPTERS,
  HUB_PROFESIONAL_COPY,
  HUB_PROFESIONAL_FACTS,
  HUB_PROFESIONAL_PROFESSIONS,
  HUB_PROFESIONAL_TIMELINE,
} from "@/data/films/flagships/hubProfesional";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateOpening } from "./kit/KitScenes";
import {
  hubProfessionSwitcherLayout,
  hubProtocolLayout,
  hubServicesLayout,
} from "./hubProfesionalFilmLayout";

export type HubProfesionalFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["hub-profesional-ai"];

/**
 * Escena 1: El Estándar Profesional (Manifesto) (8.5s / 255 frames).
 */
function ManifestoScene({
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
  const copy = HUB_PROFESIONAL_COPY.manifesto;

  const plates = [
    {
      kicker: copy.kicker[language],
      title: copy.title[language],
      sub: copy.sub[language],
    },
  ];

  const plate = plates[0];
  const itemIn = progress(frame, 12, 32, EASE_IN_OUT);

  return (
    <Fade duration={duration}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: format === "portrait" ? "0 40px" : "0 120px",
          textAlign: "center",
          opacity: itemIn,
          transform: `translateY(${(1 - itemIn) * 16}px)`,
        }}
      >
        <div
          style={{
            fontFamily: b.fonts.label,
            fontSize: format === "portrait" ? 18 : 16,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: b.palette.accent,
            marginBottom: 16,
            textTransform: "uppercase",
          }}
        >
          {plate.kicker}
        </div>

        <div
          style={{
            fontFamily: b.fonts.display,
            fontSize: format === "portrait" ? 36 : 48,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
            color: b.palette.text,
            maxWidth: 1000,
            marginBottom: 24,
            textTransform: "uppercase",
          }}
        >
          {plate.title}
        </div>

        <div
          style={{
            fontFamily: b.fonts.body,
            fontSize: format === "portrait" ? 20 : 20,
            lineHeight: 1.45,
            color: b.palette.muted,
            maxWidth: 820,
          }}
        >
          {plate.sub}
        </div>
      </div>
    </Fade>
  );
}

/**
 * Escena 2: PROTAGONISTA · Selector Multirrubro (24.0s / 720 frames).
 * Muestra el intercambio dinámico en vivo entre las 6 especialidades profesionales.
 */
function ProfessionSwitcherScene({
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
  const copy = HUB_PROFESIONAL_COPY.switcher;

  // 720 frames / 6 profesiones = 120 frames por profesión
  const profCount = HUB_PROFESIONAL_PROFESSIONS.length;
  const framesPerProf = duration / profCount;
  const currentProfIndex = Math.min(
    profCount - 1,
    Math.floor(frame / framesPerProf),
  );
  const prof = HUB_PROFESIONAL_PROFESSIONS[currentProfIndex];
  const layout = hubProfessionSwitcherLayout(format, language, currentProfIndex);

  // Progreso dentro de la profesión actual para transiciones
  const localFrame = frame % framesPerProf;
  const profEntrance = progress(localFrame, 0, 18, EASE_IN_OUT);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: "left",
        }}
      />

      {/* Riel de Tabs con las 6 profesiones */}
      {layout.tabs.map((tab, idx) => {
        const isActive = idx === currentProfIndex;
        const targetProf = HUB_PROFESIONAL_PROFESSIONS[idx];
        const tabAccent = targetProf.color;

        return (
          <div
            key={tab.id}
            style={{
              ...boxStyle(tab.box),
              position: "absolute",
              borderRadius: 8,
              background: isActive ? alpha(tabAccent, 24) : alpha(b.palette.surface, 85),
              border: `1.5px solid ${isActive ? tabAccent : alpha(b.palette.line, 80)}`,
              boxShadow: isActive ? `0 0 16px ${alpha(tabAccent, 35)}` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 8px",
            }}
          >
            <span
              style={{
                fontFamily: b.fonts.label,
                fontSize: format === "portrait" ? 18 : 13,
                fontWeight: isActive ? 800 : 600,
                color: isActive ? b.palette.text : b.palette.muted,
                textAlign: "center",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {targetProf.title[language]}
            </span>
          </div>
        );
      })}

      {/* Card principal activa con metamorfosis cromática */}
      <div
        style={{
          opacity: profEntrance,
          transform: `translateY(${(1 - profEntrance) * 10}px)`,
        }}
      >
        <KitPanel box={layout.activeCard} glow={0.35} />
        <div
          style={{
            ...boxStyle(layout.activeCard),
            position: "absolute",
            borderRadius: b.radius,
            background: alpha(b.palette.surface, 92),
            border: `1.5px solid ${prof.color}`,
            boxShadow: `0 0 32px ${alpha(prof.color, 25)}`,
          }}
        />

        {/* Badge superior */}
        <div
          style={{
            ...boxStyle(layout.badgeBox),
            position: "absolute",
            borderRadius: 99,
            background: alpha(prof.color, 20),
            border: `1px solid ${prof.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 14px",
          }}
        >
          <span
            style={{
              fontFamily: b.fonts.label,
              fontSize: format === "portrait" ? 15 : 13,
              fontWeight: 800,
              color: prof.color,
              textAlign: "center",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {prof.badge[language]}
          </span>
        </div>

        {/* Titular de la profesión */}
        <BoxText
          block={layout.titleBlock}
          style={{
            fontFamily: b.fonts.display,
            fontWeight: 800,
            color: b.palette.text,
            textAlign: "left",
          }}
        />

        {/* Gran titular / propuesta de valor adaptada */}
        <BoxText
          block={layout.headlineBlock}
          style={{
            fontFamily: b.fonts.display,
            fontWeight: 800,
            color: b.palette.text,
            textAlign: "left",
          }}
        />

        {/* Subtítulo descriptivo */}
        <BoxText
          block={layout.subBlock}
          style={{
            fontFamily: b.fonts.body,
            color: b.palette.muted,
            textAlign: "left",
          }}
        />

        {/* Barra de métricas y credenciales del rubro */}
        <div
          style={{
            ...boxStyle(layout.statsBox),
            position: "absolute",
            borderRadius: 8,
            background: alpha(b.palette.raised, 80),
            border: `1px solid ${alpha(prof.color, 40)}`,
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <span
            style={{
              fontFamily: b.fonts.label,
              fontSize: format === "portrait" ? 18 : 14,
              fontWeight: 700,
              color: prof.color,
              textAlign: "left",
            }}
          >
            {prof.stats[language]}
          </span>
        </div>

        {/* Mockup interactivo en previewCard */}
        <div
          style={{
            ...boxStyle(layout.previewCard),
            position: "absolute",
            borderRadius: 8,
            background: alpha(b.palette.bg, 95),
            border: `1px solid ${alpha(b.palette.line, 80)}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Cabecera del mockup */}
          <div
            style={{
              height: 28,
              background: alpha(b.palette.raised, 90),
              borderBottom: `1px solid ${b.palette.line}`,
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              gap: 6,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 99, background: "#FF5F56" }} />
            <div style={{ width: 8, height: 8, borderRadius: 99, background: "#FFBD2E" }} />
            <div style={{ width: 8, height: 8, borderRadius: 99, background: "#27C93F" }} />
            <div
              style={{
                marginLeft: 8,
                fontSize: 11,
                fontFamily: b.fonts.label,
                color: b.palette.muted,
                letterSpacing: "0.05em",
              }}
            >
              profecionalcv.vercel.app/{prof.id}
            </div>
          </div>

          {/* Contenido visual de la plantilla */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <Img
              src={idxHeroShot(currentProfIndex)}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top center",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(180deg, transparent 40%, ${alpha(b.palette.bg, 80)} 100%)`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Barra de hint interactivo al pie */}
      <div
        style={{
          ...boxStyle(layout.hintBar),
          position: "absolute",
          borderRadius: 8,
          background: alpha(b.palette.surface, 85),
          border: `1px solid ${alpha(b.palette.line, 70)}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 14px",
        }}
      >
        <span
          style={{
            fontFamily: b.fonts.label,
            fontSize: format === "portrait" ? 17 : 14,
            color: b.palette.muted,
            textAlign: "center",
          }}
        >
          {HUB_PROFESIONAL_COPY.switcher.hint[language]}
        </span>
      </div>
    </Fade>
  );
}

/**
 * Las capturas del sitio son de la plantilla de mecánica (la que se despliega
 * por defecto) y del showcase. Mecánica muestra la suya; los demás rubros, el
 * showcase: nunca fotos del taller rotuladas como otra especialidad.
 */
function idxHeroShot(index: number): string {
  return index === 0 ? HUB_PROFESIONAL_ASSETS.heroShot.src : HUB_PROFESIONAL_ASSETS.showcaseShot.src;
}

/**
 * Escena 3: Servicios Tácticos Elite (9.5s / 285 frames).
 */
function ServicesScene({
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
  const copy = HUB_PROFESIONAL_COPY.services;
  const layout = hubServicesLayout(format, language);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: "left",
        }}
      />

      {layout.services.map((srv, i) => {
        const itemIn = progress(frame, 8 + i * 8, 22 + i * 8, EASE_IN_OUT);

        return (
          <div
            key={srv.code}
            style={{
              opacity: itemIn,
              transform: `translateY(${(1 - itemIn) * 12}px)`,
            }}
          >
            <KitPanel box={srv.card} glow={0.2} />
            <div
              style={{
                ...boxStyle(srv.card),
                position: "absolute",
                borderRadius: b.radius,
                background: alpha(b.palette.surface, 88),
                border: `1.5px solid ${alpha(b.palette.line, 75)}`,
              }}
            />
              {/* Código SRV */}
              <div
                style={{
                  ...boxStyle(srv.codeBox),
                  position: "absolute",
                  borderRadius: 6,
                  background: alpha(b.palette.accent, 20),
                  border: `1px solid ${b.palette.accent}`,
                }}
              />
                <BoxText
                  block={srv.codeBlock}
                  style={{
                    fontFamily: b.fonts.label,
                    fontWeight: 800,
                    color: b.palette.accent,
                    textAlign: "center",
                  }}
                />

              <BoxText
                block={srv.titleBlock}
                style={{
                  fontFamily: b.fonts.display,
                  fontWeight: 700,
                  color: b.palette.text,
                  textAlign: "left",
                }}
              />

              <BoxText
                block={srv.specBlock}
                style={{
                  fontFamily: b.fonts.body,
                  color: b.palette.muted,
                  textAlign: "left",
                }}
              />
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Escena 4: Protocolo en 4 Fases (9.0s / 270 frames).
 */
function ProtocolScene({
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
  const copy = HUB_PROFESIONAL_COPY.protocol;
  const layout = hubProtocolLayout(format, language);

  return (
    <Fade duration={duration}>
      <KitTitle
        kicker={copy.kicker[language]}
        title={copy.title[language]}
        box={layout.title}
        format={format}
      />

      <BoxText
        block={layout.subtitleBlock}
        style={{
          fontFamily: b.fonts.body,
          color: b.palette.muted,
          textAlign: "left",
        }}
      />

      {layout.steps.map((st, i) => {
        const itemIn = progress(frame, 8 + i * 8, 22 + i * 8, EASE_IN_OUT);

        return (
          <div
            key={st.step}
            style={{
              opacity: itemIn,
              transform: `translateY(${(1 - itemIn) * 12}px)`,
            }}
          >
            <KitPanel box={st.card} glow={0.2} />
            <div
              style={{
                ...boxStyle(st.card),
                position: "absolute",
                borderRadius: b.radius,
                background: alpha(b.palette.surface, 88),
                border: `1.5px solid ${alpha(b.palette.line, 75)}`,
              }}
            />
              {/* Número del paso */}
              <div
                style={{
                  ...boxStyle(st.stepBox),
                  position: "absolute",
                  borderRadius: 6,
                  background: alpha(b.palette.raised, 90),
                  border: `1px solid ${alpha(b.palette.line, 90)}`,
                }}
              />
                <BoxText
                  block={st.stepBlock}
                  style={{
                    fontFamily: b.fonts.label,
                    fontWeight: 800,
                    color: b.palette.accent,
                    textAlign: "center",
                  }}
                />

              <BoxText
                block={st.nameBlock}
                style={{
                  fontFamily: b.fonts.display,
                  fontWeight: 700,
                  color: b.palette.text,
                  textAlign: "left",
                }}
              />

              <BoxText
                block={st.descBlock}
                style={{
                  fontFamily: b.fonts.body,
                  color: b.palette.muted,
                  textAlign: "left",
                }}
              />
          </div>
        );
      })}
    </Fade>
  );
}

/**
 * Escena 5: Métricas de Autoridad (FactsBeat) (7.0s / 210 frames).
 */
function MetricsScene({
  format,
  duration,
  language,
}: {
  format: FilmFormatName;
  duration: number;
  language: FilmLanguage;
}) {
  const copy = HUB_PROFESIONAL_COPY.metrics;
  const source = language === "es" ? "sitio en producción" : "live site";
  const facts = [
    { value: `${HUB_PROFESIONAL_FACTS.professionsCount.value}`, label: copy.professions[language], source },
    { value: `${HUB_PROFESIONAL_FACTS.protocolSteps.value}`, label: copy.steps[language], source },
    { value: `${HUB_PROFESIONAL_FACTS.inspectionPoints.value}`, label: copy.points[language], source },
  ];

  return (
    <FactsBeat
      format={format}
      duration={duration}
      language={language}
      kicker={copy.kicker[language]}
      title={copy.title[language]}
      facts={facts}
    />
  );
}

/**
 * Composición principal del film insignia Hub Profesional.
 */
export function HubProfesionalFilm({ language = "es" }: HubProfesionalFilmProps) {
  const { portrait, width, height, fps } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const b = brand.palette;

  return (
    <KitFrame brand={brand} chapters={[...HUB_PROFESIONAL_CHAPTERS]}>
      {/* 0. Apertura de marca (7s / 210 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.opening.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.opening.duration}
        premountFor={fps}
      >
        <PlateOpening
          format={format}
          duration={HUB_PROFESIONAL_TIMELINE.opening.duration}
          width={width}
          height={height}
          spec={{
            asset: HUB_PROFESIONAL_ASSETS.heroLoop,
            orientation: "banner",
            focal: { x: 0.5, y: 0.5 },
            wordmark: { w: 480, h: 120 },
            markAspect: 1,
          }}
          asset={HUB_PROFESIONAL_ASSETS.heroLoop}
          poster="/portfolio/brands/hub-profesional-ai/hero-loop-poster.jpg"
          kicker={HUB_PROFESIONAL_COPY.kicker[language]}
          tagline={HUB_PROFESIONAL_COPY.tagline[language]}
          wordmarkSrc={brand.logo.wordmark}
          particle={{
            src: brand.logo.mark,
            mode: brand.logo.particleMode,
            colors: [b.text, b.accentSoft, b.accent],
          }}
        />
      </Sequence>

      {/* 1. Manifesto: El Estándar Profesional (8.5s / 255 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.manifesto.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.manifesto.duration}
      >
        <ManifestoScene
          format={format}
          duration={HUB_PROFESIONAL_TIMELINE.manifesto.duration}
          language={language}
        />
      </Sequence>

      {/* 2. Selector Multirrubro (PROTAGONISTA: 24s / 720 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.switcher.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.switcher.duration}
      >
        <ProfessionSwitcherScene
          format={format}
          duration={HUB_PROFESIONAL_TIMELINE.switcher.duration}
          language={language}
        />
      </Sequence>

      {/* 3. Servicios Tácticos (9.5s / 285 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.services.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.services.duration}
      >
        <ServicesScene
          format={format}
          duration={HUB_PROFESIONAL_TIMELINE.services.duration}
          language={language}
        />
      </Sequence>

      {/* 4. Protocolo en 4 Fases (9s / 270 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.protocol.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.protocol.duration}
      >
        <ProtocolScene
          format={format}
          duration={HUB_PROFESIONAL_TIMELINE.protocol.duration}
          language={language}
        />
      </Sequence>

      {/* 5. Métricas de Autoridad (7s / 210 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.metrics.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.metrics.duration}
      >
        <MetricsScene
          format={format}
          duration={HUB_PROFESIONAL_TIMELINE.metrics.duration}
          language={language}
        />
      </Sequence>

      {/* 6. Firma y Cierre (6.5s / 195 f) */}
      <Sequence
        from={HUB_PROFESIONAL_TIMELINE.signature.from}
        durationInFrames={HUB_PROFESIONAL_TIMELINE.signature.duration}
        premountFor={fps}
      >
        <SignatureScene
          portrait={portrait}
          width={width}
          height={height}
          duration={HUB_PROFESIONAL_TIMELINE.signature.duration}
        />
      </Sequence>
    </KitFrame>
  );
}
