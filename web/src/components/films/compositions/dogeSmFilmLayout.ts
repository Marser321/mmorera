import { kitBands } from "./kit/kitLayout";
import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { GLYPH, textBlock, textHeight, textWidth, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import {
  DOGE_TIERS,
  type DogeCopy,
  type DogeTierKey,
} from "@/data/films/flagships/dogeSm";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type DogeTierCardLayout = {
  id: DogeTierKey;
  card: Box;
  badgeBox: Box;
  badgeBlock: TextBlock;
  nameBlock: TextBlock;
  cadenceBlock: TextBlock;
  priceBox: Box;
  priceBlock: TextBlock;
  periodBlock: TextBlock;
  features: TextBlock[];
  ctaBox: Box;
  ctaBlock: TextBlock;
};

export type DogeTierOfferLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  cards: DogeTierCardLayout[];
  summaryBar: Box;
  summaryBlock: TextBlock;
  blocks: LayoutBlock[];
};

export function dogeTierOfferLayout(
  format: FilmFormatName,
  copy: DogeCopy,
  language: FilmLanguage,
): DogeTierOfferLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const subtitleFontSize = portrait ? 21 : 16;
  const tagFontSize = portrait ? 20 : 15;
  const nameFontSize = portrait ? 28 : 24;
  const cadenceFontSize = portrait ? 20 : 15;
  const priceFontSize = portrait ? 38 : 34;
  const periodFontSize = portrait ? 20 : 15;
  const featureFontSize = portrait ? 20 : 15;
  const ctaFontSize = portrait ? 20 : 15;
  const summaryFontSize = portrait ? 20 : 15;

  const blocks: LayoutBlock[] = [];

  if (!portrait) {
    // LANDSCAPE (1600x900)
    // Subtítulo arriba
    const subH = textHeight(subtitleFontSize, 1);
    const subtitleBlock = textBlock(
      "doge.tiers.sub",
      {
        x: body.x,
        y: body.y,
        w: body.w,
        h: subH,
      },
      copy.tiers.subtitle,
      subtitleFontSize,
      1,
    );
    blocks.push(subtitleBlock);

    // Barra de resumen abajo
    const summaryH = 50;
    const summaryBar: Box = {
      x: body.x,
      y: body.y + body.h - summaryH,
      w: body.w,
      h: summaryH,
    };
    const sumTxtH = textHeight(summaryFontSize, 1);
    const summaryBlock = textBlock(
      "doge.tiers.summary",
      {
        x: summaryBar.x + 24,
        y: summaryBar.y + (summaryH - sumTxtH) / 2,
        w: summaryBar.w - 48,
        h: sumTxtH,
      },
      copy.tiers.assessmentNote,
      summaryFontSize,
      1,
    );
    blocks.push(summaryBlock);

    // Grilla central de 3 columnas para las 3 tarjetas de planes
    const topOffset = subH + 18;
    const cardsAreaY = body.y + topOffset;
    const cardsAreaH = summaryBar.y - cardsAreaY - 18;
    const cols = splitColumns(
      {
        x: body.x,
        y: cardsAreaY,
        w: body.w,
        h: cardsAreaH,
      },
      [1, 1, 1],
      24,
    );

    const cards: DogeTierCardLayout[] = [];

    DOGE_TIERS.forEach((tier, idx) => {
      const card = cols[idx];
      const padX = 24;
      const innerW = card.w - padX * 2;

      // Badge de categoría
      const badgeH = 30;
      const badgeW = Math.min(innerW, Math.max(250, Math.ceil(textWidth(tier.tag[language], tagFontSize, GLYPH.upper)) + 40));
      const badgeBox: Box = {
        x: card.x + padX,
        y: card.y + 20,
        w: badgeW,
        h: badgeH,
      };
      const badgeBlock = textBlock(
        `doge.tier.${tier.id}.badge`,
        {
          x: badgeBox.x + 10,
          y: badgeBox.y + (badgeH - textHeight(tagFontSize, 1)) / 2,
          w: badgeBox.w - 20,
          h: textHeight(tagFontSize, 1),
        },
        tier.tag[language],
        tagFontSize,
        1,
      );
      blocks.push(badgeBlock);

      // Nombre del plan
      const nameH = textHeight(nameFontSize, 1);
      const nameBlock = textBlock(
        `doge.tier.${tier.id}.name`,
        {
          x: card.x + padX,
          y: badgeBox.y + badgeBox.h + 12,
          w: innerW,
          h: nameH,
        },
        tier.name,
        nameFontSize,
        1,
      );
      blocks.push(nameBlock);

      // Cadencia
      const cadenceH = textHeight(cadenceFontSize, 1);
      const cadenceBlock = textBlock(
        `doge.tier.${tier.id}.cadence`,
        {
          x: card.x + padX,
          y: nameBlock.box.y + nameBlock.box.h + 6,
          w: innerW,
          h: cadenceH,
        },
        `${tier.cadenceLabel[language]} • ${tier.description[language]}`,
        cadenceFontSize,
        1,
      );
      blocks.push(cadenceBlock);

      // Caja de precio
      const priceW = Math.ceil(textWidth(tier.priceFormatted, priceFontSize, GLYPH.upper)) + 24;
      const priceH = textHeight(priceFontSize, 1);
      const priceBoxY = cadenceBlock.box.y + cadenceBlock.box.h + 14;
      const priceBox: Box = {
        x: card.x + padX,
        y: priceBoxY,
        w: innerW,
        h: priceH,
      };

      const priceBlock = textBlock(
        `doge.tier.${tier.id}.price`,
        {
          x: card.x + padX,
          y: priceBoxY,
          w: priceW,
          h: priceH,
        },
        tier.priceFormatted,
        priceFontSize,
        1,
      );
      blocks.push(priceBlock);

      const periodLabel = language === "es" ? "/ ciclo" : "/ cycle";
      const periodH = textHeight(periodFontSize, 1);
      const periodBlock = textBlock(
        `doge.tier.${tier.id}.period`,
        {
          x: card.x + padX + priceW + 10,
          y: priceBoxY + (priceH - periodH) / 2 + 2,
          w: innerW - priceW - 10,
          h: periodH,
        },
        periodLabel,
        periodFontSize,
        1,
      );
      blocks.push(periodBlock);

      // Lista de características / beneficios
      const featStartY = priceBoxY + priceH + 20;
      const features: TextBlock[] = [];
      const featH = textHeight(featureFontSize, 2);

      tier.features.forEach((feat, fIdx) => {
        const featBlock = textBlock(
          `doge.tier.${tier.id}.feat.${fIdx}`,
          {
            x: card.x + padX + 20,
            y: featStartY + fIdx * (featH + 10),
            w: innerW - 20,
            h: featH,
          },
          `• ${feat[language]}`,
          featureFontSize,
          2,
        );
        blocks.push(featBlock);
        features.push(featBlock);
      });

      // Botón CTA
      const ctaH = 44;
      const ctaBox: Box = {
        x: card.x + padX,
        y: card.y + card.h - ctaH - 18,
        w: innerW,
        h: ctaH,
      };
      const ctaTxtH = textHeight(ctaFontSize, 1);
      const ctaBlock = textBlock(
        `doge.tier.${tier.id}.cta`,
        {
          x: ctaBox.x + 12,
          y: ctaBox.y + (ctaH - ctaTxtH) / 2,
          w: ctaBox.w - 24,
          h: ctaTxtH,
        },
        copy.tiers.selectLabel,
        ctaFontSize,
        1,
      );
      blocks.push(ctaBlock);

      cards.push({
        id: tier.id,
        card,
        badgeBox,
        badgeBlock,
        nameBlock,
        cadenceBlock,
        priceBox,
        priceBlock,
        periodBlock,
        features,
        ctaBox,
        ctaBlock,
      });
    });

    return {
      title,
      body,
      subtitleBlock,
      cards,
      summaryBar,
      summaryBlock,
      blocks,
    };
  }

  // PORTRAIT (1080x1350)
  // Subtítulo arriba
  const subH = textHeight(subtitleFontSize, 1);
  const subtitleBlock = textBlock(
    "doge.tiers.sub",
    {
      x: body.x,
      y: body.y,
      w: body.w,
      h: subH,
    },
    copy.tiers.subtitle,
    subtitleFontSize,
    1,
  );
  blocks.push(subtitleBlock);

  // Barra de resumen abajo
  const summaryH = 56;
  const summaryBar: Box = {
    x: body.x,
    y: body.y + body.h - summaryH,
    w: body.w,
    h: summaryH,
  };
  const sumTxtH = textHeight(summaryFontSize, 1);
  const summaryBlock = textBlock(
    "doge.tiers.summary",
    {
      x: summaryBar.x + 20,
      y: summaryBar.y + (summaryH - sumTxtH) / 2,
      w: summaryBar.w - 40,
      h: sumTxtH,
    },
    copy.tiers.assessmentNote,
    summaryFontSize,
    1,
  );
  blocks.push(summaryBlock);

  // 3 tarjetas apiladas verticalmente
  const cardsGap = 16;
  const topOffset = subH + 16;
  const cardsStartY = body.y + topOffset;
  const totalCardsH = summaryBar.y - cardsStartY - 16;
  const cardH = Math.floor((totalCardsH - cardsGap * 2) / 3);

  const cards: DogeTierCardLayout[] = [];

  DOGE_TIERS.forEach((tier, idx) => {
    const cardY = cardsStartY + idx * (cardH + cardsGap);
    const card: Box = {
      x: body.x,
      y: cardY,
      w: body.w,
      h: cardH,
    };

    // Subdivisión horizontal interna en 2 columnas:
    // Izquierda (38%): Badge, Nombre, Cadencia, Precio, Botón CTA
    // Derecha (62%): Lista de 3 características
    const leftW = Math.floor(card.w * 0.40);
    const pad = 20;

    // Badge
    const badgeH = 32;
    const badgeW = Math.min(leftW - pad, Math.max(285, Math.ceil(textWidth(tier.tag[language], tagFontSize, GLYPH.upper)) + 30));
    const badgeBox: Box = {
      x: card.x + pad,
      y: card.y + 16,
      w: badgeW,
      h: badgeH,
    };
    const badgeBlock = textBlock(
      `doge.tier.${tier.id}.badge`,
      {
        x: badgeBox.x + 10,
        y: badgeBox.y + (badgeH - textHeight(tagFontSize, 1)) / 2,
        w: badgeBox.w - 20,
        h: textHeight(tagFontSize, 1),
      },
      tier.tag[language],
      tagFontSize,
      1,
    );
    blocks.push(badgeBlock);

    // Nombre
    const nameH = textHeight(nameFontSize, 1);
    const nameBlock = textBlock(
      `doge.tier.${tier.id}.name`,
      {
        x: card.x + pad,
        y: badgeBox.y + badgeBox.h + 8,
        w: leftW - pad,
        h: nameH,
      },
      tier.name,
      nameFontSize,
      1,
    );
    blocks.push(nameBlock);

    // Cadencia
    const cadenceH = textHeight(cadenceFontSize, 1);
    const cadenceBlock = textBlock(
      `doge.tier.${tier.id}.cadence`,
      {
        x: card.x + pad,
        y: nameBlock.box.y + nameBlock.box.h + 4,
        w: leftW - pad,
        h: cadenceH,
      },
      tier.cadenceLabel[language],
      cadenceFontSize,
      1,
    );
    blocks.push(cadenceBlock);

    // Precio
    const priceW = Math.ceil(textWidth(tier.priceFormatted, priceFontSize, GLYPH.upper)) + 24;
    const priceH = textHeight(priceFontSize, 1);
    const priceBoxY = cadenceBlock.box.y + cadenceBlock.box.h + 10;
    const priceBox: Box = {
      x: card.x + pad,
      y: priceBoxY,
      w: leftW - pad,
      h: priceH,
    };

    const priceBlock = textBlock(
      `doge.tier.${tier.id}.price`,
      {
        x: card.x + pad,
        y: priceBoxY,
        w: priceW,
        h: priceH,
      },
      tier.priceFormatted,
      priceFontSize,
      1,
    );
    blocks.push(priceBlock);

    const periodLabel = language === "es" ? "/ ciclo" : "/ cycle";
    const periodH = textHeight(periodFontSize, 1);
    const periodBlock = textBlock(
      `doge.tier.${tier.id}.period`,
      {
        x: card.x + pad + priceW + 10,
        y: priceBoxY + (priceH - periodH) / 2 + 2,
        w: leftW - pad - priceW - 10,
        h: periodH,
      },
      periodLabel,
      periodFontSize,
      1,
    );
    blocks.push(periodBlock);

    // Botón CTA
    const ctaH = 46;
    const ctaBox: Box = {
      x: card.x + pad,
      y: card.y + card.h - ctaH - 16,
      w: leftW - pad,
      h: ctaH,
    };
    const ctaTxtH = textHeight(ctaFontSize, 1);
    const ctaBlock = textBlock(
      `doge.tier.${tier.id}.cta`,
      {
        x: ctaBox.x + 10,
        y: ctaBox.y + (ctaH - ctaTxtH) / 2,
        w: ctaBox.w - 20,
        h: ctaTxtH,
      },
      copy.tiers.selectLabel,
      ctaFontSize,
      1,
    );
    blocks.push(ctaBlock);

    // Columna derecha: 3 características
    const rightX = card.x + leftW + 16;
    const rightW = card.w - (leftW + 16) - pad;
    const featH = textHeight(featureFontSize, 2);
    const featStartY = card.y + 24;
    const features: TextBlock[] = [];

    tier.features.forEach((feat, fIdx) => {
      const featBlock = textBlock(
        `doge.tier.${tier.id}.feat.${fIdx}`,
        {
          x: rightX,
          y: featStartY + fIdx * (featH + 14),
          w: rightW,
          h: featH,
        },
        `✓ ${feat[language]}`,
        featureFontSize,
        2,
      );
      blocks.push(featBlock);
      features.push(featBlock);
    });

    cards.push({
      id: tier.id,
      card,
      badgeBox,
      badgeBlock,
      nameBlock,
      cadenceBlock,
      priceBox,
      priceBlock,
      periodBlock,
      features,
      ctaBox,
      ctaBlock,
    });
  });

  return {
    title,
    body,
    subtitleBlock,
    cards,
    summaryBar,
    summaryBlock,
    blocks,
  };
}
