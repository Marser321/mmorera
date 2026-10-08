import { kitBands } from "./kit/kitLayout";
import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import {
  EVO_FINISH_KEYS,
  EVO_FINISHES,
  EVO_HOST,
  type EvoCopy,
  type EvoFinishKey,
} from "@/data/films/flagships/evowrap";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type EvoFinishCardLayout = {
  id: EvoFinishKey;
  card: Box;
  swatch: Box;
  codeBlock: TextBlock;
  nameBlock: TextBlock;
  metaBlock: TextBlock;
};

export type EvoVisualizerWindowLayout = {
  win: Box;
  bar: Box;
  url: TextBlock;
  screen: Box;
  badge: Box;
};

export type EvoFinishSelectorLayout = {
  title: Box;
  body: Box;
  window: EvoVisualizerWindowLayout;
  cards: EvoFinishCardLayout[];
  blocks: LayoutBlock[];
};

export type EvoTransformationLayout = {
  title: Box;
  body: Box;
  frame: Box;
  beforeBadge: Box;
  afterBadge: Box;
  beforeLabel: TextBlock;
  afterLabel: TextBlock;
  note: TextBlock;
  blocks: LayoutBlock[];
};

export const EVO_CAPTURE_ASPECT = 16 / 9;

export function evoFinishSelectorLayout(
  format: FilmFormatName,
  copy: EvoCopy,
  language: FilmLanguage,
): EvoFinishSelectorLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const barH = portrait ? 44 : 36;
  const urlFontSize = portrait ? 22 : 15;
  const codeFontSize = portrait ? 20 : 15;
  const nameFontSize = portrait ? 21 : 16;
  const metaFontSize = portrait ? 20 : 15;

  const urlText = `${EVO_HOST}/visualizer`;
  const blocks: LayoutBlock[] = [];

  if (!portrait) {
    // LANDSCAPE (1600x900): 2 columnas
    // Columna izquierda: Ventana 3D del configurador (1.15 flex)
    // Columna derecha: Grilla 2x4 de acabados (1 flex)
    const [leftCol, rightCol] = splitColumns(body, [1.15, 1], 32);

    // Ventana proporcional
    const maxWinW = leftCol.w;
    const maxWinH = leftCol.h;
    let winW = maxWinW;
    let screenH = winW / EVO_CAPTURE_ASPECT;
    if (screenH + barH > maxWinH) {
      screenH = maxWinH - barH;
      winW = screenH * EVO_CAPTURE_ASPECT;
    }
    const winX = leftCol.x + (leftCol.w - winW) / 2;
    const winY = leftCol.y + (leftCol.h - (screenH + barH)) / 2;
    const win: Box = { x: winX, y: winY, w: winW, h: screenH + barH };
    const bar: Box = { x: winX, y: winY, w: winW, h: barH };
    const screen: Box = { x: winX, y: winY + barH, w: winW, h: screenH };

    const url = textBlock(
      "evo.window.url",
      {
        x: bar.x + 56,
        y: bar.y + (bar.h - textHeight(urlFontSize, 1)) / 2,
        w: Math.ceil(textWidth(urlText, urlFontSize)) + 16,
        h: textHeight(urlFontSize, 1),
      },
      urlText,
      urlFontSize,
      1,
    );
    blocks.push(url);

    const badge: Box = {
      x: screen.x + screen.w - 180,
      y: screen.y + 16,
      w: 164,
      h: 32,
    };

    // 8 tarjetas en grilla 2 columnas x 4 filas
    const cols = 2;
    const rows = 4;
    const gapX = 12;
    const gapY = 10;
    const cardW = Math.floor((rightCol.w - (cols - 1) * gapX) / cols);
    const cardH = Math.floor((rightCol.h - (rows - 1) * gapY) / rows);
    const pad = 8;
    const swatchSize = 28;

    const cards: EvoFinishCardLayout[] = EVO_FINISH_KEYS.map((key, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cardX = rightCol.x + col * (cardW + gapX);
      const cardY = rightCol.y + row * (cardH + gapY);
      const card: Box = { x: cardX, y: cardY, w: cardW, h: cardH };

      const def = EVO_FINISHES.find((f) => f.id === key)!;
      const finishName = def.name[language];
      const finishMeta = def.sheen[language];

      const swatch: Box = {
        x: card.x + pad,
        y: card.y + pad,
        w: swatchSize,
        h: swatchSize,
      };

      const codeBlock = textBlock(
        `evo.card.${key}.code`,
        {
          x: swatch.x + swatch.w + 6,
          y: card.y + pad + (swatchSize - textHeight(codeFontSize, 1)) / 2,
          w: Math.ceil(textWidth(def.code, codeFontSize)) + 6,
          h: textHeight(codeFontSize, 1),
        },
        def.code,
        codeFontSize,
        1,
      );

      const nameX = codeBlock.box.x + codeBlock.box.w + 4;
      const nameW = card.x + card.w - pad - nameX;
      const nameBlock = textBlock(
        `evo.card.${key}.name`,
        {
          x: nameX,
          y: card.y + pad + (swatchSize - textHeight(nameFontSize, 1)) / 2,
          w: Math.max(30, nameW),
          h: textHeight(nameFontSize, 1),
        },
        finishName,
        nameFontSize,
        1,
      );

      const metaY = swatch.y + swatch.h + 6;
      const metaH = textHeight(metaFontSize, 1);
      const metaBlock = textBlock(
        `evo.card.${key}.meta`,
        {
          x: card.x + pad,
          y: metaY,
          w: card.w - pad * 2,
          h: metaH,
        },
        finishMeta,
        metaFontSize,
        1,
      );

      blocks.push(codeBlock, nameBlock, metaBlock);

      return {
        id: key,
        card,
        swatch,
        codeBlock,
        nameBlock,
        metaBlock,
      };
    });

    return {
      title,
      body,
      window: { win, bar, url, screen, badge },
      cards,
      blocks,
    };
  } else {
    // PORTRAIT (1080x1350): Layout vertical
    // Parte superior: Ventana 3D del configurador
    // Parte inferior: Grilla 2x4 de acabados
    const splitGap = 20;
    const topH = Math.floor(body.h * 0.44);
    const bottomH = body.h - topH - splitGap;

    const topArea: Box = { x: body.x, y: body.y, w: body.w, h: topH };
    const bottomArea: Box = { x: body.x, y: body.y + topH + splitGap, w: body.w, h: bottomH };

    // Ventana proporcional en topArea
    let winW = topArea.w;
    let screenH = winW / EVO_CAPTURE_ASPECT;
    if (screenH + barH > topArea.h) {
      screenH = topArea.h - barH;
      winW = screenH * EVO_CAPTURE_ASPECT;
    }
    const winX = topArea.x + (topArea.w - winW) / 2;
    const winY = topArea.y + (topArea.h - (screenH + barH)) / 2;
    const win: Box = { x: winX, y: winY, w: winW, h: screenH + barH };
    const bar: Box = { x: winX, y: winY, w: winW, h: barH };
    const screen: Box = { x: winX, y: winY + barH, w: winW, h: screenH };

    const url = textBlock(
      "evo.window.url",
      {
        x: bar.x + 64,
        y: bar.y + (bar.h - textHeight(urlFontSize, 1)) / 2,
        w: Math.ceil(textWidth(urlText, urlFontSize)) + 16,
        h: textHeight(urlFontSize, 1),
      },
      urlText,
      urlFontSize,
      1,
    );
    blocks.push(url);

    const badge: Box = {
      x: screen.x + screen.w - 200,
      y: screen.y + 14,
      w: 184,
      h: 36,
    };

    // 8 tarjetas en grilla 2 columnas x 4 filas
    const cols = 2;
    const rows = 4;
    const gapX = 14;
    const gapY = 10;
    const cardW = Math.floor((bottomArea.w - (cols - 1) * gapX) / cols);
    const cardH = Math.floor((bottomArea.h - (rows - 1) * gapY) / rows);
    const pad = 10;
    const swatchSize = 34;

    const cards: EvoFinishCardLayout[] = EVO_FINISH_KEYS.map((key, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cardX = bottomArea.x + col * (cardW + gapX);
      const cardY = bottomArea.y + row * (cardH + gapY);
      const card: Box = { x: cardX, y: cardY, w: cardW, h: cardH };

      const def = EVO_FINISHES.find((f) => f.id === key)!;
      const finishName = def.name[language];
      const finishMeta = def.sheen[language];

      const swatch: Box = {
        x: card.x + pad,
        y: card.y + pad,
        w: swatchSize,
        h: swatchSize,
      };

      const codeBlock = textBlock(
        `evo.card.${key}.code`,
        {
          x: swatch.x + swatch.w + 8,
          y: card.y + pad + (swatchSize - textHeight(codeFontSize, 1)) / 2,
          w: Math.ceil(textWidth(def.code, codeFontSize)) + 8,
          h: textHeight(codeFontSize, 1),
        },
        def.code,
        codeFontSize,
        1,
      );

      const nameX = codeBlock.box.x + codeBlock.box.w + 6;
      const nameW = card.x + card.w - pad - nameX;
      const nameBlock = textBlock(
        `evo.card.${key}.name`,
        {
          x: nameX,
          y: card.y + pad + (swatchSize - textHeight(nameFontSize, 1)) / 2,
          w: Math.max(30, nameW),
          h: textHeight(nameFontSize, 1),
        },
        finishName,
        nameFontSize,
        1,
      );

      const metaY = swatch.y + swatch.h + 8;
      const metaH = textHeight(metaFontSize, 1);
      const metaBlock = textBlock(
        `evo.card.${key}.meta`,
        {
          x: card.x + pad,
          y: metaY,
          w: card.w - pad * 2,
          h: metaH,
        },
        finishMeta,
        metaFontSize,
        1,
      );

      blocks.push(codeBlock, nameBlock, metaBlock);

      return {
        id: key,
        card,
        swatch,
        codeBlock,
        nameBlock,
        metaBlock,
      };
    });

    return {
      title,
      body,
      window: { win, bar, url, screen, badge },
      cards,
      blocks,
    };
  }
}

