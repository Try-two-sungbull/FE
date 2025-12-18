import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  FileText,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";


interface FormField {
  id: string;
  label: string;
  sourceLabel?: string; // 구매계획서에서의 항목명
  type: "text" | "number" | "select" | "textarea" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
  isBlueField?: boolean; // 파란 글자 (구매계획서에서 추출되는 항목)
}

// 구매계획서 → 입찰공고 매핑 필드
const formFields: FormField[] = [
  {
    id: "title",
    label: "공고명",
    sourceLabel: "물품명/구매물품",
    type: "text",
    placeholder: "예: 실내공기질 자동측정망 가스상 측정장비 구매",
    required: true,
    isBlueField: true,
    hint: "구매계획서의 '물품명' 또는 '구매물품'에서 자동 추출됩니다",
  },
  {
    id: "amount",
    label: "예산액",
    sourceLabel: "소요예산",
    type: "number",
    placeholder: "부가세 포함 금액",
    required: true,
    isBlueField: true,
    hint: "구매계획서의 '소요예산'에서 자동 추출됩니다 (부가세 포함)",
  },
  {
    id: "period",
    label: "용역기간/계약기간",
    sourceLabel: "납품기한/계약기간",
    type: "text",
    placeholder: "예: 계약 후 120일",
    required: true,
    isBlueField: true,
    hint: "구매계획서의 '납품기한' 또는 '계약기간'에서 자동 추출됩니다",
  },
  {
    id: "productCode",
    label: "세부품명번호",
    sourceLabel: "세부품명번호(10자리)",
    type: "text",
    placeholder: "예: 4111319901",
    required: true,
    isBlueField: true,
    hint: "10자리 세부품명번호 입력 시 품명이 자동 생성됩니다",
  },
  {
    id: "productName",
    label: "품명",
    type: "text",
    placeholder: "세부품명번호 입력 시 자동 생성",
    isBlueField: true,
  },
  {
    id: "deliveryLocation",
    label: "납품장소",
    sourceLabel: "납품장소/설치지점",
    type: "text",
    placeholder: "예: 생활환경지원부 장비실",
    isBlueField: true,
    hint: "구매계획서의 '납품장소'에서 자동 추출됩니다",
  },
  {
    id: "bidMethod",
    label: "낙찰 방법",
    sourceLabel: "낙찰자 선정방법",
    type: "select",
    required: true,
    options: [
      { value: "small", label: "소액수의계약" },
      { value: "qualified", label: "적격심사" },
      { value: "negotiation", label: "협상에 의한 계약" },
    ],
    hint: "금액 및 구매계획서 내용에 따라 자동 결정됩니다",
  },
  {
    id: "contractMethod",
    label: "계약 방법",
    sourceLabel: "계약방법/입찰방법",
    type: "select",
    required: true,
    isBlueField: true,
    options: [
      { value: "general", label: "일반경쟁" },
      { value: "limited", label: "제한경쟁" },
      { value: "private", label: "수의계약" },
    ],
    hint: "구매계획서의 '계약방법' 또는 '입찰방법'에서 추출됩니다",
  },
  {
    id: "companyRestriction",
    label: "기업 제한",
    sourceLabel: "입찰참가자격",
    type: "select",
    required: true,
    isBlueField: true,
    options: [
      { value: "small", label: "소기업 제한 (1억 미만)" },
      { value: "sme", label: "중소기업 제한 (1억~2.3억)" },
      { value: "none", label: "제한 없음 (2.3억 이상)" },
    ],
    hint: "금액에 따라 자동 결정: 1억 미만=소기업, 1억~2.3억=중소기업",
  },
  {
    id: "jointContract",
    label: "공동계약",
    sourceLabel: "공동계약 허용 여부",
    type: "select",
    isBlueField: true,
    options: [
      { value: "no", label: "해당 없음 (단독)" },
      { value: "yes", label: "공동이행방식 허용" },
    ],
    hint: "구매계획서에 명시되지 않으면 단독 참여로 간주됩니다",
  },
  {
    id: "qualifications",
    label: "입찰참가자격 (상세)",
    sourceLabel: "입찰참가자격",
    type: "textarea",
    placeholder: "추가 입찰 참가 자격 요건",
    isBlueField: true,
    hint: "구매계획서의 '입찰참가자격'에서 자동 추출됩니다",
  },
];

interface NoticeFormProps {
  type?: string;
  subType?: string;
  onPreview?: (data: Record<string, string>) => void;
  formData?: Record<string, string>;
}

