import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/applications/status-badge";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/db/schema";

export function RecentTable({ rows }: { rows: Application[] }) {
  if (rows.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No applications yet.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader className="[&_th]:text-xs [&_th]:font-medium [&_th]:tracking-wide [&_th]:text-muted-foreground [&_th]:uppercase">
        <TableRow className="hover:bg-transparent">
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className="[&_td]:py-3">
            <TableCell className="font-medium">
              <Link
                href={`/dashboard/applications/${row.id}`}
                className="hover:underline"
              >
                {row.companyName}
              </Link>
            </TableCell>
            <TableCell>{row.role}</TableCell>
            <TableCell>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {formatDate(row.appliedDate)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
