"""
Banda sonora del trailer de la fábrica de contenido, sintetizada con numpy.

No usa muestras ni música de terceros: cada sonido se genera aquí, con los
mismos tiempos del video (src/components/films/trailer/timing.json), así
que cada corte, golpe y caída cae en el pulso.

Uso: python scripts/trailer-soundtrack.py <salida.wav> [--chars <letras del pedido tecleado>]

Forma (120 BPM, compás = 2 s, en La menor: Am · F · C · G):
  0-4 s    entrada: colchón suave, el tecleo del pedido y el Enter
  4-8 s    título: tres golpes graves
  8-20 s   el pulso de las ediciones: bombo, platillos y bajo; palmas desde los 12 s
  20-24 s  el puente: redoble y barrido de ruido hasta la caída
  24-47 s  la caída, los siete estilos: todo junto, con arpegio y un acento en cada corte
  47-51 s  el muro: respiro a medio tiempo, campanas, el cambio de idioma y el sello
  51-54 s  el código: arpegio digital y subida
  54-60 s  cierre: golpe, campanas y el acorde que se apaga
"""

import json
import sys
import wave
from pathlib import Path

import numpy as np

SR = 48_000
ROOT = Path(__file__).resolve().parent.parent
TIMING = json.loads((ROOT / "src/components/films/trailer/timing.json").read_text(encoding="utf-8"))
FPS = TIMING["fps"]
BEAT = 60.0 / TIMING["bpm"]
BAR = BEAT * 4
TOTAL = TIMING["total"] / FPS
N = int(round(TOTAL * SR))
RNG = np.random.default_rng(20261104)


def sec(frame: float) -> float:
    return frame / FPS


def tvec(duration: float) -> np.ndarray:
    return np.arange(int(round(duration * SR))) / SR


def midi(note: float) -> float:
    return 440.0 * 2 ** ((note - 69) / 12)


# ── Filtros en frecuencia (estáticos, suaves) ─────────────────────────────


def shape(x: np.ndarray, low: float | None = None, high: float | None = None, order: int = 2) -> np.ndarray:
    """Pasa-altos (low) y pasa-bajos (high) con caída tipo Butterworth, por FFT."""
    if x.size == 0:
        return x
    n = int(2 ** np.ceil(np.log2(x.size + 1)))
    spectrum = np.fft.rfft(x, n)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    gain = np.ones_like(freqs)
    if high is not None:
        gain *= 1 / np.sqrt(1 + (freqs / high) ** (2 * order))
    if low is not None:
        with np.errstate(divide="ignore"):
            gain *= 1 / np.sqrt(1 + (low / np.maximum(freqs, 1e-6)) ** (2 * order))
    return np.fft.irfft(spectrum * gain, n)[: x.size]


def tilt(x: np.ndarray, low_db: float = -2.0, high_db: float = 3.5, low_corner: float = 110.0, high_corner: float = 3500.0) -> np.ndarray:
    """Ecualización de máster: un poco menos de graves y un poco más de brillo."""
    n = int(2 ** np.ceil(np.log2(x.size + 1)))
    spectrum = np.fft.rfft(x, n)
    freqs = np.maximum(np.fft.rfftfreq(n, 1 / SR), 1e-6)
    low = 1 + (10 ** (low_db / 20) - 1) / (1 + (freqs / low_corner) ** 2)
    high = 1 + (10 ** (high_db / 20) - 1) / (1 + (high_corner / freqs) ** 2)
    return np.fft.irfft(spectrum * low * high, n)[: x.size]


def band(x: np.ndarray, center: float, width: float = 1.0) -> np.ndarray:
    return shape(x, low=center / (1 + width), high=center * (1 + width))


# ── Osciladores y envolventes ─────────────────────────────────────────────


