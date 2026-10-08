import { kitBands } from "./kit/kitLayout";
import { type Box, type FilmFormatName } from "@/lib/filmLayout";
import { textBlock, textHeight, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import {
  HUB_PROFESIONAL_COPY,
  HUB_PROFESIONAL_PROFESSIONS,
  HUB_PROFESIONAL_PROTOCOL,
  HUB_PROFESIONAL_SERVICES,
} from "@/data/films/flagships/hubProfesional";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type HubTabButtonLayout = {
  id: string;
  box: Box;
  titleBlock: TextBlock;
};

export type HubProfessionSwitcherLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  tabsRow: Box;
  tabs: HubTabButtonLayout[];
  activeCard: Box;
  badgeBox: Box;
  badgeBlock: TextBlock;
  titleBlock: TextBlock;
  headlineBlock: TextBlock;
  subBlock: TextBlock;
  statsBox: Box;
  statsBlock: TextBlock;
  previewCard: Box;
  hintBar: Box;
  hintBlock: TextBlock;
  blocks: LayoutBlock[];
};

export type HubServiceCardLayout = {
  code: string;
  card: Box;
  codeBox: Box;
  codeBlock: TextBlock;
  titleBlock: TextBlock;
  specBlock: TextBlock;
};

export type HubServicesLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  services: HubServiceCardLayout[];
  blocks: LayoutBlock[];
};

export type HubProtocolStepLayout = {
  step: string;
  card: Box;
  stepBox: Box;
  stepBlock: TextBlock;
  nameBlock: TextBlock;
  descBlock: TextBlock;
};

export type HubProtocolLayout = {
  title: Box;
  body: Box;
  subtitleBlock: TextBlock;
  steps: HubProtocolStepLayout[];
  blocks: LayoutBlock[];
};

/**
 * Geometría de la escena protagonista: Profession Switcher.
 */
