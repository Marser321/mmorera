import type { ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BEATS, CARD, CAST, HAND, HERO_FRAMES, HERO_SIZE, PAPER_LANDS, PAPER_X, PASSES, PLACED, TABLE_Y, type CastId } from "./timing";

/**
 * Boceto animado del hero «El equipo». Los muñecos son provisorios: formas
 * simples para probar la historia, el ritmo y el encuadre. Todo sale del
 * cuadro (sin transiciones de CSS), como los demás films.
 */

const WALL = "#0B0B0A";
const IVORY = "#ECE7DD";
const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const EASE = Easing.inOut(Easing.cubic);

type Key = readonly [number, number];
/** Valor en un cuadro, entre claves. */
const at = (frame: number, keys: readonly Key[]) => interpolate(frame, keys.map((key) => key[0]), keys.map((key) => key[1]), { ...CLAMP, easing: EASE });
/** Un saltito: sube y baja en `length` cuadros. */
const hop = (frame: number, start: number, height = 44, length = 10) => {
  const t = (frame - start) / length;
  return t <= 0 || t >= 1 ? 0 : -height * Math.sin(Math.PI * t);
};
/** Presencia de algo entre dos cuadros, con entrada y salida suaves. */
const on = (frame: number, from: number, to: number, fade = 5) => Math.min(interpolate(frame, [from, from + fade], [0, 1], CLAMP), interpolate(frame, [to - fade, to], [1, 0], CLAMP));

// ── Dónde está cada cosa ──────────────────────────────────────────────────

const X: Record<CastId, readonly Key[]> = {
  plano: [[0, 900], [96, 900], [112, 985], [192, 985], [212, 860], [PLACED.plano, 860], [PLACED.plano + 12, 1020], [480, 1020], [508, 900]],
  voz: [[0, 1080], [76, 1080], [92, 1100], [PLACED.voz, 1100], [PLACED.voz + 12, 1280], [480, 1280], [508, 1080]],
  cable: [[0, 1260], [112, 1260], [130, 1245], [192, 1245], [212, 1310], [PLACED.cable, 1310], [PLACED.cable + 12, 1150], [480, 1150], [508, 1260]],
  toma: [[0, 1440], [192, 1440], [212, 1500], [PLACED.toma, 1500], [PLACED.toma + 12, 1410], [480, 1410], [508, 1440]],
  lupa: [[0, 1620], [142, 1620], [160, 1335], [192, 1335], [212, 1640], [PLACED.lupa, 1640], [PLACED.lupa + 12, 1540], [480, 1540], [508, 1620]],
};

/** Plano se sube a la pila de libros para buscar. */
const BOOKS = { x: 860, height: 74 };

function paperAt(frame: number) {
  const fall = interpolate(frame, [0, PAPER_LANDS], [0, 1], { ...CLAMP, easing: Easing.in(Easing.quad) });
  const tug = frame >= 120 && frame < 190 ? 22 * Math.sin((frame - 120) / 4) : 0;
  const order: CastId[] = ["plano", "cable", "voz", "toma", "lupa"];
  const slots = order.map((id) => CAST.find((member) => member.id === id)!.slot);
  const passing: Key[] = [[386, PAPER_X], [PASSES.plano, slots[0]], [PASSES.cable, slots[1]], [PASSES.voz, slots[2]], [PASSES.toma, slots[3]], [PASSES.lupa, slots[4]]];
  const rise = interpolate(frame, [CARD.rises, CARD.up], [0, 1], { ...CLAMP, easing: EASE });
  // Entre mano y mano, el papel hace un arco chico.
  const arc = frame > PASSES.plano && frame < PASSES.lupa ? -26 * Math.abs(Math.sin(((frame - PASSES.plano) / 12) * Math.PI)) : 0;
  return {
    x: (frame < 386 ? PAPER_X + tug : at(frame, passing)) + rise * (1280 - slots[4]),
    y: -90 + fall * (TABLE_Y - 14 + 90) + hop(frame, PAPER_LANDS, 14, 8) + arc - rise * 215 + (rise === 1 ? 5 * Math.sin(frame / 6) : 0),
    rotation: (1 - fall) * -38 + (frame < 386 ? tug * 0.25 : 0),
    stripes: order.filter((id) => frame >= PASSES[id]).length,
    card: rise,
    opacity: frame >= CARD.gone ? 0 : interpolate(frame, [CARD.fades, CARD.gone], [1, 0], CLAMP),
  };
}