def saw(freq: float, t: np.ndarray, ceiling: float = 5000.0, phase: float = 0.0) -> np.ndarray:
    """Diente de sierra de banda limitada (aditiva), sin aliasing."""
    out = np.zeros_like(t)
    harmonics = max(1, int(ceiling // freq))
    for k in range(1, harmonics + 1):
        out += np.sin(2 * np.pi * k * freq * t + phase * k) / k
    return out * (2 / np.pi)


def env(t: np.ndarray, attack: float, release: float, total: float) -> np.ndarray:
    """Envolvente lineal de entrada y salida con meseta."""
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    r = np.clip((total - t) / max(release, 1e-4), 0, 1)
    return np.minimum(a, r)


def decay(t: np.ndarray, rate: float, attack: float = 0.002) -> np.ndarray:
    return np.exp(-t * rate) * np.clip(t / attack, 0, 1)


class Bus:
    """Un canal estéreo donde se colocan sonidos en el tiempo."""

    def __init__(self) -> None:
        self.l = np.zeros(N)
        self.r = np.zeros(N)

    def put(self, at: float, sound: np.ndarray, gain: float = 1.0, pan: float = 0.0, right: np.ndarray | None = None) -> None:
        start = int(round(at * SR))
        if start >= N:
            return
        left = sound
        rgt = sound if right is None else right
        end = min(N, start + max(left.size, rgt.size))
        if start < 0:
            return
        gl = gain * np.cos((pan + 1) * np.pi / 4) * np.sqrt(2)
        gr = gain * np.sin((pan + 1) * np.pi / 4) * np.sqrt(2)
        self.l[start : min(end, start + left.size)] += left[: min(end, start + left.size) - start] * gl
        self.r[start : min(end, start + rgt.size)] += rgt[: min(end, start + rgt.size) - start] * gr

    def apply(self, gain: np.ndarray) -> None:
        self.l *= gain
        self.r *= gain


# ── Instrumentos ──────────────────────────────────────────────────────────


def kick(length: float = 0.5, punch: float = 1.0) -> np.ndarray:
    t = tvec(length)
    freq = 52 + 110 * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(freq) / SR) * np.exp(-t * 9.0)
    click = shape(RNG.standard_normal(t.size), low=2000, high=9000) * np.exp(-t * 320) * 0.3
    return np.tanh(1.6 * punch * (body + click)) * 0.85


def clap(length: float = 0.3) -> np.ndarray:
    t = tvec(length)
    noise = band(RNG.standard_normal(t.size), 2100, 1.0)
    bursts = sum(np.exp(-np.maximum(t - d, 0) * 160) * (t >= d) for d in (0.0, 0.009, 0.018))
    tail = np.exp(-t * 16) * 0.55
    return noise * (bursts * 0.5 + tail) * 0.55


def hat(length: float = 0.07, open_hat: bool = False) -> np.ndarray:
    t = tvec(0.3 if open_hat else length)
    noise = shape(RNG.standard_normal(t.size), low=6000, high=14000)
    return noise * np.exp(-t * (16 if open_hat else 75)) * 1.15


def shaker() -> np.ndarray:
    t = tvec(0.05)
    return shape(RNG.standard_normal(t.size), low=8000, high=15000) * np.exp(-t * 90) * np.clip(t / 0.004, 0, 1)


def bass_note(freq: float, length: float, bright: float = 0.25) -> np.ndarray:
    t = tvec(length)
    tone = np.sin(2 * np.pi * freq * t) + bright * np.sin(2 * np.pi * 2 * freq * t) + 0.08 * np.sin(2 * np.pi * 3 * freq * t)
    return np.tanh(1.3 * tone) * env(t, 0.006, 0.06, length) * (0.75 + 0.25 * np.exp(-t * 6))


def pluck(freq: float, length: float = 0.24, ceiling: float = 5200) -> np.ndarray:
    t = tvec(length)
    tone = saw(freq, t, ceiling) * 0.6 + np.sin(2 * np.pi * freq * t) * 0.4
    return shape(tone * np.exp(-t * 15) * np.clip(t / 0.003, 0, 1), high=ceiling * 0.8)


def bell(freq: float, length: float = 2.4) -> np.ndarray:
    t = tvec(length)
    partials = [(1.0, 1.0, 3.2), (2.0, 0.42, 4.4), (2.76, 0.22, 5.5), (5.4, 0.08, 8.0)]
    return sum(amp * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t * rate) for ratio, amp, rate in partials) * np.clip(t / 0.003, 0, 1) * 0.5


