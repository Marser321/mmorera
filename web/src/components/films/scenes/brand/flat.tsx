import type { CSSProperties, ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { CLAMP, EASE_IN_OUT, EASE_OUT, progress } from "../theme";
import { alpha, useBrand } from "./context";

/**
 * Kit de pantallas planas con la piel de la marca: recrea módulos del
 * producto real (mismos nombres, servicios y precios del código) para mostrar
 * los flujos en movimiento. Los datos de personas y montos son de ejemplo y se
 * rotulan como tales.
 */

export function FlatPanel({ kicker, title, children, style, width, height }: { kicker: string; title: string; children: ReactNode; style?: CSSProperties; width: number; height: number }) {
  const brand = useBrand();
  return (
    <div
      style={{
        position: "absolute",
        width,
        height,
        boxSizing: "border-box",
        padding: 34,
        borderRadius: brand.radius * 1.4,
        background: `linear-gradient(160deg, ${brand.palette.raised}, ${brand.palette.surface} 60%)`,
        border: `1px solid ${brand.palette.line}`,
        boxShadow: `0 40px 100px ${alpha("#000000", 50)}`,
        overflow: "hidden",
        ...style,
      }}
    >
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: `1px solid ${alpha(brand.palette.accent, 45)}`, background: alpha(brand.palette.accent, 10), fontFamily: brand.fonts.label, fontSize: 15, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: brand.palette.accent }}>
        {kicker}
      </span>
      <div style={{ marginTop: 16, fontFamily: brand.fonts.display, fontSize: 52, fontWeight: 600, lineHeight: 1, color: brand.palette.text }}>{title}</div>
      <div style={{ position: "relative", marginTop: 26 }}>{children}</div>
    </div>
  );
}

export function SampleBadge({ label, style }: { label: string; style?: CSSProperties }) {
  const brand = useBrand();
  return (
    <span style={{ position: "absolute", padding: "6px 12px", borderRadius: 999, border: `1px dashed ${alpha(brand.palette.muted, 60)}`, fontFamily: brand.fonts.body, fontSize: 14, color: brand.palette.muted, ...style }}>
      {label}
    </span>
  );
}

/* ─── Reserva en 6 pasos ─── */

export function FlatWizard({ steps, from, stepFrames, renderStep, width }: { steps: string[]; from: number; stepFrames: number; renderStep: (index: number, local: number) => ReactNode; width: number }) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const raw = (frame - from) / stepFrames;
  const current = Math.max(0, Math.min(steps.length - 1, Math.floor(raw)));
  const local = frame - from - current * stepFrames;
  const fill = interpolate(raw, [0, steps.length - 1], [0, 1], CLAMP);
  return (
    <div style={{ position: "relative", width }}>
      <div style={{ position: "relative", height: 70 }}>
        <div style={{ position: "absolute", left: 22, right: 22, top: 22, height: 3, background: brand.palette.line, borderRadius: 9 }}>
          <div style={{ width: "100%", height: "100%", background: brand.palette.accent, transformOrigin: "left", scale: `${fill} 1`, borderRadius: 9 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {steps.map((step, index) => {
            const done = index < current || (index === current && raw >= steps.length - 1 + 0.6);
            const active = index === current;
            return (
              <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 120 }}>
                <span style={{ width: 46, height: 46, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: brand.fonts.label, fontSize: 20, fontWeight: 700, background: done || active ? brand.palette.accent : brand.palette.surface, color: done || active ? brand.palette.onAccent : brand.palette.muted, border: `1px solid ${active ? brand.palette.accentSoft : brand.palette.line}`, boxShadow: active ? `0 0 0 8px ${alpha(brand.palette.accent, 16)}` : "none" }}>
                  {done && !active ? "✓" : index + 1}
                </span>
                <span style={{ fontFamily: brand.fonts.body, fontSize: 15, color: active ? brand.palette.text : brand.palette.muted, textAlign: "center" }}>{step}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ position: "relative", marginTop: 52, minHeight: 300 }}>
        <div key={current} style={{ opacity: progress(local, 0, 14), translate: `${(1 - progress(local, 0, 18, EASE_OUT)) * 30}px 0` }}>
          {renderStep(current, local)}
        </div>
      </div>
    </div>
  );
}

export function ChoiceRow({ items, selected, at, local }: { items: Array<{ title: string; meta?: string }>; selected: number; at: number; local: number }) {
  const brand = useBrand();
  const picked = local >= at;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 16 }}>
      {items.map((item, index) => {
        const isPick = picked && index === selected;
        return (
          <div key={item.title} style={{ padding: "22px 22px", borderRadius: brand.radius, background: isPick ? alpha(brand.palette.accent, 14) : brand.palette.surface, border: `1px solid ${isPick ? brand.palette.accent : brand.palette.line}`, scale: isPick ? "1.03" : "1" }}>
            <div style={{ fontFamily: brand.fonts.display, fontSize: 28, fontWeight: 600, color: brand.palette.text }}>{item.title}</div>
            {item.meta ? <div style={{ marginTop: 8, fontFamily: brand.fonts.body, fontSize: 17, color: isPick ? brand.palette.accentSoft : brand.palette.muted }}>{item.meta}</div> : null}
          </div>
        );
      })}
    </div>
  );
}

