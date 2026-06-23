import { z } from "zod";

export const STATUSES = [
  "applied",
  "oa",
  "interview",
  "hr_round",
  "rejected",
  "offer",
  "accepted",
] as const;

export type Status = (typeof STATUSES)[number];

export const applicationSchema = z.object({
  companyName: z.string().min(1, "Company name is required").max(255),
  role: z.string().min(1, "Role is required").max(255),
  status: z.enum(STATUSES),
  location: z.string().max(255).optional().or(z.literal("")),
  salary: z.string().max(100).optional().or(z.literal("")),
  jobUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
  appliedDate: z.coerce.date({ message: "Applied date is required" }),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;

// Client form schema: the date input produces a "YYYY-MM-DD" string. The server
// action re-validates with `applicationSchema` (coerced Date) — never trust the
// client alone.
export const applicationFormSchema = applicationSchema.extend({
  appliedDate: z.string().min(1, "Applied date is required"),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

// Filters used by the applications list (search / filter / sort / paginate).
export const SORTS = ["date_desc", "date_asc"] as const;
export type Sort = (typeof SORTS)[number];

export const listParamsSchema = z.object({
  search: z.string().max(255).optional(),
  status: z.enum(STATUSES).optional(),
  sort: z.enum(SORTS).default("date_desc"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type ListParams = z.infer<typeof listParamsSchema>;
