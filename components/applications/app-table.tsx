"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  SearchIcon,
  ArrowUpDownIcon,
  PencilIcon,
  EyeIcon,
  Trash2Icon,
  Loader2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/applications/status-badge";
import { DeleteDialog } from "@/components/applications/delete-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate } from "@/lib/utils";
import { STATUS_META } from "@/types";
import { STATUSES, type Sort, type Status } from "@/lib/validators";
import type { Application } from "@/db/schema";

const PAGE_SIZE = 10;

type ListResult = { rows: Application[]; total: number };

async function fetchApplications(
  search: string,
  status: Status | "all",
  sort: Sort,
  page: number
): Promise<ListResult> {
  const qs = new URLSearchParams();
  if (search) qs.set("search", search);
  if (status !== "all") qs.set("status", status);
  qs.set("sort", sort);
  qs.set("page", String(page));
  qs.set("pageSize", String(PAGE_SIZE));

  const res = await fetch(`/api/applications?${qs.toString()}`);
  if (!res.ok) throw new Error("Failed to load applications");
  return res.json();
}

export function AppTable({ initialData }: { initialData: ListResult }) {
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [sort, setSort] = useState<Sort>("date_desc");
  const [page, setPage] = useState(1);

  // Debounce the search box → committed `search` value.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const isDefault =
    search === "" && status === "all" && sort === "date_desc" && page === 1;

  const { data, isError, isFetching } = useQuery({
    queryKey: ["applications", { search, status, sort, page }],
    queryFn: () => fetchApplications(search, status, sort, page),
    initialData: isDefault ? initialData : undefined,
    placeholderData: keepPreviousData,
  });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ["applications"] });
  }

  const hasFilters = search !== "" || status !== "all";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search company or role…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v as Status | "all");
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {STATUS_META[s].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={() => {
            setSort((prev) =>
              prev === "date_desc" ? "date_asc" : "date_desc"
            );
            setPage(1);
          }}
        >
          <ArrowUpDownIcon />
          {sort === "date_desc" ? "Newest" : "Oldest"}
        </Button>
      </div>

      {/* Table / states */}
      {isError ? (
        <p className="py-12 text-center text-sm text-destructive">
          Could not load applications. Please refresh.
        </p>
      ) : total === 0 && !hasFilters ? (
        <EmptyState />
      ) : rows.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No applications match your filters.
        </p>
      ) : (
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className={isFetching ? "opacity-60" : undefined}>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.companyName}
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.location || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(row.appliedDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link
                          href={`/dashboard/applications/${row.id}`}
                          aria-label="Edit"
                        >
                          <PencilIcon />
                        </Link>
                      </Button>
                      {row.jobUrl ? (
                        <Button asChild variant="ghost" size="icon-sm">
                          <a
                            href={row.jobUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View job posting"
                          >
                            <EyeIcon />
                          </a>
                        </Button>
                      ) : null}
                      <DeleteDialog
                        id={row.id}
                        companyName={row.companyName}
                        onSuccess={invalidate}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="text-destructive hover:text-destructive"
                            aria-label="Delete"
                          >
                            <Trash2Icon />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {total > 0 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {isFetching ? (
              <span className="inline-flex items-center gap-1">
                <Loader2Icon className="size-3 animate-spin" /> Loading…
              </span>
            ) : (
              <>
                {total} application{total === 1 ? "" : "s"} · Page {page} of{" "}
                {totalPages}
              </>
            )}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
