import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipProps = {
  active?: boolean;
  tone?: "accent" | "compare";
  children: ReactNode;
  onClick?: () => void;
};

export function Chip({ active, tone = "accent", children, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-full border px-3.5 text-sm font-medium transition-colors duration-150",
        active && tone === "accent" && "border-accent bg-accent text-accent-fg",
        active && tone === "compare" && "border-compare bg-compare text-navy-fg",
        !active && "border-line bg-surface text-ink-soft hover:border-ink/25 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
