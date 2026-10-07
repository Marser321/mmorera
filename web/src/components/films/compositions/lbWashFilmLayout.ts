import { safeArea, splitColumns, stackBands, type Box, type FilmFormatName } from "@/lib/filmLayout";

export type LbOpeningLayout = {
  markBox: Box;
  titleBox: Box;
};

export function lbOpeningLayout(format: FilmFormatName): LbOpeningLayout {
  const safe = safeArea(format);
  if (format === "portrait") {
    return {
      markBox: {
        x: safe.x + Math.round((safe.w - 360) / 2),
        y: safe.y + 180,
        w: 360,
        h: 360,
      },
      titleBox: {
        x: safe.x + 20,
        y: safe.y + 580,
        w: safe.w - 40,
        h: 240,
      },
    };
  }
  return {
    markBox: {
      x: safe.x + 120,
      y: safe.y + Math.round((safe.h - 380) / 2),
      w: 380,
      h: 380,
    },
    titleBox: {
      x: safe.x + 560,
      y: safe.y + Math.round((safe.h - 320) / 2),
      w: safe.w - 600,
      h: 320,
    },
  };
}

export type LbFleetLayout = {
  titleBox: Box;
  vansBox: Box;
  equationBox: Box;
};

export function lbFleetLayout(format: FilmFormatName): LbFleetLayout {
  const safe = safeArea(format);
  if (format === "portrait") {
    const bands = stackBands(safe, [
      { id: "title", h: 180 },
      { id: "vans", h: 360 },
      { id: "equation", flex: 1 },
    ], 24);
    return {
      titleBox: bands.title,
      vansBox: bands.vans,
      equationBox: bands.equation,
    };
  }
  const bands = stackBands(safe, [
    { id: "title", h: 110 },
    { id: "body", flex: 1 },
  ], 24);
  const [vansBox, equationBox] = splitColumns(bands.body, [1.1, 1], 36);
  return {
    titleBox: bands.title,
    vansBox,
    equationBox,
  };
}

export type LbQuoterLayout = {
  titleBox: Box;
  gridBox: Box;
  summaryBox: Box;
};

export function lbQuoterLayout(format: FilmFormatName): LbQuoterLayout {
  const safe = safeArea(format);
  if (format === "portrait") {
    const bands = stackBands(safe, [
      { id: "title", h: 170 },
      { id: "grid", h: 420 },
      { id: "summary", flex: 1 },
    ], 20);
    return {
      titleBox: bands.title,
      gridBox: bands.grid,
      summaryBox: bands.summary,
    };
  }
  const bands = stackBands(safe, [
    { id: "title", h: 100 },
    { id: "body", flex: 1 },
  ], 24);
  const [gridBox, summaryBox] = splitColumns(bands.body, [1.3, 0.9], 32);
  return {
    titleBox: bands.title,
    gridBox,
    summaryBox,
  };
}

export type LbCrewLayout = {
  titleBox: Box;
  phoneBox: Box;
  crmFeedBox: Box;
};

export function lbCrewLayout(format: FilmFormatName): LbCrewLayout {
  const safe = safeArea(format);
  if (format === "portrait") {
    const bands = stackBands(safe, [
      { id: "title", h: 170 },
      { id: "phone", flex: 1.2 },
      { id: "crm", flex: 0.8 },
    ], 20);
    return {
      titleBox: bands.title,
      phoneBox: bands.phone,
      crmFeedBox: bands.crm,
    };
  }
  const bands = stackBands(safe, [
    { id: "title", h: 100 },
    { id: "body", flex: 1 },
  ], 24);
  const [phoneBox, crmFeedBox] = splitColumns(bands.body, [0.9, 1.1], 36);
  return {
    titleBox: bands.title,
    phoneBox,
    crmFeedBox,
  };
}

