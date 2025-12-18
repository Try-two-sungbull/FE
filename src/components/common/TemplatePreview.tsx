import React, { useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Copy, Printer, RotateCcw, Pencil, Info, CheckCircle2 } from 'lucide-react';

interface TemplatePreviewProps {
    template: string;
    data: Record<string, any>;
    title?: string;
    onDataChange?: (data: Record<string, any>) => void;
    editable?: boolean;
}

/**
 * AI 추출 데이터와 HTML 템플릿을 결합하여 미리보기를 제공하는 컴포넌트
 */
export function TemplatePreview({
    template,
    data,
    title = '입찰공고문 미리보기',
    editable = true,
}: TemplatePreviewProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    // 템플릿에 데이터 바인딩
    const htmlContent = useMemo(() => {
        let content = template;

        // 1. 단순 텍스트 치환 {{key}} -> value
        Object.keys(data).forEach((key) => {
            const value = data[key];
            // null/undefined check
            const safeValue = value === null || value === undefined ? '' : String(value);
            content = content.replace(new RegExp(`{{${key}}}`, 'g'), safeValue);
        });

        // 2. 조건부 렌더링 블록 처리 ({{#if key}} ... {{/if}})
        const ifRegex = /{{#if\s+(\w+)}}([\s\S]*?){{\/if}}/g;
        content = content.replace(ifRegex, (match, key, innerContent) => {
            return data[key] ? innerContent : '';
        });

        return content;
    }, [template, data]);

    // 에디터 초기화
    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.innerHTML = htmlContent;
        }
    }, [htmlContent]);

    const handleCopy = async () => {
        if (editorRef.current) {
            try {
                await navigator.clipboard.writeText(editorRef.current.innerText);
                alert('내용이 클립보드에 복사되었습니다.');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const handlePrint = () => {
        if (editorRef.current) {
            const printWindow = window.open('', '_blank');
            if (printWindow) {
                printWindow.document.write(`
          <html>
            <head>
              <title>${title}</title>
              <style>
                body { font-family: 'Malgun Gothic', 'Dotum', sans-serif; padding: 40px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 8px; }
              </style>
            </head>
            <body>
              ${editorRef.current.innerHTML}
            </body>
          </html>
        `);
                printWindow.document.close();
                printWindow.print();
            }
        }
    };

    const handleReset = () => {
        if (editorRef.current) {
            editorRef.current.innerHTML = htmlContent;
        }
    };

    return (
        <Card className="h-full flex flex-col shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b shrink-0">
                <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="h-4 w-4 text-primary" />
                    {title}
                </CardTitle>
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleReset} title="원본으로 복원">
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCopy} title="복사">
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handlePrint} title="인쇄">
                        <Printer className="h-4 w-4" />
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
                {/* 안내 메시지 */}
                {editable && (
                    <div className="px-4 py-2 bg-blue-50 border-b flex items-center gap-2 shrink-0">
                        <Info className="h-4 w-4 text-blue-600" />
                        <p className="text-xs text-blue-700">
                            <span className="font-medium">템플릿 미리보기 모드</span>: AI 추출 데이터가 적용된 결과입니다.
                        </p>
                    </div>
                )}

                {/* 렌더링 영역 */}
                <div className="flex-1 overflow-auto bg-slate-50 p-6">
                    <div
                        ref={editorRef}
                        contentEditable={editable}
                        suppressContentEditableWarning
                        className="max-w-[800px] mx-auto bg-white shadow-sm border p-8 min-h-[600px] outline-none focus:ring-2 focus:ring-primary/20 rounded-sm text-sm leading-relaxed"
                    >
                        {/* HTML이 여기에 주입됩니다 */}
                    </div>
                </div>

                {/* 하단 상태바 */}
                <div className="p-3 bg-white border-t flex items-center gap-2 text-xs text-gray-500 shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>데이터 바인딩 완료</span>
                </div>
            </CardContent>
        </Card>
    );
}

