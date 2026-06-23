"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { STATUS_META } from "@/types";
import type { DashboardStats } from "@/types";
import { STATUS_COLORS } from "@/components/charts/chart-colors";

export function StatusPie({
  data,
}: {
  data: DashboardStats["statusDistribution"];
}) {
  const chartData = data
    .filter((d) => d.count > 0)
    .map((d) => ({
      name: STATUS_META[d.status].label,
      value: d.count,
      color: STATUS_COLORS[d.status],
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        No data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Tooltip
          contentStyle={{
            background: "var(--popover)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            color: "var(--popover-foreground)",
            fontSize: "0.8rem",
          }}
        />
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          innerRadius={55}
          paddingAngle={2}
          label={(entry) => `${entry.name} (${entry.value})`}
          labelLine={false}
        >
          {chartData.map((entry) => (
            <Cell key={entry.name} fill={entry.color} stroke="var(--background)" />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
