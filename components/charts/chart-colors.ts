import type { Status } from "@/lib/validators";

/** Slice/bar colors aligned with the status badge palette. */
export const STATUS_COLORS: Record<Status, string> = {
  applied: "#a1a1aa",
  oa: "#3b82f6",
  interview: "#6366f1",
  hr_round: "#8b5cf6",
  rejected: "#ef4444",
  offer: "#f59e0b",
  accepted: "#22c55e",
};
