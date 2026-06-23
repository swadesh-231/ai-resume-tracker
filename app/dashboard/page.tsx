import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentTable } from "@/components/dashboard/recent-table";
import { StatusPie } from "@/components/charts/status-pie";
import { MonthlyBar } from "@/components/charts/monthly-bar";
import {
  getApplications,
  getDashboardStats,
} from "@/actions/application.actions";

export default async function DashboardPage() {
  const [statsResult, recentResult] = await Promise.all([
    getDashboardStats(),
    getApplications({ sort: "date_desc", page: 1, pageSize: 5 }),
  ]);

  if (!statsResult.ok) {
    return (
      <p className="text-sm text-destructive">{statsResult.error}</p>
    );
  }

  const stats = statsResult.data;
  const recent = recentResult.ok ? recentResult.data.rows : [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Your job search at a glance.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/applications/new">
            <PlusIcon /> Add Application
          </Link>
        </Button>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPie data={stats.statusDistribution} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <MonthlyBar data={stats.monthly} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Applications</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/applications">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <RecentTable rows={recent} />
        </CardContent>
      </Card>
    </div>
  );
}
