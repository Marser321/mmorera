import { kitBands } from "./kit/kitLayout";
import { splitColumns, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { textBlock, textHeight, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { PUNTA_COPY, PUNTA_TIERS, PUNTA_WORKFLOW } from "@/data/films/flagships/punta360";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type PuntaTourHotspotLayout = {
  id: string;
  marker: Box;
  card: Box;
  titleBlock: TextBlock;
  detailBlock: TextBlock;
};

export type PuntaVirtualTourLayout = {
  title: Box;
  body: Box;
  viewportBox: Box;
  telemetryBar: Box;
  telemetryBlock: TextBlock;
  hotspots: PuntaTourHotspotLayout[];
  blocks: LayoutBlock[];
};

export type PuntaComparisonLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  leftCard: Box;
  leftBadge: Box;
  leftBadgeBlock: TextBlock;
  rightCard: Box;
  rightBadge: Box;
  rightBadgeBlock: TextBlock;
  blocks: LayoutBlock[];
};

export type PuntaPlanCardLayout = {
  id: string;
  card: Box;
  nameBlock: TextBlock;
  priceBox: Box;
  priceBlock: TextBlock;
  cadenceBlock: TextBlock;
  features: TextBlock[];
  ctaBox: Box;
  ctaBlock: TextBlock;
};

export type PuntaPlansLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  cards: PuntaPlanCardLayout[];
  blocks: LayoutBlock[];
};

export type PuntaWorkflowStepLayout = {
  step: string;
  card: Box;
  numberBlock: TextBlock;
  titleBlock: TextBlock;
  descBlock: TextBlock;
};

export type PuntaWorkflowLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  steps: PuntaWorkflowStepLayout[];
  blocks: LayoutBlock[];
};

export function puntaVirtualTourLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): PuntaVirtualTourLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const teleH = portrait ? 44 : 36;
  const viewportMargin = portrait ? 16 : 24;

  const viewportBox: Box = {
    x: body.x + viewportMargin,
    y: body.y + 12,
    w: body.w - viewportMargin * 2,
    h: body.h - teleH - 32,
  };

  const telemetryBar: Box = {
    x: viewportBox.x,
    y: viewportBox.y + viewportBox.h + 8,
    w: viewportBox.w,
    h: teleH,
  };

  const teleFontSize = portrait ? 20 : 15;
  const teleText = PUNTA_COPY.tour.hint[language];
  const telemetryBlock = textBlock(
    "punta.tour.tele",
    {
      x: telemetryBar.x + 16,
      y: telemetryBar.y + (teleH - textHeight(teleFontSize, 1)) / 2,
      w: telemetryBar.w - 32,
      h: textHeight(teleFontSize, 1),
    },
    teleText,
    teleFontSize,
    1,
  );
  blocks.push(telemetryBlock);

  // 3 Hotspots distribuidos sobre el viewport
  const hotspots: PuntaTourHotspotLayout[] = [
    {
      id: "living",
      marker: {
        x: viewportBox.x + viewportBox.w * 0.22,
        y: viewportBox.y + viewportBox.h * 0.45,
        w: 36,
        h: 36,
      },
      card: {
        x: viewportBox.x + (portrait ? 16 : 32),
        y: viewportBox.y + viewportBox.h * 0.62,
        w: portrait ? viewportBox.w - 32 : 360,
        h: 96,
      },
      titleBlock: textBlock(
        "punta.hotspot.living.title",
        {
          x: viewportBox.x + (portrait ? 32 : 48),
          y: viewportBox.y + viewportBox.h * 0.62 + 12,
          w: portrait ? viewportBox.w - 64 : 328,
          h: 24,
        },
        language === "es" ? "Living Principal" : "Main Living Hall",
        portrait ? 20 : 16,
        1,
      ),
      detailBlock: textBlock(
        "punta.hotspot.living.desc",
        {
          x: viewportBox.x + (portrait ? 32 : 48),
          y: viewportBox.y + viewportBox.h * 0.62 + 42,
          w: portrait ? viewportBox.w - 64 : 328,
          h: 40,
        },
        language === "es" ? "Doble altura con ventanales hacia la costa" : "Double-height glass facing ocean line",
        portrait ? 16 : 13,
        2,
      ),
    },
  ];

  return {
    title,
    body,
    viewportBox,
    telemetryBar,
    telemetryBlock,
    hotspots,
    blocks,
  };
}

