"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useActivityLogs } from "@/hooks/admin/log/getAllLogs";
import { TNotificationLog } from "@/lib/types/log.types";

export default function WaiterNotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: logData } = useActivityLogs({
    page: page,
    limit: 10,
    module: "Kitchen",
  });

  const logs = logData?.data ?? [];

  const notifications = logs.map((log: TNotificationLog) => {
    let entity = null;

    try {
      entity = log.entityId ? JSON.parse(log.entityId) : null;
    } catch {
      entity = null;
    }

    return {
      ...log,
      entity,
    };
  });

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Notifications"
        description="Keep track of kitchen updates for your waiter orders."
      />

      {notifications.length ? (
        <div className="space-y-4">
          {notifications.map((log: TNotificationLog) => (
            <Card key={log._id} className="border-border">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-foreground">
                    Order #{log.entityType?.orderNumber ?? "-"}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Table {log.entityType?.tableId} •{" "}
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>

                <Badge variant="outline">{log.action}</Badge>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-muted-foreground">{log.details}</p>

                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{log.entityType?.items?.length ?? 0} items</span>

                  <span>Customer: {log.entityType?.customerName}</span>

                  <span>Rs. {log.entityType?.total}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent>
            <p className="text-center text-muted-foreground">
              No waiter notifications available yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
