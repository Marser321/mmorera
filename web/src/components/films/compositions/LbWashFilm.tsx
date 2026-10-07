import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from "remotion";
import { resolveArchitecture } from "@/data/architecture/bundle";
import { bundle as lbArchitecture } from "@/data/architecture/bundles/lb-elite-wash-detail";
import { brandCssVars, CASE_BRANDS } from "@/data/brands/caseBrands";
import {
  LB_CHAPTERS,
  LB_COPY,
  LB_TIMELINE,
  LB_VEHICLE_TIERS,
} from "@/data/films/flagships/lbWash";
import type { FilmLanguage } from "@/data/films/filmTypes";
import { safeArea, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { ArchitectureScene } from "../scenes/brand/ArchitectureScene";
import { BrandTitle, Fade } from "../scenes/brand/camera";
import { alpha, BrandProvider, useBrand } from "../scenes/brand/context";
import { FactWall } from "../scenes/brand/FactWall";
import { DustField, ParticleLogo } from "../scenes/brand/ParticleLogo";
import { SignatureScene } from "../scenes/case/ClosingScenes";
import { Letterbox } from "../scenes/case/shared";
import { ChapterTicks } from "../scenes/primitives";
import { progress, useFilmLayout, windowed } from "../scenes/theme";
import {
  lbCrewLayout,
  lbFleetLayout,
  lbOpeningLayout,
  lbQuoterLayout,
} from "./lbWashFilmLayout";

export type LbWashFilmProps = {
  language: FilmLanguage;
};

const brand = CASE_BRANDS["lb-elite-wash-detail"];

function SceneTitle({
  kicker,
  title,
  box,
  portrait,
  from = 6,
}: {
  kicker?: string;
  title: string;
  box: Box;
  portrait: boolean;
  from?: number;
}) {
  return (
    <BrandTitle
      kicker={kicker}
      title={title}
      from={from}
      size={portrait ? 48 : 38}
      style={{ left: box.x, top: box.y, width: box.w }}
    />
  );
}

/**
 * "Detailing móvil de alta gama": L&B Elite Wash & Detail con su propia estructura
 * (azul eléctrico, Outfit e Inter).
 * 4 camionetas patrullando el suroeste de Florida, la regla rectora de una visita
 * por casa, cotizador por carrocería contra 88 servicios, arquitectura sin base de datos
 * sobre HighLevel CRM, la app móvil de la cuadrilla, ingeniería y firma.
 */
export function LbWashFilm({ language }: LbWashFilmProps) {
  const { fps, portrait, width, height } = useFilmLayout();
  const format: FilmFormatName = portrait ? "portrait" : "landscape";
  const safe = safeArea(format);
  const bands = stackBands(safe, [{ id: "title", h: portrait ? 180 : 110 }, { id: "body", flex: 1 }], 24);
  const T = LB_TIMELINE;
  const copy = LB_COPY[language];

  return (
    <BrandProvider brand={brand}>
      <AbsoluteFill
        style={{
          ...brandCssVars(brand),
          background: brand.palette.bg,
          overflow: "hidden",
          fontFamily: brand.fonts.body,
          color: brand.palette.text,
        }}
      >
        <DustField color={brand.palette.accentSoft} count={60} opacity={0.22} />

        {/* 1. Apertura e Identidad */}
        <Sequence name="Apertura" from={T.opening.from} durationInFrames={T.opening.duration} premountFor={fps}>
          <OpeningScene copy={copy} format={format} duration={T.opening.duration} />
        </Sequence>

        {/* 2. Regla Operativa: "Una visita, una camioneta" */}
        <Sequence name="Regla operativa" from={T.fleetRule.from} durationInFrames={T.fleetRule.duration} premountFor={fps}>
          <FleetRuleScene copy={copy} format={format} duration={T.fleetRule.duration} />
        </Sequence>

        {/* 3. Cotizador Dinámico por Carrocería */}
        <Sequence name="Cotizador" from={T.quoter.from} durationInFrames={T.quoter.duration} premountFor={fps}>
          <VehicleQuoterScene copy={copy} format={format} language={language} duration={T.quoter.duration} />
        </Sequence>

        {/* 4. Arquitectura Database-less en Archify */}
        <Sequence name="Arquitectura" from={T.architecture.from} durationInFrames={T.architecture.duration} premountFor={fps}>
          <ArchitectureSection language={language} bands={bands} portrait={portrait} duration={T.architecture.duration} />
        </Sequence>

        {/* 5. La Cuadrilla en Campo */}
        <Sequence name="Cuadrilla" from={T.crew.from} durationInFrames={T.crew.duration} premountFor={fps}>
          <FieldCrewScene copy={copy} format={format} duration={T.crew.duration} />
        </Sequence>

        {/* 6. Muro de Ingeniería y Verificación */}
        <Sequence name="Ingeniería" from={T.engineering.from} durationInFrames={T.engineering.duration} premountFor={fps}>
          <EngineeringSection language={language} bands={bands} portrait={portrait} duration={T.engineering.duration} />
        </Sequence>

        {/* 7. Firma y Monograma Final */}
        <Sequence name="Firma" from={T.signature.from} durationInFrames={T.signature.duration} premountFor={fps}>
          <SignatureScene portrait={portrait} width={width} height={height} duration={T.signature.duration} />
        </Sequence>

        <Letterbox portrait={portrait} />
        <ChapterTicks
          chapters={LB_CHAPTERS}
          size={portrait ? 8 : 6}
          style={{ left: portrait ? 72 : 120, right: portrait ? 72 : 120, bottom: 26, zIndex: 21 }}
        />
      </AbsoluteFill>
    </BrandProvider>
  );
}

function ArchitectureSection({
  language,
  bands,
  portrait,
  duration,
}: {
  language: FilmLanguage;
  bands: Record<string, Box>;
  portrait: boolean;
  duration: number;
}) {
  const copy = LB_COPY[language];
  const architecture = resolveArchitecture(lbArchitecture, language, portrait ? "portrait" : "landscape");
  const parts = stackBands(bands.body, [{ id: "diagram", flex: 1 }, { id: "caption", h: portrait ? 170 : 92 }], portrait ? 20 : 14);
  const build = 75;
  const viewsCount = architecture.diagram.meta.views?.length || 3;
  return (
    <Fade duration={duration}>
      <SceneTitle kicker="Arquitectura de CRM & Agenda" title={copy.archTitle} box={bands.title} portrait={portrait} />
      <ArchitectureScene
        diagram={architecture.diagram}
        layout={architecture.layout}
        area={parts.diagram}
        caption={{ x: parts.caption.x, y: parts.caption.y, w: parts.caption.w, size: portrait ? 28 : 20 }}
        maxZoom={1.6}
        buildFrames={build}
        viewFrames={Math.floor((duration - build) / viewsCount)}
      />
    </Fade>
  );
}

function EngineeringSection({
  language,
  bands,
  portrait,
  duration,
}: {
  language: FilmLanguage;
  bands: Record<string, Box>;
  portrait: boolean;
  duration: number;
}) {
  const copy = LB_COPY[language];
  return (
    <Fade duration={duration}>
      <SceneTitle kicker="Ingeniería de Producción" title="Métricas Verificadas de Operación" box={bands.title} portrait={portrait} />
      <FactWall
        box={bands.body}
        duration={duration}
        language={language}
        facts={copy.engineeringFacts.map((f) => ({ value: f.value, label: f.label, source: f.source }))}
      />
    </Fade>
  );
}

function OpeningScene({ copy, format, duration }: { copy: typeof LB_COPY["es"]; format: FilmFormatName; duration: number }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const layout = lbOpeningLayout(format);
  const enter = progress(frame, 0, 45);
  const glow = interpolate(frame, [0, 45, duration], [0.1, 0.45, 0.25], { extrapolateRight: "clamp" });
  const logoSize = Math.round(layout.markBox.w * 0.75);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: layout.markBox.x,
          top: layout.markBox.y,
          width: layout.markBox.w,
          height: layout.markBox.h,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: layout.markBox.w * 0.9,
            height: layout.markBox.h * 0.9,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${b.palette.accentSoft} 0%, transparent 70%)`,
            opacity: glow,
          }}
        />
        <ParticleLogo
          src={b.logo.mark}
          mode={b.logo.particleMode}
          colors={[b.palette.accentSoft, b.palette.accent, b.palette.accentDeep]}
          size={logoSize}
          center={{ x: layout.markBox.x + layout.markBox.w / 2, y: layout.markBox.y + layout.markBox.h / 2 }}
          formFrom={6}
          formTo={60}
          dissolveAt={duration - 20}
          count={2200}
          restAlpha={0.95}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: layout.titleBox.x,
          top: layout.titleBox.y,
          width: layout.titleBox.w,
          height: layout.titleBox.h,
          opacity: enter,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: format === "portrait" ? 22 : 18,
            color: b.palette.accentSoft,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontFamily: b.fonts.label,
            marginBottom: 16,
          }}
        >
          {copy.heroTag}
        </div>
        <h1
          style={{
            fontSize: format === "portrait" ? 48 : 46,
            fontWeight: 700,
            lineHeight: 1.15,
            color: b.palette.text,
            fontFamily: b.fonts.display,
            margin: 0,
            marginBottom: 16,
          }}
        >
          {copy.heroHeadline}
        </h1>
        <p
          style={{
            fontSize: format === "portrait" ? 24 : 20,
            color: b.palette.muted,
            lineHeight: 1.45,
            margin: 0,
          }}
        >
          {copy.heroSubline}
        </p>
      </div>
    </AbsoluteFill>
  );
}

function FleetRuleScene({ copy, format, duration }: { copy: typeof LB_COPY["es"]; format: FilmFormatName; duration: number }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const layout = lbFleetLayout(format);
  const fade = windowed(frame, 0, duration, 20, 20);

  const vans = [
    { id: "van-1", label: "Camioneta 01", location: "Cape Coral", status: "En servicio · 3h30", active: true },
    { id: "van-2", label: "Camioneta 02", location: "Fort Myers", status: "En servicio · 2h00", active: true },
    { id: "van-3", label: "Camioneta 03", location: "Naples", status: "Hold 15m · Espera pago", active: true },
    { id: "van-4", label: "Camioneta 04", location: "Estero", status: "Disponible · Próx. turno", active: false },
  ];

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <SceneTitle kicker="Regla Operativa Central" title={copy.rulePrinciple} box={layout.titleBox} portrait={format === "portrait"} />

      <div style={{ position: "absolute", left: layout.vansBox.x, top: layout.vansBox.y, width: layout.vansBox.w, height: layout.vansBox.h }}>
        <div style={{ display: "grid", gridTemplateColumns: format === "portrait" ? "1fr 1fr" : "1fr 1fr", gap: 14 }}>
          {vans.map((van, i) => {
            const vanEnter = progress(frame, 15 + i * 10, 35 + i * 10);
            return (
              <div
                key={van.id}
                style={{
                  background: b.palette.surface,
                  border: `1px solid ${van.active ? b.palette.accentDeep : b.palette.line}`,
                  borderRadius: 14,
                  padding: 16,
                  opacity: vanEnter,
                  transform: `translateY(${(1 - vanEnter) * 16}px)`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: b.palette.accentSoft, fontFamily: b.fonts.label }}>
                    {van.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: van.active ? alpha(b.palette.accent, 0.2) : alpha(b.palette.muted, 0.15),
                      color: van.active ? b.palette.accentSoft : b.palette.muted,
                      fontWeight: 600,
                    }}
                  >
                    {van.location}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: b.palette.text, fontWeight: 500 }}>{van.status}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position: "absolute", left: layout.equationBox.x, top: layout.equationBox.y, width: layout.equationBox.w, height: layout.equationBox.h }}>
        <div
          style={{
            background: alpha(b.palette.surface, 0.9),
            border: `1px solid ${b.palette.accentSoft}`,
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", color: b.palette.accentSoft, marginBottom: 10 }}>
            Cálculo de visita a domicilio
          </div>
          <div style={{ fontSize: format === "portrait" ? 22 : 24, fontWeight: 700, color: b.palette.text, fontFamily: b.fonts.display, marginBottom: 12 }}>
            {copy.ruleEquation}
          </div>
          <p style={{ fontSize: 15, color: b.palette.muted, lineHeight: 1.5, margin: 0 }}>
            Una sola camioneta cubre todos los vehículos de la propiedad en secuencia. El tiempo de viaje se cobra una sola vez al final y el horario se reserva en bloque.
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function VehicleQuoterScene({
  copy,
  format,
  language,
  duration,
}: {
  copy: typeof LB_COPY["es"];
  format: FilmFormatName;
  language: FilmLanguage;
  duration: number;
}) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const layout = lbQuoterLayout(format);
  const fade = windowed(frame, 0, duration, 20, 20);

  // Ciclo visual de selección automática entre tipos de vehículos
  const selectedIndex = Math.min(Math.floor((frame / (duration * 0.8)) * LB_VEHICLE_TIERS.length), LB_VEHICLE_TIERS.length - 1);
  const currentVehicle = LB_VEHICLE_TIERS[selectedIndex];

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <SceneTitle kicker={copy.quoterTitle} title={copy.quoterSubtitle} box={layout.titleBox} portrait={format === "portrait"} />

      {/* Grilla de tipos de vehículo */}
      <div style={{ position: "absolute", left: layout.gridBox.x, top: layout.gridBox.y, width: layout.gridBox.w, height: layout.gridBox.h }}>
        <div style={{ display: "grid", gridTemplateColumns: format === "portrait" ? "1fr 1fr" : "1fr 1fr", gap: 14 }}>
          {LB_VEHICLE_TIERS.map((tier, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={tier.id}
                style={{
                  background: isSelected ? alpha(b.palette.accentDeep, 0.35) : b.palette.surface,
                  border: `2px solid ${isSelected ? b.palette.accentSoft : b.palette.line}`,
                  borderRadius: 14,
                  padding: 18,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: b.palette.text, fontFamily: b.fonts.display }}>
                    {tier.name[language]}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: alpha(b.palette.accent, 0.2),
                      color: b.palette.accentSoft,
                      fontWeight: 600,
                    }}
                  >
                    {tier.badge[language]}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span style={{ fontSize: 24, fontWeight: 800, color: b.palette.accentSoft }}>
                    ${tier.startingPrice}
                  </span>
                  <span style={{ fontSize: 13, color: b.palette.muted }}>base</span>
                  <span style={{ fontSize: 12, color: b.palette.muted, marginLeft: "auto" }}>
                    ~{tier.washDurationMin} min
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de cálculo en vivo */}
      <div style={{ position: "absolute", left: layout.summaryBox.x, top: layout.summaryBox.y, width: layout.summaryBox.w, height: layout.summaryBox.h }}>
        <div
          style={{
            background: b.palette.surface,
            border: `1px solid ${b.palette.accent}`,
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", color: b.palette.accentSoft }}>
            {copy.quoterSummaryLabel}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, color: b.palette.muted }}>{copy.quoterDurationLabel}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: b.palette.text }}>
              {currentVehicle.washDurationMin + 30} min (con traslado)
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, color: b.palette.muted }}>{copy.quoterDepositLabel}</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: b.palette.accentSoft }}>
              ${Math.round(currentVehicle.startingPrice * 0.35)}
            </span>
          </div>
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: alpha(b.palette.accent, 0.15),
              border: `1px dashed ${b.palette.accentSoft}`,
              fontSize: 12,
              color: b.palette.accentSoft,
            }}
          >
            {copy.quoterHoldNotice}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

function FieldCrewScene({ copy, format, duration }: { copy: typeof LB_COPY["es"]; format: FilmFormatName; duration: number }) {
  const frame = useCurrentFrame();
  const b = useBrand();
  const layout = lbCrewLayout(format);
  const fade = windowed(frame, 0, duration, 20, 20);

  // Simulación de interacción de botón en la app de cuadrilla
  const actionDone = frame > 110;

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <SceneTitle kicker={copy.crewTitle} title={copy.crewSubtitle} box={layout.titleBox} portrait={format === "portrait"} />

      {/* Pantalla simulada de la app móvil cuadrilla.html */}
      <div style={{ position: "absolute", left: layout.phoneBox.x, top: layout.phoneBox.y, width: layout.phoneBox.w, height: layout.phoneBox.h }}>
        <div
          style={{
            background: "#0B0D10",
            border: `2px solid ${b.palette.line}`,
            borderRadius: 20,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            gap: 12,
            boxShadow: `0 16px 40px rgba(0,0,0,0.6)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: "#F2F4F7" }}>Hoy · Camioneta 01</span>
            <span style={{ fontSize: 12, color: "#9AA4B2" }}>Enlace firmado /c/</span>
          </div>
          <div style={{ background: "#15181D", borderRadius: 12, padding: 14, border: "1px solid #262B33" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#F2F4F7" }}>10:30am · 2 vehículos (SUV + Sedan)</div>
            <div style={{ fontSize: 13, color: "#9AA4B2", marginTop: 4 }}>Pelican Bay Blvd, Naples · Saldo: $120</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div
              style={{
                background: actionDone ? "#16A34A" : alpha("#16A34A", 0.8),
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 14,
                color: "#FFFFFF",
              }}
            >
              {actionDone ? "✓ Atendida" : copy.crewActionAttend}
            </div>
            <div
              style={{
                background: "#2563EB",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
                fontWeight: 700,
                fontSize: 14,
                color: "#FFFFFF",
              }}
            >
              {copy.crewActionCash}
            </div>
          </div>
        </div>
      </div>

      {/* Feed en vivo de GoHighLevel */}
      <div style={{ position: "absolute", left: layout.crmFeedBox.x, top: layout.crmFeedBox.y, width: layout.crmFeedBox.w, height: layout.crmFeedBox.h }}>
        <div
          style={{
            background: b.palette.surface,
            border: `1px solid ${b.palette.accentDeep}`,
            borderRadius: 16,
            padding: 24,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", color: b.palette.accentSoft }}>
            Sincronización en GoHighLevel CRM
          </div>
          <div style={{ fontSize: 14, fontFamily: "monospace", color: b.palette.text, lineHeight: 1.6 }}>
            {actionDone ? (
              <>
                <div style={{ color: "#2BB673" }}>▶ appointmentStatus: &quot;showed&quot;</div>
                <div>▶ Crédito consumido en contrato</div>
                <div>▶ Contacto actualizado sin tocar DB</div>
              </>
            ) : (
              <>
                <div style={{ color: b.palette.accentSoft }}>▶ appointmentStatus: &quot;confirmed&quot;</div>
                <div>▶ Esperando parada de la cuadrilla</div>
                <div>▶ Cero Postgres · Estado en calendario</div>
              </>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
