"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { applications, type Application } from "@/db/schema";
import {
  applicationSchema,
  listParamsSchema,
  type ApplicationInput,
  type ListParams,
} from "@/lib/validators";
import type { ActionResult, DashboardStats } from "@/types";
import { STATUSES } from "@/lib/validators";

/** Normalize empty-string optionals to null for the DB. */
function clean(input: ApplicationInput) {
  return {
    companyName: input.companyName,
    role: input.role,
    status: input.status,
    location: input.location?.trim() ? input.location : null,
    salary: input.salary?.trim() ? input.salary : null,
    jobUrl: input.jobUrl?.trim() ? input.jobUrl : null,
    notes: input.notes?.trim() ? input.notes : null,
    appliedDate: input.appliedDate,
  };
}

async function requireUserId(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return userId;
}

export async function createApplication(
  input: ApplicationInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const userId = await requireUserId();

    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const [row] = await db
      .insert(applications)
      .values({ ...clean(parsed.data), userId })
      .returning({ id: applications.id });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");

    return { ok: true, data: { id: row.id } };
  } catch (err) {
    console.error("createApplication failed", err);
    return { ok: false, error: "Could not create application. Please try again." };
  }
}

export async function updateApplication(
  id: string,
  input: ApplicationInput
): Promise<ActionResult> {
  try {
    const userId = await requireUserId();

    const parsed = applicationSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
    }

    const updated = await db
      .update(applications)
      .set({ ...clean(parsed.data), updatedAt: new Date() })
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .returning({ id: applications.id });

    if (updated.length === 0) {
      return { ok: false, error: "Application not found." };
    }

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");
    revalidatePath(`/dashboard/applications/${id}`);

    return { ok: true, data: undefined };
  } catch (err) {
    console.error("updateApplication failed", err);
    return { ok: false, error: "Could not update application. Please try again." };
  }
}

export async function deleteApplication(id: string): Promise<ActionResult> {
  try {
    const userId = await requireUserId();

    const deleted = await db
      .delete(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .returning({ id: applications.id });

    if (deleted.length === 0) {
      return { ok: false, error: "Application not found." };
    }

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");

    return { ok: true, data: undefined };
  } catch (err) {
    console.error("deleteApplication failed", err);
    return { ok: false, error: "Could not delete application. Please try again." };
  }
}

export async function getApplications(
  params: Partial<ListParams> = {}
): Promise<ActionResult<{ rows: Application[]; total: number }>> {
  try {
    const userId = await requireUserId();

    const parsed = listParamsSchema.safeParse(params);
    if (!parsed.success) {
      return { ok: false, error: "Invalid query parameters." };
    }
    const { search, status, sort, page, pageSize } = parsed.data;

    const filters = [eq(applications.userId, userId)];
    if (status) filters.push(eq(applications.status, status));
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      filters.push(
        or(
          ilike(applications.companyName, term),
          ilike(applications.role, term)
        )!
      );
    }
    const where = and(...filters);

    const orderBy =
      sort === "date_asc"
        ? asc(applications.appliedDate)
        : desc(applications.appliedDate);

    const [rows, totalResult] = await Promise.all([
      db
        .select()
        .from(applications)
        .where(where)
        .orderBy(orderBy)
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ value: count() }).from(applications).where(where),
    ]);

    return {
      ok: true,
      data: { rows, total: totalResult[0]?.value ?? 0 },
    };
  } catch (err) {
    console.error("getApplications failed", err);
    return { ok: false, error: "Could not load applications." };
  }
}

export async function getApplicationById(
  id: string
): Promise<ActionResult<Application>> {
  try {
    const userId = await requireUserId();

    const [row] = await db
      .select()
      .from(applications)
      .where(and(eq(applications.id, id), eq(applications.userId, userId)))
      .limit(1);

    if (!row) return { ok: false, error: "Application not found." };

    return { ok: true, data: row };
  } catch (err) {
    console.error("getApplicationById failed", err);
    return { ok: false, error: "Could not load application." };
  }
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  try {
    const userId = await requireUserId();
    const where = eq(applications.userId, userId);

    // Status counts in a single grouped query.
    const grouped = await db
      .select({ status: applications.status, value: count() })
      .from(applications)
      .where(where)
      .groupBy(applications.status);

    const counts = Object.fromEntries(
      grouped.map((g) => [g.status, g.value])
    ) as Record<string, number>;

    const statusDistribution = STATUSES.map((status) => ({
      status,
      count: counts[status] ?? 0,
    }));

    const total = statusDistribution.reduce((sum, s) => sum + s.count, 0);
    const interviews = (counts.interview ?? 0) + (counts.hr_round ?? 0);
    const rejected = counts.rejected ?? 0;
    const offers = counts.offer ?? 0;
    const accepted = counts.accepted ?? 0;
    const acceptanceRate =
      total === 0 ? 0 : Math.round((accepted / total) * 100);

    // Monthly counts for the last 6 months.
    const monthlyRows = await db
      .select({
        month: sql<string>`to_char(${applications.appliedDate}, 'YYYY-MM')`,
        value: count(),
      })
      .from(applications)
      .where(
        and(
          where,
          sql`${applications.appliedDate} >= date_trunc('month', now()) - interval '5 months'`
        )
      )
      .groupBy(sql`to_char(${applications.appliedDate}, 'YYYY-MM')`);

    const monthlyMap = Object.fromEntries(
      monthlyRows.map((r) => [r.month, r.value])
    );

    const monthly: { month: string; count: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      monthly.push({ month: key, count: monthlyMap[key] ?? 0 });
    }

    return {
      ok: true,
      data: {
        total,
        interviews,
        rejected,
        offers,
        accepted,
        acceptanceRate,
        statusDistribution,
        monthly,
      },
    };
  } catch (err) {
    console.error("getDashboardStats failed", err);
    return { ok: false, error: "Could not load dashboard stats." };
  }
}
