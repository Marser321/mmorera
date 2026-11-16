import type { CSSProperties } from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CITIES, CITY_IDS, CLIP_FRAMES, END_FRAMES, END_FROM, PLANE, REEL_SCENES, TRAILER_SCENES, XFADE, type CityId, type Scene } from "./timing";

/**
 * Tráiler y reel de Vespera. Todo se mueve por cuadro (sin transiciones de
 * CSS): los clips como secuencias JPEG, el avión cenital a velocidad pareja y
 * las tarjetas de destino con su sello.
 */

const NIGHT = "#120f24";
const CREAM = "#fffaf1";
const CHAMPAGNE = "#e8c98f";
const PAPER = "#f1ece0";
const SERIF = '"Vespera Cormorant", Georgia, serif';
const SANS = '"Vespera Jakarta", Arial, sans-serif';

const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE_OUT = Easing.bezier(0.2, 0.8, 0.2, 1);
const pad = (n: number) => String(n).padStart(4, "0");

/** Dónde está el avión en un cuadro de su pasada: la parte de arriba de la imagen, en px. */
function planeTop(pass: number, height: number) {
  const planeHeight = PLANE.width * PLANE.ratio;
  return height - (pass * (height + planeHeight)) / PLANE.frames;
}

/** La forma que deja ver la escena nueva: todo lo que queda por detrás de las alas. */
function behindWings(pass: number, width: number, height: number) {
  const planeHeight = PLANE.width * PLANE.ratio;
  const top = planeTop(pass, height);
  const root = top + planeHeight * PLANE.seamRoot;
  const tip = top + planeHeight * PLANE.seamTip;
  const half = PLANE.width * PLANE.wingTip;
  // El ala sube en línea recta de la punta a la raíz; fuera de la punta sigue a la misma altura.
  const edge = root + ((tip - root) * Math.min(1, width / 2 / half));
  return `polygon(0px ${edge}px, ${width / 2}px ${root}px, ${width}px ${edge}px, ${width}px ${height + 2}px, 0px ${height + 2}px)`;
}

function Shot({ scene, opening }: { scene: Scene; opening: "night" | "cut" | null }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const local = frame - scene.from;
  if (local < 0 || local >= scene.frames) return null;
  const clipFrame = Math.min(CLIP_FRAMES - 1, scene.start + local);
  const zoom = interpolate(local, [0, scene.frames], [scene.zoom[0], scene.zoom[1]]);
  const style: CSSProperties = {};
  if (scene.enter === "fade") style.opacity = interpolate(local, [0, XFADE], [0, 1], CLAMP);
  else style.clipPath = behindWings(local + PLANE.lead, width, height);
  // La primera escena no se funde con nada: aparece desde la noche (tráiler) o de corte (reel, que se repite).
  if (opening) style.opacity = opening === "night" ? interpolate(local, [0, XFADE], [0, 1], CLAMP) : 1;
  return (
    <AbsoluteFill style={style}>
      <Img src={staticFile(`${scene.clip}/${pad(clipFrame)}.jpg`)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
    </AbsoluteFill>
  );
}

/** El avión cenital de la demo, de abajo hacia arriba y siempre a la misma velocidad. */
function PlanePass({ scene }: { scene: Scene }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const pass = frame - (scene.from - PLANE.lead);
  if (pass < 0 || pass > PLANE.frames) return null;
  return (
    <Img
      src={staticFile("plane-top.webp")}
      style={{ position: "absolute", left: (width - PLANE.width) / 2, top: planeTop(pass, height), width: PLANE.width, height: PLANE.width * PLANE.ratio, filter: "drop-shadow(0 34px 38px rgba(13, 11, 28, 0.38))" }}
    />
  );
}

/** La ruta y los kilómetros que se suman mientras pasa el avión. */
function RouteChip({ scene, from, to }: { scene: Scene; from: CityId; to: CityId }) {
  const frame = useCurrentFrame();
  const pass = frame - (scene.from - PLANE.lead);
  if (pass < 4 || pass > PLANE.frames + 14) return null;
  const opacity = interpolate(pass, [4, 10, PLANE.frames + 6, PLANE.frames + 14], [0, 1, 1, 0], CLAMP);
  const km = Math.round(interpolate(pass, [8, PLANE.frames - 4], [CITIES[from].km, CITIES[to].km], CLAMP));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 24px", borderRadius: 999, background: "rgba(18, 15, 36, 0.92)", border: "1px solid rgba(255, 250, 241, 0.2)", color: CREAM, fontFamily: SANS, fontSize: 17, fontWeight: 600, letterSpacing: "0.1em", boxShadow: "0 14px 34px rgba(13, 11, 28, 0.4)" }}>
        <span>{CITIES[from].code}</span>
        <span style={{ color: CHAMPAGNE }}>→</span>
        <span>{CITIES[to].code}</span>
        <span style={{ width: 1, height: 16, background: "rgba(255, 250, 241, 0.28)" }} />
        <span style={{ fontVariantNumeric: "tabular-nums", minWidth: 96, textAlign: "right" }}>{km.toLocaleString("es-ES").replace(".", " ")} km</span>
      </div>
    </AbsoluteFill>
  );
}

