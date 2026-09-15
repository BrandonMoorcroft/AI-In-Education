import { bestUse, filterLabel, worstUse, type Filter, type Rollup } from "@/lib/cube";
import { fmtNum, fmtSigned } from "@/lib/utils";

export function Insights({
  stats,
  filter,
  other,
  otherFilter,
}: {
  stats: Rollup;
  filter: Filter;
  other?: Rollup | null;
  otherFilter?: Filter;
}) {
  const best = bestUse(stats);
  const worst = worstUse(stats);
  const adv = stats.skill.Advanced;
  const beg = stats.skill.Beginner;
  const high = stats.burnout.High;
  const otherBest = other ? bestUse(other) : null;

  return (
    <aside className="flex flex-col gap-4 rounded-xl bg-navy p-5 text-navy-fg shadow-card lg:sticky lg:top-4">
      <p className="text-xs font-medium tracking-[0.16em] text-accent-soft uppercase">
        {other ? "Comparison read" : "What works here"}
      </p>
      <h2 className="font-display text-2xl leading-tight">
        {other && otherFilter ? `${filterLabel(filter)} vs ${filterLabel(otherFilter)}` : filterLabel(filter)}
      </h2>
      <ul className="flex flex-col gap-3 text-sm leading-relaxed text-accent-soft">
        {other ? (
          <>
            <li>
              Pre GPA is the baseline. A starts at {stats.pre.toFixed(2)}; B starts at {other.pre.toFixed(2)} (
              {fmtSigned(stats.pre - other.pre)}).
            </li>
            <li>
              Lift is {fmtSigned(stats.gpaChange)} for A vs {fmtSigned(other.gpaChange)} for B — after that different start.
            </li>
            <li>
              {best && otherBest
                ? `Strongest use case stays ${best.name} in A (${fmtSigned(best.gpaChange)}) and ${otherBest.name} in B (${fmtSigned(otherBest.gpaChange)}).`
                : null}
            </li>
            <li>
              Hours: A {fmtNum(stats.hours, 1)} vs B {fmtNum(other.hours, 1)}. Improved: {fmtNum(stats.pctImproved, 1)}% vs{" "}
              {fmtNum(other.pctImproved, 1)}%.
            </li>
          </>
        ) : (
          <>
            <li>
              {fmtNum(stats.n)} students. Mean GPA change {fmtSigned(stats.gpaChange)}. {fmtNum(stats.pctImproved, 1)}% improved.
            </li>
            {best ? (
              <li>
                Strongest use case is <span className="text-navy-fg">{best.name}</span> at {fmtSigned(best.gpaChange)} GPA.
                {worst && worst.name !== best.name ? ` Weakest is ${worst.name} at ${fmtSigned(worst.gpaChange)}.` : ""}
              </li>
            ) : null}
            {adv && beg ? (
              <li>
                Advanced prompting lifts {fmtSigned(adv.gpaChange)} versus beginner {fmtSigned(beg.gpaChange)}. Skill is a multiplier, not extra hours.
              </li>
            ) : null}
            {high ? (
              <li>
                High-burnout students average {fmtNum(high.hours ?? 0, 1)} GenAI hours/week — {fmtNum(stats.highBurnout, 0)}% of this cut.
              </li>
            ) : null}
            <li>Study time still sits at {fmtNum(stats.study, 1)} hrs/week. Do not swap it out for tool time.</li>
          </>
        )}
      </ul>
    </aside>
  );
}
