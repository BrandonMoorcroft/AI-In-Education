import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartFrame } from "@/components/dashboard/chart-frame";
import { cube, histPoints, type Rollup } from "@/lib/cube";
import { chart } from "@/lib/chart-colors";
import { cn, fmtNum, fmtSigned } from "@/lib/utils";

const tooltipStyle = {
  background: chart.surface,
  border: `1px solid ${chart.line}`,
  borderRadius: 8,
  fontSize: 12,
  color: chart.ink,
};

const tick = { fill: chart.muted, fontSize: 11 };
const tickInk = { fill: chart.inkSoft, fontSize: 12 };

function Panel({
  title,
  kicker,
  children,
  tone,
}: {
  title: string;
  kicker?: string;
  children: ReactNode;
  tone?: "a" | "b";
}) {
  return (
    <section
      className={cn(
        "flex min-h-72 flex-col rounded-xl border bg-surface p-4 shadow-card sm:p-5",
        tone === "a" && "border-accent/40",
        tone === "b" && "border-compare/40",
      )}
    >
      {kicker ? (
        <p className={cn("text-xs font-medium tracking-wide uppercase", tone === "b" ? "text-compare" : "text-accent")}>
          {kicker}
        </p>
      ) : null}
      <h2 className="mb-3 font-display text-xl text-ink">{title}</h2>
      <div className="min-h-52 min-w-0 flex-1">{children}</div>
    </section>
  );
}

function GpaPanel({
  stats,
  tone,
  kicker,
}: {
  stats: Rollup;
  tone: "a" | "b";
  kicker: string;
}) {
  const data = histPoints(cube.gpaEdges, stats.preHist, "pre").map((row, i) => ({
    ...row,
    post: stats.postHist[i] ?? 0,
  }));
  const preFill = tone === "a" ? chart.accentSoft : chart.compareSoft;
  const postFill = tone === "a" ? chart.accent : chart.compare;
  return (
    <Panel tone={tone} kicker={kicker} title={`Pre ${stats.pre.toFixed(2)} → post ${stats.post.toFixed(2)}`}>
      <ChartFrame>
        <BarChart data={data} barCategoryGap="12%">
          <CartesianGrid vertical={false} stroke={chart.line} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="pre" name="Pre GPA" fill={preFill} stroke={postFill} strokeWidth={1} radius={[3, 3, 0, 0]} />
          <Bar dataKey="post" name="Post GPA" fill={postFill} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ChartFrame>
    </Panel>
  );
}

export function GpaShift({ a, b, labelA, labelB }: { a: Rollup; b?: Rollup | null; labelA?: string; labelB?: string }) {
  if (!b) {
    return <GpaPanel stats={a} tone="a" kicker="Before and after GPA" />;
  }

  const data = histPoints(cube.gpaEdges, a.preHist, "preA").map((row, i) => ({
    label: row.label,
    preA: a.preHist[i] ?? 0,
    preB: b.preHist[i] ?? 0,
    postA: a.postHist[i] ?? 0,
    postB: b.postHist[i] ?? 0,
  }));

  const nameA = labelA ?? "A";
  const nameB = labelB ?? "B";

  return (
    <Panel title="Pre and post GPA">
      <p className="mb-3 text-sm text-ink-soft">
        A {nameA}: pre {a.pre.toFixed(2)} → post {a.post.toFixed(2)}. B {nameB}: pre {b.pre.toFixed(2)} → post {b.post.toFixed(2)}.
      </p>
      <ChartFrame>
        <BarChart data={data} barCategoryGap="18%" barGap={1}>
          <CartesianGrid vertical={false} stroke={chart.line} />
          <XAxis dataKey="label" tick={tick} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Bar dataKey="preA" name="A pre" fill={chart.accentSoft} stroke={chart.accent} strokeWidth={1} radius={[2, 2, 0, 0]} />
          <Bar dataKey="preB" name="B pre" fill={chart.compareSoft} stroke={chart.compare} strokeWidth={1} radius={[2, 2, 0, 0]} />
          <Bar dataKey="postA" name="A post" fill={chart.accent} radius={[2, 2, 0, 0]} />
          <Bar dataKey="postB" name="B post" fill={chart.compare} radius={[2, 2, 0, 0]} />
        </BarChart>
      </ChartFrame>
    </Panel>
  );
}