/** El sello de pasaporte de la demo: dos aros, el nombre en arco, el código y el avión. */
function Stamp({ city, size, filled = false }: { city: CityId; size: number; filled?: boolean }) {
  const arc = `vespera-sello-${city}`;
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill={filled ? "currentColor" : "none"} fillOpacity={filled ? 0.14 : 1} stroke="currentColor" strokeWidth="1.5" style={{ display: "block", overflow: "visible" }}>
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="40" fill="none" />
      <defs>
        <path id={arc} d="M 17 51 A 33 33 0 0 1 83 51" />
      </defs>
      <text fill="currentColor" fillOpacity="1" stroke="none" fontSize="11" letterSpacing="2" fontFamily={SANS} fontWeight={600}>
        <textPath href={`#${arc}`} startOffset="50%" textAnchor="middle">
          {CITIES[city].name.toUpperCase()}
        </textPath>
      </text>
      <text x="50" y="61" textAnchor="middle" fontSize="23" fill="currentColor" fillOpacity="1" stroke="none" fontFamily={SERIF} fontWeight={600}>
        {CITIES[city].code}
      </text>
      <path d="m50 69 3 9 9 4v3l-10-2v7l3 2v2l-5-1-5 1v-2l3-2v-7l-10 2v-3l9-4z" fill="currentColor" fillOpacity="1" stroke="none" />
    </svg>
  );
}

/** El golpe del sello: cae un poco grande y girado, y se asienta. */
function stampStyle(frame: number, at: number): CSSProperties {
  const land = interpolate(frame, [at, at + 9], [0, 1], { ...CLAMP, easing: EASE_OUT });
  return { opacity: interpolate(frame, [at, at + 4], [0, 1], CLAMP), transform: `scale(${1.32 - 0.32 * land}) rotate(${-15 + 9 * land}deg)` };
}

