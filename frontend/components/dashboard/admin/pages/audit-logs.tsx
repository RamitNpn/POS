"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDate, PageSection } from "../shared";
import { useActivityLogs } from "@/hooks/admin/log/getAllLogs";
import { TActivityLog } from "@/lib/types/log.types";
import TablePagination from "@/components/shared/pagination";
import { useEffect, useState } from "react";

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: logData } = useActivityLogs({
    page: page,
    limit: 10,
    search: search,
  });

  const logs = logData?.data ?? [];

  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Audit Logs"
        description="Review recent account activity and system events."
      />

      <PageSection title="Activity Timeline">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length > 0 ? (
              logs.map((log: TActivityLog) => (
                <TableRow key={log._id}>
                  <TableCell>{formatDate(log.createdAt)}</TableCell>
                  <TableCell>{log.user.name}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{log.details}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No logs found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PageSection>

      {logData?.pagination?.totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={logData.pagination.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
