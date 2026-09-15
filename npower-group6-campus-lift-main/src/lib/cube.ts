import raw from "@/data/campus-lift.json";

export type NestedStat = {
  n: number;
  gpaChange: number;
  hours?: number;
  retention?: number;
};

export type Cell = {
  major: string;
  year: string;
  use: string;
  n: number;
  gpaChange: number;
  pctImproved: number;
  hours: number;
  study: number;
  pre: number;
  post: number;
  retention: number;
  highBurnout: number;
  skill: Record<string, NestedStat>;
  burnout: Record<string, NestedStat>;
  preHist: number[];
  postHist: number[];
  hourHist: number[];
};

export type Cube = {
  majors: string[];
  years: string[];
  uses: string[];
  skills: string[];
  burns: string[];
  gpaEdges: number[];
  hourEdges: number[];
  cells: Cell[];
};

export type Filter = {
  major: string | null;
  year: string | null;
  use: string | null;
};

export const emptyFilter = (): Filter => ({ major: null, year: null, use: null });

export const cube = raw as Cube;

export function matches(cell: Cell, f: Filter) {
  if (f.major && cell.major !== f.major) return false;
  if (f.year && cell.year !== f.year) return false;
  if (f.use && cell.use !== f.use) return false;
  return true;
}

export function filterLabel(f: Filter) {
  const parts = [f.major, f.year, f.use].filter(Boolean);
  return parts.length ? parts.join(" · ") : "All students";
}

function wavg(sum: number, n: number) {
  return n ? sum / n : 0;
}

export type Rollup = {
  n: number;
  gpaChange: number;
  pctImproved: number;
  hours: number;
  study: number;
  pre: number;
  post: number;
  retention: number;
  highBurnout: number;
  skill: Record<string, NestedStat>;
  burnout: Record<string, NestedStat>;
  preHist: number[];
  postHist: number[];
  hourHist: number[];
  byUse: { name: string; n: number; gpaChange: number; hours: number }[];
  byMajor: { name: string; n: number; hours: number; gpaChange: number }[];
  byYear: { name: string; n: number; hours: number; gpaChange: number; highBurnout: number }[];
  heatmap: { major: string; year: string; hours: number; gpaChange: number; n: number }[];
};