/** La tarjeta del destino, abajo a la izquierda: número, ciudad, coordenadas y sello. */
function CityCard({ scene, exitBefore }: { scene: Scene; exitBefore: number }) {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const city = scene.city;
  if (!city) return null;
  const local = frame - scene.from;
  const out = scene.frames - exitBefore;
  if (local < 12 || local > out) return null;
  const enter = interpolate(local, [12, 24], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const opacity = Math.min(enter, interpolate(local, [out - 9, out], [1, 0], CLAMP));
  const index = CITY_IDS.indexOf(city) + 1;
  return (
    <div
      style={{ position: "absolute", left: 64, top: height - 64 - 148, width: 420, height: 148, boxSizing: "border-box", padding: "22px 26px", borderRadius: 20, background: "rgba(18, 15, 36, 0.8)", border: "1px solid rgba(255, 250, 241, 0.16)", boxShadow: "0 22px 50px rgba(13, 11, 28, 0.42)", color: CREAM, opacity, transform: `translateY(${18 * (1 - enter)}px)` }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", width: 250, fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.18em", color: CHAMPAGNE }}>
        <span>
          0{index} / 0{CITY_IDS.length}
        </span>
        <span style={{ color: "rgba(255, 250, 241, 0.62)" }}>{CITIES[city].country}</span>
      </div>
      <div style={{ marginTop: 6, fontFamily: SERIF, fontSize: 54, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{CITIES[city].name}</div>
      <div style={{ marginTop: 4, fontFamily: SANS, fontSize: 13, letterSpacing: "0.06em", color: "rgba(255, 250, 241, 0.7)", fontVariantNumeric: "tabular-nums" }}>{CITIES[city].coords}</div>
      <div style={{ position: "absolute", right: 24, top: 25, color: CHAMPAGNE, ...stampStyle(local, 26) }}>
        <Stamp city={city} size={98} />
      </div>
    </div>
  );
}

/** La marca sobre la ventanilla, unos segundos. */
function Wordmark() {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  // Entra cuando el marco de la ventanilla ya salió de cuadro.
  const opacity = interpolate(frame, [38, 50, 76, 88], [0, 1, 1, 0], CLAMP);
  if (opacity <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 72, top: height - 168, opacity, color: CREAM, textShadow: "0 2px 26px rgba(13, 11, 28, 0.6)" }}>
      <div style={{ width: 44, height: 1, background: CHAMPAGNE }} />
      <div style={{ marginTop: 14, fontFamily: SERIF, fontSize: 72, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.025em" }}>Vespera</div>
    </div>
  );
}

/** El cierre: el pasaje del pie de la demo, con la puerta, la hora, los asientos y los tres sellos. */
function BoardingPass() {
  const frame = useCurrentFrame();
  const local = frame - END_FROM;
  if (local < 0) return null;
  const enter = interpolate(local, [4, 20], [0, 1], { ...CLAMP, easing: EASE_OUT });
  const leave = interpolate(local, [END_FRAMES - 9, END_FRAMES - 1], [1, 0], CLAMP);
  const notch: CSSProperties = { position: "absolute", left: 548 - 11, width: 22, height: 22, borderRadius: 11, background: NIGHT };
  return (
    <AbsoluteFill style={{ opacity: interpolate(local, [0, XFADE], [0, 1], CLAMP), background: `radial-gradient(120% 90% at 50% 0%, #2a2350 0%, ${NIGHT} 62%)`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", width: 800, height: 252, borderRadius: 22, background: PAPER, color: NIGHT, boxShadow: "0 40px 90px rgba(5, 4, 12, 0.55)", opacity: Math.min(enter, leave), transform: `translateY(${26 * (1 - enter)}px) scale(1.12)` }}>
        <div style={{ position: "absolute", left: 48, top: 44 }}>
          <div style={{ fontFamily: SERIF, fontSize: 66, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.025em" }}>Vespera</div>
          <div style={{ marginTop: 16, fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: "0.2em", color: "#8a6a3a" }}>VCE · PAR · GRX</div>
          <div style={{ marginTop: 34, display: "flex", gap: 44, fontFamily: SERIF, fontSize: 32, fontWeight: 600, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
            <span>B12</span>
            <span>19:40</span>
            <span>2A · 2B</span>
          </div>
        </div>
        <div style={{ position: "absolute", left: 548, top: 22, bottom: 22, borderLeft: "1.5px dashed rgba(18, 15, 36, 0.3)" }} />
        <div style={{ ...notch, top: -11 }} />
        <div style={{ ...notch, bottom: -11 }} />
        <div style={{ position: "absolute", left: 572, top: 0, width: 204, height: 252, color: "#3b3470" }}>
          {CITY_IDS.map((city, index) => (
            <div key={city} style={{ position: "absolute", left: [10, 104, 54][index], top: [34, 52, 138][index], ...stampStyle(local, 22 + index * 8) }}>
              <Stamp city={city} size={88} filled />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

function Scenes({ scenes, lastCardExit, opening }: { scenes: Scene[]; lastCardExit: number; opening: "night" | "cut" }) {
  return (
    <>
      {scenes.map((scene, index) => (
        <Shot key={scene.clip} scene={scene} opening={index === 0 ? opening : null} />
      ))}
      {scenes.map((scene, index) => {
        if (!scene.city) return null;
        // La tarjeta sale antes de que entre el avión de la escena que sigue.
        const next = scenes[index + 1];
        return <CityCard key={scene.clip} scene={scene} exitBefore={next?.enter === "plane" ? XFADE + PLANE.lead + 1 : lastCardExit} />;
      })}
      {scenes.map((scene, index) => {
        if (scene.enter !== "plane") return null;
        const from = [...scenes.slice(0, index)].reverse().find((item) => item.city)?.city;
        const to = scenes.slice(index).find((item) => item.city)?.city;
        return (
          <div key={scene.clip}>
            <PlanePass scene={scene} />
            {from && to && <RouteChip scene={scene} from={from} to={to} />}
          </div>
        );
      })}
    </>
  );
}

export function VesperaTrailer() {
  return (
    <AbsoluteFill style={{ background: NIGHT, overflow: "hidden" }}>
      <Scenes scenes={TRAILER_SCENES} lastCardExit={XFADE + 2} opening="night" />
      <Wordmark />
      <BoardingPass />
    </AbsoluteFill>
  );
}

/** El reel se repite: la tarjeta queda hasta el final y el corte vuelve al avión. */
export function VesperaReel() {
  return (
    <AbsoluteFill style={{ background: NIGHT, overflow: "hidden" }}>
      <Scenes scenes={REEL_SCENES} lastCardExit={0} opening="cut" />
    </AbsoluteFill>
  );
}
