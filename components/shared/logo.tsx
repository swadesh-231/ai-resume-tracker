import Link from "next/link";
import { BriefcaseBusinessIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 font-semibold", className)}
    >
      <span className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-b from-brand to-primary text-brand-foreground shadow-sm">
        <BriefcaseBusinessIcon className="size-4" />
      </span>
      <span className="tracking-tight">
        Resume<span className="text-muted-foreground">Track</span>
      </span>
    </Link>
  );
}