export function hubProfessionSwitcherLayout(
  format: FilmFormatName,
  language: FilmLanguage,
  activeProfIndex = 0,
): HubProfessionSwitcherLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "hub.switcher.sub",
    {
      x: body.x + 20,
      y: body.y + 6,
      w: body.w - 40,
      h: subH,
    },
    HUB_PROFESIONAL_COPY.switcher.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  // Tabs de las 6 profesiones
  const tabsTop = subtitleBlock.box.y + subtitleBlock.box.h + (portrait ? 10 : 10);
  const tabsH = portrait ? 82 : 38;
  const tabsRow: Box = {
    x: body.x + 16,
    y: tabsTop,
    w: body.w - 32,
    h: tabsH,
  };

  const profCount = HUB_PROFESIONAL_PROFESSIONS.length;
  const tabs: HubTabButtonLayout[] = [];

  if (!portrait) {
    // 1 fila de 6 tabs en landscape
    const tabGap = 10;
    const tabW = Math.floor((tabsRow.w - tabGap * (profCount - 1)) / profCount);

    for (let i = 0; i < profCount; i++) {
      const p = HUB_PROFESIONAL_PROFESSIONS[i];
      const tabBox: Box = {
        x: tabsRow.x + i * (tabW + tabGap),
        y: tabsRow.y,
        w: tabW,
        h: tabsRow.h,
      };
      const tabFontSize = 15;
      const tabTextH = textHeight(tabFontSize, 1);
      const tabBlock = textBlock(
        `hub.tab.${p.id}`,
        {
          x: tabBox.x + 2,
          y: tabBox.y + Math.floor((tabBox.h - tabTextH) / 2),
          w: tabBox.w - 4,
          h: tabTextH,
        },
        p.title[language],
        tabFontSize,
        1,
      );
      blocks.push(tabBlock);
      tabs.push({ id: p.id, box: tabBox, titleBlock: tabBlock });
    }
  } else {
    // 2 filas de 3 tabs en portrait para máxima legibilidad
    const cols = 3;
    const tabGapX = 10;
    const tabGapY = 8;
    const tabW = Math.floor((tabsRow.w - tabGapX * (cols - 1)) / cols);
    const tabH = Math.floor((tabsRow.h - tabGapY) / 2);

    for (let i = 0; i < profCount; i++) {
      const p = HUB_PROFESIONAL_PROFESSIONS[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const tabBox: Box = {
        x: tabsRow.x + col * (tabW + tabGapX),
        y: tabsRow.y + row * (tabH + tabGapY),
        w: tabW,
        h: tabH,
      };
      const tabFontSize = 20;
      const tabTextH = textHeight(tabFontSize, 1);
      const tabBlock = textBlock(
        `hub.tab.${p.id}`,
        {
          x: tabBox.x + 2,
          y: tabBox.y + Math.floor((tabBox.h - tabTextH) / 2),
          w: tabBox.w - 4,
          h: tabTextH,
        },
        p.title[language],
        tabFontSize,
        1,
      );
      blocks.push(tabBlock);
      tabs.push({ id: p.id, box: tabBox, titleBlock: tabBlock });
    }
  }

  // Hint bar al pie
  const hintH = portrait ? 54 : 32;
  const hintBar: Box = {
    x: body.x + 16,
    y: body.y + body.h - hintH - 6,
    w: body.w - 32,
    h: hintH,
  };
  const hintFontSize = portrait ? 20 : 15;
  const hintLines = portrait ? 2 : 1;
  const hintTextH = textHeight(hintFontSize, hintLines);
  const hintBlock = textBlock(
    "hub.switcher.hint",
    {
      x: hintBar.x + 10,
      y: hintBar.y + Math.floor((hintH - hintTextH) / 2),
      w: hintBar.w - 20,
      h: hintTextH,
    },
    HUB_PROFESIONAL_COPY.switcher.hint[language],
    hintFontSize,
    hintLines,
  );
  blocks.push(hintBlock);

  // Card central activa
  const cardTop = tabsRow.y + tabsRow.h + (portrait ? 10 : 12);
  const cardH = hintBar.y - cardTop - (portrait ? 10 : 10);
  const activeCard: Box = {
    x: body.x + 16,
    y: cardTop,
    w: body.w - 32,
    h: cardH,
  };

  const prof = HUB_PROFESIONAL_PROFESSIONS[activeProfIndex] ?? HUB_PROFESIONAL_PROFESSIONS[0];

  let badgeBox: Box;
  let titleBox: Box;
  let headlineBox: Box;
  let subTextBox: Box;
  let statsBox: Box;
  let previewCard: Box;

  if (!portrait) {
    const pad = 24;
    const innerW = activeCard.w - pad * 2;
    const innerH = activeCard.h - pad * 2;
    const colGap = 24;
    const leftW = Math.round((innerW - colGap) * 0.54);
    const rightW = innerW - colGap - leftW;

    const leftX = activeCard.x + pad;
    const leftY = activeCard.y + pad;
    const rightX = leftX + leftW + colGap;

    badgeBox = {
      x: leftX,
      y: leftY,
      w: 220,
      h: 30,
    };

    titleBox = {
      x: leftX,
      y: badgeBox.y + badgeBox.h + 12,
      w: leftW,
      h: 36,
    };

    headlineBox = {
      x: leftX,
      y: titleBox.y + titleBox.h + 10,
      w: leftW,
      h: 84,
    };

    subTextBox = {
      x: leftX,
      y: headlineBox.y + headlineBox.h + 10,
      w: leftW,
      h: 68,
    };

    statsBox = {
      x: leftX,
      y: leftY + innerH - 44,
      w: leftW,
      h: 44,
    };

    previewCard = {
      x: rightX,
      y: leftY,
      w: rightW,
      h: innerH,
    };
  } else {
    // Portrait
    const pad = 16;
    const innerW = activeCard.w - pad * 2;

    badgeBox = {
      x: activeCard.x + pad,
      y: activeCard.y + 12,
      w: Math.min(320, innerW),
      h: 36,
    };

    titleBox = {
      x: activeCard.x + pad,
      y: badgeBox.y + badgeBox.h + 8,
      w: innerW,
      h: 36,
    };

    headlineBox = {
      x: activeCard.x + pad,
      y: titleBox.y + titleBox.h + 8,
      w: innerW,
      h: 80,
    };

    subTextBox = {
      x: activeCard.x + pad,
      y: headlineBox.y + headlineBox.h + 8,
      w: innerW,
      h: 68,
    };

    statsBox = {
      x: activeCard.x + pad,
      y: subTextBox.y + subTextBox.h + 8,
      w: innerW,
      h: 42,
    };

    const prevY = statsBox.y + statsBox.h + 10;
    previewCard = {
      x: activeCard.x + pad,
      y: prevY,
      w: innerW,
      h: activeCard.y + activeCard.h - prevY - 12,
    };
  }

  const badgeFontSize = portrait ? 20 : 15;
  const badgeTextH = textHeight(badgeFontSize, 1);
  const badgeBlock = textBlock(
    "hub.active.badge",
    {
      x: badgeBox.x + 6,
      y: badgeBox.y + Math.floor((badgeBox.h - badgeTextH) / 2),
      w: badgeBox.w - 12,
      h: badgeTextH,
    },
    prof.badge[language],
    badgeFontSize,
    1,
  );
  blocks.push(badgeBlock);

  const titleFontSize = 24;
  const titleTextH = textHeight(titleFontSize, 1);
  const titleBlock = textBlock(
    "hub.active.title",
    {
      x: titleBox.x,
      y: titleBox.y,
      w: titleBox.w,
      h: titleTextH,
    },
    prof.title[language],
    titleFontSize,
    1,
  );
  blocks.push(titleBlock);

  const headlineFontSize = 20;
  const headlineLines = 3;
  const headlineTextH = textHeight(headlineFontSize, headlineLines);
  const headlineBlock = textBlock(
    "hub.active.headline",
    {
      x: headlineBox.x,
      y: headlineBox.y,
      w: headlineBox.w,
      h: headlineTextH,
    },
    prof.headline[language],
    headlineFontSize,
    headlineLines,
  );
  blocks.push(headlineBlock);

  const subTextFontSize = portrait ? 20 : 15;
  const subTextLines = 3;
  const subTextH = textHeight(subTextFontSize, subTextLines);
  const subBlock = textBlock(
    "hub.active.sub",
    {
      x: subTextBox.x,
      y: subTextBox.y,
      w: subTextBox.w,
      h: subTextH,
    },
    prof.sub[language],
    subTextFontSize,
    subTextLines,
  );
  blocks.push(subBlock);

  const statsFontSize = portrait ? 20 : 15;
  const statsTextH = textHeight(statsFontSize, 1);
  const statsBlock = textBlock(
    "hub.active.stats",
    {
      x: statsBox.x + 8,
      y: statsBox.y + Math.floor((statsBox.h - statsTextH) / 2),
      w: statsBox.w - 16,
      h: statsTextH,
    },
    prof.stats[language],
    statsFontSize,
    1,
  );
  blocks.push(statsBlock);

  return {
    title,
    body,
    subtitleBlock,
    tabsRow,
    tabs,
    activeCard,
    badgeBox,
    badgeBlock,
    titleBlock,
    headlineBlock,
    subBlock,
    statsBox,
    statsBlock,
    previewCard,
    hintBar,
    hintBlock,
    blocks,
  };
}

