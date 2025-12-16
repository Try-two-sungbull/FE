import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  Package, 
  Briefcase, 
  Wrench, 
  Building2,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface ActionItem {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const purchaseTypes: ActionItem[] = [
  {
    icon: Package,
    title: "물품 구매",
    description: "사무용품, 장비, 소모품 등",
    color: "text-blue-600",
    bgColor: "bg-blue-50 hover:bg-blue-100",
  },
  {
    icon: Briefcase,
    title: "일반용역",
    description: "시설관리, 청소, 경비 등",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 hover:bg-emerald-100",
  },
  {
    icon: Wrench,
    title: "기술용역",
    description: "시스템 개발, 컨설팅 등",
    color: "text-violet-600",
    bgColor: "bg-violet-50 hover:bg-violet-100",
  },
  {
    icon: Building2,
    title: "공사",
    description: "건설, 시설공사 등",
    color: "text-amber-600",
    bgColor: "bg-amber-50 hover:bg-amber-100",
  },
];

interface QuickActionsProps {
  onSelectType?: (type: string) => void;
}

export function QuickActions({ onSelectType }: QuickActionsProps) {
  return (
    <Card variant="elevated" className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          새 공고문 작성
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {purchaseTypes.map((item) => (
          <button
            key={item.title}
            onClick={() => onSelectType?.(item.title)}
            className={cn(
              "group flex flex-col items-start p-4 rounded-xl transition-all duration-200",
              "border border-transparent hover:border-border/50",
              item.bgColor
            )}
          >
            <div className={cn("p-2.5 rounded-lg bg-white/80 mb-3", item.color)}>
              <item.icon className="h-5 w-5" />
            </div>
            <h4 className="font-semibold text-foreground mb-0.5">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.description}</p>
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity",
              item.color
            )}>
              시작하기
              <ArrowRight className="h-3 w-3" />
            </div>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
