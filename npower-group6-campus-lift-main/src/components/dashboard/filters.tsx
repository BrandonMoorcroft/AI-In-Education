import { Chip } from "@/components/ui/chip";
import { cube, type Filter } from "@/lib/cube";
import { cn } from "@/lib/utils";

type Props = {
  value: Filter;
  onChange: (next: Filter) => void;
  tone?: "accent" | "compare";
  label: string;
};

function Row({
  title,
  options,
  selected,
  onSelect,
  tone,
}: {
  title: string;
  options: string[];
  selected: string | null;
  onSelect: (v: string | null) => void;
  tone: "accent" | "compare";
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        <Chip active={selected === null} tone={tone} onClick={() => onSelect(null)}>
          All
        </Chip>
        {options.map((opt) => (
          <Chip key={opt} active={selected === opt} tone={tone} onClick={() => onSelect(opt)}>
            {opt}
          </Chip>
        ))}
      </div>
    </div>
  );
}

export function FilterPanel({ value, onChange, tone = "accent", label }: Props) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-xl border bg-surface p-4 shadow-card sm:p-5",
        tone === "compare" && "border-compare/30",
      )}
    >
      <p className="font-display text-lg text-ink">{label}</p>
      <Row
        title="Major"
        options={cube.majors}
        selected={value.major}
        tone={tone}
        onSelect={(major) => onChange({ ...value, major })}
      />
      <Row
        title="Year of study"
        options={cube.years}
        selected={value.year}
        tone={tone}
        onSelect={(year) => onChange({ ...value, year })}
      />
      <Row
        title="Use case"
        options={cube.uses}
        selected={value.use}
        tone={tone}
        onSelect={(use) => onChange({ ...value, use })}
      />
    </section>
  );
}
