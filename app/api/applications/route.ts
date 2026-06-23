import { NextResponse } from "next/server";

import { getApplications } from "@/actions/application.actions";
import { STATUSES, SORTS, type Sort, type Status } from "@/lib/validators";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawStatus = searchParams.get("status");
  const rawSort = searchParams.get("sort");
  const rawPage = searchParams.get("page");
  const rawPageSize = searchParams.get("pageSize");

  const result = await getApplications({
    search: searchParams.get("search") ?? undefined,
    status:
      rawStatus && STATUSES.includes(rawStatus as Status)
        ? (rawStatus as Status)
        : undefined,
    sort:
      rawSort && SORTS.includes(rawSort as Sort) ? (rawSort as Sort) : undefined,
    page: rawPage ? Number(rawPage) : undefined,
    pageSize: rawPageSize ? Number(rawPageSize) : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json(result.data);
}
