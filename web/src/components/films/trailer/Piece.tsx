import { C, FONT, Footage, LOOK, Monogram, SHOTS, ivory, wall } from "./kit";

/**
 * La pieza de muestra que el sistema reacomoda en cada formato: la misma toma
 * con el look de la marca, el monograma, el título y su rótulo. No es una
 * captura escalada: cada formato acomoda la composición a su proporción.
 */
export function Piece({ width, height, lines, label = "MMORERA / 06" }: { width: number; height: number; lines: string[]; label?: string | null }) {
  const wide = width / height > 1.4;
  const base = Math.min(width, height);
  const pad = Math.round(base * 0.075);
  const titleSize = wide ? height * 0.135 : base * (height / width > 1.3 ? 0.118 : 0.104);
  const imageFrame = wide ? { x: width * 0.42, y: 0, width: width * 0.58, height } : { x: 0, y: 0, width, height };

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: C.wall }}>
      <Footage at={SHOTS.frontal} frame={imageFrame} focal={[0.68, 0.38]} filter={LOOK.brand} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: wide
            ? `linear-gradient(90deg, ${C.wall} 40%, ${wall(0.6)} 52%, transparent 75%)`
            : `linear-gradient(180deg, ${wall(0.35)} 0%, transparent 28%, ${wall(0.2)} 50%, ${wall(0.92)} 86%)`,
        }}
      />
      <Monogram size={base * 0.13} style={{ position: "absolute", left: pad, top: pad }} />
      {label ? <div style={{ position: "absolute", right: pad, top: pad + base * 0.012, fontFamily: FONT.mono, fontSize: Math.max(9, base * 0.032), letterSpacing: "0.12em", color: ivory(0.7) }}>{label}</div> : null}
      <div style={{ position: "absolute", left: pad, right: wide ? width * 0.5 : pad, bottom: pad * 1.1 }}>
        <div style={{ width: base * 0.09, height: Math.max(2, base * 0.008), background: C.signal, marginBottom: base * 0.04 }} />
        {lines.map((line, i) => (
          <div key={`${i}-${line}`} style={{ fontFamily: FONT.body, fontWeight: 600, fontSize: titleSize, lineHeight: 1.02, letterSpacing: "-0.035em", color: C.ivory, whiteSpace: "nowrap" }}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}
