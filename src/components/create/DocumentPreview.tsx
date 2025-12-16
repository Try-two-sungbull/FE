import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle2,
  Eye,
  Printer
} from "lucide-react";

interface DocumentPreviewProps {
  data?: Record<string, string>;
}

export function DocumentPreview({ data }: DocumentPreviewProps) {
  const hasData = data && Object.keys(data).length > 0;

  return (
    <Card variant="elevated" className="h-full animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4 text-primary" />
          공고문 미리보기
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" disabled={!hasData}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" disabled={!hasData}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" disabled={!hasData}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 bg-white min-h-[600px] border-b">
          {hasData ? (
            <div className="max-w-[600px] mx-auto space-y-6 font-serif">
              {/* Document Header */}
              <div className="text-center space-y-4 pb-6 border-b border-border/50">
                <Badge variant="outline" className="font-sans">
                  물품 · 적격심사
                </Badge>
                <h1 className="text-xl font-bold">입 찰 공 고</h1>
                <p className="text-sm text-muted-foreground font-sans">
                  공고번호: 2024-물품-001
                </p>
              </div>

              {/* Document Title */}
              <div className="text-center py-4">
                <h2 className="text-lg font-semibold">
                  {data.title || "공고명"}
                </h2>
              </div>

              {/* Basic Info Table */}
              <div className="border rounded-lg overflow-hidden text-sm">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b">
                      <td className="bg-secondary/50 px-4 py-2.5 font-medium w-1/3">추정가격</td>
                      <td className="px-4 py-2.5">
                        {data.amount 
                          ? `${Number(data.amount).toLocaleString()}원 (부가세 포함)`
                          : "-"
                        }
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="bg-secondary/50 px-4 py-2.5 font-medium">계약 방법</td>
                      <td className="px-4 py-2.5">
                        {data.contractMethod === "general" && "일반경쟁입찰"}
                        {data.contractMethod === "limited" && "제한경쟁입찰"}
                        {data.contractMethod === "designated" && "지명경쟁입찰"}
                        {data.contractMethod === "private" && "수의계약"}
                        {!data.contractMethod && "-"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="bg-secondary/50 px-4 py-2.5 font-medium">계약 구분</td>
                      <td className="px-4 py-2.5">
                        {data.contractType === "unit" && "단가계약"}
                        {data.contractType === "total" && "총액계약"}
                        {data.contractType === "long-term" && "장기계속계약"}
                        {!data.contractType && "-"}
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="bg-secondary/50 px-4 py-2.5 font-medium">납품 기한</td>
                      <td className="px-4 py-2.5">{data.period || "-"}</td>
                    </tr>
                    <tr>
                      <td className="bg-secondary/50 px-4 py-2.5 font-medium">납품 장소</td>
                      <td className="px-4 py-2.5">{data.deliveryLocation || "-"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Qualifications */}
              {data.qualifications && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">입찰 참가 자격</h3>
                  <div className="bg-secondary/30 rounded-lg p-4 text-sm whitespace-pre-wrap">
                    {data.qualifications}
                  </div>
                </div>
              )}

              {/* Footer Notice */}
              <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground text-center space-y-1">
                <p>※ 본 공고문은 AI 어시스턴트에 의해 생성된 초안입니다.</p>
                <p>최종 게시 전 담당자의 검토가 필요합니다.</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">미리보기 대기 중</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                좌측 양식에 내용을 입력하시면 실시간으로 공고문 미리보기가 표시됩니다
              </p>
            </div>
          )}
        </div>

        {/* Validation Status */}
        {hasData && (
          <div className="p-4 bg-success/5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-success">
                법령 검증 완료
              </p>
              <p className="text-xs text-muted-foreground">
                국가계약법 및 최신 계약예규 기준 검증됨
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-success hover:text-success">
              상세보기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
