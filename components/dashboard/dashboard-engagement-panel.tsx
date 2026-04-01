"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardTrendPoint } from "@/lib/dashboard/types";

type DashboardEngagementPanelLabels = {
  title: string;
  impressions: string;
  engagementRate: string;
  replies: string;
  posts: string;
  growth: string;
};

type DashboardEngagementPanelProps = {
  trend: DashboardTrendPoint[];
  locale: string;
  labels: DashboardEngagementPanelLabels;
};

type EngagementPoint = {
  day: string;
  impressions: number;
};

const chartConfig = {
  impressions: {
    label: "Impressions",
    color: "#f1f5f9",
  },
} satisfies ChartConfig;

function compactNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function percentDelta(current: number, previous: number): string {
  if (previous <= 0) {
    return "+0%";
  }

  const delta = ((current - previous) / previous) * 100;
  const normalized = Number.isFinite(delta) ? delta : 0;
  return `${normalized >= 0 ? "+" : ""}${normalized.toFixed(1)}%`;
}

function toEngagementData(trend: DashboardTrendPoint[], locale: string): EngagementPoint[] {
  const recent = trend.slice(-7);

  return recent.map((item) => ({
    day: new Date(item.date).toLocaleDateString(locale, { weekday: "short" }),
    impressions: item.posts * 42000 + item.replies * 22000,
  }));
}

export function DashboardEngagementPanel({
  trend,
  locale,
  labels,
}: DashboardEngagementPanelProps): React.JSX.Element {
  const recent = trend.slice(-7);
  const previous = trend.slice(-14, -7);

  const currentImpressions = recent.reduce((sum, item) => sum + item.posts * 42000 + item.replies * 22000, 0);
  const previousImpressions = previous.reduce((sum, item) => sum + item.posts * 42000 + item.replies * 22000, 0);

  const currentEngagementRate = recent.length
    ? (recent.reduce((sum, item) => sum + item.replies, 0) /
        Math.max(recent.reduce((sum, item) => sum + item.posts, 0), 1)) *
      100
    : 0;
  const previousEngagementRate = previous.length
    ? (previous.reduce((sum, item) => sum + item.replies, 0) /
        Math.max(previous.reduce((sum, item) => sum + item.posts, 0), 1)) *
      100
    : 0;

  const chartData = toEngagementData(trend, locale);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-b from-white via-zinc-50 to-white px-5 py-5 text-zinc-900 shadow-sm [--eng-line:#18181b] [--eng-fill:#18181b] [--eng-grid:rgba(39,39,42,0.18)] [--eng-axis:#52525b] dark:border-white/10 dark:bg-gradient-to-b dark:from-black dark:via-zinc-950 dark:to-black dark:text-zinc-100 dark:shadow-lg dark:[--eng-line:#fafafa] dark:[--eng-fill:#ffffff] dark:[--eng-grid:rgba(161,161,170,0.2)] dark:[--eng-axis:#a1a1aa]">
      <h3 className="text-lg font-semibold">{labels.title}</h3>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{labels.impressions}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{compactNumber(currentImpressions, locale)}</span>
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{percentDelta(currentImpressions, previousImpressions)}</span>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{labels.engagementRate}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-bold">{currentEngagementRate.toFixed(1)}%</span>
            <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">{percentDelta(currentEngagementRate, previousEngagementRate)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <ChartContainer config={chartConfig} className="h-[260px] w-full">
          <AreaChart data={chartData} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--eng-fill)" stopOpacity={0.38} />
                <stop offset="100%" stopColor="var(--eng-fill)" stopOpacity={0.04} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--eng-grid)" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} stroke="var(--eng-axis)" />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={42}
              stroke="var(--eng-axis)"
              tickFormatter={(value) => compactNumber(Number(value), locale)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              type="monotone"
              dataKey="impressions"
              stroke="var(--eng-line)"
              strokeWidth={2}
              fill="url(#engagementFill)"
              fillOpacity={1}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      <div className="mt-4 border-t border-zinc-200 pt-4 dark:border-white/10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{labels.impressions}</p>
            <p className="mt-1 text-2xl font-semibold">{currentImpressions.toLocaleString(locale)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{labels.replies}</p>
            <p className="mt-1 text-2xl font-semibold">{recent.reduce((sum, item) => sum + item.replies, 0).toLocaleString(locale)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{labels.posts}</p>
            <p className="mt-1 text-2xl font-semibold">{recent.reduce((sum, item) => sum + item.posts, 0).toLocaleString(locale)}</p>
          </div>
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{labels.growth}</p>
            <p className="mt-1 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">{percentDelta(currentImpressions, previousImpressions)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
