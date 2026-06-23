import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_META } from "@/types";
import type { Status } from "@/lib/validators";

export function StatusBadge({
  status,
  className,
}: {
  status: Status;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", meta.className, className)}
    >
      {meta.label}
    </Badge>
  );
}