function handAt(frame: number) {
  const tap = (start: number) => {
    const t = (frame - start) / 7;
    return t <= 0 || t >= 1 ? 0 : 86 * Math.sin(Math.PI * t);
  };
  return {
    x: at(frame, [[HAND.enters, 1222], [318, 1222], [HAND.sweepFrom, 1020], [HAND.sweepTo, 1540], [HAND.leaves, 1560]]),
    y: at(frame, [[HAND.enters, -380], [298, 330], [318, 330], [HAND.sweepFrom, 150], [HAND.sweepTo, 150], [HAND.leaves, -380]]) + tap(HAND.taps[0]) + tap(HAND.taps[1]),
    visible: frame >= HAND.enters && frame <= HAND.leaves,
  };
}

// ── Los muñecos ───────────────────────────────────────────────────────────

const BODY = { width: 108, height: 140 };
/** La cámara del boceto: acerca la escena y la corre a la derecha, para que el título entre arriba a la izquierda. */
const CAMERA = { scale: 1.35, x: -415, y: -183.5 };

/** Lo que lleva cada uno, dibujado con lo mínimo. */
function Prop({ id, frame }: { id: CastId; frame: number }) {
  if (id === "plano") {
    return (
      <g transform="translate(46 -70) rotate(-28)">
        <rect x={-26} y={-9} width={52} height={18} rx={9} fill={IVORY} />
        <line x1={-14} y1={-9} x2={-14} y2={9} stroke="#3F8CFF" strokeWidth={2} />
        <line x1={4} y1={-9} x2={4} y2={9} stroke="#3F8CFF" strokeWidth={2} />
      </g>
    );
  }
  if (id === "voz") {
    return (
      <g fill="none" stroke="#1B1A17" strokeWidth={7} strokeLinecap="round">
        <path d={`M -50 -98 C -50 -164, 50 -164, 50 -98`} />
        <rect x={-60} y={-110} width={16} height={28} rx={7} fill="#1B1A17" stroke="none" />
        <rect x={44} y={-110} width={16} height={28} rx={7} fill="#1B1A17" stroke="none" />
        <path d="M 52 -84 Q 46 -58, 22 -58" strokeWidth={4} />
      </g>
    );
  }
  if (id === "cable") {
    return (
      <g fill="none" stroke="#57701A" strokeWidth={6} strokeLinecap="round">
        <ellipse cx={0} cy={-44} rx={62} ry={15} />
        <ellipse cx={0} cy={-62} rx={60} ry={14} transform="rotate(-9 0 -62)" />
        <path d="M 58 -52 q 22 -6 30 12" />
        <rect x={82} y={-44} width={18} height={24} rx={4} fill="#1B1A17" stroke="none" />
      </g>
    );
  }
  if (id === "toma") {
    const recording = frame % 16 < 9;
    return (
      <g transform="translate(52 -78)">
        <rect x={-20} y={-15} width={40} height={30} rx={6} fill="#1B1A17" />
        <circle cx={22} cy={0} r={10} fill="#2C2A26" stroke="#1B1A17" strokeWidth={3} />
        <circle cx={-10} cy={-7} r={4} fill={recording ? "#FF3B30" : "#5A2320"} />
      </g>
    );
  }
  return (
    <g transform="translate(56 -74) rotate(18)" fill="none" stroke="#1B1A17" strokeWidth={6} strokeLinecap="round">
      <circle cx={0} cy={0} r={17} fill="rgba(236,231,221,.28)" />
      <line x1={12} y1={12} x2={30} y2={30} />
    </g>
  );
}

