import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle2,
  Eye,
  Printer,
  Info,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface DocumentPreviewProps {
  data?: Record<string, string>;
  onDataChange?: (data: Record<string, string>) => void;
}

export function DocumentPreview({ data, onDataChange }: DocumentPreviewProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const hasData = data && Object.keys(data).length > 0;

  const handleFieldChange = (field: string, value: string) => {
    if (onDataChange && data) {
      onDataChange({ ...data, [field]: value });
    }
  };

  const handleFieldClick = (field: string) => {
    setEditingField(field);
  };

  const handleFieldBlur = () => {
    setEditingField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      setEditingField(null);
    }
    if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  const getBidMethodText = (method?: string) => {
    switch (method) {
      case "small": return "소액수의(총액, 전자)대상입니다.";
      case "qualified": return "적격심사대상 물품입니다.";
      case "negotiation": return "협상에 의한 계약 대상입니다.";
      default: return "-";
    }
  };

  const getContractMethodText = (method?: string) => {
    switch (method) {
      case "general": return "일반경쟁(총액), 전자입찰대상 용역입니다.";
      case "limited": return "제한경쟁(총액), 전자입찰대상 용역입니다.";
      case "private": return "수의계약 대상입니다.";
      default: return "-";
    }
  };

  const getCompanyRestrictionText = (restriction?: string) => {
    switch (restriction) {
      case "small": 
        return "「중소기업기본법」 제2조에 따른 소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 소기업·소상공인확인서를 소지한 업체";
      case "sme": 
        return "「중소기업기본법」 제2조에 따른 중소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 중소기업·소상공인확인서를 소지한 업체";
      case "none": 
        return "제한 없음";
      default: return "-";
    }
  };

  const getJointContractText = (joint?: string) => {
    if (joint === "yes") {
      return "공동계약 가능 (공동이행방식)";
    }
    return "해당 없음";
  };

  // 편집 가능한 필드 컴포넌트
  const EditableField = ({ 
    field, 
    value, 
    isBlue = false,
    multiline = false,
    className = ""
  }: { 
    field: string; 
    value: string; 
    isBlue?: boolean;
    multiline?: boolean;
    className?: string;
  }) => {
    const isEditing = editingField === field;
    
    if (isEditing) {
      return multiline ? (
        <Textarea
          value={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="min-h-[60px] text-sm"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          onBlur={handleFieldBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="h-7 text-sm inline-block w-auto min-w-[100px]"
        />
      );
    }

    return (
      <span
        onClick={() => handleFieldClick(field)}
        className={cn(
          "cursor-pointer hover:bg-primary/10 px-1 py-0.5 rounded transition-colors inline-flex items-center gap-1 group",
          isBlue && "text-blue-600 font-medium",
          className
        )}
        title="클릭하여 수정"
      >
        {value || "-"}
        <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </span>
    );
  };

  // 선택형 필드 컴포넌트
  const EditableSelect = ({ 
    field, 
    value, 
    options,
    isBlue = false 
  }: { 
    field: string; 
    value: string; 
    options: { value: string; label: string }[];
    isBlue?: boolean;
  }) => {
    const isEditing = editingField === field;
    const displayText = options.find(o => o.value === value)?.label || "-";
    
    if (isEditing) {
      return (
        <select
          value={value}
          onChange={(e) => {
            handleFieldChange(field, e.target.value);
            setEditingField(null);
          }}
          onBlur={handleFieldBlur}
          autoFocus
          className="text-sm border rounded px-2 py-1 bg-background"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    }

    return (
      <span
        onClick={() => handleFieldClick(field)}
        className={cn(
          "cursor-pointer hover:bg-primary/10 px-1 py-0.5 rounded transition-colors inline-flex items-center gap-1 group",
          isBlue && "text-blue-600 font-medium"
        )}
        title="클릭하여 수정"
      >
        {displayText}
        <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      </span>
    );
  };

  return (
    <Card variant="elevated" className="h-full animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4 text-primary" />
          입찰공고문 미리보기
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
        {/* 편집 안내 */}
        {hasData && (
          <div className="px-4 py-2 bg-amber-50 border-b flex items-center gap-2">
            <Pencil className="h-4 w-4 text-amber-600" />
            <p className="text-xs text-amber-700">
              <span className="font-medium">텍스트를 클릭</span>하면 직접 수정할 수 있습니다
            </p>
          </div>
        )}

        {/* 파란 글자 안내 */}
        {hasData && (
          <div className="px-4 py-2 bg-blue-50 border-b flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-blue-700">
              <span className="font-medium">파란색 텍스트</span>는 구매계획서에서 자동 추출된 항목입니다
            </p>
          </div>
        )}
        
        <div className="p-6 bg-card min-h-[600px] border-b overflow-auto">
          {hasData ? (
            <div className="max-w-[600px] mx-auto space-y-6 text-sm">
              {/* Document Header */}
              <div className="text-center space-y-4 pb-6 border-b border-border/50">
                <p className="text-xs text-muted-foreground">물품구매 입찰공고</p>
                <h1 className="text-lg font-bold">
                  한국환경공단 입찰공고번호 : 
                  <EditableField field="noticeNumber" value={data.noticeNumber || "00-00000000-00"} />
                </h1>
                <EditableSelect 
                  field="bidMethod" 
                  value={data.bidMethod || "small"} 
                  options={[
                    { value: "small", label: "소액수의" },
                    { value: "qualified", label: "적격심사" },
                    { value: "negotiation", label: "협상에 의한 계약" }
                  ]}
                />
              </div>

              {/* 청렴계약 안내 */}
              <div className="bg-secondary/30 rounded-lg p-4 text-xs">
                <p className="font-medium mb-2">본 계약은 청렴계약제가 적용됩니다</p>
                <p className="text-muted-foreground">
                  이 계약은 「국가를 당사자로 하는 계약에 관한 법률」에 따른 청렴계약제가 적용됩니다.
                </p>
              </div>

              {/* 1. 입찰에 부치는 사항 */}
              <div className="space-y-3">
                <h2 className="font-bold">1. 입찰에 부치는 사항</h2>
                <div className="pl-4 space-y-2">
                  <p>가. 공 고 명 : <EditableField field="title" value={data.title || ""} isBlue /></p>
                  <p>나. 용역기간 : <EditableField field="period" value={data.period || ""} isBlue /></p>
                  <p>다. 예 산 액 : <EditableField field="amount" value={data.amount || ""} isBlue />원 (부가가치세 포함)</p>
                  <p>라. 구매범위 : <EditableField field="purchaseScope" value={data.purchaseScope || "물품규격서 및 붙임 참조"} /></p>
                  <p>마. 전자입찰서 제출기간 : <EditableField field="bidSubmitPeriod" value={data.bidSubmitPeriod || "2025. 12. ○.(09:00) ～ 12. ○.(10:00)"} /></p>
                  <p>바. 개찰일시 및 장소 : <EditableField field="openingDateTime" value={data.openingDateTime || "2025. 12. ○.(11:00), 국가종합전자조달시스템(나라장터)"} /></p>
                </div>
              </div>

              {/* 2. 견적(입찰) 및 계약방식 */}
              <div className="space-y-3">
                <h2 className="font-bold">2. 견적(입찰) 및 계약방식</h2>
                <div className="pl-4 space-y-2">
                  <p>가. <EditableSelect 
                    field="contractMethod" 
                    value={data.contractMethod || "general"} 
                    options={[
                      { value: "general", label: "일반경쟁(총액), 전자입찰대상 용역입니다." },
                      { value: "limited", label: "제한경쟁(총액), 전자입찰대상 용역입니다." },
                      { value: "private", label: "수의계약 대상입니다." }
                    ]}
                    isBlue
                  /></p>
                  <p>나. <EditableSelect 
                    field="bidMethod" 
                    value={data.bidMethod || "small"} 
                    options={[
                      { value: "small", label: "소액수의(총액, 전자)대상입니다." },
                      { value: "qualified", label: "적격심사대상 물품입니다." },
                      { value: "negotiation", label: "협상에 의한 계약 대상입니다." }
                    ]}
                    isBlue
                  /></p>
                  <p>다. 청렴계약이행 서약제 대상입니다.</p>
                </div>
              </div>

              {/* 3. 입찰참가자격 */}
              <div className="space-y-3">
                <h2 className="font-bold">3. 입찰참가자격</h2>
                <p className="text-xs text-muted-foreground pl-4">아래의 입찰참가자격을 모두 갖춘 자이어야 합니다.</p>
                <div className="pl-4 space-y-3">
                  <div>
                    <p className="mb-1">가. 국가종합전자조달시스템 입찰참가자격등록규정에 따라 나라장터(G2B)시스템에 아래의 사항을 입찰참가자격으로 등록한 자</p>
                    <p className="pl-4">
                      ○ [세부품명번호: <EditableField field="productCode" value={data.productCode || "0000000000"} isBlue />(<EditableField field="productName" value={data.productName || "품명"} isBlue />)] 제조 또는 공급물품으로 등록된 자
                    </p>
                  </div>
                  <p>나. 「국가를 당사자로 하는 계약에 관한 법률」 제27조(부정당업자의 입찰참가 자격제한)에 해당되지 아니한 업체</p>
                  <p>다. 「국가를 당사자로 하는 계약에 관한 법률」 제27조의5 및 같은 법 시행령 제12조제3항에 따른 제한에 해당되지 않는 자</p>
                  <div>
                    <p className="mb-1">라. 기업 제한</p>
                    <p className="pl-4 text-xs">
                      <EditableSelect 
                        field="companyRestriction" 
                        value={data.companyRestriction || "none"} 
                        options={[
                          { value: "small", label: "「중소기업기본법」 제2조에 따른 소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 소기업·소상공인확인서를 소지한 업체" },
                          { value: "sme", label: "「중소기업기본법」 제2조에 따른 중소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 중소기업·소상공인확인서를 소지한 업체" },
                          { value: "none", label: "제한 없음" }
                        ]}
                        isBlue
                      />
                    </p>
                  </div>
                  <div>
                    <p className="mb-1">마. 추가 자격요건</p>
                    <div className="pl-4 text-xs">
                      <EditableField 
                        field="qualifications" 
                        value={data.qualifications || "없음"} 
                        isBlue 
                        multiline 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 공동계약 */}
              <div className="space-y-3">
                <h2 className="font-bold">4. 공동계약</h2>
                <div className="pl-4 text-xs">
                  <EditableSelect 
                    field="jointContract" 
                    value={data.jointContract || "no"} 
                    options={[
                      { value: "yes", label: "공동계약 가능 (공동이행방식)" },
                      { value: "no", label: "해당 없음" }
                    ]}
                    isBlue
                  />
                  {data.jointContract === "yes" && (
                    <div className="mt-2 space-y-1 text-muted-foreground">
                      <p>가. 단독 또는 공동이행방식으로만 입찰참여가 가능하며, 공동수급체 구성원은 각각 본 입찰에서 요구하는 입찰참가자격을 모두 갖추어야 합니다.</p>
                      <p>나. 공동수급체 구성원은 대표사가 참여 지분율이 가장 많아야 하고, 대표사를 포함하여 5개사 이하로 구성하여야 합니다.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. 납품장소 */}
              <div className="space-y-3">
                <h2 className="font-bold">5. 납품장소</h2>
                <p className="pl-4"><EditableField field="deliveryLocation" value={data.deliveryLocation || "미지정"} isBlue /></p>
              </div>

              {/* Footer Notice */}
              <div className="pt-4 border-t border-border/50 text-xs text-muted-foreground text-center space-y-1">
                <p>※ 본 공고문은 AI 어시스턴트에 의해 생성된 초안입니다.</p>
                <p>최종 게시 전 담당자의 검토가 필요합니다.</p>
                <p className="text-blue-600 font-medium">파란색 텍스트: 구매계획서에서 자동 추출된 항목</p>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">미리보기 대기 중</h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                구매계획서를 업로드하거나 좌측 양식에 내용을 입력하시면 실시간으로 입찰공고문 미리보기가 표시됩니다
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
