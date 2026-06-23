import {
  ClipboardListIcon,
  UsersIcon,
  XCircleIcon,
  GiftIcon,
  CheckCircle2Icon,
  TrendingUpIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardStats } from "@/types";

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    { label: "Total Applications", value: stats.total, icon: ClipboardListIcon },
    { label: "Interviews", value: stats.interviews, icon: UsersIcon },
    { label: "Rejected", value: stats.rejected, icon: XCircleIcon },
    { label: "Offers", value: stats.offers, icon: GiftIcon },
    { label: "Accepted", value: stats.accepted, icon: CheckCircle2Icon },
    {
      label: "Acceptance Rate",
      value: `${stats.acceptanceRate}%`,
      icon: TrendingUpIcon,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.label}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tracking-tight">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
