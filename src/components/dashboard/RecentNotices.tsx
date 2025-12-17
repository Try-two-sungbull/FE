import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MoreHorizontal, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notice {
  id: string;
  title: string;
  type: string;
  status: "draft" | "review" | "published";
  updatedAt: string;
  amount: string;
}

const recentNotices: Notice[] = [

];

const statusConfig = {
  draft: {
    label: "작성중",
    icon: Clock,
    className: "bg-muted text-muted-foreground",
  },
  review: {
    label: "검토중",
    icon: AlertCircle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  published: {
    label: "게시완료",
    icon: CheckCircle2,
    className: "bg-success/10 text-success border-success/20",
  },
};

export function RecentNotices() {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          최근 작성 공고문
        </CardTitle>
        <Button variant="ghost" size="sm">
          전체보기
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentNotices.map((notice) => {
          const status = statusConfig[notice.status];
          const StatusIcon = status.icon;

          return (
            <div
              key={notice.id}
              className="group flex items-center gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-foreground truncate">
                    {notice.title}
                  </h4>
                  <Badge variant="outline" className={cn("shrink-0", status.className)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {status.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{notice.type}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                  <span className="font-medium text-foreground">{notice.amount}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{notice.updatedAt}</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