export function rollup(cells: Cell[], f: Filter): Rollup {
  const subset = cells.filter((c) => matches(c, f));
  const histLen = cube.gpaEdges.length - 1;
  const hourLen = cube.hourEdges.length - 1;

  const acc: Rollup = {
    n: 0,
    gpaChange: 0,
    pctImproved: 0,
    hours: 0,
    study: 0,
    pre: 0,
    post: 0,
    retention: 0,
    highBurnout: 0,
    skill: Object.fromEntries(cube.skills.map((s) => [s, { n: 0, gpaChange: 0, hours: 0, retention: 0 }])),
    burnout: Object.fromEntries(cube.burns.map((b) => [b, { n: 0, gpaChange: 0, hours: 0 }])),
    preHist: Array(histLen).fill(0),
    postHist: Array(histLen).fill(0),
    hourHist: Array(hourLen).fill(0),
    byUse: [],
    byMajor: [],
    byYear: [],
    heatmap: [],
  };

  const useMap = new Map<string, { n: number; gpa: number; hours: number }>();
  const majorMap = new Map<string, { n: number; gpa: number; hours: number }>();
  const yearMap = new Map<string, { n: number; gpa: number; hours: number; burn: number }>();
  const heatMap = new Map<string, { major: string; year: string; n: number; hours: number; gpa: number }>();

  for (const c of subset) {
    acc.n += c.n;
    acc.gpaChange += c.gpaChange * c.n;
    acc.pctImproved += c.pctImproved * c.n;
    acc.hours += c.hours * c.n;
    acc.study += c.study * c.n;
    acc.pre += c.pre * c.n;
    acc.post += c.post * c.n;
    acc.retention += c.retention * c.n;
    acc.highBurnout += c.highBurnout * c.n;
    for (let i = 0; i < histLen; i++) {
      acc.preHist[i] += c.preHist[i] ?? 0;
      acc.postHist[i] += c.postHist[i] ?? 0;
    }
    for (let i = 0; i < hourLen; i++) acc.hourHist[i] += c.hourHist[i] ?? 0;

    for (const s of cube.skills) {
      const row = c.skill[s];
      if (!row) continue;
      const t = acc.skill[s];
      t.n += row.n;
      t.gpaChange += row.gpaChange * row.n;
      t.hours = (t.hours ?? 0) + (row.hours ?? 0) * row.n;
      t.retention = (t.retention ?? 0) + (row.retention ?? 0) * row.n;
    }
    for (const b of cube.burns) {
      const row = c.burnout[b];
      if (!row) continue;
      const t = acc.burnout[b];
      t.n += row.n;
      t.gpaChange += row.gpaChange * row.n;
      t.hours = (t.hours ?? 0) + (row.hours ?? 0) * row.n;
    }

    const u = useMap.get(c.use) ?? { n: 0, gpa: 0, hours: 0 };
    u.n += c.n;
    u.gpa += c.gpaChange * c.n;
    u.hours += c.hours * c.n;
    useMap.set(c.use, u);

    const m = majorMap.get(c.major) ?? { n: 0, gpa: 0, hours: 0 };
    m.n += c.n;
    m.gpa += c.gpaChange * c.n;
    m.hours += c.hours * c.n;
    majorMap.set(c.major, m);

    const y = yearMap.get(c.year) ?? { n: 0, gpa: 0, hours: 0, burn: 0 };
    y.n += c.n;
    y.gpa += c.gpaChange * c.n;
    y.hours += c.hours * c.n;
    y.burn += c.highBurnout * c.n;
    yearMap.set(c.year, y);

    const hk = `${c.major}|${c.year}`;
    const h = heatMap.get(hk) ?? { major: c.major, year: c.year, n: 0, hours: 0, gpa: 0 };
    h.n += c.n;
    h.hours += c.hours * c.n;
    h.gpa += c.gpaChange * c.n;
    heatMap.set(hk, h);
  }

  acc.gpaChange = wavg(acc.gpaChange, acc.n);
  acc.pctImproved = wavg(acc.pctImproved, acc.n);
  acc.hours = wavg(acc.hours, acc.n);
  acc.study = wavg(acc.study, acc.n);
  acc.pre = wavg(acc.pre, acc.n);
  acc.post = wavg(acc.post, acc.n);
  acc.retention = wavg(acc.retention, acc.n);
  acc.highBurnout = wavg(acc.highBurnout, acc.n);

  for (const s of cube.skills) {
    const t = acc.skill[s];
    t.gpaChange = wavg(t.gpaChange, t.n);
    t.hours = wavg(t.hours ?? 0, t.n);
    t.retention = wavg(t.retention ?? 0, t.n);
  }
  for (const b of cube.burns) {
    const t = acc.burnout[b];
    t.gpaChange = wavg(t.gpaChange, t.n);
    t.hours = wavg(t.hours ?? 0, t.n);
  }

  acc.byUse = cube.uses.map((name) => {
    const r = useMap.get(name) ?? { n: 0, gpa: 0, hours: 0 };
    return { name, n: r.n, gpaChange: wavg(r.gpa, r.n), hours: wavg(r.hours, r.n) };
  }).sort((a, b) => b.gpaChange - a.gpaChange);

  acc.byMajor = cube.majors.map((name) => {
    const r = majorMap.get(name) ?? { n: 0, gpa: 0, hours: 0 };
    return { name, n: r.n, gpaChange: wavg(r.gpa, r.n), hours: wavg(r.hours, r.n) };
  });

  acc.byYear = cube.years.map((name) => {
    const r = yearMap.get(name) ?? { n: 0, gpa: 0, hours: 0, burn: 0 };
    return {
      name,
      n: r.n,
      gpaChange: wavg(r.gpa, r.n),
      hours: wavg(r.hours, r.n),
      highBurnout: wavg(r.burn, r.n),
    };
  });

  acc.heatmap = [...heatMap.values()].map((h) => ({
    major: h.major,
    year: h.year,
    n: h.n,
    hours: wavg(h.hours, h.n),
    gpaChange: wavg(h.gpa, h.n),
  }));

  return acc;
}

export function histPoints(edges: number[], counts: number[], key: string) {
  return counts.map((count, i) => ({
    label: edges[i].toFixed(1),
    [key]: count,
    mid: (edges[i] + edges[i + 1]) / 2,
  }));
}

export function bestUse(r: Rollup) {
  return r.byUse.find((u) => u.n > 0) ?? null;
}

export function worstUse(r: Rollup) {
  const withN = r.byUse.filter((u) => u.n > 0);
  return withN.length ? withN[withN.length - 1] : null;
}