/**
 * Geometría de Servicios Tácticos (Mecánica Premium).
 */
export function hubServicesLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): HubServicesLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "hub.services.sub",
    {
      x: body.x + 20,
      y: body.y + 6,
      w: body.w - 40,
      h: subH,
    },
    HUB_PROFESIONAL_COPY.services.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const gridTop = subtitleBlock.box.y + subtitleBlock.box.h + (portrait ? 16 : 20);
  const gridH = body.y + body.h - gridTop - (portrait ? 12 : 16);

  const services: HubServiceCardLayout[] = [];
  const count = HUB_PROFESIONAL_SERVICES.length;

  if (!portrait) {
    // 2x2 grid
    const cols = 2;
    const rows = 2;
    const gapX = 24;
    const gapY = 20;
    const cardW = Math.floor((body.w - 32 - gapX) / cols);
    const cardH = Math.floor((gridH - gapY) / rows);

    for (let i = 0; i < count; i++) {
      const srv = HUB_PROFESIONAL_SERVICES[i];
      const col = i % cols;
      const row = Math.floor(i / cols);
      const card: Box = {
        x: body.x + 16 + col * (cardW + gapX),
        y: gridTop + row * (cardH + gapY),
        w: cardW,
        h: cardH,
      };

      const codeBox: Box = {
        x: card.x + 18,
        y: card.y + 16,
        w: 96,
        h: 28,
      };
      const codeFontSize = 15;
      const codeTextH = textHeight(codeFontSize, 1);
      const codeBlock = textBlock(
        `hub.srv.code.${srv.code}`,
        {
          x: codeBox.x + 4,
          y: codeBox.y + Math.floor((codeBox.h - codeTextH) / 2),
          w: codeBox.w - 8,
          h: codeTextH,
        },
        srv.code,
        codeFontSize,
        1,
      );
      blocks.push(codeBlock);

      const titleFontSize = 20;
      const titleTextH = textHeight(titleFontSize, 1);
      const titleBlock = textBlock(
        `hub.srv.title.${srv.code}`,
        {
          x: card.x + 18,
          y: codeBox.y + codeBox.h + 12,
          w: card.w - 36,
          h: titleTextH,
        },
        srv.title[language],
        titleFontSize,
        1,
      );
      blocks.push(titleBlock);

      const specFontSize = 15;
      const specLines = 2;
      const specTextH = textHeight(specFontSize, specLines);
      const specBlock = textBlock(
        `hub.srv.spec.${srv.code}`,
        {
          x: card.x + 18,
          y: titleBlock.box.y + titleBlock.box.h + 10,
          w: card.w - 36,
          h: specTextH,
        },
        srv.spec[language],
        specFontSize,
        specLines,
      );
      blocks.push(specBlock);

      services.push({ code: srv.code, card, codeBox, codeBlock, titleBlock, specBlock });
    }
  } else {
    // Portrait: 4 cards stacked
    const gapY = 12;
    const cardH = Math.floor((gridH - gapY * (count - 1)) / count);

    for (let i = 0; i < count; i++) {
      const srv = HUB_PROFESIONAL_SERVICES[i];
      const card: Box = {
        x: body.x + 16,
        y: gridTop + i * (cardH + gapY),
        w: body.w - 32,
        h: cardH,
      };

      const codeBox: Box = {
        x: card.x + 16,
        y: card.y + 12,
        w: 110,
        h: 28,
      };
      const codeFontSize = 20;
      const codeTextH = textHeight(codeFontSize, 1);
      const codeBlock = textBlock(
        `hub.srv.code.${srv.code}`,
        {
          x: codeBox.x + 4,
          y: codeBox.y + Math.floor((codeBox.h - codeTextH) / 2),
          w: codeBox.w - 8,
          h: codeTextH,
        },
        srv.code,
        codeFontSize,
        1,
      );
      blocks.push(codeBlock);

      const titleFontSize = 20;
      const titleTextH = textHeight(titleFontSize, 1);
      const titleBlock = textBlock(
        `hub.srv.title.${srv.code}`,
        {
          x: card.x + 136,
          y: card.y + 12,
          w: card.w - 152,
          h: titleTextH,
        },
        srv.title[language],
        titleFontSize,
        1,
      );
      blocks.push(titleBlock);

      const specFontSize = 20;
      const specLines = 2;
      const specTextH = textHeight(specFontSize, specLines);
      const specBlock = textBlock(
        `hub.srv.spec.${srv.code}`,
        {
          x: card.x + 16,
          y: codeBox.y + codeBox.h + 8,
          w: card.w - 32,
          h: specTextH,
        },
        srv.spec[language],
        specFontSize,
        specLines,
      );
      blocks.push(specBlock);

      services.push({ code: srv.code, card, codeBox, codeBlock, titleBlock, specBlock });
    }
  }

  return { title, body, subtitleBlock, services, blocks };
}

