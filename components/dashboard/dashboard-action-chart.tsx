"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardUserActionItem } from "@/lib/dashboard/types";

type DashboardActionChartProps = {
  data: DashboardUserActionItem[];
};

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

function toChartData(data: DashboardUserActionItem[]): Array<{ actionType: string; count: number }> {
  return data.slice(0, 8).map((item) => ({
    actionType: item.actionType,
    count: item.count,
  }));
}

function shortenActionType(value: string): string {
  return value.length > 14 ? `${value.slice(0, 14)}...` : value;
}

export function DashboardActionChart({ data }: DashboardActionChartProps): React.JSX.Element {
  const chartData = toChartData(data);

  return (
    <ChartContainer config={chartConfig} className="h-[320px] w-full">
      <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 8 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          type="category"
          dataKey="actionType"
          tickLine={false}
          axisLine={false}
          tickFormatter={shortenActionType}
          width={120}
        />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
