import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppTable } from "@/components/applications/app-table";
import { getApplications } from "@/actions/application.actions";

export default async function ApplicationsPage() {
  const result = await getApplications({
    sort: "date_desc",
    page: 1,
    pageSize: 10,
  });

  const initialData = result.ok ? result.data : { rows: [], total: 0 };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and manage every application.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/applications/new">
            <PlusIcon /> Add Application
          </Link>
        </Button>
      </div>

      <AppTable initialData={initialData} />
    </div>
  );
}
