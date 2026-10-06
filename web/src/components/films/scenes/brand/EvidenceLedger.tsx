import { AbsoluteFill, useCurrentFrame } from "remotion";
import { formatFact } from "@/data/films/flagships/types";
import type { FilmLanguage } from "@/data/films/filmTypes";
import type { Box } from "@/lib/filmLayout";
import { EASE_IN_OUT, progress, useFilmLayout } from "../theme";
import { alpha, useBrand } from "./context";
import { boxStyle, BoxText, Glyph, Plate, SampleTag, type GlyphKind } from "./dataKit";
import { EVIDENCE_TONES, evidenceLedgerLayout, type EvidenceLedgerData, type EvidenceTier, type EvidenceTierId } from "./layout/evidenceLedger";

export type EvidenceLedgerProps = {
  box: Box;
  duration: number;
  tiers: EvidenceTier[];
  total: EvidenceLedgerData["total"];
  breakdown?: EvidenceLedgerData["breakdown"];
  wording?: EvidenceLedgerData["wording"];
  language: FilmLanguage;
  sampleLabel?: string;
};

const TIER_GLYPH: Record<EvidenceTierId, GlyphKind> = {
  approved: "check",
  signal: "half",
  "not-established": "ring",
  prohibited: "cross",
};

/**
 * Registro de evidencia por nivel. Primero cuenta el total (una sola vez) y
 * el desglose; después cada nivel entra en orden: su marca de color crece, el
 * nombre, las afirmaciones de a una y la nota. Nada entra encima de nada.
 */
export function EvidenceLedger({ box, duration, tiers, total, breakdown, wording, language, sampleLabel }: EvidenceLedgerProps) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const { portrait } = useFilmLayout();
  const layout = evidenceLedgerLayout(box, { tiers, total, breakdown, wording, language, sampleLabel }, portrait ? "portrait" : "landscape");
  const tone = (id: EvidenceTierId) => EVIDENCE_TONES[id] ?? brand.palette.muted;

  const rowsFrom = 46 + (breakdown?.length ?? 0) * 8;
  const rowStep = Math.max(22, Math.min(50, (duration * 0.64 - rowsFrom) / Math.max(1, tiers.length)));
  const rowsEnd = rowsFrom + rowStep * tiers.length;

  return (
    <AbsoluteFill>
      {/* Total: cuenta una vez hasta la cifra exacta. */}
      <BoxText block={layout.totalValue} style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.01em", opacity: progress(frame, 0, 12) }}>
        {formatFact({ value: Math.round(total.value * progress(frame, 4, 50, EASE_IN_OUT)) }, language)}
      </BoxText>
      <BoxText block={layout.totalLabel} style={{ fontFamily: brand.fonts.body, fontWeight: 500, color: brand.palette.muted, opacity: progress(frame, 8, 24) }} />

      {layout.breakdown.map((chip, index) => {
        const enter = 22 + index * 8;
        const value = breakdown?.[index]?.value ?? 0;
        return (
          <div key={chip.label.id} style={{ opacity: progress(frame, enter, enter + 14) }}>
            <div style={{ ...boxStyle(chip.frame), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${brand.palette.line}`, background: alpha(brand.palette.surface, 85) }} />
            <BoxText block={chip.label} style={{ fontFamily: brand.fonts.body, color: brand.palette.muted }} />
            <BoxText block={chip.value} align="right" style={{ fontFamily: brand.fonts.body, fontWeight: 700, color: brand.palette.text, fontVariantNumeric: "tabular-nums" }}>
              {formatFact({ value: Math.round(value * progress(frame, enter + 4, enter + 36, EASE_IN_OUT)) }, language)}
            </BoxText>
          </div>
        );
      })}

      {layout.rows.map((row, index) => {
        const t0 = rowsFrom + index * rowStep;
        const color = tone(row.id);
        const prohibited = row.id === "prohibited";
        const card = progress(frame, t0, t0 + 14);
        const marker = progress(frame, t0 + 4, t0 + 24, EASE_IN_OUT);
        const itemsFrom = t0 + 12;
        const noteAt = itemsFrom + row.items.length * 8 + 4;
        return (
          <div key={row.id} style={{ opacity: card }}>
            <Plate box={row.card} style={prohibited ? { background: `linear-gradient(165deg, ${alpha(color, 9)}, ${brand.palette.surface} 70%)`, borderColor: alpha(color, 28) } : undefined} />
            <div style={{ ...boxStyle(row.marker), borderRadius: 9, background: color, transformOrigin: "top", scale: `1 ${marker}` }} />
            <BoxText block={row.label} style={{ fontFamily: brand.fonts.display, fontWeight: 600, color: brand.palette.text, opacity: progress(frame, t0 + 6, t0 + 20) }} />
            {row.tag ? (
              <div style={{ opacity: progress(frame, t0 + 14, t0 + 28) }}>
                <div style={{ ...boxStyle(row.tag.frame), boxSizing: "border-box", borderRadius: 999, border: `1px solid ${alpha(color, 55)}`, background: alpha(color, 10) }} />
                <BoxText block={row.tag.text} align="center" style={{ fontFamily: brand.fonts.body, fontWeight: 600, color }} />
              </div>
            ) : null}
            {row.items.map((item, itemIndex) => {
              const at = itemsFrom + itemIndex * 8;
              const show = progress(frame, at, at + 14);
              return (
                <div key={item.text.id} style={{ opacity: show }}>
                  <Glyph kind={TIER_GLYPH[row.id]} box={item.icon} color={color} draw={progress(frame, at, at + 18, EASE_IN_OUT)} weight={2.2} />
                  <BoxText block={item.text} style={{ fontFamily: brand.fonts.body, color: prohibited ? brand.palette.muted : brand.palette.text }} />
                </div>
              );
            })}
            {row.note ? <BoxText block={row.note} style={{ fontFamily: brand.fonts.body, fontStyle: "italic", color: brand.palette.muted, opacity: progress(frame, noteAt, noteAt + 16) }} /> : null}
          </div>
        );
      })}

      {layout.sample ? <SampleTag block={layout.sample} opacity={progress(frame, rowsEnd, rowsEnd + 20)} /> : null}
    </AbsoluteFill>
  );
}
