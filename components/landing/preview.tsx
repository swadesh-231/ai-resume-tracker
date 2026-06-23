import {
  ClipboardListIcon,
  UsersIcon,
  TrendingUpIcon,
} from "lucide-react";

import { StatusBadge } from "@/components/applications/status-badge";
import type { Status } from "@/lib/validators";

const rows: { company: string; role: string; status: Status; date: string }[] = [
  { company: "Vercel", role: "Frontend Engineer", status: "interview", date: "Jun 18" },
  { company: "Stripe", role: "Full Stack Engineer", status: "oa", date: "Jun 12" },
  { company: "Razorpay", role: "SDE II", status: "offer", date: "Jun 04" },
  { company: "Notion", role: "Product Engineer", status: "rejected", date: "May 28" },
];

const stats = [
  { label: "Applications", value: "48", icon: ClipboardListIcon },
  { label: "Interviews", value: "11", icon: UsersIcon },
  { label: "Acceptance", value: "23%", icon: TrendingUpIcon },
];

export function DashboardPreview() {
  return (
    <div className="border-gradient relative rounded-2xl p-2 shadow-2xl shadow-black/30">
      <div className="rounded-xl border border-border/60 bg-card/80 backdrop-blur">
        {/* window chrome */}
        <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
          <span className="ml-3 text-xs text-muted-foreground">
            resumetrack.app / dashboard
          </span>
        </div>

        <div className="space-y-5 p-5">
          {/* stat tiles */}
          <div className="grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-lg border border-border/60 bg-background/40 p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[0.7rem] text-muted-foreground">
                    {s.label}
                  </span>
                  <s.icon className="size-3.5 text-muted-foreground" />
                </div>
                <p className="mt-1.5 text-xl font-semibold tracking-tight">
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* mini table */}
          <div className="overflow-hidden rounded-lg border border-border/60">
            <div className="grid grid-cols-[1.4fr_1.6fr_1fr_auto] gap-2 border-b border-border/60 bg-muted/30 px-3 py-2 text-[0.7rem] font-medium text-muted-foreground">
              <span>Company</span>
              <span>Role</span>
              <span>Status</span>
              <span className="text-right">Date</span>
            </div>
            {rows.map((r) => (
              <div
                key={r.company}
                className="grid grid-cols-[1.4fr_1.6fr_1fr_auto] items-center gap-2 border-b border-border/40 px-3 py-2.5 text-xs last:border-0"
              >
                <span className="font-medium">{r.company}</span>
                <span className="text-muted-foreground">{r.role}</span>
                <span>
                  <StatusBadge status={r.status} />
                </span>
                <span className="text-right text-muted-foreground">
                  {r.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
