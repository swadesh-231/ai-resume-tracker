import Link from "next/link";
import { InboxIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "No applications yet",
  description = "Add your first application to start tracking your job search.",
  actionHref = "/dashboard/applications/new",
  actionLabel = "Add application",
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center gap-5 overflow-hidden rounded-xl border border-dashed border-border/70 bg-card/40 py-20 text-center">
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
      <div className="relative flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background text-brand">
        <InboxIcon className="size-6" />
      </div>
      <div className="relative space-y-1">
        <p className="font-medium">{title}</p>
        <p className="max-w-xs text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild className="relative">
        <Link href={actionHref}>
          <PlusIcon /> {actionLabel}
        </Link>
      </Button>
    </div>
  );
}
