import { Img, Sequence, useCurrentFrame } from "remotion";
import { CASE_BRANDS } from "@/data/brands/caseBrands";
import { TC_ASSETS, TC_BILINGUAL, TC_CHAPTERS, TC_COPY, TC_HOST, TC_LINES, TC_QUOTE_ASSETS, TC_TIMELINE, tcQuoteShots } from "@/data/films/flagships/truckersChoice";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { FilmFormatName } from "@/lib/filmLayout";
import { Fade } from "../scenes/brand/camera";
import { alpha, useBrand } from "../scenes/brand/context";
import { boxStyle, BoxText } from "../scenes/brand/dataKit";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { EASE_IN_OUT, progress, useFilmLayout, windowed } from "../scenes/theme";
import { FactsBeat, KitFrame, KitPanel, KitTitle, PlateManifesto, PlateOpening, ReelBeat } from "./kit/KitScenes";
import { tcBilingualLayout, tcRoofLayout } from "./truckersFilmLayout";

export type TruckersFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["truckers-choice"];

/**
 * "Seguros + permisos, bajo un mismo techo": Truckers Choice con su propia
 * estructura (ámbar sobre azul noche, Manrope e Inter). El camión y el mapa
 * del logo en partículas sobre el clip del hero, la noche en la ruta con los
 * clips del propio sitio, el mismo sitio en inglés y en español partido por
 * una cortina (escena protagonista), las seis líneas del catálogo bajo el
 * techo de la hoja de ruta, la cotización, las cifras y la firma.
 *
 * Todo sale del sitio publicado, recorrido en solo lectura.
 */
export function TruckersFilm({ language }: TruckersFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const copy = TC_COPY[language];
  const T = TC_TIMELINE;
  const b = brand.palette;
  const quoteAssets = TC_QUOTE_ASSETS[language];

  return (
    <KitFrame brand={brand} chapters={TC_CHAPTERS}>
      <Sequence name="Isotipo" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
        <PlateOpening
          format={format}
          duration={T.opening.duration}
          width={width}
          height={height}
          spec={{ asset: TC_ASSETS.hero, orientation: "banner", focal: { x: 0.55, y: 0.55 }, wordmark: { w: 648, h: 114 }, markAspect: 960 / 504 }}
          asset={TC_ASSETS.hero}
          poster={TC_ASSETS.heroPoster.src}
          kicker={copy.openingKicker}
          tagline={copy.openingTagline}
          wordmarkSrc={brand.logo.wordmark}
          particle={{ src: brand.logo.mark, mode: brand.logo.particleMode, colors: [b.text, b.accentSoft, b.accent] }}
        />
      </Sequence>

      <Sequence name="Una noche en la ruta" from={T.night.from} durationInFrames={T.night.duration} premountFor={fps}>
        <PlateManifesto
          format={format}
          duration={T.night.duration}
          asset={TC_ASSETS.storm}
          beats={copy.nightBeats}
          veil={0.2}
          ratio={[1.2, 0.8]}
          plates={[
            { asset: TC_ASSETS.storm, poster: TC_ASSETS.stormPoster.src, focal: { x: 0.55, y: 0.5 } },
            { asset: TC_ASSETS.paperwork, focal: { x: 0.35, y: 0.4 } },
            { asset: TC_ASSETS.network, poster: TC_ASSETS.networkPoster.src },
            { asset: TC_ASSETS.sunrise, poster: TC_ASSETS.sunrisePoster.src, focal: { x: 0.6, y: 0.55 } },
          ]}
        />
      </Sequence>

      <Sequence name="Dos idiomas" from={T.bilingual.from} durationInFrames={T.bilingual.duration} premountFor={fps}>
        <BilingualSplit language={language} format={format} duration={T.bilingual.duration} />
      </Sequence>

      <Sequence name="Un solo techo" from={T.roof.from} durationInFrames={T.roof.duration} premountFor={fps}>
        <OneRoof language={language} format={format} duration={T.roof.duration} />
      </Sequence>

      <Sequence name="La cotización" from={T.quote.from} durationInFrames={T.quote.duration} premountFor={fps}>
        <ReelBeat
          format={format}
          duration={T.quote.duration}
          kicker={copy.quoteKicker}
          title={copy.quoteTitle}
          note={copy.quoteNote}
          shots={tcQuoteShots(language)}
          aspect={quoteAssets.quote0.w / quoteAssets.quote0.h}
          nativeWidth={quoteAssets.quote0.w}
          host={TC_HOST}
          noteLabels={copy.quoteNotes}
          srcFor={(shot) => quoteAssets[shot.name as keyof typeof quoteAssets].src}
        />
      </Sequence>

      <Sequence name="Ingeniería" from={T.engineering.from} durationInFrames={T.engineering.duration} premountFor={fps}>
        <FactsBeat format={format} duration={T.engineering.duration} language={language} kicker={copy.engineeringKicker} title={copy.engineeringTitle} facts={copy.engineeringFacts} />
      </Sequence>

      <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
        <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
      </Sequence>
    </KitFrame>
  );
}

