import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { FilterPanel } from "@/components/dashboard/filters";
import { CompareTable } from "@/components/dashboard/compare-table";
import {
  BurnoutUsage,
  GpaShift,
  MajorHeat,
  SkillBars,
  UseRank,
  YearLines,
} from "@/components/dashboard/charts";
import { Insights } from "@/components/dashboard/insights";
import { KpiRow } from "@/components/dashboard/kpis";
import { cube, emptyFilter, filterLabel, rollup, type Filter } from "@/lib/cube";
import { cn } from "@/lib/utils";

export default function App() {
  const [a, setA] = useState<Filter>(emptyFilter);
  const [b, setB] = useState<Filter>({ major: "Humanities", year: null, use: null });
  const [compare, setCompare] = useState(false);

  const statsA = useMemo(() => rollup(cube.cells, a), [a]);
  const statsB = useMemo(() => rollup(cube.cells, b), [b]);
  const labelA = filterLabel(a);
  const labelB = filterLabel(b);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <header className="border-b border-line bg-navy text-navy-fg">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.18em] text-accent-soft uppercase">
            NPower Group 6 · 50,000 students
          </p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl leading-tight tracking-tight sm:text-5xl">Campus Lift</h1>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-accent-soft">
                GPA went up. Hours are not why. Filter by major, year, and use case — then compare two student groups to see which GenAI strategies actually move grades.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent-fg px-5 text-sm font-medium text-navy transition-colors duration-150 hover:bg-surface"
              >
                <ExternalLink className="size-4" aria-hidden />
                Open in new tab
              </a>
              <button
                type="button"
                onClick={() => setCompare((v) => !v)}
                className={cn(
                  "min-h-11 rounded-full px-5 text-sm font-medium transition-colors duration-150",
                  compare ? "bg-accent-fg text-navy" : "bg-accent text-accent-fg",
                )}
              >
                {compare ? "Hide comparison" : "Compare groups"}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className={cn("grid gap-4", compare ? "lg:grid-cols-2" : "grid-cols-1")}>
          <FilterPanel label="Group A" value={a} onChange={setA} />
          {compare ? <FilterPanel label="Group B" value={b} onChange={setB} tone="compare" /> : null}
        </div>

        {compare ? (
          <>
            <GpaShift a={statsA} b={statsB} labelA={labelA} labelB={labelB} />
            <CompareTable a={statsA} b={statsB} />
          </>
        ) : (
          <KpiRow stats={statsA} name="Cohort" />
        )}

        <div className="grid items-start gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-5 lg:col-span-2">
            {compare ? null : <GpaShift a={statsA} labelA={labelA} />}
            <UseRank a={statsA} b={compare ? statsB : null} />

            {compare ? (
              <div className="rounded-xl border border-dashed border-line bg-bg-subtle p-3 sm:p-4">
                <p className="mb-3 text-xs font-medium tracking-wide text-muted uppercase">
                  Group A context · not part of this comparison
                </p>
                <div className="grid gap-4 opacity-45 saturate-50 md:grid-cols-2">
                  <SkillBars a={statsA} />
                  <BurnoutUsage a={statsA} />
                  <YearLines a={statsA} />
                  <MajorHeat a={statsA} />
                </div>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <SkillBars a={statsA} />
                  <BurnoutUsage a={statsA} />
                  <YearLines a={statsA} />
                </div>
                <MajorHeat a={statsA} />
              </>
            )}
          </div>
          <Insights
            stats={statsA}
            filter={a}
            other={compare ? statsB : null}
            otherFilter={compare ? b : undefined}
          />
        </div>
      </div>
    </main>
  );
}
