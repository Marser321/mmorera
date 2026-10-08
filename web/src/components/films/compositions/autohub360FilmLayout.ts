import { kitBands } from "./kit/kitLayout";
import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import {
  AUTOHUB_HOTSPOTS,
  type AutohubCopy,
  type AutohubHotspotKey,
} from "@/data/films/flagships/autohub360";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type AutohubHotspotCardLayout = {
  id: AutohubHotspotKey;
  card: Box;
  badgeBox: Box;
  codeBlock: TextBlock;
  titleBlock: TextBlock;
  catBlock: TextBlock;
  descBlock: TextBlock;
};

export type AutohubViewerWindowLayout = {
  win: Box;
  bar: Box;
  url: TextBlock;
  screen: Box;
  controlsBar: Box;
  modeBadge: Box;
};

export type AutohubInteriorTourLayout = {
  title: Box;
  body: Box;
  window: AutohubViewerWindowLayout;
  cards: AutohubHotspotCardLayout[];
  blocks: LayoutBlock[];
};

export const AUTOHUB_HOST = "auto-indol-five.vercel.app";

export function autohubInteriorTourLayout(
  format: FilmFormatName,
  copy: AutohubCopy,
  language: FilmLanguage,
): AutohubInteriorTourLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const barH = portrait ? 46 : 36;
  const urlFontSize = portrait ? 20 : 15;
  const codeFontSize = portrait ? 20 : 15;
  const titleFontSize = portrait ? 21 : 16;
  const catFontSize = portrait ? 20 : 15;
  const descFontSize = portrait ? 20 : 15;

  const urlText = `${AUTOHUB_HOST}/catalogo/demo-1`;
  const blocks: LayoutBlock[] = [];

  if (!portrait) {
    // LANDSCAPE (1600x900)
    // Columna izquierda (1.15): Visor esférico 360°
    // Columna derecha (1.0): Grilla 2x4 de puntos de interés
    const [leftCol, rightCol] = splitColumns(body, [1.15, 1.0], 28);

    const win: Box = { x: leftCol.x, y: leftCol.y, w: leftCol.w, h: leftCol.h };
    const bar: Box = { x: win.x, y: win.y, w: win.w, h: barH };
    const controlsH = 40;
    const screen: Box = {
      x: win.x,
      y: win.y + barH,
      w: win.w,
      h: win.h - barH - controlsH,
    };
    const controlsBar: Box = {
      x: win.x,
      y: screen.y + screen.h,
      w: win.w,
      h: controlsH,
    };
    const modeBadge: Box = {
      x: controlsBar.x + 16,
      y: controlsBar.y + 8,
      w: 190,
      h: controlsH - 16,
    };

    const url = textBlock(
      "autohub.window.url",
      {
        x: bar.x + 48,
        y: bar.y + (bar.h - textHeight(urlFontSize, 1)) / 2,
        w: Math.ceil(textWidth(urlText, urlFontSize)) + 16,
        h: textHeight(urlFontSize, 1),
      },
      urlText,
      urlFontSize,
      1,
    );
    blocks.push(url);

    const windowLayout: AutohubViewerWindowLayout = {
      win,
      bar,
      url,
      screen,
      controlsBar,
      modeBadge,
    };

    // Grilla 2 columnas x 4 filas para los 8 puntos
    const gapX = 12;
    const gapY = 10;
    const cols = 2;
    const rows = 4;
    const cardW = Math.floor((rightCol.w - gapX * (cols - 1)) / cols);
    const cardH = Math.floor((rightCol.h - gapY * (rows - 1)) / rows);

    const cards: AutohubHotspotCardLayout[] = [];

    AUTOHUB_HOTSPOTS.forEach((spot, idx) => {
      const colIdx = idx % cols;
      const rowIdx = Math.floor(idx / cols);

      const cardX = rightCol.x + colIdx * (cardW + gapX);
      const cardY = rightCol.y + rowIdx * (cardH + gapY);
      const cardBox: Box = { x: cardX, y: cardY, w: cardW, h: cardH };

      const badgeBox: Box = {
        x: cardX + 8,
        y: cardY + 8,
        w: 24,
        h: 24,
      };

      const codeW = Math.ceil(textWidth(spot.code, codeFontSize)) + 8;
      const code = textBlock(
        `autohub.card.${spot.id}.code`,
        {
          x: cardX + 38,
          y: cardY + 10,
          w: codeW,
          h: textHeight(codeFontSize, 1),
        },
        spot.code,
        codeFontSize,
        1,
      );
      blocks.push(code);

      const catText = spot.category[language];
      const cat = textBlock(
        `autohub.card.${spot.id}.cat`,
        {
          x: cardX + 42 + codeW,
          y: cardY + 10,
          w: cardW - (48 + codeW),
          h: textHeight(catFontSize, 1),
        },
        catText,
        catFontSize,
        1,
      );
      blocks.push(cat);

      const titleText = spot.title[language];
      const titleBlk = textBlock(
        `autohub.card.${spot.id}.title`,
        {
          x: cardX + 8,
          y: cardY + 36,
          w: cardW - 16,
          h: textHeight(titleFontSize, 1),
        },
        titleText,
        titleFontSize,
        1,
      );
      blocks.push(titleBlk);

      const descText = spot.desc[language];
      const descBlk = textBlock(
        `autohub.card.${spot.id}.desc`,
        {
          x: cardX + 8,
          y: cardY + 64,
          w: cardW - 16,
          h: cardH - 70,
        },
        descText,
        descFontSize,
        3,
      );
      blocks.push(descBlk);

      cards.push({
        id: spot.id,
        card: cardBox,
        badgeBox,
        codeBlock: code,
        titleBlock: titleBlk,
        catBlock: cat,
        descBlock: descBlk,
      });
    });

    return {
      title,
      body,
      window: windowLayout,
      cards,
      blocks,
    };
  }

  // PORTRAIT (1080x1350)
  // Superior: Visor esférico 360° (~310px)
  // Inferior: Grilla 2x4 de puntos (~658px)
  const winH = 310;
  const win: Box = { x: body.x, y: body.y, w: body.w, h: winH };
  const bar: Box = { x: win.x, y: win.y, w: win.w, h: barH };
  const controlsH = 40;
  const screen: Box = {
    x: win.x,
    y: win.y + barH,
    w: win.w,
    h: winH - barH - controlsH,
  };
  const controlsBar: Box = {
    x: win.x,
    y: screen.y + screen.h,
    w: win.w,
    h: controlsH,
  };
  const modeBadge: Box = {
    x: controlsBar.x + 16,
    y: controlsBar.y + 8,
    w: 240,
    h: controlsH - 16,
  };

  const url = textBlock(
    "autohub.window.url",
    {
      x: bar.x + 50,
      y: bar.y + (bar.h - textHeight(urlFontSize, 1)) / 2,
      w: Math.ceil(textWidth(urlText, urlFontSize)) + 20,
      h: textHeight(urlFontSize, 1),
    },
    urlText,
    urlFontSize,
    1,
  );
  blocks.push(url);

  const windowLayout: AutohubViewerWindowLayout = {
    win,
    bar,
    url,
    screen,
    controlsBar,
    modeBadge,
  };

  const cardsAreaY = body.y + winH + 16;
  const cardsAreaH = body.h - winH - 16;
  const cols = 2;
  const rows = 4;
  const gapX = 14;
  const gapY = 10;
  const cardW = Math.floor((body.w - gapX * (cols - 1)) / cols);
  const cardH = Math.floor((cardsAreaH - gapY * (rows - 1)) / rows);

  const cards: AutohubHotspotCardLayout[] = [];

  AUTOHUB_HOTSPOTS.forEach((spot, idx) => {
    const colIdx = idx % cols;
    const rowIdx = Math.floor(idx / cols);

    const cardX = body.x + colIdx * (cardW + gapX);
    const cardY = cardsAreaY + rowIdx * (cardH + gapY);
    const cardBox: Box = { x: cardX, y: cardY, w: cardW, h: cardH };

    const badgeBox: Box = {
      x: cardX + 10,
      y: cardY + 8,
      w: 26,
      h: 26,
    };

    const codeW = Math.ceil(textWidth(spot.code, codeFontSize)) + 12;
    const code = textBlock(
      `autohub.card.${spot.id}.code`,
      {
        x: cardX + 44,
        y: cardY + 10,
        w: codeW,
        h: textHeight(codeFontSize, 1),
      },
      spot.code,
      codeFontSize,
      1,
    );
    blocks.push(code);

    const catText = spot.category[language];
    const cat = textBlock(
      `autohub.card.${spot.id}.cat`,
      {
        x: cardX + 48 + codeW,
        y: cardY + 10,
        w: cardW - (54 + codeW),
        h: textHeight(catFontSize, 1),
      },
      catText,
      catFontSize,
      1,
    );
    blocks.push(cat);

    const titleText = spot.title[language];
    const titleBlk = textBlock(
      `autohub.card.${spot.id}.title`,
      {
        x: cardX + 10,
        y: cardY + 38,
        w: cardW - 20,
        h: textHeight(titleFontSize, 1),
      },
      titleText,
      titleFontSize,
      1,
    );
    blocks.push(titleBlk);

    const descText = spot.desc[language];
    const descBlk = textBlock(
      `autohub.card.${spot.id}.desc`,
      {
        x: cardX + 10,
        y: cardY + 68,
        w: cardW - 20,
        h: cardH - 70,
      },
      descText,
      descFontSize,
      3,
    );
    blocks.push(descBlk);

    cards.push({
      id: spot.id,
      card: cardBox,
      badgeBox,
      codeBlock: code,
      titleBlock: titleBlk,
      catBlock: cat,
      descBlock: descBlk,
    });
  });

  return {
    title,
    body,
    window: windowLayout,
    cards,
    blocks,
  };
}
