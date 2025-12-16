import { useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "textarea" | "date";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  hint?: string;
  aiGenerated?: boolean;
}

const formFields: FormField[] = [
  {
    id: "title",
    label: "공고명",
    type: "text",
    placeholder: "예: 사무용 컴퓨터 구매",
    required: true,
  },
  {
    id: "amount",
    label: "추정가격",
    type: "number",
    placeholder: "원 단위로 입력",
    required: true,
    hint: "부가세 포함 금액",
  },
  {
    id: "contractMethod",
    label: "계약 방법",
    type: "select",
    required: true,
    options: [
      { value: "general", label: "일반경쟁" },
      { value: "limited", label: "제한경쟁" },
      { value: "designated", label: "지명경쟁" },
      { value: "private", label: "수의계약" },
    ],
  },
  {
    id: "contractType",
    label: "계약 구분",
    type: "select",
    required: true,
    options: [
      { value: "unit", label: "단가계약" },
      { value: "total", label: "총액계약" },
      { value: "long-term", label: "장기계속계약" },
    ],
  },
  {
    id: "period",
    label: "계약 기간",
    type: "text",
    placeholder: "예: 계약일로부터 30일",
    required: true,
    aiGenerated: true,
  },
  {
    id: "deliveryLocation",
    label: "납품 장소",
    type: "text",
    placeholder: "예: 본청 물류창고",
    aiGenerated: true,
  },
  {
    id: "qualifications",
    label: "입찰 참가 자격",
    type: "textarea",
    placeholder: "입찰 참가에 필요한 자격 요건을 입력해주세요",
    required: true,
    aiGenerated: true,
  },
];

interface NoticeFormProps {
  type?: string;
  subType?: string;
  onPreview?: (data: Record<string, string>) => void;
}

export function NoticeForm({ type, subType, onPreview }: NoticeFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    onPreview?.({ ...formData, [id]: value });
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate file processing
    setTimeout(() => {
      setIsUploading(false);
      // Auto-fill demo data
      setFormData({
        title: "사무용 컴퓨터 구매",
        amount: "45000000",
        contractMethod: "general",
        contractType: "total",
        period: "계약일로부터 30일",
        deliveryLocation: "본청 전산실",
        qualifications: "「소프트웨어 진흥법」에 따른 소프트웨어사업자로 등록된 업체\n「중소기업기본법」 제2조에 따른 중소기업",
      });
    }, 1500);
  };

  const filledCount = Object.values(formData).filter(Boolean).length;
  const totalRequired = formFields.filter((f) => f.required).length;

  return (
    <div className="space-y-6">
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
              <h3 className="font-semibold mb-1">발주계획서 업로드</h3>
              <p className="text-sm text-muted-foreground mb-3">
                한글(.hwp) 또는 PDF 파일을 업로드하면 AI가 자동으로 항목을 채워드립니다
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
                    분석 중...
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
            필수 항목 입력
          </CardTitle>
          <Badge variant="outline" className="font-normal">
            {filledCount} / {totalRequired} 완료
          </Badge>
        </CardHeader>
        <CardContent className="space-y-5">
          {formFields.map((field) => (
            <div key={field.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor={field.id} className="text-sm font-medium">
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-0.5">*</span>
                  )}
                </Label>
                {field.aiGenerated && formData[field.id] && (
                  <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px] gap-1">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI 추천
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
                    formData[field.id] && field.aiGenerated && "border-accent/50 bg-accent/5"
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
                  <SelectTrigger>
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
                  rows={4}
                  className={cn(
                    formData[field.id] && field.aiGenerated && "border-accent/50 bg-accent/5"
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
              {filledCount >= totalRequired ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-success font-medium">모든 필수 항목이 입력되었습니다</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {totalRequired - filledCount}개 필수 항목이 남았습니다
                  </span>
                </>
              )}
            </div>
            <Button className="gap-2" disabled={filledCount < totalRequired}>
              미리보기
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
