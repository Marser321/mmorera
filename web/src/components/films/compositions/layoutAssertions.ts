import assert from "node:assert/strict";
import { inside, overlaps, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { countLines, MIN_TEXT, textHeight, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";

/**
 * Comprobaciones comunes de los tests de layout de los films insignia: los
 * bloques no salen de su marco, ningún texto pisa a otro (ni a un gráfico) y
 * cada texto entra en sus líneas con un tamaño legible.
 */
export function assertBlocks(blocks: LayoutBlock[], frame: Box, format: FilmFormatName, name: string) {
  for (const block of blocks) assert.ok(inside(block.box, frame), `${name}: ${block.id} sale de su marco`);
  const texts = blocks.filter((block): block is TextBlock => block.kind === "text");
  const media = blocks.filter((block) => block.kind === "media");
  for (const text of texts) {
    assert.ok(text.size >= MIN_TEXT[format], `${name}: ${text.id} a ${text.size} px (mínimo ${MIN_TEXT[format]})`);
    assert.ok(countLines(text.text, text.size, text.box.w, text.glyph) <= text.lines, `${name}: "${text.text}" no entra en ${text.lines} línea(s)`);
    assert.ok(textHeight(text.size, text.lines) <= text.box.h + 0.5, `${name}: ${text.id} no entra en alto`);
  }
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) assert.ok(!overlaps(texts[i].box, texts[j].box), `${name}: ${texts[i].id} pisa ${texts[j].id}`);
    for (const item of media) assert.ok(!overlaps(texts[i].box, item.box), `${name}: ${texts[i].id} pisa ${item.id}`);
  }
}

export function assertInside(inner: Box, outer: Box, name: string) {
  assert.ok(inside(inner, outer), `${name}: ${JSON.stringify(inner)} sale de ${JSON.stringify(outer)}`);
}
