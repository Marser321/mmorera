import { kitBands } from "./kit/kitLayout";
import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { textBlock, textHeight, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { LNB_BUILDER_STEPS, LNB_COPY, LNB_STUDIOS, LNB_TIERS } from "@/data/films/flagships/lnbSaas";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type LnbBuilderStepLayout = {
  step: string;
  card: Box;
  numberBlock: TextBlock;
  phaseBlock: TextBlock;
  choiceBlock: TextBlock;
  descBlock: TextBlock;
  weightBlock: TextBlock;
};

export type LnbCakeBuilderLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  previewCard: Box;
  previewBadge: Box;
  previewBadgeBlock: TextBlock;
  layers: Box[];
  steps: LnbBuilderStepLayout[];
  hintBar: Box;
  hintBlock: TextBlock;
  blocks: LayoutBlock[];
};

export type LnbStudioCardLayout = {
  id: string;
  card: Box;
  tagBox: Box;
  tagBlock: TextBlock;
  titleBlock: TextBlock;
  descBlock: TextBlock;
};

export type LnbStudiosLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  studios: LnbStudioCardLayout[];
  blocks: LayoutBlock[];
};

export type LnbExpressLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  catalogCard: Box;
  kdsCard: Box;
  pickupBadge: Box;
  pickupBadgeBlock: TextBlock;
  zeroWaitBadge: Box;
  zeroWaitBadgeBlock: TextBlock;
  blocks: LayoutBlock[];
};

export type LnbLoyaltyTierLayout = {
  id: string;
  card: Box;
  nameBlock: TextBlock;
  priceBox: Box;
  priceBlock: TextBlock;
  cadenceBlock: TextBlock;
  features: TextBlock[];
};

export type LnbLoyaltyLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  cardBox: Box;
  cardTitleBlock: TextBlock;
  pointsBox: Box;
  pointsBlock: TextBlock;
  savedBox: Box;
  savedBlock: TextBlock;
  tiers: LnbLoyaltyTierLayout[];
  blocks: LayoutBlock[];
};

/**
 * Geometría de la escena protagonista: The Cake Studio.
 */
