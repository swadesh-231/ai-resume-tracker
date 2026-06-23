import type { Status } from "@/lib/validators";

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type DashboardStats = {
  total: number;
  interviews: number;
  rejected: number;
  offers: number;
  accepted: number;
  acceptanceRate: number;
  statusDistribution: { status: Status; count: number }[];
  monthly: { month: string; count: number }[];
};

export type StatusMeta = {
  label: string;
  /** Tailwind classes for the badge. */
  className: string;
};

export const STATUS_META: Record<Status, StatusMeta> = {
  applied: {
    label: "Applied",
    className: "bg-muted text-muted-foreground border-border",
  },
  oa: {
    label: "OA",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  interview: {
    label: "Interview",
    className:
      "bg-indigo-500/10 text-indigo-600 border-indigo-500/20 dark:text-indigo-400",
  },
  hr_round: {
    label: "HR Round",
    className:
      "bg-violet-500/10 text-violet-600 border-violet-500/20 dark:text-violet-400",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  },
  offer: {
    label: "Offer",
    className:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  },
  accepted: {
    label: "Accepted",
    className:
      "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
  },
};