function Puppet({ id, color, x, lift, tilt, stretch, look, surprised, placed, children }: { id: CastId; color: string; x: number; lift: number; tilt: number; stretch: number; look: readonly [number, number]; surprised: boolean; placed: number; children?: ReactNode }) {
  const frame = useCurrentFrame();
  const y = TABLE_Y + lift;
  return (
    <g>
      {/* La sombra se queda en la mesa y se achica cuando salta. */}
      <ellipse cx={x} cy={TABLE_Y + 6} rx={62 + lift * 0.35} ry={11} fill="rgba(0,0,0,.45)" />
      <g transform={`translate(${x} ${y}) rotate(${tilt}) scale(${2 - stretch} ${stretch})`}>
        {placed > 0 ? <ellipse cx={0} cy={-BODY.height / 2} rx={BODY.width / 2 + 18} ry={BODY.height / 2 + 18} fill="none" stroke={color} strokeWidth={5} opacity={placed * 0.75} /> : null}
        <rect x={-BODY.width / 2} y={-BODY.height} width={BODY.width} height={BODY.height} rx={50} fill={color} />
        {/* Un poco de volumen: luz arriba a la izquierda, como de lámpara. */}
        <ellipse cx={-20} cy={-BODY.height + 30} rx={26} ry={16} fill="rgba(255,255,255,.2)" />
        <rect x={-BODY.width / 2} y={-44} width={BODY.width} height={44} rx={22} fill="rgba(0,0,0,.14)" />
        {[-22, 22].map((eye) => (
          <g key={eye}>
            <circle cx={eye} cy={-94} r={14} fill={IVORY} />
            <circle cx={eye + look[0] * 6} cy={-94 + look[1] * 6} r={6.5} fill="#141311" />
          </g>
        ))}
        {surprised ? <ellipse cx={0} cy={-62} rx={8} ry={10} fill="#141311" /> : <path d="M -11 -64 Q 0 -57, 11 -64" fill="none" stroke="#141311" strokeWidth={4} strokeLinecap="round" />}
        <Prop id={id} frame={frame} />
      </g>
      {children}
    </g>
  );
}

// ── Globos de íconos: se entienden sin palabras ───────────────────────────

type BubbleKind = "chat" | "layout" | "plug" | "rec" | "down" | "book" | "lens" | "what" | "wait" | "plus";

function Glyph({ kind }: { kind: BubbleKind }) {
  const ink = "#141311";
  if (kind === "chat") return <g fill={ink}>{[-16, 0, 16].map((dx) => <circle key={dx} cx={dx} cy={0} r={5.5} />)}</g>;
  if (kind === "layout") return <g fill="none" stroke={ink} strokeWidth={4}><rect x={-22} y={-15} width={44} height={30} rx={4} /><line x1={-22} y1={-5} x2={22} y2={-5} /><line x1={-4} y1={-5} x2={-4} y2={15} /></g>;
  if (kind === "plug") return <g fill={ink}><rect x={-12} y={-6} width={24} height={18} rx={4} /><rect x={-8} y={-17} width={4.5} height={12} rx={2} /><rect x={3.5} y={-17} width={4.5} height={12} rx={2} /><rect x={-2} y={12} width={4} height={8} /></g>;
  if (kind === "rec") return <circle cx={0} cy={0} r={12} fill="#FF3B30" />;
  if (kind === "down") return <g fill="none" stroke={ink} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="-22,-12 -8,-2 2,-8 20,12" /><polyline points="8,12 20,12 20,0" /></g>;
  if (kind === "book") return <g fill="none" stroke={ink} strokeWidth={4} strokeLinejoin="round"><path d="M 0 -12 L -22 -15 L -22 12 L 0 15 L 22 12 L 22 -15 Z" /><line x1={0} y1={-12} x2={0} y2={15} /></g>;
  if (kind === "lens") return <g fill="none" stroke={ink} strokeWidth={4.5} strokeLinecap="round"><circle cx={-4} cy={-4} r={11} /><line x1={5} y1={5} x2={16} y2={16} /></g>;
  return <text x={0} y={12} textAnchor="middle" fontSize={36} fontWeight={800} fontFamily="Arial, sans-serif" fill={ink}>{kind === "what" ? "?" : kind === "plus" ? "+" : "…"}</text>;
}