export function lnbCakeBuilderLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): LnbCakeBuilderLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "lnb.builder.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    LNB_COPY.builder.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const contentY = body.y + subH + 16;
  const hintH = portrait ? 44 : 36;
  const contentH = body.h - subH - hintH - 28;

  let previewCard: Box;
  let stepsArea: Box;

  if (portrait) {
    const prevH = Math.round(contentH * 0.38);
    previewCard = {
      x: body.x + 16,
      y: contentY,
      w: body.w - 32,
      h: prevH,
    };
    stepsArea = {
      x: body.x + 16,
      y: contentY + prevH + 12,
      w: body.w - 32,
      h: contentH - prevH - 12,
    };
  } else {
    const prevW = Math.round((body.w - 48) * 0.44);
    const stepsW = body.w - 48 - prevW;
    previewCard = {
      x: body.x + 16,
      y: contentY,
      w: prevW,
      h: contentH,
    };
    stepsArea = {
      x: body.x + 16 + prevW + 16,
      y: contentY,
      w: stepsW,
      h: contentH,
    };
  }

  // Capas visuales de la torta dentro de previewCard
  const layerMargin = portrait ? 20 : 32;
  const cakeAreaW = previewCard.w - layerMargin * 2;
  const cakeAreaH = portrait ? previewCard.h - 80 : previewCard.h - 120;
  const cakeAreaY = previewCard.y + (portrait ? 60 : 80);

  const layerH = Math.round(cakeAreaH / 3);
  const layers: Box[] = [
    // Capa 3: Cobertura (arriba)
    {
      x: previewCard.x + layerMargin + Math.round(cakeAreaW * 0.15),
      y: cakeAreaY,
      w: Math.round(cakeAreaW * 0.7),
      h: layerH - 6,
    },
    // Capa 2: Relleno (centro)
    {
      x: previewCard.x + layerMargin + Math.round(cakeAreaW * 0.08),
      y: cakeAreaY + layerH,
      w: Math.round(cakeAreaW * 0.84),
      h: layerH - 6,
    },
    // Capa 1: Base bizcochuelo (abajo)
    {
      x: previewCard.x + layerMargin,
      y: cakeAreaY + layerH * 2,
      w: cakeAreaW,
      h: layerH - 6,
    },
  ];

  const previewBadge: Box = {
    x: previewCard.x + 16,
    y: previewCard.y + 14,
    w: previewCard.w - 32,
    h: 32,
  };
  const previewBadgeBlock = textBlock(
    "lnb.builder.prev.badge",
    {
      x: previewBadge.x + 8,
      y: previewBadge.y + 6,
      w: previewBadge.w - 16,
      h: 20,
    },
    language === "es" ? "PREVISUALIZACIÓN 3D · 3 FASES" : "3D PREVIEW · 3 PHASES",
    13,
    1,
  );

  // Las 3 tarjetas de pasos
  const steps: LnbBuilderStepLayout[] = [];
  const stepGap = 10;
  const stepH = Math.round((stepsArea.h - stepGap * 2) / 3);

  for (let i = 0; i < LNB_BUILDER_STEPS.length; i++) {
    const s = LNB_BUILDER_STEPS[i];
    const sCard: Box = {
      x: stepsArea.x,
      y: stepsArea.y + i * (stepH + stepGap),
      w: stepsArea.w,
      h: stepH,
    };

    const numW = portrait ? 36 : 42;
    const numberBlock = textBlock(
      `lnb.step.${s.step}.num`,
      {
        x: sCard.x + 12,
        y: sCard.y + 12,
        w: numW,
        h: 24,
      },
      s.step,
      portrait ? 18 : 16,
      1,
    );

    const phaseW = Math.round((sCard.w - numW - 36) * 0.45);
    const phaseBlock = textBlock(
      `lnb.step.${s.step}.phase`,
      {
        x: sCard.x + 12 + numW + 8,
        y: sCard.y + 12,
        w: phaseW,
        h: 22,
      },
      s.phase[language],
      portrait ? 15 : 14,
      1,
    );

    const choiceW = sCard.w - numW - phaseW - 36;
    const choiceBlock = textBlock(
      `lnb.step.${s.step}.choice`,
      {
        x: sCard.x + 12 + numW + 8 + phaseW + 4,
        y: sCard.y + 12,
        w: choiceW,
        h: 22,
      },
      s.choice[language],
      portrait ? 15 : 14,
      1,
    );

    const descH = portrait ? 28 : 22;
    const descBlock = textBlock(
      `lnb.step.${s.step}.desc`,
      {
        x: sCard.x + 12 + numW + 8,
        y: sCard.y + 36,
        w: sCard.w - numW - 28,
        h: descH,
      },
      s.desc[language],
      portrait ? 13 : 12,
      portrait ? 2 : 1,
    );

    const weightBlock = textBlock(
      `lnb.step.${s.step}.weight`,
      {
        x: sCard.x + 12 + numW + 8,
        y: sCard.y + 36 + descH + 4,
        w: sCard.w - numW - 28,
        h: 18,
      },
      s.weight[language],
      12,
      1,
    );

    steps.push({
      step: s.step,
      card: sCard,
      numberBlock,
      phaseBlock,
      choiceBlock,
      descBlock,
      weightBlock,
    });
  }

  const hintBar: Box = {
    x: body.x + 16,
    y: contentY + contentH + 8,
    w: body.w - 32,
    h: hintH,
  };
  const hintFontSize = portrait ? 20 : 15;
  const hintBlock = textBlock(
    "lnb.builder.hint",
    {
      x: hintBar.x + 16,
      y: hintBar.y + Math.round((hintH - textHeight(hintFontSize, 1)) / 2),
      w: hintBar.w - 32,
      h: textHeight(hintFontSize, 1),
    },
    LNB_COPY.builder.hint[language],
    hintFontSize,
    1,
  );
  blocks.push(hintBlock);

  return {
    title,
    body,
    subtitleBlock,
    previewCard,
    previewBadge,
    previewBadgeBlock,
    layers,
    steps,
    hintBar,
    hintBlock,
    blocks,
  };
}

/**
 * Geometría de Craving Studios: 4 módulos gastronómicos.
 */
