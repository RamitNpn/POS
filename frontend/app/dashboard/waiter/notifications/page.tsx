"use client";

import { DashboardHeader } from "@/components/layout/dashboard-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useActivityLogs } from "@/hooks/admin/log/getAllLogs";
import { TNotificationLog, TParsedNotificationLog } from "@/lib/types/log.types";

export default function WaiterNotificationsPage() {
  const [page] = useState(1);

  const { data: logData } = useActivityLogs({
    page,
    limit: 10,
    module: "Kitchen",
  });

  const logs = logData?.data ?? [];

const notifications: TParsedNotificationLog[] = logs.map((log: TNotificationLog) => ({
  ...log,
  entity: log.entityType ? JSON.parse(log.entityType) : null,
}));

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Notifications"
        description="Keep track of kitchen updates for your waiter orders."
      />

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((log) => (
            <Card key={log._id} className="border-border">
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle className="text-foreground">
                    Order #{log.entity?.orderNumber ?? "-"}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Table {log.entity?.tableId ?? "-"} •{" "}
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>

                <Badge variant="outline">{log.action}</Badge>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <p className="text-sm text-muted-foreground">
                  {log.details}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <span>
                    {log.entity?.items?.length ?? 0} item
                    {(log.entity?.items?.length ?? 0) !== 1 ? "s" : ""}
                  </span>

                  <span>
                    Customer: {log.entity?.customerName ?? "-"}
                  </span>

                  <span>
                    Rs. {log.entity?.total?.toFixed(2) ?? "0.00"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border">
          <CardContent className="py-10">
            <p className="text-center text-muted-foreground">
              No waiter notifications available yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}