export function puntaComparisonLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): PuntaComparisonLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "punta.comp.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    PUNTA_COPY.comparison.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const cardsAreaY = body.y + subH + 24;
  const cardsAreaH = body.h - subH - 36;

  let leftCard: Box;
  let rightCard: Box;

  if (portrait) {
    const cardH = (cardsAreaH - 20) / 2;
    leftCard = { x: body.x + 20, y: cardsAreaY, w: body.w - 40, h: cardH };
    rightCard = { x: body.x + 20, y: cardsAreaY + cardH + 20, w: body.w - 40, h: cardH };
  } else {
    const cardW = (body.w - 48) / 2;
    leftCard = { x: body.x + 16, y: cardsAreaY, w: cardW, h: cardsAreaH };
    rightCard = { x: body.x + 16 + cardW + 16, y: cardsAreaY, w: cardW, h: cardsAreaH };
  }

  const badgeH = 34;
  const badgeW = portrait ? 240 : 220;
  const leftBadge: Box = {
    x: leftCard.x + 16,
    y: leftCard.y + 16,
    w: badgeW,
    h: badgeH,
  };
  const leftBadgeBlock = textBlock(
    "punta.comp.amateur",
    {
      x: leftBadge.x + 12,
      y: leftBadge.y + 7,
      w: leftBadge.w - 24,
      h: 20,
    },
    PUNTA_COPY.comparison.amateurLabel[language],
    13,
    1,
  );

  const rightBadge: Box = {
    x: rightCard.x + 16,
    y: rightCard.y + 16,
    w: badgeW,
    h: badgeH,
  };
  const rightBadgeBlock = textBlock(
    "punta.comp.pro",
    {
      x: rightBadge.x + 12,
      y: rightBadge.y + 7,
      w: rightBadge.w - 24,
      h: 20,
    },
    PUNTA_COPY.comparison.proLabel[language],
    13,
    1,
  );

  return {
    title,
    body,
    subtitleBlock,
    leftCard,
    leftBadge,
    leftBadgeBlock,
    rightCard,
    rightBadge,
    rightBadgeBlock,
    blocks,
  };
}

export function puntaPlansLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): PuntaPlansLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subLines = portrait ? 2 : 1;
  const subH = textHeight(subFontSize, subLines);
  const subtitleBlock = textBlock(
    "punta.plans.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    PUNTA_COPY.plans.sub[language],
    subFontSize,
    subLines,
  );
  blocks.push(subtitleBlock);

  const cardsAreaY = body.y + subH + 20;
  const cardsAreaH = body.h - subH - 30;

  const cards: PuntaPlanCardLayout[] = [];

  if (portrait) {
    const cardH = (cardsAreaH - 24) / 3;
    PUNTA_TIERS.forEach((tier, i) => {
      const cardBox: Box = {
        x: body.x + 16,
        y: cardsAreaY + i * (cardH + 12),
        w: body.w - 32,
        h: cardH,
      };
      const nameBlock = textBlock(
        `punta.plan.${tier.id}.name`,
        { x: cardBox.x + 16, y: cardBox.y + 12, w: cardBox.w - 32, h: 26 },
        tier.name,
        22,
        1,
      );
      const priceBox: Box = { x: cardBox.x + 16, y: cardBox.y + 42, w: 120, h: 36 };
      const priceBlock = textBlock(
        `punta.plan.${tier.id}.price`,
        { x: priceBox.x, y: priceBox.y, w: priceBox.w, h: 34 },
        tier.price,
        30,
        1,
      );
      const cadenceBlock = textBlock(
        `punta.plan.${tier.id}.cadence`,
        { x: cardBox.x + 140, y: cardBox.y + 50, w: 160, h: 22 },
        tier.cadence[language],
        16,
        1,
      );
      const features = tier.perks.slice(0, 2).map((perk, pIdx) =>
        textBlock(
          `punta.plan.${tier.id}.feat.${pIdx}`,
          { x: cardBox.x + 16, y: cardBox.y + 84 + pIdx * 24, w: cardBox.w - 32, h: 22 },
          `• ${perk[language]}`,
          15,
          1,
        )
      );
      const ctaBox: Box = { x: cardBox.x + cardBox.w - 180, y: cardBox.y + cardBox.h - 48, w: 160, h: 36 };
      const ctaBlock = textBlock(
        `punta.plan.${tier.id}.cta`,
        { x: ctaBox.x, y: ctaBox.y + 8, w: ctaBox.w, h: 20 },
        language === "es" ? "Comenzar" : "Get Started",
        14,
        1,
      );

      cards.push({
        id: tier.id,
        card: cardBox,
        nameBlock,
        priceBox,
        priceBlock,
        cadenceBlock,
        features,
        ctaBox,
        ctaBlock,
      });
    });
  } else {
    const colBoxes = splitColumns(
      { x: body.x + 16, y: cardsAreaY, w: body.w - 32, h: cardsAreaH },
      [1, 1, 1],
      20,
    );
    PUNTA_TIERS.forEach((tier, i) => {
      const cardBox = colBoxes[i];
      const nameBlock = textBlock(
        `punta.plan.${tier.id}.name`,
        { x: cardBox.x + 20, y: cardBox.y + 20, w: cardBox.w - 40, h: 28 },
        tier.name,
        24,
        1,
      );
      const priceBox: Box = { x: cardBox.x + 20, y: cardBox.y + 56, w: 140, h: 42 };
      const priceBlock = textBlock(
        `punta.plan.${tier.id}.price`,
        { x: priceBox.x, y: priceBox.y, w: priceBox.w, h: 40 },
        tier.price,
        34,
        1,
      );
      const cadenceBlock = textBlock(
        `punta.plan.${tier.id}.cadence`,
        { x: cardBox.x + 165, y: cardBox.y + 68, w: 120, h: 22 },
        tier.cadence[language],
        16,
        1,
      );
      const features = tier.perks.map((perk, pIdx) =>
        textBlock(
          `punta.plan.${tier.id}.feat.${pIdx}`,
          { x: cardBox.x + 20, y: cardBox.y + 116 + pIdx * 28, w: cardBox.w - 40, h: 24 },
          `• ${perk[language]}`,
          15,
          1,
        )
      );
      const ctaBox: Box = { x: cardBox.x + 20, y: cardBox.y + cardBox.h - 58, w: cardBox.w - 40, h: 42 };
      const ctaBlock = textBlock(
        `punta.plan.${tier.id}.cta`,
        { x: ctaBox.x, y: ctaBox.y + 11, w: ctaBox.w, h: 20 },
        language === "es" ? "Comenzar" : "Get Started",
        15,
        1,
      );

      cards.push({
        id: tier.id,
        card: cardBox,
        nameBlock,
        priceBox,
        priceBlock,
        cadenceBlock,
        features,
        ctaBox,
        ctaBlock,
      });
    });
  }

  return {
    title,
    body,
    subtitleBlock,
    cards,
    blocks,
  };
}