export function lnbStudiosLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): LnbStudiosLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "lnb.studios.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    LNB_COPY.studios.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const cardsAreaY = body.y + subH + 24;
  const cardsAreaH = body.h - subH - 36;
  const studios: LnbStudioCardLayout[] = [];

  if (portrait) {
    // Cuadrícula 2x2 en portrait
    const colW = (body.w - 48) / 2;
    const rowH = (cardsAreaH - 16) / 2;
    for (let i = 0; i < LNB_STUDIOS.length; i++) {
      const st = LNB_STUDIOS[i];
      const col = i % 2;
      const row = Math.floor(i / 2);
      const card: Box = {
        x: body.x + 16 + col * (colW + 16),
        y: cardsAreaY + row * (rowH + 16),
        w: colW,
        h: rowH,
      };

      const tagBox: Box = {
        x: card.x + 12,
        y: card.y + 12,
        w: card.w - 24,
        h: 26,
      };
      const tagBlock = textBlock(
        `lnb.studio.${st.id}.tag`,
        {
          x: tagBox.x + 8,
          y: tagBox.y + 4,
          w: tagBox.w - 16,
          h: 18,
        },
        st.tag[language],
        12,
        1,
      );

      const titleBlock = textBlock(
        `lnb.studio.${st.id}.title`,
        {
          x: card.x + 12,
          y: card.y + 44,
          w: card.w - 24,
          h: 28,
        },
        st.title[language],
        18,
        1,
      );

      const descBlock = textBlock(
        `lnb.studio.${st.id}.desc`,
        {
          x: card.x + 12,
          y: card.y + 76,
          w: card.w - 24,
          h: card.h - 88,
        },
        st.desc[language],
        14,
        4,
      );

      studios.push({ id: st.id, card, tagBox, tagBlock, titleBlock, descBlock });
    }
  } else {
    // 4 columnas en landscape
    const colBoxes = splitColumns(
      { x: body.x + 16, y: cardsAreaY, w: body.w - 32, h: cardsAreaH },
      [1, 1, 1, 1],
      16,
    );
    for (let i = 0; i < LNB_STUDIOS.length; i++) {
      const st = LNB_STUDIOS[i];
      const card = colBoxes[i];

      const tagBox: Box = {
        x: card.x + 14,
        y: card.y + 16,
        w: card.w - 28,
        h: 28,
      };
      const tagBlock = textBlock(
        `lnb.studio.${st.id}.tag`,
        {
          x: tagBox.x + 8,
          y: tagBox.y + 5,
          w: tagBox.w - 16,
          h: 18,
        },
        st.tag[language],
        12,
        1,
      );

      const titleBlock = textBlock(
        `lnb.studio.${st.id}.title`,
        {
          x: card.x + 14,
          y: card.y + 56,
          w: card.w - 28,
          h: 32,
        },
        st.title[language],
        19,
        1,
      );

      const descBlock = textBlock(
        `lnb.studio.${st.id}.desc`,
        {
          x: card.x + 14,
          y: card.y + 98,
          w: card.w - 28,
          h: card.h - 114,
        },
        st.desc[language],
        14,
        6,
      );

      studios.push({ id: st.id, card, tagBox, tagBlock, titleBlock, descBlock });
    }
  }

  return {
    title,
    body,
    subtitleBlock,
    studios,
    blocks,
  };
}

/**
 * Geometría de LNB Express y sincronización KDS de cocina.
 */
export function lnbExpressLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): LnbExpressLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "lnb.express.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    LNB_COPY.express.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const cardsAreaY = body.y + subH + 24;
  const cardsAreaH = body.h - subH - 36;

  let catalogCard: Box;
  let kdsCard: Box;

  if (portrait) {
    const cardH = (cardsAreaH - 16) / 2;
    catalogCard = { x: body.x + 16, y: cardsAreaY, w: body.w - 32, h: cardH };
    kdsCard = { x: body.x + 16, y: cardsAreaY + cardH + 16, w: body.w - 32, h: cardH };
  } else {
    const cardW = (body.w - 48) / 2;
    catalogCard = { x: body.x + 16, y: cardsAreaY, w: cardW, h: cardsAreaH };
    kdsCard = { x: body.x + 16 + cardW + 16, y: cardsAreaY, w: cardW, h: cardsAreaH };
  }

  const badgeH = 34;
  const badgeW = portrait ? 280 : 260;

  const pickupBadge: Box = {
    x: catalogCard.x + 16,
    y: catalogCard.y + 16,
    w: badgeW,
    h: badgeH,
  };
  const pickupBadgeBlock = textBlock(
    "lnb.express.pickup",
    {
      x: pickupBadge.x + 12,
      y: pickupBadge.y + 7,
      w: pickupBadge.w - 24,
      h: 20,
    },
    language === "es" ? "RETIRO EXPRESS · 15 MINUTOS" : "EXPRESS PICKUP · 15 MINUTES",
    13,
    1,
  );

  const zeroWaitBadge: Box = {
    x: kdsCard.x + 16,
    y: kdsCard.y + 16,
    w: badgeW,
    h: badgeH,
  };
  const zeroWaitBadgeBlock = textBlock(
    "lnb.express.kds",
    {
      x: zeroWaitBadge.x + 12,
      y: zeroWaitBadge.y + 7,
      w: zeroWaitBadge.w - 24,
      h: 20,
    },
    language === "es" ? "KITCHEN LIVE · MONITOR KDS" : "KITCHEN LIVE · KDS MONITOR",
    13,
    1,
  );

  return {
    title,
    body,
    subtitleBlock,
    catalogCard,
    kdsCard,
    pickupBadge,
    pickupBadgeBlock,
    zeroWaitBadge,
    zeroWaitBadgeBlock,
    blocks,
  };
}

