import type { Rollup } from "@/lib/cube";
import { cn, fmtNum, fmtSigned } from "@/lib/utils";

function Card({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: string;
  hint: string;
  warn?: boolean;
}) {
  return (
    <article className="flex min-h-28 flex-col justify-between rounded-xl border bg-surface p-4 shadow-card sm:p-5">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{label}</p>
      <p className={cn("font-display text-4xl tabular tracking-tight", warn ? "text-warn" : "text-ink")}>
        {value}
      </p>
      <p className="text-sm text-ink-soft">{hint}</p>
    </article>
  );
}

export function KpiRow({ stats, name }: { stats: Rollup; name: string }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Card
        label={`${name} · GPA lift`}
        value={fmtSigned(stats.gpaChange)}
        hint={`Pre ${stats.pre.toFixed(2)} → post ${stats.post.toFixed(2)}`}
      />
      <Card
        label="Weekly GenAI hours"
        value={fmtNum(stats.hours, 1)}
        hint={`${fmtNum(stats.study, 1)} hrs still spent studying`}
      />
      <Card
        label="Students who improved"
        value={`${fmtNum(stats.pctImproved, 1)}%`}
        hint={`${fmtNum(stats.n)} in this cut · ${fmtNum(stats.highBurnout, 0)}% high burnout`}
        warn={stats.highBurnout >= 40}
      />
    </div>
  );
}
