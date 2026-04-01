import {
  IconArrowDownRight,
  IconArrowRight,
  IconArrowUpRight,
} from "@tabler/icons-react";

import { cn } from "@/lib/utils";

type TrendPillProps = {
  current: number;
  previous: number;
  inverse?: boolean;
  className?: string;
};

function formatRate(current: number, previous: number): number {
  if (previous <= 0) {
    if (current <= 0) {
      return 0;
    }

    return 100;
  }

  return ((current - previous) / previous) * 100;
}

export function TrendPill({ current, previous, inverse = false, className }: TrendPillProps): React.JSX.Element {
  const rawRate = formatRate(current, previous);
  const effectiveRate = inverse ? -rawRate : rawRate;

  const isUp = effectiveRate > 0.1;
  const isDown = effectiveRate < -0.1;
  const normalized = Math.abs(effectiveRate).toFixed(1);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium",
        isUp && "border-emerald-200 text-emerald-600 dark:border-emerald-500/40 dark:text-emerald-400",
        isDown && "border-rose-200 text-rose-600 dark:border-rose-500/40 dark:text-rose-400",
        !isUp && !isDown && "border-zinc-200 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400",
        className
      )}
    >
      {isUp ? <IconArrowUpRight className="size-3.5" /> : null}
      {isDown ? <IconArrowDownRight className="size-3.5" /> : null}
      {!isUp && !isDown ? <IconArrowRight className="size-3.5" /> : null}
      <span>{isUp ? "+" : isDown ? "-" : ""}{normalized}%</span>
    </div>
  );
}
