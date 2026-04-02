"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardDauTrendPoint } from "@/lib/dashboard/types";

type DashboardDauChartProps = {
  data: DashboardDauTrendPoint[];
};

const chartConfig = {
  dau: {
    label: "DAU",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

function formatAxisDate(value: string): string {
  return value.slice(5);
}

export function DashboardDauChart({ data }: DashboardDauChartProps): React.JSX.Element {
  return (
    <ChartContainer config={chartConfig} className="h-[260px] w-full">
      <LineChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatAxisDate} />
        <YAxis allowDecimals={false} width={30} tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Line
          dataKey="dau"
          type="monotone"
          stroke="var(--color-dau)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
