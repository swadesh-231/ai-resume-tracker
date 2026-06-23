import Link from "next/link";
import { ChevronLeftIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ApplicationForm } from "@/components/forms/application-form";

export default function NewApplicationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/dashboard/applications"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeftIcon className="size-4" /> Back to applications
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Add Application
        </h1>
        <p className="text-sm text-muted-foreground">
          Track a new job application.
        </p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <ApplicationForm />
        </CardContent>
      </Card>
    </div>
  );
}