/**
 * Geometría de Protocolo de Servicio en 4 Fases.
 */
export function hubProtocolLayout(
  format: FilmFormatName,
  language: FilmLanguage,
): HubProtocolLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";
  const blocks: LayoutBlock[] = [];

  const subFontSize = portrait ? 20 : 16;
  const subH = textHeight(subFontSize, 2);
  const subtitleBlock = textBlock(
    "hub.protocol.sub",
    {
      x: body.x + 20,
      y: body.y + 6,
      w: body.w - 40,
      h: subH,
    },
    HUB_PROFESIONAL_COPY.protocol.sub[language],
    subFontSize,
    2,
  );
  blocks.push(subtitleBlock);

  const gridTop = subtitleBlock.box.y + subtitleBlock.box.h + (portrait ? 16 : 24);
  const gridH = body.y + body.h - gridTop - (portrait ? 12 : 16);

  const steps: HubProtocolStepLayout[] = [];
  const count = HUB_PROFESIONAL_PROTOCOL.length;

  if (!portrait) {
    // 4 columns horizontal sequence
    const gapX = 16;
    const cardW = Math.floor((body.w - 32 - gapX * (count - 1)) / count);

    for (let i = 0; i < count; i++) {
      const p = HUB_PROFESIONAL_PROTOCOL[i];
      const card: Box = {
        x: body.x + 16 + i * (cardW + gapX),
        y: gridTop,
        w: cardW,
        h: gridH,
      };

      const stepBox: Box = {
        x: card.x + 16,
        y: card.y + 18,
        w: 52,
        h: 30,
      };
      const stepFontSize = 18;
      const stepTextH = textHeight(stepFontSize, 1);
      const stepBlock = textBlock(
        `hub.prot.num.${p.step}`,
        {
          x: stepBox.x + 4,
          y: stepBox.y + Math.floor((stepBox.h - stepTextH) / 2),
          w: stepBox.w - 8,
          h: stepTextH,
        },
        p.step,
        stepFontSize,
        1,
      );
      blocks.push(stepBlock);

      const nameFontSize = 18;
      const nameLines = 2;
      const nameTextH = textHeight(nameFontSize, nameLines);
      const nameBlock = textBlock(
        `hub.prot.name.${p.step}`,
        {
          x: card.x + 16,
          y: stepBox.y + stepBox.h + 14,
          w: card.w - 32,
          h: nameTextH,
        },
        p.name[language],
        nameFontSize,
        nameLines,
      );
      blocks.push(nameBlock);

      const descFontSize = 15;
      const descLines = 3;
      const descTextH = textHeight(descFontSize, descLines);
      const descBlock = textBlock(
        `hub.prot.desc.${p.step}`,
        {
          x: card.x + 16,
          y: nameBlock.box.y + nameBlock.box.h + 12,
          w: card.w - 32,
          h: descTextH,
        },
        p.desc[language],
        descFontSize,
        descLines,
      );
      blocks.push(descBlock);

      steps.push({ step: p.step, card, stepBox, stepBlock, nameBlock, descBlock });
    }
  } else {
    // Portrait: 4 cards stacked
    const gapY = 12;
    const cardH = Math.floor((gridH - gapY * (count - 1)) / count);

    for (let i = 0; i < count; i++) {
      const p = HUB_PROFESIONAL_PROTOCOL[i];
      const card: Box = {
        x: body.x + 16,
        y: gridTop + i * (cardH + gapY),
        w: body.w - 32,
        h: cardH,
      };

      const stepBox: Box = {
        x: card.x + 16,
        y: card.y + 12,
        w: 48,
        h: 28,
      };
      const stepFontSize = 20;
      const stepTextH = textHeight(stepFontSize, 1);
      const stepBlock = textBlock(
        `hub.prot.num.${p.step}`,
        {
          x: stepBox.x + 4,
          y: stepBox.y + Math.floor((stepBox.h - stepTextH) / 2),
          w: stepBox.w - 8,
          h: stepTextH,
        },
        p.step,
        stepFontSize,
        1,
      );
      blocks.push(stepBlock);

      const nameFontSize = 20;
      const nameTextH = textHeight(nameFontSize, 1);
      const nameBlock = textBlock(
        `hub.prot.name.${p.step}`,
        {
          x: card.x + 72,
          y: card.y + 12,
          w: card.w - 88,
          h: nameTextH,
        },
        p.name[language],
        nameFontSize,
        1,
      );
      blocks.push(nameBlock);

      const descFontSize = 20;
      const descLines = 2;
      const descTextH = textHeight(descFontSize, descLines);
      const descBlock = textBlock(
        `hub.prot.desc.${p.step}`,
        {
          x: card.x + 16,
          y: stepBox.y + stepBox.h + 8,
          w: card.w - 32,
          h: descTextH,
        },
        p.desc[language],
        descFontSize,
        descLines,
      );
      blocks.push(descBlock);

      steps.push({ step: p.step, card, stepBox, stepBlock, nameBlock, descBlock });
    }
  }

  return { title, body, subtitleBlock, steps, blocks };
}
