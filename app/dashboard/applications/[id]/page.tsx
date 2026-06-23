import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeftIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ApplicationForm } from "@/components/forms/application-form";
import { StatusBadge } from "@/components/applications/status-badge";
import { getApplicationById } from "@/actions/application.actions";

export default async function EditApplicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getApplicationById(id);

  if (!result.ok) notFound();

  const application = result.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" /> Back to applications
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            {application.companyName}
          </h1>
          <StatusBadge status={application.status} />
        </div>
        <p className="text-sm text-muted-foreground">{application.role}</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ApplicationForm application={application} />
        </CardContent>
      </Card>
    </div>
  );
}
