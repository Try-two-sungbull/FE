import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

import {
  STAT_CARD_VARIANTS,
  StatCardVariant,
  CHANGE_COLORS,
  ChangeType,
} from "@/lib/statCardType";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: ChangeType;
  variant: StatCardVariant;
  overrideIcon?: LucideIcon;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  variant,
  overrideIcon,
}: StatCardProps) {
  const config = STAT_CARD_VARIANTS[variant];
  const Icon = overrideIcon ?? config.icon;

  return (
    <Card className={cn("border-l-4", config.border)}>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>

          {change && (
            <p className={cn("text-sm", CHANGE_COLORS[changeType])}>
              {change}
            </p>
          )}
        </div>

        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            config.iconBg,
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
}