export function evoTransformationLayout(
  format: FilmFormatName,
  copy: EvoCopy,
): EvoTransformationLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const labelFontSize = portrait ? 20 : 15;
  const noteFontSize = portrait ? 20 : 15;
  const blocks: LayoutBlock[] = [];

  const noteH = textHeight(noteFontSize, 1);
  const noteGap = portrait ? 18 : 14;

  const frameW = portrait ? body.w : Math.min(body.w, 1100);
  const frameH = body.h - noteH - noteGap;
  const frameX = body.x + (body.w - frameW) / 2;
  const frameY = body.y;
  const frame: Box = { x: frameX, y: frameY, w: frameW, h: frameH };

  const badgePad = portrait ? 18 : 16;
  const badgeH = portrait ? 40 : 34;

  const beforeText = copy.transformation.beforeLabel;
  const beforeTextW = Math.ceil(textWidth(beforeText, labelFontSize)) + (portrait ? 28 : 20);
  const beforeBadge: Box = {
    x: frame.x + badgePad,
    y: frame.y + badgePad,
    w: beforeTextW,
    h: badgeH,
  };
  const beforeLabel = textBlock(
    "evo.transform.before",
    {
      x: beforeBadge.x,
      y: beforeBadge.y + (beforeBadge.h - textHeight(labelFontSize, 1)) / 2,
      w: beforeBadge.w,
      h: textHeight(labelFontSize, 1),
    },
    beforeText,
    labelFontSize,
    1,
  );
  blocks.push(beforeLabel);

  const afterText = copy.transformation.afterLabel;
  const afterTextW = Math.ceil(textWidth(afterText, labelFontSize)) + (portrait ? 28 : 20);
  const afterBadge: Box = {
    x: frame.x + frame.w - badgePad - afterTextW,
    y: frame.y + badgePad,
    w: afterTextW,
    h: badgeH,
  };
  const afterLabel = textBlock(
    "evo.transform.after",
    {
      x: afterBadge.x,
      y: afterBadge.y + (afterBadge.h - textHeight(labelFontSize, 1)) / 2,
      w: afterBadge.w,
      h: textHeight(labelFontSize, 1),
    },
    afterText,
    labelFontSize,
    1,
  );
  blocks.push(afterLabel);

  const noteY = frame.y + frame.h + noteGap;
  const noteBlock = textBlock(
    "evo.transform.note",
    {
      x: frame.x,
      y: noteY,
      w: frame.w,
      h: noteH,
    },
    copy.transformation.note,
    noteFontSize,
    1,
  );
  blocks.push(noteBlock);

  return {
    title,
    body,
    frame,
    beforeBadge,
    afterBadge,
    beforeLabel,
    afterLabel,
    note: noteBlock,
    blocks,
  };
}
