import {
  ClipboardListIcon,
  UsersIcon,
  XCircleIcon,
  GiftIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Total Applications",
      value: stats.total,
      icon: ClipboardListIcon,
      accent: "text-foreground",
    },
    {
      label: "Interviews",
      value: stats.interviews,
      icon: UsersIcon,
      accent: "text-indigo-400",
    },
    {
      label: "Offers",
      value: stats.offers,
      icon: GiftIcon,
      accent: "text-amber-400",
    },
    {
      label: "Accepted",
      value: stats.accepted,
      icon: CheckCircle2Icon,
      accent: "text-green-400",
    },
    {
      label: "Rejected",
      value: stats.rejected,
      icon: XCircleIcon,
      accent: "text-red-400",
    },
    {
      label: "Acceptance Rate",
      value: `${stats.acceptanceRate}%`,
      icon: TrendingUpIcon,
      accent: "text-brand",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-xl border border-border/60 bg-card p-5 transition-colors hover:border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{card.label}</span>
            <span
              className={cn(
                "flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background",
                card.accent
              )}
            >
              <card.icon className="size-4" />
            </span>
          </div>
          <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
