"use client";

import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <TriangleAlertIcon className="size-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Could not load this page</h2>
        <p className="text-sm text-muted-foreground">
          Something went wrong while loading your data.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