/**
 * Geometría de Crumb Club y Membresías LNB Pass.
 */
export function lnbLoyaltyLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): LnbLoyaltyLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "lnb.club.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    LNB_COPY.club.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const contentY = body.y + subH + 20;
  const contentH = body.h - subH - 32;

  let cardBox: Box;
  let tiersArea: Box;

  if (portrait) {
    const cardH = Math.round(contentH * 0.34);
    cardBox = { x: body.x + 16, y: contentY, w: body.w - 32, h: cardH };
    tiersArea = {
      x: body.x + 16,
      y: contentY + cardH + 12,
      w: body.w - 32,
      h: contentH - cardH - 12,
    };
  } else {
    const cardW = Math.round((body.w - 48) * 0.35);
    const tiersW = body.w - 48 - cardW;
    cardBox = { x: body.x + 16, y: contentY, w: cardW, h: contentH };
    tiersArea = {
      x: body.x + 16 + cardW + 16,
      y: contentY,
      w: tiersW,
      h: contentH,
    };
  }

  // Tarjeta Crumb Club
  const cardTitleBlock = textBlock(
    "lnb.club.card.title",
    {
      x: cardBox.x + 16,
      y: cardBox.y + 16,
      w: cardBox.w - 32,
      h: 24,
    },
    "CRUMB CLUB · MEMBRESÍA",
    15,
    1,
  );

  const ptsH = 34;
  const pointsBox: Box = {
    x: cardBox.x + 16,
    y: cardBox.y + 50,
    w: cardBox.w - 32,
    h: ptsH,
  };
  const pointsBlock = textBlock(
    "lnb.club.pts",
    {
      x: pointsBox.x + 12,
      y: pointsBox.y + 7,
      w: pointsBox.w - 24,
      h: 20,
    },
    language === "es" ? "245 PUNTOS · EJEMPLO" : "245 POINTS · SAMPLE",
    13,
    1,
  );

  const savedBox: Box = {
    x: cardBox.x + 16,
    y: cardBox.y + 50 + ptsH + 10,
    w: cardBox.w - 32,
    h: ptsH,
  };
  const savedBlock = textBlock(
    "lnb.club.saved",
    {
      x: savedBox.x + 12,
      y: savedBox.y + 7,
      w: savedBox.w - 24,
      h: 20,
    },
    language === "es" ? "$2.450 AHORRO · EJEMPLO" : "$2,450 SAVED · SAMPLE",
    13,
    1,
  );

  // 3 Planes LNB Pass
  const tiers: LnbLoyaltyTierLayout[] = [];
  const tierCols = splitColumns(tiersArea, [1, 1, 1], 12);

  for (let i = 0; i < LNB_TIERS.length; i++) {
    const t = LNB_TIERS[i];
    const tCard = tierCols[i];

    const nameBlock = textBlock(
      `lnb.tier.${t.id}.name`,
      {
        x: tCard.x + 12,
        y: tCard.y + 14,
        w: tCard.w - 24,
        h: 26,
      },
      t.name,
      portrait ? 17 : 16,
      1,
    );

    const priceBox: Box = {
      x: tCard.x + 12,
      y: tCard.y + 44,
      w: tCard.w - 24,
      h: 34,
    };
    const priceBlock = textBlock(
      `lnb.tier.${t.id}.price`,
      {
        x: priceBox.x,
        y: priceBox.y,
        w: priceBox.w,
        h: 26,
      },
      t.price,
      portrait ? 20 : 19,
      1,
    );

    const cadenceBlock = textBlock(
      `lnb.tier.${t.id}.cadence`,
      {
        x: tCard.x + 12,
        y: tCard.y + 74,
        w: tCard.w - 24,
        h: 18,
      },
      t.cadence[language],
      12,
      1,
    );

    const features: TextBlock[] = [];
    const featStartY = tCard.y + 100;
    const featH = 26;
    for (let f = 0; f < t.perks.length; f++) {
      const featBlock = textBlock(
        `lnb.tier.${t.id}.f.${f}`,
        {
          x: tCard.x + 12,
          y: featStartY + f * featH,
          w: tCard.w - 24,
          h: 22,
        },
        t.perks[f][language],
        portrait ? 12 : 11,
        1,
      );
      features.push(featBlock);
    }

    tiers.push({
      id: t.id,
      card: tCard,
      nameBlock,
      priceBox,
      priceBlock,
      cadenceBlock,
      features,
    });
  }

  return {
    title,
    body,
    subtitleBlock,
    cardBox,
    cardTitleBlock,
    pointsBox,
    pointsBlock,
    savedBox,
    savedBlock,
    tiers,
    blocks,
  };
}
