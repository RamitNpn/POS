import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { TActivityLog } from '@/lib/types/log.types';
import { useActivityLogs } from '@/hooks/admin/log/getAllLogs';

interface ActivityFeedProps {
  title?: string;
  description?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getActionColor(action: string): string {
  if (action.toLowerCase().includes('ready')) return 'bg-success/20 text-success';
  if (action.toLowerCase().includes('created')) return 'bg-info/20 text-info';
  if (action.toLowerCase().includes('payment')) return 'bg-primary/20 text-primary';
  if (action.toLowerCase().includes('cancelled')) return 'bg-destructive/20 text-destructive';
  return 'bg-muted text-muted-foreground';
}

export function ActivityFeed({ 
  title = 'Recent Activity',
  description = 'Latest updates from your team'
}: ActivityFeedProps) {

  const { data: logData } = useActivityLogs({ limit: 10 });
  const logs = logData?.data ?? [];

  return (
    <Card className="bg-card border-border h-[90vh] overflow-y-scroll">
      <CardHeader>
        <CardTitle className="text-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No recent activity</p>
        ) : (
          <div className="space-y-4">
            {logs.map((activity: TActivityLog) => (
              <div key={activity._id} className="flex items-start gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className={getActionColor(activity.action)}>
                    {getInitials(activity.user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {activity.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