def impact(length: float = 2.6, depth: float = 1.0) -> np.ndarray:
    t = tvec(length)
    sweep = 62 * np.exp(-t * 0.9) + 30
    sub = np.sin(2 * np.pi * np.cumsum(sweep) / SR) * np.exp(-t * 2.6) * 0.65
    noise = shape(RNG.standard_normal(t.size), low=60, high=2200) * np.exp(-t * 6.5) * 0.8
    crack = shape(RNG.standard_normal(t.size), low=2500, high=11000) * np.exp(-t * 30) * 0.35
    return np.tanh(1.2 * depth * (sub + noise + crack)) * 0.9


def whoosh(length: float = 0.42) -> np.ndarray:
    t = tvec(length)
    noise = band(RNG.standard_normal(t.size), 1800, 1.4)
    rise = (t / length) ** 2.2
    return noise * rise * np.clip((length - t) / 0.02, 0, 1) * 0.5


def riser(length: float) -> np.ndarray:
    """Ruido que sube de brillo + un tono que sube una octava y media."""
    t = tvec(length)
    out = np.zeros_like(t)
    steps = 24
    seg = t.size // steps
    noise = RNG.standard_normal(t.size + seg)
    for i in range(steps):
        center = 300 * (12000 / 300) ** (i / (steps - 1)) * 0.5
        window = np.zeros(t.size)
        a, b = max(0, (i - 1) * seg), min(t.size, (i + 1) * seg)
        window[a:b] = np.hanning(b - a)
        out += band(noise[: t.size], center, 0.8) * window
    tone_freq = 220 * (2 ** (1.5 * t / length))
    tone = np.sin(2 * np.pi * np.cumsum(tone_freq) / SR) * 0.25
    amp = (t / length) ** 2.4
    return (out * 0.55 + tone) * amp


def typing_click() -> np.ndarray:
    t = tvec(0.03)
    return band(RNG.standard_normal(t.size), 3200, 0.8) * np.exp(-t * 260) * (0.6 + 0.4 * RNG.random())


def enter_thock() -> np.ndarray:
    t = tvec(0.16)
    return (np.sin(2 * np.pi * 190 * t) * np.exp(-t * 38) + band(RNG.standard_normal(t.size), 1400, 0.8) * np.exp(-t * 90) * 0.4) * 0.8


# ── Armonía ───────────────────────────────────────────────────────────────

# La menor: Am · F · C · G. Raíz para el bajo y voces para el colchón (MIDI).
CHORDS = [
    {"root": 45, "voices": [57, 60, 64, 69]},  # Am
    {"root": 41, "voices": [57, 60, 65, 69]},  # F
    {"root": 48, "voices": [55, 60, 64, 67]},  # C
    {"root": 43, "voices": [55, 59, 62, 67]},  # G
]
AM = CHORDS[0]


FINALE_BAR = int(round(TIMING["cues"]["finale"] / TIMING["bar"]))


def chord_at(bar: int):
    return AM if bar >= FINALE_BAR else CHORDS[bar % 4]


