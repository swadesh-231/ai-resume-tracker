import { cn } from "@/lib/utils";
import { STATUS_META } from "@/types";
import { STATUS_COLORS } from "@/components/charts/chart-colors";
import type { Status } from "@/lib/validators";

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        className
      )}
    >
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: STATUS_COLORS[status] }}
        aria-hidden
      />
      {STATUS_META[status].label}
    </span>
  );
}
