import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'from last period',
  icon,
  className,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  const isNeutral = change === 0 || change === undefined;

  return (
    <Card className={cn('bg-card border-border', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="md:text-sm text-[10px] font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            {isPositive && (
              <>
                <TrendingUp className="size-3 text-success" />
                <span className="text-success">+{change}%</span>
              </>
            )}
            {isNegative && (
              <>
                <TrendingDown className="size-3 text-destructive" />
                <span className="text-destructive">{change}%</span>
              </>
            )}
            {isNeutral && (
              <>
                <Minus className="size-3 text-muted-foreground" />
                <span className="text-muted-foreground">0%</span>
              </>
            )}
            <span className="text-muted-foreground">{changeLabel}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
