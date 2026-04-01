"use client";

import { Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

type DashboardPremiumRateChartProps = {
  premiumUsers: number;
  totalUsers: number;
};

const chartConfig = {
  premium: {
    label: "Premium",
    color: "hsl(var(--chart-1))",
  },
  standard: {
    label: "Standard",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function DashboardPremiumRateChart({
  premiumUsers,
  totalUsers,
}: DashboardPremiumRateChartProps): React.JSX.Element {
  const standardUsers = Math.max(totalUsers - premiumUsers, 0);
  const chartData = [
    { tier: "premium", value: premiumUsers, fill: "var(--color-premium)" },
    { tier: "standard", value: standardUsers, fill: "var(--color-standard)" },
  ];

  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="tier" hideLabel />} />
        <Pie data={chartData} dataKey="value" nameKey="tier" innerRadius={52} outerRadius={90} strokeWidth={2} />
        <ChartLegend content={<ChartLegendContent nameKey="tier" />} />
      </PieChart>
    </ChartContainer>
  );
}
