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
      key: d.status,
      name: STATUS_META[d.status].label,
      value: d.count,
      color: STATUS_COLORS[d.status],
    }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-[260px] flex-col items-center justify-center gap-1 text-center">
        <p className="text-sm font-medium">No data yet</p>
        <p className="text-xs text-muted-foreground">
          Add an application to see the breakdown.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative mx-auto h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: "calc(var(--radius) - 2px)",
                color: "var(--popover-foreground)",
                fontSize: "0.8rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
              }}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={92}
              innerRadius={62}
              paddingAngle={2}
              strokeWidth={0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tracking-tight tabular-nums">
            {total}
          </span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {chartData.map((entry) => (
          <li
            key={entry.key}
            className="flex items-center justify-between gap-2 text-sm"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="truncate text-muted-foreground">
                {entry.name}
              </span>
            </span>
            <span className="tabular-nums">{entry.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