export function puntaWorkflowLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): PuntaWorkflowLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subLines = portrait ? 2 : 1;
  const subH = textHeight(subFontSize, subLines);
  const subtitleBlock = textBlock(
    "punta.wf.sub",
    {
      x: body.x + 20,
      y: body.y + 8,
      w: body.w - 40,
      h: subH,
    },
    PUNTA_COPY.workflow.sub[language],
    subFontSize,
    subLines,
  );
  blocks.push(subtitleBlock);

  const cardsAreaY = body.y + subH + 24;
  const cardsAreaH = body.h - subH - 36;
  const steps: PuntaWorkflowStepLayout[] = [];

  if (portrait) {
    const cardH = (cardsAreaH - 36) / 4;
    PUNTA_WORKFLOW.forEach((step, i) => {
      const cardBox: Box = {
        x: body.x + 16,
        y: cardsAreaY + i * (cardH + 12),
        w: body.w - 32,
        h: cardH,
      };
      const numberBlock = textBlock(
        `punta.wf.${step.step}.num`,
        { x: cardBox.x + 16, y: cardBox.y + 12, w: 48, h: 28 },
        step.step,
        24,
        1,
      );
      const titleBlock = textBlock(
        `punta.wf.${step.step}.title`,
        { x: cardBox.x + 72, y: cardBox.y + 12, w: cardBox.w - 88, h: 26 },
        step.title[language],
        20,
        1,
      );
      const descBlock = textBlock(
        `punta.wf.${step.step}.desc`,
        { x: cardBox.x + 72, y: cardBox.y + 44, w: cardBox.w - 88, h: 36 },
        step.desc[language],
        15,
        2,
      );
      steps.push({ step: step.step, card: cardBox, numberBlock, titleBlock, descBlock });
    });
  } else {
    const colBoxes = splitColumns(
      { x: body.x + 16, y: cardsAreaY, w: body.w - 32, h: cardsAreaH },
      [1, 1, 1, 1],
      16,
    );
    PUNTA_WORKFLOW.forEach((step, i) => {
      const cardBox = colBoxes[i];
      const numberBlock = textBlock(
        `punta.wf.${step.step}.num`,
        { x: cardBox.x + 20, y: cardBox.y + 20, w: 60, h: 36 },
        step.step,
        32,
        1,
      );
      const titleBlock = textBlock(
        `punta.wf.${step.step}.title`,
        { x: cardBox.x + 20, y: cardBox.y + 64, w: cardBox.w - 40, h: 28 },
        step.title[language],
        22,
        1,
      );
      const descBlock = textBlock(
        `punta.wf.${step.step}.desc`,
        { x: cardBox.x + 20, y: cardBox.y + 104, w: cardBox.w - 40, h: 72 },
        step.desc[language],
        16,
        3,
      );
      steps.push({ step: step.step, card: cardBox, numberBlock, titleBlock, descBlock });
    });
  }

  return {
    title,
    body,
    subtitleBlock,
    steps,
    blocks,
  };
}