// PDF 파일명 기반 Mock Template 구현
// 키워드: 소액수의, 국가계약, 직접생산증명서, 세부품명번호, 소기업, 공동
export const MOCK_NOTICE_TEMPLATE = `
<div style="font-family: 'Malgun Gothic', dotum, sans-serif; max-width: 800px; margin: 0 auto; line-height: 1.6;">
  
  <!-- 헤더 -->
  <div style="text-align: center; margin-bottom: 40px; border-bottom: 3px double #000; padding-bottom: 20px;">
    <p style="font-size: 14px; color: #666; margin-bottom: 10px;">물품구매 입찰공고(소액수의)</p>
    <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #000;">{{noticeNumber}}</h1>
  </div>

  <!-- 1. 입찰에 부치는 사항 -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 18px; font-weight: bold; padding-left: 10px; border-left: 5px solid #2563eb; margin-bottom: 15px;">1. 입찰에 부치는 사항</h2>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #ccc;">
      <colgroup>
        <col style="width: 30%; background-color: #f3f4f6;">
        <col style="width: 70%;">
      </colgroup>
      <tbody>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">가. 수요기관</th>
          <td style="padding: 10px; border: 1px solid #ddd;">{{orgName}}</td>
        </tr>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">나. 공 고 명</th>
          <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">{{title}}</td>
        </tr>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">다. 계약방법</th>
          <td style="padding: 10px; border: 1px solid #ddd;">소액수의(총액) / 제한경쟁 / 전자입찰</td>
        </tr>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">라. 배정예산</th>
          <td style="padding: 10px; border: 1px solid #ddd; color: #2563eb; font-weight: bold;">{{amount}} (VAT 포함)</td>
        </tr>
        <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">마. 납품기한</th>
          <td style="padding: 10px; border: 1px solid #ddd;">{{deliveryPeriod}}</td>
        </tr>
         <tr>
          <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">바. 납품장소</th>
          <td style="padding: 10px; border: 1px solid #ddd;">{{deliveryLocation}}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 2. 입찰참가자격 -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 18px; font-weight: bold; padding-left: 10px; border-left: 5px solid #2563eb; margin-bottom: 15px;">2. 입찰참가자격</h2>
    <div style="font-size: 14px; padding: 20px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
      <p style="margin-bottom: 10px;">가. 「국가를 당사자로 하는 계약에 관한 법률 시행령」 제12조 및 동법 시행규칙 제14조에 의한 경쟁입찰 참가자격을 갖춘 자로서, 아래의 자격을 모두 갖춘 자이어야 합니다.</p>
      
      <p style="margin-bottom: 8px; font-weight: bold;">나. 국가종합전자조달시스템 입찰참가자격등록규정에 의하여 G2B에 입찰마감일 전일까지 다음의 세부품명번호를 제조 또는 공급물품으로 등록한 자</p>
      <div style="margin-left: 20px; margin-bottom: 15px; color: #2563eb;">
        - 세부품명번호(10자리): {{productCode}} ({{productName}})
      </div>

      <p style="margin-bottom: 8px; font-weight: bold;">다. 「중소기업제품 구매촉진 및 판로지원에 관한 법률」 제9조 및 동법 시행규칙 제5조에 따라 직접생산확인증명서를 소지한 자</p>
      <div style="margin-left: 20px; margin-bottom: 15px; color: #4b5563;">
        - 세부품명: {{productName}}<br>
        ※ 유효기간 내에 있어야 하며, 중소기업제품 공공구매 종합정보망에서 확인 가능해야 함
      </div>

      <p style="margin-bottom: 8px; font-weight: bold;">라. 기업 구분 제한</p>
      <div style="margin-left: 20px; margin-bottom: 15px;">
        - 「중소기업기본법」 제2조에 따른 소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 확인서를 소지한 업체
      </div>
      
      {{#if qualifications}}
      <div style="margin-top: 15px; padding-top: 15px; border-top: 1px dashed #cbd5e1;">
        <p style="font-weight: bold; color: #dc2626;">[기타 제한사항]</p>
        <p>{{qualifications}}</p>
      </div>
      {{/if}}
    </div>
  </div>

  <!-- 3. 공동수급 -->
  <div style="margin-bottom: 40px;">
    <h2 style="font-size: 18px; font-weight: bold; padding-left: 10px; border-left: 5px solid #2563eb; margin-bottom: 15px;">3. 공동수급에 관한 사항</h2>
    <div style="font-size: 14px;">
      <p>가. 공동수급(공동이행방식)을 허용합니다.</p>
      <p>나. 공동수급체 구성원은 대표사를 포함하여 5인 이하로 구성하여야 하며, 구성원별 최소 지분율은 10% 이상이어야 합니다.</p>
      <p>다. 공동수급협정서 제출기한: 입찰서 제출 마감일 전일 18:00까지</p>
    </div>
  </div>

  <div style="text-align: center; margin-top: 60px; color: #64748b; font-size: 13px;">
    <p>위와 같이 공고합니다.</p>
    <p style="margin-top: 20px; font-weight: bold; font-size: 16px; color: #000;">2025년 12월 18일</p>
    <p style="font-weight: bold; font-size: 18px; color: #000; margin-top: 10px;">{{orgName}} 계약관</p>
  </div>
</div>
`;
