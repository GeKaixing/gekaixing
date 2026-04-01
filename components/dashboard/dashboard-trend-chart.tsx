"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DashboardTrendPoint } from "@/lib/dashboard/types";

type DashboardTrendChartProps = {
  data: DashboardTrendPoint[];
};

const chartConfig = {
  posts: {
    label: "Posts",
    color: "hsl(var(--chart-1))",
  },
  replies: {
    label: "Replies",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function formatAxisDate(value: string): string {
  return value.slice(5);
}

export function DashboardTrendChart({ data }: DashboardTrendChartProps): React.JSX.Element {
  return (
    <ChartContainer config={chartConfig} className="h-[280px] w-full">
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatAxisDate} />
        <YAxis allowDecimals={false} width={28} tickLine={false} axisLine={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              indicator="dot"
              labelFormatter={(value) => String(value)}
            />
          }
        />
        <Bar dataKey="posts" fill="var(--color-posts)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="replies" fill="var(--color-replies)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