type SceneProps = { language: FilmLanguage; format: FilmFormatName; duration: number };

/**
 * Tiempos de cada parada del recorrido bilingüe (frames locales): la cortina
 * va a la mitad, se sostiene con los dos idiomas lado a lado y termina de
 * cruzar. Cada parada arranca en el idioma en que terminó la anterior; la
 * última se queda partida al medio.
 */
const STOP = { length: 200, cross: 16, half: [30, 78], full: [112, 158] } as const;

/** Posición de la cortina (0: todo en español, 1: todo en inglés) en cada parada. */
const CURTAIN: Array<[number, number, number]> = [
  [1, 0.5, 0],
  [0, 0.5, 1],
  [1, 0.5, 0.5],
];

/** 3 · El mismo sitio en /en y en /es: la cortina recorre la página y la barra cambia de ruta. */
function BilingualSplit({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = TC_COPY[language];
  const layout = tcBilingualLayout(format, copy, TC_HOST);
  const { screen, bar, win } = layout;
  const stopIndex = Math.min(TC_BILINGUAL.length - 1, Math.floor(frame / STOP.length));
  const local = frame - stopIndex * STOP.length;
  const [start, mid, end] = CURTAIN[stopIndex];
  const curtain = start + (mid - start) * progress(local, STOP.half[0], STOP.half[1], EASE_IN_OUT) + (end - mid) * progress(local, STOP.full[0], STOP.full[1], EASE_IN_OUT);
  const dominant = curtain >= 0.5 ? "en" : "es";
  const stop = TC_BILINGUAL[stopIndex];
  const stopCopy = copy.bilingualStops[stop.id];
  const route = copy.routes[stopIndex];
  // La leyenda cambia con cada parada; la última se queda hasta el final.
  const captionShow = stopIndex === TC_BILINGUAL.length - 1 ? progress(local, 8, 26) : windowed(local, 8, 26, STOP.length - 18, STOP.length);
  const open = progress(frame, 0, 28, EASE_IN_OUT);
  const dividerX = screen.x + curtain * screen.w;
  const dividerShow = Math.min(1, Math.min(curtain, 1 - curtain) * 12);

  return (
    <Fade duration={duration}>
      <KitTitle kicker={copy.bilingualKicker} title={copy.bilingualTitle} box={layout.title} format={format} />
      <div style={{ opacity: open, transform: `translateY(${(1 - open) * 18}px)` }}>
        <KitPanel box={win} glow={0.35} />
        {/* Barra del navegador: la ruta sigue al idioma que domina la ventana. */}
        <div style={{ ...boxStyle(bar), borderBottom: `1px solid ${b.palette.line}`, background: alpha(b.palette.bg, 70), borderTopLeftRadius: b.radius, borderTopRightRadius: b.radius }} />
        {[0, 1, 2].map((dot) => (
          <div key={dot} style={{ position: "absolute", left: bar.x + 18 + dot * 16, top: bar.y + bar.h / 2 - 5, width: 10, height: 10, borderRadius: 5, background: alpha(b.palette.muted, 45) }} />
        ))}
        <BoxText block={{ ...layout.url, text: `${TC_HOST}/${dominant}` }} style={{ fontFamily: b.fonts.label, color: b.palette.muted }}>
          {TC_HOST}
          <span style={{ color: b.palette.accent, fontWeight: 600 }}>/{dominant}</span>
        </BoxText>
        {/* Pantalla: cada parada entra encima de la anterior; el español se recorta desde la cortina. */}
        <div style={{ ...boxStyle(screen), overflow: "hidden", borderBottomLeftRadius: b.radius, borderBottomRightRadius: b.radius }}>
          {TC_BILINGUAL.map((item, index) => {
            const from = index * STOP.length;
            if (frame < from - STOP.cross || frame >= from + STOP.length + STOP.cross) return null;
            const fade = index === 0 ? 1 : progress(frame, from - STOP.cross, from);
            const push = 1 + 0.035 * progress(frame, from - STOP.cross, from + STOP.length, EASE_IN_OUT);
            const [s, m, e] = CURTAIN[index];
            const t = frame - from;
            const cut = s + (m - s) * progress(t, STOP.half[0], STOP.half[1], EASE_IN_OUT) + (e - m) * progress(t, STOP.full[0], STOP.full[1], EASE_IN_OUT);
            const image = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", maxWidth: "none", transform: `scale(${push})`, transformOrigin: "50% 30%" } as const;
            return (
              <div key={item.id} style={{ position: "absolute", inset: 0, opacity: fade }}>
                <Img src={item.en.src} style={image} />
                <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 0 0 ${cut * 100}%)` }}>
                  <Img src={item.es.src} style={image} />
                </div>
              </div>
            );
          })}
        </div>
        {/* Cortina: línea ámbar con su manija. */}
        <div style={{ position: "absolute", left: dividerX - 1.5, top: screen.y, width: 3, height: screen.h, background: b.palette.accent, opacity: dividerShow, boxShadow: `0 0 24px ${alpha(b.palette.accent, 60)}` }} />
        <div
          style={{
            position: "absolute",
            left: dividerX - 22,
            top: screen.y + screen.h / 2 - 22,
            width: 44,
            height: 44,
            borderRadius: 22,
            background: b.palette.accent,
            color: b.palette.onAccent,
            opacity: dividerShow,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: b.fonts.label,
            fontWeight: 700,
            fontSize: 20,
          }}
        >
          ⇆
        </div>
        {(["en", "es"] as const).map((lang) => {
          const block = lang === "en" ? layout.langEn : layout.langEs;
          const visible = lang === "en" ? Math.min(1, curtain * 8) : Math.min(1, (1 - curtain) * 8);
          return (
            <BoxText
              key={lang}
              block={block}
              align="center"
              style={{ fontFamily: b.fonts.label, fontWeight: 700, letterSpacing: "0.08em", color: lang === dominant ? b.palette.onAccent : b.palette.text, background: lang === dominant ? b.palette.accent : alpha(b.palette.bg, 80), border: `1px solid ${alpha(b.palette.accent, 60)}`, borderRadius: block.box.h / 2, opacity: visible }}
            />
          );
        })}
      </div>
      {/* Leyenda de la parada y el par de rutas espejo. */}
      <div style={{ opacity: captionShow }}>
        <BoxText block={{ ...layout.kicker, text: stopCopy.kicker }} style={{ fontFamily: b.fonts.label, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: b.palette.accentSoft }} />
        <BoxText block={{ ...layout.stopText, text: stopCopy.text }} style={{ fontFamily: b.fonts.display, fontWeight: 700, color: b.palette.text, letterSpacing: "-0.01em" }} />
      </div>
      <div style={{ opacity: progress(frame, 24, 44) }}>
        <KitPanel box={layout.routesBox} />
        {layout.routeRows.map((row, index) => {
          const lang = index === 0 ? "en" : "es";
          const active = lang === dominant;
          return (
            <div key={lang}>
              <BoxText block={row.lang} style={{ fontFamily: b.fonts.label, fontWeight: 700, letterSpacing: "0.08em", color: active ? b.palette.accent : b.palette.muted }} />
              <BoxText block={{ ...row.path, text: route[lang] }} style={{ fontFamily: b.fonts.label, color: active ? b.palette.text : alpha(b.palette.muted, 80), opacity: captionShow }} />
            </div>
          );
        })}
      </div>
    </Fade>
  );
}

/** Tiempos del techo: se dibuja, suben los pasos, entran las líneas y la cuenta llega a 30. */
const ROOF = { drawFrom: 8, drawTo: 52, columnsFrom: 40, columnEvery: 14, chipsFrom: 84, chipEvery: 24, labelFrom: 250 } as const;

/** 4 · Las seis líneas del catálogo bajo el techo de la hoja de ruta de cuatro pasos. */
function OneRoof({ language, format, duration }: SceneProps) {
  const b = useBrand();
  const frame = useCurrentFrame();
  const copy = TC_COPY[language];
  const layout = tcRoofLayout(format, copy, language);
  const { roof } = layout;
  const draw = progress(frame, ROOF.drawFrom, ROOF.drawTo, EASE_IN_OUT);
  const roofLength = 2 * Math.hypot(roof.w / 2, roof.h - 6);
  const order: string[] = TC_LINES.map((line) => line.id);
  const chipAt = (id: string) => ROOF.chipsFrom + order.indexOf(id) * ROOF.chipEvery;
  // La cuenta suma los trámites de cada línea a medida que entra (con su propio conteo).
  const counted = TC_LINES.reduce((sum, line) => sum + line.filings * progress(frame, chipAt(line.id), chipAt(line.id) + 18), 0);

  return (
    <Fade duration={duration}>
      <KitTitle kicker={copy.roofKicker} title={copy.roofTitle} box={layout.title} format={format} />
      <svg width={roof.w} height={roof.h} style={{ position: "absolute", left: roof.x, top: roof.y, overflow: "visible" }}>
        <path
          d={`M 0 ${roof.h} L ${roof.w / 2} 6 L ${roof.w} ${roof.h}`}
          fill="none"
          stroke={b.palette.accent}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeDasharray={roofLength}
          strokeDashoffset={roofLength * (1 - draw)}
          style={{ filter: `drop-shadow(0 0 14px ${alpha(b.palette.accent, 55)})` }}
        />
      </svg>
      {layout.columns.map((column) => {
        const rise = progress(frame, ROOF.columnsFrom + column.step * ROOF.columnEvery, ROOF.columnsFrom + column.step * ROOF.columnEvery + 24);
        const lit = Math.max(...column.chips.map((chip) => progress(frame, chipAt(chip.id), chipAt(chip.id) + 12)), 0);
        return (
          <div key={column.step} style={{ opacity: rise, transform: `translateY(${(1 - rise) * 24}px)` }}>
            <KitPanel box={column.panel} glow={lit * 0.5} />
            <BoxText block={column.index} style={{ fontFamily: b.fonts.label, fontWeight: 700, color: b.palette.accent, fontVariantNumeric: "tabular-nums" }} />
            <BoxText block={column.name} style={{ fontFamily: b.fonts.display, fontWeight: 700, color: b.palette.text }} />
            {column.chips.map((chip) => {
              const pop = progress(frame, chipAt(chip.id), chipAt(chip.id) + 14);
              const line = TC_LINES.find((item) => item.id === chip.id)!;
              const shown = Math.round(line.filings * progress(frame, chipAt(chip.id), chipAt(chip.id) + 18));
              return (
                <div key={chip.id} style={{ opacity: pop, transform: `translateX(${(1 - pop) * -14}px)` }}>
                  <div style={{ ...boxStyle(chip.box), boxSizing: "border-box", borderRadius: b.radius * 0.75, background: alpha(b.palette.bg, 70), border: `1px solid ${alpha(b.palette.accent, 25 + pop * 20)}` }} />
                  <BoxText block={chip.label} style={{ fontFamily: b.fonts.body, fontWeight: 500, color: b.palette.text }} />
                  <div style={{ ...boxStyle(chip.badge), borderRadius: chip.badge.w / 2, background: b.palette.accent }} />
                  <BoxText block={{ ...chip.count, text: String(shown) }} align="center" style={{ fontFamily: b.fonts.label, fontWeight: 700, color: b.palette.onAccent, fontVariantNumeric: "tabular-nums" }} />
                </div>
              );
            })}
          </div>
        );
      })}
      <BoxText block={{ ...layout.total, text: String(Math.round(counted)) }} align="right" style={{ fontFamily: b.fonts.display, fontWeight: 800, color: b.palette.accent, fontVariantNumeric: "tabular-nums", opacity: progress(frame, ROOF.chipsFrom - 10, ROOF.chipsFrom + 6) }} />
      <BoxText block={layout.totalLabel} valign="center" style={{ fontFamily: b.fonts.display, fontWeight: 600, color: b.palette.text, opacity: progress(frame, ROOF.labelFrom - 20, ROOF.labelFrom) }} />
    </Fade>
  );
}
