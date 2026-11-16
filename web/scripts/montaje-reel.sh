#!/usr/bin/env bash
# Arma el reel de un caso por planos (criterio en docs/films/CRITERIO-REELS.md).
# Planos: "clip|<video>|<inicio s>|<duración s>" o "still|<captura 2x 2560x1600>|<duración s>".
# Uso: bash scripts/montaje-reel.sh public/portfolio/reels/<slug> <plano> <plano> [...]
set -e
[ -n "${FFMPEG_DIR:-}" ] && export PATH="$FFMPEG_DIR:$PATH"   # ffmpeg con libsvtav1 en el PATH o en FFMPEG_DIR
out=$1; shift; tmp=$(mktemp -d); i=0; durs=()
for plano in "$@"; do
  IFS="|" read -r tipo f a b <<<"$plano"
  if [ "$tipo" = clip ]; then
    # Los clips generados traen cuadros repetidos sueltos: se sacan y se re-temporiza a 30 cps parejos.
    ffmpeg -y -loglevel error -ss "$a" -i "$f" -vf "mpdecimate=hi=768:lo=320:frac=0.33,setpts=N/30/TB,scale=1280:800:force_original_aspect_ratio=increase:flags=lanczos,crop=1280:800,format=yuv420p,setsar=1" -t "$b" -r 30 -an -c:v libx264 -crf 14 "$tmp/p$i.mp4"; durs+=("$b")
  else
    d=$a
    # Acercamiento con paso idéntico en cada cuadro: base 8x (10240x6400), +8 px de ancho y +5 de alto por cuadro (≈0,6 px en la salida).
    ffmpeg -y -loglevel error -loop 1 -framerate 30 -t "$d" -i "$f" -vf "scale=10240:6400:flags=lanczos,scale=w='10240+8*n':h='6400+5*n':eval=frame:flags=bicubic,crop=10240:6400,scale=1280:800:flags=lanczos,format=yuv420p,setsar=1" -an -c:v libx264 -crf 14 "$tmp/p$i.mp4"; durs+=("$d")
  fi
  i=$((i+1))
done
X=0.4; inputs=""; fc=""; prev="0:v"; off=0
for ((k=0;k<i;k++)); do inputs="$inputs -i $tmp/p$k.mp4"; done
for ((k=1;k<i;k++)); do off=$(awk -v o="$off" -v d="${durs[$((k-1))]}" -v x=$X 'BEGIN{printf "%.3f", o+d-x}'); lbl="v$k"; fc="$fc[$prev][$k:v]xfade=transition=fade:duration=$X:offset=$off[$lbl];"; prev=$lbl; done
ffmpeg -y -loglevel error $inputs -filter_complex "${fc}[$prev]format=yuv420p[o]" -map "[o]" -r 30 -c:v libx264 -crf 20 -preset slow -movflags +faststart -an "$out.mp4"
ffmpeg -y -loglevel error -i "$out.mp4" -c:v libsvtav1 -crf 32 -preset 6 -pix_fmt yuv420p -an "$out.webm" 2>&1 | grep -v "Svt\[" || true
rm -rf "$tmp"
echo "$out $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out.mp4")s mp4=$(stat -c%s "$out.mp4") webm=$(stat -c%s "$out.webm")"