/** Grilla de horarios: un turno ocupado no se puede tomar; se elige otro libre. */
export function SlotGrid({ slots, taken, attempt, chosen, local, busyLabel }: { slots: string[]; taken: number; attempt: number; chosen: number; local: number; busyLabel: string }) {
  const brand = useBrand();
  const tryAt = 22;
  const chooseAt = 70;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
      {slots.map((slot, index) => {
        const isTaken = index === taken;
        const isAttempt = index === attempt && local >= tryAt && local < chooseAt;
        const isChosen = index === chosen && local >= chooseAt;
        return (
          <div key={slot} style={{ position: "relative", padding: "18px 0", textAlign: "center", borderRadius: brand.radius * 0.8, fontFamily: brand.fonts.display, fontSize: 26, fontWeight: 600, color: isTaken ? brand.palette.muted : isChosen ? brand.palette.onAccent : brand.palette.text, background: isChosen ? brand.palette.accent : isTaken ? alpha(brand.palette.muted, 10) : brand.palette.surface, border: `1px solid ${isAttempt ? "#e5484d" : isChosen ? brand.palette.accent : brand.palette.line}`, textDecoration: isTaken ? "line-through" : "none" }}>
            {slot}
            {isAttempt ? <span style={{ position: "absolute", left: "50%", top: -34, translate: "-50% 0", padding: "4px 10px", borderRadius: 999, background: "#e5484d", color: "#fff", fontFamily: brand.fonts.body, fontSize: 14, whiteSpace: "nowrap" }}>{busyLabel}</span> : null}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Mostrador: venta, caja y liquidaciones ─── */

export function FlatTicket({ items, method, from, width, labels }: { items: Array<{ name: string; price: number }>; method: string; from: number; width: number; labels: { total: string; methods: string[]; charge: string; charged: string } }) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  const shown = items.filter((_, index) => frame >= from + index * 22).length;
  const total = items.slice(0, shown).reduce((sum, item) => sum + item.price, 0);
  const paidAt = from + items.length * 22 + 30;
  const paid = progress(frame, paidAt, paidAt + 14);
  return (
    <div style={{ width }}>
      {items.map((item, index) => {
        const enter = progress(frame, from + index * 22, from + index * 22 + 14);
        return (
          <div key={item.name} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: `1px solid ${brand.palette.line}`, fontFamily: brand.fonts.body, fontSize: 22, color: brand.palette.text, opacity: enter, translate: `${(1 - enter) * 20}px 0` }}>
            <span>{item.name}</span>
            <span style={{ color: brand.palette.accentSoft }}>$ {item.price}</span>
          </div>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 22, fontFamily: brand.fonts.display, color: brand.palette.text }}>
        <span style={{ fontSize: 24, color: brand.palette.muted }}>{labels.total}</span>
        <span style={{ fontSize: 56, fontWeight: 700 }}>$ {Math.round(interpolate(frame, [from, from + items.length * 22], [0, total], CLAMP))}</span>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
        {labels.methods.map((option) => (
          <span key={option} style={{ padding: "10px 16px", borderRadius: 999, fontFamily: brand.fonts.body, fontSize: 17, border: `1px solid ${option === method ? brand.palette.accent : brand.palette.line}`, color: option === method ? brand.palette.accent : brand.palette.muted }}>
            {option}
          </span>
        ))}
      </div>
      <div style={{ marginTop: 22, padding: "18px 0", borderRadius: brand.radius, textAlign: "center", fontFamily: brand.fonts.display, fontSize: 26, fontWeight: 700, background: paid > 0.5 ? alpha(brand.palette.accent, 14) : brand.palette.accent, color: paid > 0.5 ? brand.palette.accent : brand.palette.onAccent, border: `1px solid ${brand.palette.accent}` }}>
        {paid > 0.5 ? `✓ ${labels.charged}` : labels.charge}
      </div>
    </div>
  );
}

export function FlatRows({ rows, from, width, stagger = 16 }: { rows: Array<{ label: string; meta?: string; value: number; prefix?: string }>; from: number; width: number; stagger?: number }) {
  const frame = useCurrentFrame();
  const brand = useBrand();
  return (
    <div style={{ width }}>
      {rows.map((row, index) => {
        const start = from + index * stagger;
        const enter = progress(frame, start, start + 16);
        const value = Math.round(interpolate(frame, [start, start + 40], [0, row.value], { ...CLAMP, easing: EASE_IN_OUT }));
        return (
          <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", marginBottom: 12, borderRadius: brand.radius, background: brand.palette.surface, border: `1px solid ${brand.palette.line}`, opacity: enter, translate: `0 ${(1 - enter) * 16}px` }}>
            <div>
              <div style={{ fontFamily: brand.fonts.display, fontSize: 26, fontWeight: 600, color: brand.palette.text }}>{row.label}</div>
              {row.meta ? <div style={{ marginTop: 4, fontFamily: brand.fonts.body, fontSize: 16, color: brand.palette.muted }}>{row.meta}</div> : null}
            </div>
            <div style={{ fontFamily: brand.fonts.display, fontSize: 34, fontWeight: 700, color: brand.palette.accentSoft }}>{row.prefix ?? "$ "}{value}</div>
          </div>
        );
      })}
    </div>
  );
}
