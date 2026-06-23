import Link from "next/link";
import { InboxIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No applications found.",
  description = "Add your first application to start tracking.",
  actionHref = "/dashboard/applications/new",
  actionLabel = "Add Application",
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <InboxIcon className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild>
        <Link href={actionHref}>
          <PlusIcon /> {actionLabel}
        </Link>
      </Button>
    </div>
  );
}