export function NoticeForm({ type, subType, onPreview, formData: externalFormData }: NoticeFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(externalFormData || {});
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // 외부에서 데이터가 변경되면 동기화
  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
    }
  }, [externalFormData]);

  const handleChange = (id: string, value: string) => {
    const newData = { ...formData, [id]: value };

    // 금액에 따른 자동 기업 제한 설정
    if (id === "amount") {
      const amount = parseInt(value.replace(/,/g, "")) || 0;
      const amountExcludingVat = amount / 1.1; // 부가세 제외 금액

      if (amountExcludingVat < 100000000) {
        newData.companyRestriction = "small";
      } else if (amountExcludingVat < 230000000) {
        newData.companyRestriction = "sme";
      } else {
        newData.companyRestriction = "none";
      }

      // 금액에 따른 낙찰 방법 자동 설정
      if (amountExcludingVat <= 100000000) {
        newData.bidMethod = "small"; // 소액수의 가능
      } else {
        newData.bidMethod = "qualified"; // 적격심사 필수
      }
    }

    setFormData(newData);
    onPreview?.(newData);
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    // 구매계획서 OCR 분석 시뮬레이션
    setTimeout(() => {
      setIsUploading(false);
      // 파란 글자 항목들 자동 채움 (구매계획서에서 추출)
      const extractedData = {
        title: "실내공기질 자동측정망 가스상 측정장비 구매",
        amount: "67214400",
        period: "계약 후 120일",
        productCode: "4111319901",
        productName: "대기오염측정기",
        deliveryLocation: "생활환경지원부 장비실(인천시 서구 청라에메랄드로94, 6층)",
        contractMethod: "general",
        companyRestriction: "sme",
        jointContract: "no",
        bidMethod: "qualified",
        qualifications: "「중소기업기본법」제2조에 따른 소기업 또는「소상공인 보호 및 지원에 관한 법률」제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 <소기업·소상공인 확인서>를 소지한 자",
      };
      setFormData(extractedData);
      onPreview?.(extractedData);
    }, 2000);
  };

  const handleGenerateNotice = () => {
    navigate('/loading', {
      state: {
        initialData: formData,
        type: type,
        subType: subType
      }
    });
  };

  const filledCount = Object.values(formData).filter(Boolean).length;
  const requiredFields = formFields.filter((f) => f.required);
  const filledRequired = requiredFields.filter((f) => formData[f.id]).length;

  return (
    <div className="space-y-6">
      {/* 매핑 정보 안내 */}
      <Card variant="glass" className="border-l-4 border-l-info animate-fade-in">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm mb-1">파란 글자 항목 안내</h4>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600 font-medium">파란색</span>으로 표시된 항목은 구매계획서에서 자동 추출되어 입찰공고에 반영됩니다.
                발주계획서를 업로드하면 해당 항목들이 자동으로 채워집니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Upload Card */}
      <Card variant="glass" className="border-dashed border-2 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "p-3 rounded-xl transition-colors",
              isUploading ? "bg-accent/20" : "bg-secondary"
            )}>
              <Upload className={cn(
                "h-6 w-6",
                isUploading ? "text-accent animate-pulse" : "text-muted-foreground"
              )} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">구매계획서 업로드</h3>
              <p className="text-sm text-muted-foreground mb-3">
                한글(.hwp) 또는 PDF 파일을 업로드하면 AI가 <span className="text-blue-600 font-medium">파란 글자 항목</span>을 자동으로 추출합니다
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFileUpload}
                disabled={isUploading}
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin" />
                    구매계획서 분석 중...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    파일 선택
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Fields */}
      <Card variant="elevated" className="animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            공고문 항목 입력
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {filledRequired} / {requiredFields.length} 필수항목
          </Badge>
        </CardHeader>
        <CardContent className="space-y-5">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Label
                  htmlFor={field.id}
                  className={cn(
                    "text-sm font-medium",
                    field.isBlueField && "text-blue-600"
                  )}
                >
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                {field.sourceLabel && (
                  <Badge variant="outline" className="text-[10px] font-normal text-muted-foreground">
                    구매계획서: {field.sourceLabel}
                  </Badge>
                )}
                {field.isBlueField && formData[field.id] && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    자동추출
                  </Badge>
                )}
              </div>

              {field.type === "text" && (
                <Input
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className={cn(
                    formData[field.id] && field.isBlueField && "border-blue-300 bg-blue-50/50 text-blue-900"
                  )}
                />
              )}

              {field.type === "number" && (
                <div className="relative">
                  <Input
                    id={field.id}
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.id] ? Number(formData[field.id]).toLocaleString() : ""}
                    onChange={(e) => handleChange(field.id, e.target.value.replace(/,/g, ""))}
                    className={cn(
                      formData[field.id] && field.isBlueField && "border-blue-300 bg-blue-50/50 text-blue-900"
                    )}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    원
                  </span>
                </div>
              )}

              {field.type === "select" && (
                <Select
                  value={formData[field.id]}
                  onValueChange={(value) => handleChange(field.id, value)}
                >
                  <SelectTrigger className={cn(
                    formData[field.id] && field.isBlueField && "border-blue-300 bg-blue-50/50 text-blue-900"
                  )}>
                    <SelectValue placeholder="선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "textarea" && (
                <Textarea
                  id={field.id}
                  placeholder={field.placeholder}
                  value={formData[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  rows={3}
                  className={cn(
                    formData[field.id] && field.isBlueField && "border-blue-300 bg-blue-50/50 text-blue-900"
                  )}
                />
              )}

              {field.hint && (
                <p className="text-xs text-muted-foreground">{field.hint}</p>
              )}
            </div>
          ))}

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {filledRequired >= requiredFields.length ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">모든 필수 항목이 입력되었습니다</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {requiredFields.length - filledRequired}개 필수 항목이 남았습니다
                  </span>
                </>
              )}
            </div>
            <Button
              className="gap-2"
              disabled={filledRequired < requiredFields.length}
              onClick={handleGenerateNotice}
            >
              공고문 생성
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
