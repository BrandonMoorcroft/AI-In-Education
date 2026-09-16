import type { Rollup } from "@/lib/cube";
import { cn, fmtNum, fmtSigned } from "@/lib/utils";

function Row({
  label,
  a,
  b,
  emphasize,
}: {
  label: string;
  a: string;
  b: string;
  emphasize?: boolean;
}) {
  return (
    <tr className={cn(emphasize && "bg-accent-soft/70")}>
      <th className="px-3 py-2.5 text-left font-medium text-ink-soft">{label}</th>
      <td className="px-3 py-2.5 text-right tabular text-accent">{a}</td>
      <td className="px-3 py-2.5 text-right tabular text-compare">{b}</td>
    </tr>
  );
}

export function CompareTable({ a, b }: { a: Rollup; b: Rollup }) {
  const preGap = a.pre - b.pre;
  const gapLabel =
    Math.abs(preGap) < 0.02
      ? "Pre GPA starts in the same place"
      : `Pre GPA gap ${fmtSigned(preGap)} — the groups do not start even`;

  return (
    <section className="overflow-hidden rounded-xl border bg-surface shadow-card">
      <div className="flex flex-col gap-1 border-b border-line px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 className="font-display text-xl text-ink">A vs B at a glance</h2>
        <p className="text-sm text-ink-soft">{gapLabel}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-xs font-medium tracking-wide text-muted uppercase">
              <th className="px-3 py-2 text-left">Metric</th>
              <th className="px-3 py-2 text-right text-accent">Group A</th>
              <th className="px-3 py-2 text-right text-compare">Group B</th>
            </tr>
          </thead>
          <tbody>
            <Row emphasize label="Pre-semester GPA" a={a.pre.toFixed(2)} b={b.pre.toFixed(2)} />
            <Row label="Post-semester GPA" a={a.post.toFixed(2)} b={b.post.toFixed(2)} />
            <Row label="GPA lift" a={fmtSigned(a.gpaChange)} b={fmtSigned(b.gpaChange)} />
            <Row label="Share who improved" a={`${fmtNum(a.pctImproved, 1)}%`} b={`${fmtNum(b.pctImproved, 1)}%`} />
            <Row label="Weekly GenAI hours" a={fmtNum(a.hours, 1)} b={fmtNum(b.hours, 1)} />
            <Row label="Students in cut" a={fmtNum(a.n)} b={fmtNum(b.n)} />
          </tbody>
        </table>
      </div>
    </section>
  );
}