function Bubble({ x, y, kind, opacity, shake = 0 }: { x: number; y: number; kind: BubbleKind; opacity: number; shake?: number }) {
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(${x + shake} ${y - (1 - opacity) * -14}) scale(${0.85 + 0.15 * opacity})`} opacity={opacity}>
      <rect x={-44} y={-34} width={88} height={64} rx={20} fill={IVORY} />
      <path d="M -10 28 L 0 46 L 12 28 Z" fill={IVORY} />
      <Glyph kind={kind} />
    </g>
  );
}

// ── La mano: el orquestador ───────────────────────────────────────────────

function Hand({ x, y }: { x: number; y: number }) {
  const skin = "#E9D9C3";
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-46} y={-900} width={92} height={900} rx={40} fill={skin} />
      <rect x={-60} y={-36} width={120} height={112} rx={38} fill={skin} />
      <rect x={-17} y={48} width={34} height={142} rx={17} fill={skin} />
      <rect x={-70} y={10} width={30} height={70} rx={15} fill={skin} transform="rotate(18 -55 45)" />
      <rect x={22} y={56} width={26} height={54} rx={13} fill="#DCCAB1" />
      <rect x={-48} y={56} width={26} height={50} rx={13} fill="#DCCAB1" />
      <rect x={-9} y={164} width={18} height={20} rx={8} fill="rgba(255,255,255,.35)" />
    </g>
  );
}

// ── El boceto ─────────────────────────────────────────────────────────────

export function HeroBoceto({ labels = true }: { labels?: boolean }) {
  const frame = useCurrentFrame();
  const paper = paperAt(frame);
  const hand = handAt(frame);
  const beat = [...BEATS].reverse().find((item) => frame >= item.from) ?? BEATS[0];
  const listening = frame >= HAND.taps[0] && frame < HAND.sweepFrom;

  const members = CAST.map((member, index) => {
    const x = at(frame, X[member.id]);
    // Sustos, pasos y festejos.
    const scare = hop(frame, PAPER_LANDS + index, 52, 11);
    const pass = hop(frame, PASSES[member.id] - 2, 30, 10);
    const cheer = hop(frame, CARD.up + index * 2, 58, 11) + hop(frame, CARD.up + 12 + index * 2, 40, 10);
    const place = hop(frame, PLACED[member.id], 46, 12);
    const own = member.id === "voz" ? hop(frame, 84, 26, 9) + hop(frame, 100, 22, 9) : member.id === "toma" ? hop(frame, 240, 22, 9) + hop(frame, 262, 22, 9) : 0;
    const climb = member.id === "plano" ? at(frame, [[192, 0], [212, -BOOKS.height], [PLACED.plano, -BOOKS.height], [PLACED.plano + 12, 0]]) : 0;
    const lift = scare + pass + cheer + place + own + climb;
    // Cada uno con su manía: Cable se enreda, Lupa se inclina y niega, Toma se cae de espaldas al festejar.
    let tilt = 0;
    if (member.id === "cable" && frame > 212 && frame < PLACED.cable) tilt = 13 * Math.sin((frame - 212) / 3.2);
    if (member.id === "lupa") tilt = at(frame, [[150, 0], [162, 14], [192, 14], [212, 10], [PLACED.lupa, 10], [PLACED.lupa + 10, 0]]) + (frame > 166 && frame < 192 ? 6 * Math.sin((frame - 166) / 2.2) : 0);
    if (member.id === "plano") tilt = at(frame, [[96, 0], [112, 9], [192, 9], [212, -5], [PLACED.plano, -5], [PLACED.plano + 10, 0]]);
    if (member.id === "voz") tilt = at(frame, [[76, 0], [92, -8], [190, -8], [212, 0]]);
    if (member.id === "toma") tilt += at(frame, [[CARD.up + 4, 0], [CARD.up + 12, -86], [CARD.up + 20, -86], [CARD.up + 30, 0]]);
    const stretch = 1 + 0.018 * Math.sin((frame + index * 9) / 7) + (lift < -6 ? 0.06 : 0) - (listening ? 0.04 : 0);
    // Hacia dónde mira.
    const eye: [number, number] = [x, TABLE_Y + lift - 94];
    let target: [number, number] = [x + 60 * Math.sin((frame + index * 20) / 26), eye[1] + 10];
    if (frame >= PAPER_LANDS - 6 && frame < 192) target = [paper.x, paper.y];
    else if (frame >= 192 && frame < HAND.enters) target = [x + 50, TABLE_Y - 30];
    else if (hand.visible) target = [hand.x, hand.y + 190];
    else if (frame >= HAND.leaves && frame < CARD.fades) target = [paper.x, paper.y];
    const distance = Math.hypot(target[0] - eye[0], target[1] - eye[1]) || 1;
    const look: [number, number] = [(target[0] - eye[0]) / distance, (target[1] - eye[1]) / distance];
    const surprised = (frame >= PAPER_LANDS && frame < 54) || listening || (frame >= CARD.up && frame < CARD.up + 26);
    const placed = on(frame, PLACED[member.id] + 4, PLACED[member.id] + 30, 8);
    return { ...member, x, lift, tilt, stretch, look, surprised, placed };
  });
  const of = (id: CastId) => members.find((member) => member.id === id)!;
  const head = (id: CastId) => ({ x: of(id).x, y: TABLE_Y + of(id).lift - BODY.height - 58 });
  // Los dos globos chocan: tiemblan mientras discuten.
  const clash = frame > 128 && frame < 172 ? 5 * Math.sin(frame * 1.7) : 0;

  return (
    <AbsoluteFill style={{ background: WALL }}>
      <svg viewBox={`0 0 ${HERO_SIZE.width} ${HERO_SIZE.height}`} width={HERO_SIZE.width} height={HERO_SIZE.height}>
        <defs>
          <radialGradient id="hero-lampara" cx="86%" cy="6%" r="70%">
            <stop offset="0%" stopColor="#F2C27A" stopOpacity="0.34" />
            <stop offset="45%" stopColor="#F2C27A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#F2C27A" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hero-mesa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2A2119" />
            <stop offset="100%" stopColor="#120E0A" />
          </linearGradient>
          <filter id="hero-brillo" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="22" /></filter>
        </defs>

        {/* La pared y la lámpara. */}
        <rect width={HERO_SIZE.width} height={HERO_SIZE.height} fill="url(#hero-lampara)" />
        <g transform="translate(1790 0)">
          <line x1={0} y1={0} x2={0} y2={64} stroke="#3A3128" strokeWidth={6} />
          <path d="M -58 118 L -30 64 L 30 64 L 58 118 Z" fill="#3A3128" />
          <ellipse cx={0} cy={120} rx={52} ry={9} fill="#F6D08E" />
        </g>

        <g transform={`translate(${CAMERA.x} ${CAMERA.y}) scale(${CAMERA.scale})`}>
        {/* La mesa. */}
        <rect x={-600} y={TABLE_Y} width={3200} height={400} fill="url(#hero-mesa)" />
        <rect x={-600} y={TABLE_Y} width={3200} height={3} fill="#4A3B2C" />

        {/* La pila de libros a la que se sube Plano. */}
        {[0, 1, 2].map((book) => (
          <rect key={book} x={BOOKS.x - 78 + book * 7} y={TABLE_Y - (book + 1) * (BOOKS.height / 3)} width={156 - book * 14} height={BOOKS.height / 3 - 2} rx={5} fill={["#5B4636", "#6E5540", "#4C3A2D"][book]} />
        ))}

        {/* El pedido: un papel que cae, pasa de mano en mano y termina hecho una ventanita encendida. */}
        {paper.opacity > 0 ? (
          <g opacity={paper.opacity}>
            {paper.card > 0 ? <rect x={paper.x - 96} y={paper.y - 76} width={192} height={132} rx={30} fill={IVORY} opacity={0.55 * paper.card} filter="url(#hero-brillo)" /> : null}
            <g transform={`translate(${paper.x} ${paper.y}) rotate(${paper.rotation}) scale(${1 + paper.card * 1.5})`}>
              <rect x={-38} y={-27} width={76} height={54} rx={7} fill={IVORY} />
              <path d="M 22 -27 L 38 -11 L 22 -11 Z" fill="#C9C3B7" opacity={1 - paper.card} />
              {["plano", "cable", "voz", "toma", "lupa"].slice(0, paper.stripes).map((id, stripe) => (
                <rect key={id} x={-30 + stripe * 12.4} y={-18} width={9.6} height={36} rx={3} fill={CAST.find((member) => member.id === id)!.color} />
              ))}
            </g>
          </g>
        ) : null}

        {/* Los cinco, de atrás hacia adelante según dónde están. */}
        {[...members].sort((a, b) => a.x - b.x).map((member) => (
          <Puppet key={member.id} id={member.id} color={member.color} x={member.x} lift={member.lift} tilt={member.tilt} stretch={member.stretch} look={member.look} surprised={member.surprised} placed={member.placed} />
        ))}

        {/* Lo que dice cada uno, sin palabras. */}
        <Bubble {...head("voz")} kind="chat" opacity={on(frame, 84, 176)} shake={clash} />
        <Bubble {...head("plano")} kind="layout" opacity={on(frame, 104, 176)} shake={-clash} />
        <Bubble {...head("cable")} kind="plug" opacity={on(frame, 136, 188)} />
        <Bubble {...head("toma")} kind="rec" opacity={on(frame, 118, 190)} />
        <Bubble {...head("lupa")} kind="down" opacity={on(frame, 166, 192)} />
        <Bubble {...head("plano")} kind="book" opacity={on(frame, 220, 284)} />
        <Bubble {...head("lupa")} kind="lens" opacity={on(frame, 226, 286)} />
        <Bubble {...head("cable")} kind="what" opacity={on(frame, 232, 284)} />
        <Bubble {...head("voz")} kind="wait" opacity={on(frame, 216, 286)} />
        {CAST.map((member) => (
          <Bubble key={member.id} {...head(member.id)} kind="plus" opacity={on(frame, PASSES[member.id] - 2, PASSES[member.id] + 14, 4)} />
        ))}

        {hand.visible ? <Hand x={hand.x} y={hand.y} /> : null}
        </g>

        {/* Dónde va el título: arriba a la izquierda, sobre la pared; los personajes quedan abajo y a la derecha. */}
        {labels ? (
          <g>
            <text x={96} y={84} fill={IVORY} opacity={0.6} fontSize={17} letterSpacing={3} fontFamily="var(--ff-mono), monospace">BOCETO ANIMADO · MUÑECOS PROVISORIOS</text>
            <text x={96} y={118} fill="#71F3A2" fontSize={22} letterSpacing={2} fontFamily="var(--ff-mono), monospace">{`0${BEATS.indexOf(beat) + 1} · ${beat.es.toUpperCase()}`}</text>
            <text x={96} y={218} fill={IVORY} fontSize={58} fontWeight={500} letterSpacing={-2.3} fontFamily="var(--ff-display), Arial, sans-serif">Orquesto la tecnología</text>
            <text x={96} y={284} fill={IVORY} fontSize={58} fontWeight={500} letterSpacing={-2.3} fontFamily="var(--ff-display), Arial, sans-serif">de tu negocio.</text>
            <rect x={96} y={784} width={420} height={3} fill="rgba(236,231,221,.18)" />
            <rect x={96} y={784} width={(420 * frame) / (HERO_FRAMES - 1)} height={3} fill="#71F3A2" />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
}
