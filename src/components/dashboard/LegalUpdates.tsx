import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Scale, ExternalLink, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface LegalUpdate {
  id: string;
  title: string;
  source: string;
  date: string;
  impact: "high" | "medium" | "low";
  description: string;
}

const updates: LegalUpdate[] = [
  {
    id: "1",
    title: "국가계약법 시행령 일부 개정",
    source: "기획재정부",
    date: "2024.01.15",
    impact: "high",
    description: "적격심사 기준 변경 - 물품구매 가격점수 배점 조정",
  },
  {
    id: "2",
    title: "계약예규 개정 공포",
    source: "조달청",
    date: "2024.01.10",
    impact: "medium",
    description: "소액수의계약 기준금액 상향 조정",
  },
  {
    id: "3",
    title: "공공조달 지침 안내",
    source: "조달청",
    date: "2024.01.05",
    impact: "low",
    description: "2024년 공공조달 주요 정책방향 안내",
  },
];

const impactConfig = {
  high: {
    label: "중요",
    icon: AlertTriangle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  medium: {
    label: "주의",
    icon: Info,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  low: {
    label: "참고",
    icon: Info,
    className: "bg-info/10 text-info border-info/20",
  },
};

export function LegalUpdates() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          법령 업데이트
        </CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          더보기
          <ExternalLink className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {updates.map((update) => {
          const impact = impactConfig[update.impact];
          const ImpactIcon = impact.icon;
          
          return (
            <div
              key={update.id}
              className="p-4 rounded-xl border border-border/50 hover:border-border hover:bg-secondary/20 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-1.5 rounded-md shrink-0",
                  update.impact === "high" ? "bg-destructive/10" : "bg-primary/10"
                )}>
                  <ImpactIcon className={cn(
                    "h-4 w-4",
                    update.impact === "high" ? "text-destructive" : "text-primary"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{update.title}</h4>
                    <Badge variant="outline" className={cn("shrink-0 text-[10px]", impact.className)}>
                      {impact.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1.5 line-clamp-2">
                    {update.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{update.source}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                    <span>{update.date}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
