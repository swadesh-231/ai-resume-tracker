import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
    return <p className="text-sm text-destructive">{statsResult.error}</p>;
  }

  const stats = statsResult.data;
  const recent = recentResult.ok ? recentResult.data.rows : [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stats.total === 0
              ? "Add your first application to start tracking."
              : `You're tracking ${stats.total} application${
                  stats.total === 1 ? "" : "s"
                }.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/applications/new">
            <PlusIcon /> Add application
          </Link>
        </Button>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status distribution</CardTitle>
            <CardDescription>Where your applications stand</CardDescription>
          </CardHeader>
          <CardContent>
            <StatusPie data={stats.statusDistribution} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Monthly applications</CardTitle>
            <CardDescription>Applications over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyBar data={stats.monthly} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent applications</CardTitle>
            <CardDescription>Your five latest entries</CardDescription>
          </div>
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
