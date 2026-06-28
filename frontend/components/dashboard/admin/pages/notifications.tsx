"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  statusStyle,
  PageSection,
  formatDate,
} from "@/components/dashboard/admin/shared";
import { useActivityLogs } from "@/hooks/admin/log/getAllLogs";
import { useState } from "react";
import { TActivityLog } from "@/lib/types/log.types";
import TablePagination from "@/components/shared/pagination";

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: logData } = useActivityLogs({
    page: page,
    limit: 10,
  });

  const logs = logData?.data ?? [];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Notifications"
        description="Monitor system alerts, inventory triggers and important updates."
      />
      <PageSection title="Recent notifications">
        <div className="space-y-3">
          {logs.map((notification: TActivityLog) => (
            <Card key={notification._id} className="bg-card border-border">
              <CardHeader>
                <CardTitle>{notification.module}</CardTitle>
                <CardDescription>
                  {formatDate(notification.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {notification.details}
                </p>
              </CardContent>
              <CardFooter>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyle(notification.entityType || "")}`}
                >
                  {notification.action}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </PageSection>
      {logData?.pagination?.totalPages > 1 && (
        <div className="mt-4">
          <TablePagination
            page={page}
            totalPages={logData?.pagination?.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
