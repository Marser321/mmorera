import { kitBands } from "./kit/kitLayout";
import { splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { textBlock, textHeight, textWidth, GLYPH, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { AT_HOST, AT_STAGE_KEYS, type AtCopy, type AtStageKey } from "@/data/films/flagships/americaTramites";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type AtStagedCardLayout = {
  id: AtStageKey;
  card: Box;
  badge: Box;
  numBlock: TextBlock;
  tagBlock: TextBlock;
  titleBlock: TextBlock;
  detailBlock: TextBlock;
};

export type AtWindowLayout = {
  win: Box;
  bar: Box;
  url: TextBlock;
  screen: Box;
};

export type AtStagedFormLayout = {
  title: Box;
  body: Box;
  window: AtWindowLayout;
  cards: AtStagedCardLayout[];
  blocks: LayoutBlock[];
};

export const AT_CAPTURE_ASPECT = 1920 / 1080;

export function atStagedFormLayout(format: FilmFormatName, copy: AtCopy, _language: FilmLanguage): AtStagedFormLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const barH = portrait ? 44 : 36;
  const urlFontSize = portrait ? 20 : 15;
  const badgeSize = portrait ? 32 : 28;
  const numFontSize = portrait ? 20 : 15;
  const tagFontSize = portrait ? 20 : 15;
  const titleFontSize = portrait ? 22 : 17;
  const detailFontSize = portrait ? 20 : 15;

  const longestUrl = `${AT_HOST}/contacto?ruta=tramites`;
  const blocks: LayoutBlock[] = [];

  if (!portrait) {
    // LANDSCAPE (1600x900): 2 columnas
    // Columna izquierda: Ventana de captura (1.2 flex)
    // Columna derecha: 4 tarjetas de etapas apiladas (1 flex)
    const [leftCol, rightCol] = splitColumns(body, [1.2, 1], 36);

    // Ventana proporcional
    const maxWinW = leftCol.w;
    const maxWinH = leftCol.h;
    let winW = maxWinW;
    let screenH = winW / AT_CAPTURE_ASPECT;
    if (screenH + barH > maxWinH) {
      screenH = maxWinH - barH;
      winW = screenH * AT_CAPTURE_ASPECT;
    }
    const winX = leftCol.x + (leftCol.w - winW) / 2;
    const winY = leftCol.y + (leftCol.h - (screenH + barH)) / 2;
    const win: Box = { x: winX, y: winY, w: winW, h: screenH + barH };
    const bar: Box = { x: winX, y: winY, w: winW, h: barH };
    const screen: Box = { x: winX, y: winY + barH, w: winW, h: screenH };

    const url = textBlock(
      "at.window.url",
      {
        x: bar.x + 60,
        y: bar.y + (bar.h - textHeight(urlFontSize, 1)) / 2,
        w: Math.ceil(textWidth(longestUrl, urlFontSize)) + 12,
        h: textHeight(urlFontSize, 1),
      },
      longestUrl,
      urlFontSize,
      1,
    );
    blocks.push(url);

    // 4 tarjetas apiladas en la columna derecha
    const gap = 12;
    const pad = 12;
    const totalGaps = gap * (AT_STAGE_KEYS.length - 1);
    const cardH = Math.floor((rightCol.h - totalGaps) / AT_STAGE_KEYS.length);

    const cards: AtStagedCardLayout[] = AT_STAGE_KEYS.map((key, i) => {
      const cardY = rightCol.y + i * (cardH + gap);
      const card: Box = { x: rightCol.x, y: cardY, w: rightCol.w, h: cardH };
      const cardCopy = copy.staged.cards[key];

      const badge: Box = {
        x: card.x + pad,
        y: card.y + pad,
        w: badgeSize,
        h: badgeSize,
      };

      const numBlock = textBlock(
        `at.card.${key}.num`,
        {
          x: badge.x,
          y: badge.y + (badge.h - textHeight(numFontSize, 1)) / 2,
          w: badge.w,
          h: textHeight(numFontSize, 1),
        },
        cardCopy.num,
        numFontSize,
        1,
      );

      const tagX = badge.x + badge.w + 10;
      const tagW = card.w - pad - (tagX - card.x);
      const tagH = textHeight(tagFontSize, 1);
      const tagBlock = textBlock(
        `at.card.${key}.tag`,
        {
          x: tagX,
          y: badge.y + (badge.h - tagH) / 2,
          w: tagW,
          h: tagH,
        },
        cardCopy.tag,
        tagFontSize,
        1,
        GLYPH.upper,
      );

      const titleY = badge.y + badge.h + 8;
      const titleH = textHeight(titleFontSize, 1);
      const titleBlock = textBlock(
        `at.card.${key}.title`,
        {
          x: card.x + pad,
          y: titleY,
          w: card.w - pad * 2,
          h: titleH,
        },
        cardCopy.title,
        titleFontSize,
        1,
      );

      const detailY = titleY + titleH + 6;
      const detailH = textHeight(detailFontSize, 2);
      const detailBlock = textBlock(
        `at.card.${key}.detail`,
        {
          x: card.x + pad,
          y: detailY,
          w: card.w - pad * 2,
          h: detailH,
        },
        cardCopy.detail,
        detailFontSize,
        2,
      );

      blocks.push(numBlock, tagBlock, titleBlock, detailBlock);

      return {
        id: key,
        card,
        badge,
        numBlock,
        tagBlock,
        titleBlock,
        detailBlock,
      };
    });

    return {
      title,
      body,
      window: { win, bar, url, screen },
      cards,
      blocks,
    };
  } else {
    // PORTRAIT (1080x1350): Ventana arriba con margen, 4 tarjetas apiladas abajo
    const windowH = 390;
    const stacked = stackBands(body, [{ id: "top", h: windowH }, { id: "bottom", flex: 1 }], 20);

    const screenH = windowH - barH;
    const winW = Math.round(screenH * AT_CAPTURE_ASPECT);
    const winX = stacked.top.x + Math.round((stacked.top.w - winW) / 2);
    const win: Box = { x: winX, y: stacked.top.y, w: winW, h: windowH };
    const bar: Box = { x: winX, y: stacked.top.y, w: winW, h: barH };
    const screen: Box = { x: winX, y: stacked.top.y + barH, w: winW, h: screenH };

    const url = textBlock(
      "at.window.url",
      {
        x: bar.x + 60,
        y: bar.y + (bar.h - textHeight(urlFontSize, 1)) / 2,
        w: Math.ceil(textWidth(longestUrl, urlFontSize)) + 16,
        h: textHeight(urlFontSize, 1),
      },
      longestUrl,
      urlFontSize,
      1,
    );
    blocks.push(url);

    // 4 tarjetas apiladas en el área inferior
    const gap = 10;
    const pad = 12;
    const totalGaps = gap * (AT_STAGE_KEYS.length - 1);
    const cardH = Math.floor((stacked.bottom.h - totalGaps) / AT_STAGE_KEYS.length);

    const cards: AtStagedCardLayout[] = AT_STAGE_KEYS.map((key, i) => {
      const cardY = stacked.bottom.y + i * (cardH + gap);
      const card: Box = { x: stacked.bottom.x, y: cardY, w: stacked.bottom.w, h: cardH };
      const cardCopy = copy.staged.cards[key];

      const badge: Box = {
        x: card.x + pad,
        y: card.y + pad,
        w: badgeSize,
        h: badgeSize,
      };

      const numBlock = textBlock(
        `at.card.${key}.num`,
        {
          x: badge.x,
          y: badge.y + (badge.h - textHeight(numFontSize, 1)) / 2,
          w: badge.w,
          h: textHeight(numFontSize, 1),
        },
        cardCopy.num,
        numFontSize,
        1,
      );

      // En portrait con 920px de ancho: Badge + Tag + Title en la misma primera fila
      const tagX = badge.x + badge.w + 12;
      const tagW = Math.ceil(textWidth(cardCopy.tag, tagFontSize, GLYPH.upper)) + 8;
      const tagH = textHeight(tagFontSize, 1);
      const tagBlock = textBlock(
        `at.card.${key}.tag`,
        {
          x: tagX,
          y: badge.y + (badge.h - tagH) / 2,
          w: tagW,
          h: tagH,
        },
        cardCopy.tag,
        tagFontSize,
        1,
        GLYPH.upper,
      );

      const titleX = tagX + tagW + 16;
      const titleW = card.w - pad - (titleX - card.x);
      const titleH = textHeight(titleFontSize, 1);
      const titleBlock = textBlock(
        `at.card.${key}.title`,
        {
          x: titleX,
          y: badge.y + (badge.h - titleH) / 2,
          w: titleW,
          h: titleH,
        },
        cardCopy.title,
        titleFontSize,
        1,
      );

      // Segunda fila: Detalle (2 líneas, 20px)
      const detailY = badge.y + badge.h + 8;
      const detailH = textHeight(detailFontSize, 2);
      const detailBlock = textBlock(
        `at.card.${key}.detail`,
        {
          x: card.x + pad,
          y: detailY,
          w: card.w - pad * 2,
          h: detailH,
        },
        cardCopy.detail,
        detailFontSize,
        2,
      );

      blocks.push(numBlock, tagBlock, titleBlock, detailBlock);

      return {
        id: key,
        card,
        badge,
        numBlock,
        tagBlock,
        titleBlock,
        detailBlock,
      };
    });

    return {
      title,
      body,
      window: { win, bar, url, screen },
      cards,
      blocks,
    };
  }
}