def pad_layer(bus: Bus, start_bar: int, end_bar: int, ceiling_for_bar) -> None:
    for bar in range(start_bar, end_bar):
        chord = chord_at(bar)
        at = bar * BAR
        length = BAR + 0.5 if bar < end_bar - 1 else BAR
        if bar == FINALE_BAR:
            length = TOTAL - at
        t = tvec(length)
        ceiling = ceiling_for_bar(bar)
        left = np.zeros_like(t)
        right = np.zeros_like(t)
        for v, note in enumerate(chord["voices"]):
            f = midi(note)
            for detune, side in ((-0.06, 0), (0.0, 2), (0.07, 1)):
                wave_ = saw(f * 2 ** (detune / 12), t, ceiling, phase=v * 0.7 + detune * 10)
                if side in (0, 2):
                    left += wave_
                if side in (1, 2):
                    right += wave_
        attack = 0.35 if bar != FINALE_BAR else 0.05
        e = env(t, attack, 0.5, length)
        if bar == FINALE_BAR:
            e = e * np.clip(1 - (t - 3.2) / 2.8, 0, 1)
        bus.put(at, shape(left * e, low=160, high=ceiling * 0.6) * 0.13, right=shape(right * e, low=160, high=ceiling * 0.6) * 0.13)


def build(prompt_chars: int) -> np.ndarray:
    drums, bass, pad, keys, fx, verb_send = Bus(), Bus(), Bus(), Bus(), Bus(), Bus()
    cues = TIMING["cues"]
    kick_hits: list[float] = []
    drop = sec(cues["drop"])
    wall = sec(cues["wall"])
    code = sec(cues["code"])
    finale = sec(cues["finale"])

    # Colchón: oscuro al principio, se abre hacia la caída; respira en el muro.
    def pad_ceiling(bar: int) -> float:
        at = bar * BAR
        if at < 4:
            return 1600
        if at < 20:
            return 3200
        if at < drop:
            return 3200 + (at - 18) * 700
        if at < wall - 1:
            return 7000 if int((at - drop) // 8) % 2 == 0 else 5600
        if at < code:
            return 2200
        return 4800

    pad_layer(pad, 0, FINALE_BAR + 1, pad_ceiling)

    # 0–4 s: el tecleo del pedido y el Enter.
    for i in range(prompt_chars):
        at = sec(cues["typingFrom"] + i * cues["typingFramesPerChar"])
        fx.put(at, typing_click(), 0.22, pan=RNG.uniform(-0.3, 0.3))
    fx.put(sec(cues["enter"]), enter_thock(), 0.5)
    fx.put(sec(cues["enter"]), impact(2.0, 0.6), 0.32)
    verb_send.put(sec(cues["enter"]), impact(2.0, 0.6), 0.25)
    for beat in range(4, 8):  # un pulso grave tras el Enter
        bass.put(beat * BEAT, bass_note(midi(33), 0.42, 0.1), 0.5)

    # 4–8 s: los golpes del título.
    for i, frame in enumerate(cues["titleSlams"]):
        at = sec(frame)
        drums.put(at, kick(0.6, 1.3), 0.9)
        fx.put(at, impact(1.6, 0.8 if i else 1.0), 0.45)
        verb_send.put(at, impact(1.6, 0.8), 0.3)
        kick_hits.append(at)
    bass.put(sec(cues["titleSlams"][0]), bass_note(midi(33), 3.6, 0.15) * np.exp(-tvec(3.6) * 0.7), 0.55)

    # 8–24 s: el pulso de las ediciones, con palmas desde los 12 s y el puente desde los 20 s.
    for b in range(int(8 / BEAT), int(drop / BEAT)):
        at = b * BEAT
        if at >= drop - 1.0:  # medio compás sin bombo antes de la caída
            continue
        drums.put(at, kick(), 0.82)
        kick_hits.append(at)
        drums.put(at + BEAT / 2, hat(), 0.5, pan=0.25)
        if at >= 12 and b % 2 == 1:
            drums.put(at, clap(), 0.55, pan=-0.05)
            verb_send.put(at, clap(), 0.15)
        if at >= 16:
            drums.put(at + BEAT / 4, hat(0.04), 0.22, pan=-0.3)
            drums.put(at + 3 * BEAT / 4, hat(0.04), 0.22, pan=0.35)
    for e in range(int((drop - 8) / (BEAT / 2))):  # bajo en corcheas
        at = 8 + e * BEAT / 2
        if at >= drop - 0.25:
            break
        bar = int(at // BAR)
        root = chord_at(bar)["root"] - 12
        bass.put(at, bass_note(midi(root + (12 if (e % 4 == 3) else 0)), BEAT / 2 - 0.02), 0.5)
    bridge = sec(cues["bridgeLines"][0])
    for i in range(16):  # redoble del puente
        at = bridge + i * (BEAT / 2)
        drums.put(at, clap(0.18), 0.12 + 0.02 * i, pan=0.0)
    for i in range(8):
        at = drop - 2 + i * (BEAT / 4)
        drums.put(at, clap(0.12), 0.3 + 0.03 * i)
    for s16 in range(int((drop - 8) / (BEAT / 4))):
        at = 8 + s16 * BEAT / 4
        accent = 1.0 if s16 % 4 == 2 else 0.55
        drums.put(at, shaker(), 0.22 * accent, pan=0.45 if s16 % 2 else -0.45)
    for at in [sec(f) for f in cues["bridgeLines"]]:
        fx.put(at, impact(1.2, 0.5), 0.22)
    fx.put(bridge, riser(drop - bridge), 0.42)
    fx.put(drop - 0.5, whoosh(0.5), 0.35)

    # 24–47 s: la caída y los siete estilos.
    fx.put(drop, impact(2.8, 1.1), 0.6)
    verb_send.put(drop, impact(2.8, 1.0), 0.35)
    fx.put(drop, hat(open_hat=True), 0.4)
    for b in range(int(drop / BEAT), int(wall / BEAT)):
        at = b * BEAT
        drums.put(at, kick(0.5, 1.1), 0.9)
        kick_hits.append(at)
        if b % 2 == 1:
            drums.put(at, clap(), 0.62)
            verb_send.put(at, clap(), 0.2)
        for k in range(4):
            drums.put(at + k * BEAT / 4, hat(0.05), 0.2 + (0.14 if k == 2 else 0), pan=0.3 if k % 2 else -0.3)
        drums.put(at + BEAT / 2, hat(open_hat=True), 0.12, pan=0.15)
        if at >= drop + 16:
            drums.put(at + 3 * BEAT / 4, shaker(), 0.25, pan=-0.4)
    for e in range(int((wall - drop) / BEAT)):  # bajo en corcheas con saltos de octava
        for half in (0, 1):
            at = drop + e * BEAT + half * BEAT / 2
            bar = int(at // BAR)
            root = chord_at(bar)["root"] - 12
            bass.put(at, bass_note(midi(root + (12 if half else 0)), BEAT / 2 - 0.02, 0.35), 0.55)
    for s in range(int((wall - drop) / (BEAT / 4))):  # arpegio en semicorcheas
        at = drop + s * BEAT / 4
        bar = int(at // BAR)
        tones = chord_at(bar)["voices"]
        second_half = int((at - drop) // 8) % 2 == 1
        order = [0, 2, 1, 3, 2, 1, 3, 0] if not second_half else [3, 1, 2, 0, 3, 2, 1, 2]
        note = tones[order[s % 8]] + (24 if second_half and s % 8 == 0 else 12)
        sound = pluck(midi(note))
        keys.put(at, sound, 0.16, pan=-0.35 if s % 2 else 0.35)
        keys.put(at + 0.375, sound, 0.06, pan=0.35 if s % 2 else -0.35)  # eco de corchea con puntillo
        verb_send.put(at, sound, 0.05)
    for frame in cues["styleCuts"][1:]:  # un acento en cada corte de estilo
        at = sec(frame)
        fx.put(at - 0.3, whoosh(0.3), 0.22, pan=RNG.uniform(-0.5, 0.5))
        fx.put(at, impact(1.0, 0.55), 0.2)
        chord = chord_at(int(at // BAR))
        stab = sum(pluck(midi(note + 12), 0.5, 4200) for note in chord["voices"][1:]) * 0.5
        keys.put(at, stab, 0.12)
        verb_send.put(at, stab, 0.12)

    # 47–51 s: el muro. Medio tiempo, campanas, el cambio de idioma y el sello.
    fx.put(wall, impact(1.8, 0.7), 0.3)
    for b in range(int(wall / BEAT), int(code / BEAT)):
        at = b * BEAT
        if (b - int(wall / BEAT)) % 2 == 0:
            drums.put(at, kick(0.5), 0.7)
            kick_hits.append(at)
        drums.put(at + BEAT / 2, hat(), 0.3, pan=0.2)
    bass.put(wall, bass_note(midi(chord_at(int(wall // BAR))["root"] - 12), 2.0, 0.1) * np.exp(-tvec(2.0) * 0.6), 0.45)
    for i, note in enumerate([76, 79, 83]):
        ding = bell(midi(note), 1.4)
        keys.put(wall + i * BEAT, ding, 0.18, pan=[-0.25, 0.0, 0.25][i])
        verb_send.put(wall + i * BEAT, ding, 0.3)
    flip = sec(cues["wallFlip"])
    for k in range(6):  # el cambio de idioma: un parpadeo digital
        keys.put(flip + k * 0.035, pluck(midi(88 - k * 2), 0.06, 7000), 0.07, pan=0.5 - k * 0.2)
    stamp = sec(cues["wallStamp"])
    drums.put(stamp, kick(0.6, 1.2), 0.8)
    fx.put(stamp, impact(1.4, 0.7), 0.3)
    verb_send.put(stamp, impact(1.4, 0.7), 0.2)
    kick_hits.append(stamp)
    bass.put(stamp, bass_note(midi(chord_at(int(stamp // BAR))["root"] - 12), 1.5, 0.1) * np.exp(-tvec(1.5) * 0.8), 0.45)

    # 51–54 s: el código. Pulso a medio tiempo, arpegio digital y subida.
    for b in range(int(code / BEAT), int(finale / BEAT)):
        at = b * BEAT
        if b % 2 == 0:
            drums.put(at, kick(0.5), 0.8)
            kick_hits.append(at)
        drums.put(at + BEAT / 2, hat(), 0.4, pan=0.2)
    for s in range(int((finale - code) / (BEAT / 4))):
        at = code + s * BEAT / 4
        bar = int(at // BAR)
        tones = chord_at(bar)["voices"]
        note = tones[s % 4] + (12 if s % 8 >= 4 else 0)
        keys.put(at, pluck(midi(note), 0.12, 5000), 0.11, pan=-0.4 if s % 2 else 0.4)
    for e in range(int((finale - code) / (BEAT / 2))):
        at = code + e * BEAT / 2
        bar = int(at // BAR)
        bass.put(at, bass_note(midi(chord_at(bar)["root"] - 12), BEAT / 2 - 0.03, 0.3), 0.45)
    fx.put(finale - 2.0, riser(2.0), 0.36)
    fx.put(finale - 0.45, whoosh(0.45), 0.3)

    # 54–60 s: el cierre.
    fx.put(finale, impact(4.0, 1.15), 0.62)
    verb_send.put(finale, impact(4.0, 1.0), 0.45)
    drums.put(finale, kick(0.8, 1.3), 0.85)
    kick_hits.append(finale)
    for i, note in enumerate([69, 72, 76, 83, 88]):
        sound = bell(midi(note), 4.0)
        keys.put(finale + i * BEAT / 2, sound, 0.17, pan=[-0.4, 0.4, -0.2, 0.2, 0.0][i])
        verb_send.put(finale + i * BEAT / 2, sound, 0.4)
    bass.put(finale, bass_note(midi(33), 5.5, 0.08) * np.exp(-tvec(5.5) * 0.55), 0.55)

    # Barridos suaves en los cortes de escena (no en la caída, los estilos ni el cierre).
    accented = {0.0, drop, finale, sec(cues["titleSlams"][0]), *[sec(f) for f in cues["styleCuts"]]}
    for scene in TIMING["scenes"]:
        at = sec(scene["from"])
        if at in accented:
            continue
        fx.put(at - 0.32, whoosh(0.32), 0.18, pan=RNG.uniform(-0.5, 0.5))

    # Compresión de bombo: el colchón y el bajo respiran con cada golpe.
    t = np.arange(N) / SR
    duck = np.ones(N)
    for at in kick_hits:
        i = int(at * SR)
        span = min(N - i, int(0.3 * SR))
        if span > 0:
            duck[i : i + span] = np.minimum(duck[i : i + span], 1 - 0.5 * np.exp(-np.arange(span) / SR / 0.09))
    pad.apply(duck)
    bass.apply(0.4 + 0.6 * duck)
    keys.apply(0.7 + 0.3 * duck)

    # Reverb por convolución: ruido que decae (2,4 s), estéreo decorrelacionado.
    ir_t = tvec(2.4)
    ir_l = shape(RNG.standard_normal(ir_t.size), high=6000) * np.exp(-ir_t * 2.6)
    ir_r = shape(RNG.standard_normal(ir_t.size), high=6000) * np.exp(-ir_t * 2.6)
    pre = int(0.022 * SR)
    ir_l = np.concatenate([np.zeros(pre), ir_l]) / np.sqrt(np.sum(ir_l**2))
    ir_r = np.concatenate([np.zeros(pre), ir_r]) / np.sqrt(np.sum(ir_r**2))
    send = Bus()
    send.l = verb_send.l + pad.l * 0.35 + keys.l * 0.25
    send.r = verb_send.r + pad.r * 0.35 + keys.r * 0.25

    def convolve(x: np.ndarray, ir: np.ndarray) -> np.ndarray:
        n = int(2 ** np.ceil(np.log2(x.size + ir.size)))
        return np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)[: x.size]

    wet_l = convolve(send.l, ir_l) * 0.32
    wet_r = convolve(send.r, ir_r) * 0.32

    left = drums.l * 0.9 + bass.l * 0.62 + pad.l + keys.l * 1.15 + fx.l + wet_l
    right = drums.r * 0.9 + bass.r * 0.62 + pad.r + keys.r * 1.15 + fx.r + wet_r
    left = tilt(shape(left, low=28))
    right = tilt(shape(right, low=28))

    # Entrada y salida, saturación suave y volumen final.
    fade = np.clip(t / 0.05, 0, 1) * np.clip((TOTAL - t) / 0.4, 0, 1)
    left, right = left * fade, right * fade
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
    drive = 1.6 / peak
    left = np.tanh(left * drive) / np.tanh(1.6)
    right = np.tanh(right * drive) / np.tanh(1.6)
    peak = max(np.max(np.abs(left)), np.max(np.abs(right)))
    target = 10 ** (-1.0 / 20)
    left, right = left * target / peak, right * target / peak
    return np.stack([left, right], axis=1)


def main() -> None:
    args = sys.argv[1:]
    chars = 22
    if "--chars" in args:
        chars = int(args[args.index("--chars") + 1])
        del args[args.index("--chars") : args.index("--chars") + 2]
    out = Path(args[0]) if args else ROOT / "renders/content-trailer/soundtrack.wav"
    out.parent.mkdir(parents=True, exist_ok=True)
    audio = build(chars)
    rms = np.sqrt(np.mean(audio**2))
    pcm = (np.clip(audio, -1, 1) * 32767).astype("<i2")
    with wave.open(str(out), "wb") as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(SR)
        file.writeframes(pcm.tobytes())
    print(f"{out} · {audio.shape[0] / SR:.2f} s · pico -1 dBFS · RMS {20 * np.log10(rms):.1f} dBFS")


if __name__ == "__main__":
    main()
