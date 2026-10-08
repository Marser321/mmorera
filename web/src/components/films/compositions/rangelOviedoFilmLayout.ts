import { kitBands } from "./kit/kitLayout";
import { splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";
import { fitUniform } from "../scenes/brand/layout/crmText";
import { textBlock, textHeight, GLYPH, type LayoutBlock, type TextBlock } from "../scenes/brand/layout/dataText";
import { ROG_PROFILES, ROG_STEPS, type RogCopy } from "@/data/films/flagships/rangelOviedo";
import type { FilmLanguage } from "@/data/films/filmTypes";

export type RogProfileCard = {
  id: string;
  card: Box;
  label: TextBlock;
  detail: TextBlock;
};

export type RogStepCard = {
  num: string;
  card: Box;
  badgeBox: Box;
  numBlock: TextBlock;
  title: TextBlock;
  desc: TextBlock;
};

export type RogGoalPathsLayout = {
  title: Box;
  body: Box;
  profileCards: RogProfileCard[];
  stepCards: RogStepCard[];
  blocks: LayoutBlock[];
  leftCol?: Box;
  rightCol?: Box;
  topArea?: Box;
  bottomArea?: Box;
};

export function rogGoalPathsLayout(format: FilmFormatName, copy: RogCopy, language: FilmLanguage): RogGoalPathsLayout {
  const { title, body } = kitBands(format);
  const portrait = format === "portrait";

  const profilesData = ROG_PROFILES.map((p) => ({
    id: p.id,
    label: p.label[language],
    detail: p.detail[language],
  }));

  const stepsData = ROG_STEPS.map((s) => ({
    num: s.num,
    title: s.title[language],
    desc: s.desc[language],
  }));

  if (!portrait) {
    // LANDSCAPE: 2 columnas (Perfiles a la izquierda, Etapas a la derecha)
    const [leftCol, rightCol] = splitColumns(body, [1, 1.3], 36);

    // Izquierda: Perfiles
    const leftHeaderH = textHeight(17, 1);
    const leftHeader = textBlock("rog.profiles.header", { x: leftCol.x, y: leftCol.y, w: leftCol.w, h: leftHeaderH }, copy.profilesTitle, 17, 1, GLYPH.upper);
    const leftCardsArea: Box = {
      x: leftCol.x,
      y: leftCol.y + leftHeaderH + 14,
      w: leftCol.w,
      h: leftCol.h - leftHeaderH - 14,
    };
    const profileSlots = stackBands(
      leftCardsArea,
      profilesData.map((p) => ({ id: p.id, flex: 1 })),
      10,
    );

    const pad = 14;
    const innerW = leftCardsArea.w - pad * 2;
    const labelFit = fitUniform(profilesData.map((p) => p.label), innerW, [19, 18, 17], 1);
    const detailFit = fitUniform(profilesData.map((p) => p.detail), innerW, [15], 2);

    const profileCards = profilesData.map((p) => {
      const slot = profileSlots[p.id];
      const labelH = textHeight(labelFit.size, 1);
      const detailH = textHeight(detailFit.size, detailFit.lines);
      const contentH = labelH + 6 + detailH;
      const topY = slot.y + Math.max(pad, (slot.h - contentH) / 2);

      const label = textBlock(`rog.profile.${p.id}.label`, { x: slot.x + pad, y: topY, w: innerW, h: labelH }, p.label, labelFit.size, 1);
      const detail = textBlock(`rog.profile.${p.id}.detail`, { x: slot.x + pad, y: topY + labelH + 6, w: innerW, h: detailH }, p.detail, detailFit.size, detailFit.lines);
      return { id: p.id, card: slot, label, detail };
    });

    // Derecha: Etapas
    const rightHeaderH = textHeight(17, 1);
    const rightHeader = textBlock("rog.steps.header", { x: rightCol.x, y: rightCol.y, w: rightCol.w, h: rightHeaderH }, copy.methodTitle, 17, 1, GLYPH.upper);
    const rightCardsArea: Box = {
      x: rightCol.x,
      y: rightCol.y + rightHeaderH + 14,
      w: rightCol.w,
      h: rightCol.h - rightHeaderH - 14,
    };
    const stepSlots = stackBands(
      rightCardsArea,
      stepsData.map((s) => ({ id: s.num, flex: 1 })),
      8,
    );

    const badgeW = 46;
    const stepInnerW = rightCardsArea.w - pad * 2 - badgeW - 14;
    const stepTitleFit = fitUniform(stepsData.map((s) => s.title), stepInnerW, [18, 17, 16], 1);
    const stepDescFit = fitUniform(stepsData.map((s) => s.desc), stepInnerW, [15], 1);

    const stepCards = stepsData.map((s) => {
      const slot = stepSlots[s.num];
      const titleH = textHeight(stepTitleFit.size, 1);
      const descH = textHeight(stepDescFit.size, 1);
      const contentH = titleH + 4 + descH;
      const topY = slot.y + Math.max(pad, (slot.h - contentH) / 2);

      const badgeBox: Box = { x: slot.x + pad, y: slot.y + (slot.h - 32) / 2, w: badgeW, h: 32 };
      const num = textBlock(`rog.step.${s.num}.num`, { x: badgeBox.x, y: badgeBox.y + (badgeBox.h - textHeight(15, 1)) / 2, w: badgeW, h: textHeight(15, 1) }, s.num, 15, 1);
      const title = textBlock(`rog.step.${s.num}.title`, { x: slot.x + pad + badgeW + 14, y: topY, w: stepInnerW, h: titleH }, s.title, stepTitleFit.size, 1);
      const desc = textBlock(`rog.step.${s.num}.desc`, { x: slot.x + pad + badgeW + 14, y: topY + titleH + 4, w: stepInnerW, h: descH }, s.desc, stepDescFit.size, 1);

      return { num: s.num, card: slot, badgeBox, numBlock: num, title, desc };
    });

    const blocks: LayoutBlock[] = [
      leftHeader,
      ...profileCards.flatMap((c) => [c.label, c.detail]),
      rightHeader,
      ...stepCards.flatMap((s) => [s.numBlock, s.title, s.desc]),
    ];

    return { title, body, leftCol, rightCol, profileCards, stepCards, blocks };
  } else {
    // PORTRAIT: 2 bandas (Perfiles 2x2 arriba, Etapas apiladas abajo)
    const stacked = stackBands(body, [{ id: "profiles", flex: 1.05 }, { id: "method", flex: 1.15 }], 20);
    const topArea = stacked.profiles;
    const bottomArea = stacked.method;

    const topHeaderH = textHeight(21, 1);
    const topHeader = textBlock("rog.profiles.header", { x: topArea.x, y: topArea.y, w: topArea.w, h: topHeaderH }, copy.profilesTitle, 21, 1, GLYPH.upper);
    const topGridArea: Box = {
      x: topArea.x,
      y: topArea.y + topHeaderH + 12,
      w: topArea.w,
      h: topArea.h - topHeaderH - 12,
    };

    const gridRows = stackBands(topGridArea, [{ id: "r0", flex: 1 }, { id: "r1", flex: 1 }], 10);
    const row0Cols = splitColumns(gridRows.r0, [1, 1], 10);
    const row1Cols = splitColumns(gridRows.r1, [1, 1], 10);
    const gridCards = [row0Cols[0], row0Cols[1], row1Cols[0], row1Cols[1]];

    const pad = 12;
    const cardInnerW = gridCards[0].w - pad * 2;
    const pLabelFit = fitUniform(profilesData.map((p) => p.label), cardInnerW, [22, 21, 20], 1);
    const pDetailFit = fitUniform(profilesData.map((p) => p.detail), cardInnerW, [20], 3);

    const profileCards = profilesData.map((p, i) => {
      const slot = gridCards[i];
      const labelH = textHeight(pLabelFit.size, 1);
      const detailH = textHeight(pDetailFit.size, pDetailFit.lines);
      const topY = slot.y + pad;
      const label = textBlock(`rog.profile.${p.id}.label`, { x: slot.x + pad, y: topY, w: cardInnerW, h: labelH }, p.label, pLabelFit.size, 1);
      const detail = textBlock(`rog.profile.${p.id}.detail`, { x: slot.x + pad, y: topY + labelH + 6, w: cardInnerW, h: detailH }, p.detail, pDetailFit.size, pDetailFit.lines);
      return { id: p.id, card: slot, label, detail };
    });

    const bottomHeaderH = textHeight(21, 1);
    const bottomHeader = textBlock("rog.steps.header", { x: bottomArea.x, y: bottomArea.y, w: bottomArea.w, h: bottomHeaderH }, copy.methodTitle, 21, 1, GLYPH.upper);
    const bottomCardsArea: Box = {
      x: bottomArea.x,
      y: bottomArea.y + bottomHeaderH + 12,
      w: bottomArea.w,
      h: bottomArea.h - bottomHeaderH - 12,
    };

    const stepSlots = stackBands(
      bottomCardsArea,
      stepsData.map((s) => ({ id: s.num, flex: 1 })),
      8,
    );
    const badgeW = 52;
    const stepInnerW = bottomCardsArea.w - pad * 2 - badgeW - 14;
    const sTitleFit = fitUniform(stepsData.map((s) => s.title), stepInnerW, [23, 22, 21, 20], 1);
    const sDescFit = fitUniform(stepsData.map((s) => s.desc), stepInnerW, [20], 1);

    const stepCards = stepsData.map((s) => {
      const slot = stepSlots[s.num];
      const titleH = textHeight(sTitleFit.size, 1);
      const descH = textHeight(sDescFit.size, 1);
      const contentH = titleH + 4 + descH;
      const topY = slot.y + Math.max(pad, (slot.h - contentH) / 2);

      const badgeBox: Box = { x: slot.x + pad, y: slot.y + (slot.h - 38) / 2, w: badgeW, h: 38 };
      const num = textBlock(`rog.step.${s.num}.num`, { x: badgeBox.x, y: badgeBox.y + (badgeBox.h - textHeight(20, 1)) / 2, w: badgeW, h: textHeight(20, 1) }, s.num, 20, 1);
      const title = textBlock(`rog.step.${s.num}.title`, { x: slot.x + pad + badgeW + 14, y: topY, w: stepInnerW, h: titleH }, s.title, sTitleFit.size, 1);
      const desc = textBlock(`rog.step.${s.num}.desc`, { x: slot.x + pad + badgeW + 14, y: topY + titleH + 4, w: stepInnerW, h: descH }, s.desc, sDescFit.size, 1);

      return { num: s.num, card: slot, badgeBox, numBlock: num, title, desc };
    });

    const blocks: LayoutBlock[] = [
      topHeader,
      ...profileCards.flatMap((c) => [c.label, c.detail]),
      bottomHeader,
      ...stepCards.flatMap((s) => [s.numBlock, s.title, s.desc]),
    ];

    return { title, body, topArea, bottomArea, profileCards, stepCards, blocks };
  }
}