export function UseRank({ a, b }: { a: Rollup; b?: Rollup | null }) {
  const data = cube.uses
    .map((name) => {
      const aa = a.byUse.find((u) => u.name === name);
      const bb = b?.byUse.find((u) => u.name === name);
      return { name, a: aa?.gpaChange ?? 0, b: bb?.gpaChange ?? 0 };
    })
    .sort((x, y) => y.a - x.a);
  return (
    <Panel title="Which use cases lift GPA">
      <ChartFrame>
        <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid horizontal={false} stroke={chart.line} />
          <XAxis type="number" tick={tick} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={96} tick={tickInk} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmtSigned(Number(v))} />
          <Bar dataKey="a" name="Group A" fill={chart.accent} radius={[0, 4, 4, 0]} />
          {b ? <Bar dataKey="b" name="Group B" fill={chart.compare} radius={[0, 4, 4, 0]} /> : null}
        </BarChart>
      </ChartFrame>
    </Panel>
  );
}

export function SkillBars({ a }: { a: Rollup }) {
  const data = cube.skills.map((name) => ({
    name,
    lift: a.skill[name]?.gpaChange ?? 0,
  }));
  return (
    <Panel title="Prompt skill vs GPA lift">
      <ChartFrame>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke={chart.line} />
          <XAxis dataKey="name" tick={tickInk} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => fmtSigned(Number(v))} />
          <Bar dataKey="lift" name="GPA change" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.name === "Advanced" ? chart.accent : chart.navy} />
            ))}
          </Bar>
        </BarChart>
      </ChartFrame>
    </Panel>
  );
}

export function BurnoutUsage({ a }: { a: Rollup }) {
  const data = cube.burns.map((name) => ({
    name,
    hours: a.burnout[name]?.hours ?? 0,
  }));
  return (
    <Panel title="Burnout and weekly hours">
      <ChartFrame>
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke={chart.line} />
          <XAxis dataKey="name" tick={tickInk} axisLine={false} tickLine={false} />
          <YAxis tick={tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${fmtNum(Number(v), 1)} hrs`} />
          <Bar dataKey="hours" name="Avg hours" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.name === "High" ? chart.warn : chart.accent} />
            ))}
          </Bar>
        </BarChart>
      </ChartFrame>
      <p className="mt-2 text-sm text-ink-soft">
        High burnout is {fmtNum(a.highBurnout, 0)}% of this cut. Hours rise with strain, not with extra GPA.
      </p>
    </Panel>
  );
}

export function YearLines({ a }: { a: Rollup }) {
  return (
    <Panel title="Lift and burnout by year">
      <ChartFrame>
        <LineChart data={a.byYear}>
          <CartesianGrid stroke={chart.line} />
          <XAxis dataKey="name" tick={tickInk} axisLine={false} tickLine={false} />
          <YAxis yAxisId="l" tick={tick} axisLine={false} tickLine={false} />
          <YAxis yAxisId="r" orientation="right" tick={tick} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line yAxisId="l" type="monotone" dataKey="gpaChange" name="GPA change" stroke={chart.accent} strokeWidth={2.4} dot />
          <Line yAxisId="r" type="monotone" dataKey="highBurnout" name="% high burnout" stroke={chart.warn} strokeWidth={2.4} dot />
        </LineChart>
      </ChartFrame>
    </Panel>
  );
}

export function MajorHeat({ a }: { a: Rollup }) {
  const rows = cube.majors.filter((m) => a.heatmap.some((h) => h.major === m && h.n > 0));
  const cols = cube.years.filter((y) => a.heatmap.some((h) => h.year === y && h.n > 0));
  const maxH = Math.max(...a.heatmap.map((h) => h.hours), 1);
  return (
    <Panel title="How majors and years use GenAI">
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-sm">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-medium text-muted">Major</th>
              {cols.map((y) => (
                <th key={y} className="px-1 py-1 text-center font-medium text-muted">
                  {y.slice(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((m) => (
              <tr key={m}>
                <td className="pr-2 text-ink-soft">{m}</td>
                {cols.map((y) => {
                  const cell = a.heatmap.find((h) => h.major === m && h.year === y);
                  const t = cell ? cell.hours / maxH : 0;
                  return (
                    <td key={y}>
                      <div
                        className="flex h-11 items-center justify-center rounded-md text-xs font-medium tabular"
                        style={{
                          background: `color-mix(in oklab, ${chart.accent} ${Math.round(t * 72)}%, ${chart.accentSoft})`,
                          color: t > 0.62 ? chart.surface : chart.ink,
                        }}
                        title={cell ? `${fmtNum(cell.hours, 1)} hrs · GPA ${fmtSigned(cell.gpaChange)}` : "—"}
                      >
                        {cell ? fmtNum(cell.hours, 1) : "—"}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm text-ink-soft">Cell = mean weekly GenAI hours. Darker teal is heavier use.</p>
    </Panel>
  );
}
