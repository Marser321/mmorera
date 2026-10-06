/**
 * Medidas reales de un archivo de medios leyendo sus cabeceras (sin
 * dependencias). La usan los tests de los films para comprobar que cada asset
 * declara su tamaño nativo: la cámara nunca amplía más allá de él.
 */

export interface MediaSize {
  width: number;
  height: number;
  /** Solo video: duración en segundos. */
  seconds?: number;
}

function png(data: Buffer): MediaSize {
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

function jpeg(data: Buffer): MediaSize {
  let offset = 2;
  while (offset < data.length) {
    const marker = data[offset + 1];
    const length = data.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) return { width: data.readUInt16BE(offset + 7), height: data.readUInt16BE(offset + 5) };
    offset += 2 + length;
  }
  throw new Error("JPEG sin marcador SOF");
}

function webp(data: Buffer): MediaSize {
  const chunk = data.toString("ascii", 12, 16);
  if (chunk === "VP8X") return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
  if (chunk === "VP8 ") return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
  if (chunk === "VP8L") {
    const bits = data.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  throw new Error(`WebP desconocido: ${chunk}`);
}

/** Busca una caja MP4 por tipo dentro de [start, end). */
function findBox(data: Buffer, type: string, start = 0, end = data.length): { start: number; size: number } | null {
  let offset = start;
  while (offset + 8 <= end) {
    const size = data.readUInt32BE(offset);
    if (data.toString("ascii", offset + 4, offset + 8) === type) return { start: offset, size };
    if (size < 8) return null;
    offset += size;
  }
  return null;
}

function mp4(data: Buffer): MediaSize {
  const moov = findBox(data, "moov");
  if (!moov) throw new Error("MP4 sin moov");
  const mvhd = findBox(data, "mvhd", moov.start + 8, moov.start + moov.size);
  if (!mvhd) throw new Error("MP4 sin mvhd");
  const version = data[mvhd.start + 8];
  const timescale = version === 1 ? data.readUInt32BE(mvhd.start + 28) : data.readUInt32BE(mvhd.start + 20);
  const duration = version === 1 ? Number(data.readBigUInt64BE(mvhd.start + 32)) : data.readUInt32BE(mvhd.start + 24);
  // Primer track con dimensiones (tkhd: ancho y alto en punto fijo 16.16 al final de la caja).
  let offset = moov.start + 8;
  while (offset < moov.start + moov.size) {
    const trak = findBox(data, "trak", offset, moov.start + moov.size);
    if (!trak) break;
    const tkhd = findBox(data, "tkhd", trak.start + 8, trak.start + trak.size);
    if (tkhd) {
      const width = data.readUInt32BE(tkhd.start + tkhd.size - 8) / 65536;
      const height = data.readUInt32BE(tkhd.start + tkhd.size - 4) / 65536;
      if (width > 0 && height > 0) return { width, height, seconds: duration / timescale };
    }
    offset = trak.start + trak.size;
  }
  throw new Error("MP4 sin track de video");
}

export function mediaSize(data: Buffer, file: string): MediaSize {
  const extension = file.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "png":
      return png(data);
    case "jpg":
    case "jpeg":
      return jpeg(data);
    case "webp":
      return webp(data);
    case "mp4":
      return mp4(data);
    default:
      throw new Error(`Formato sin lector: ${file}`);
  }
}
