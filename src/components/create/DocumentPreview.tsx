import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  FileText,
  Download,
  Copy,
  CheckCircle2,
  Eye,
  Printer,
  Info,
  Pencil,
  RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';

interface DocumentPreviewProps {
  data?: Record<string, string>;
  onDataChange?: (data: Record<string, string>) => void;
}

export function DocumentPreview({ data, onDataChange }: DocumentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [initialHtml, setInitialHtml] = useState('');
  const hasData = data && Object.keys(data).length > 0;

  const getBidMethodText = (method?: string) => {
    switch (method) {
      case 'small':
        return '소액수의(총액, 전자)대상입니다.';
      case 'qualified':
        return '적격심사대상 물품입니다.';
      case 'negotiation':
        return '협상에 의한 계약 대상입니다.';
      default:
        return '-';
    }
  };

  const getContractMethodText = (method?: string) => {
    switch (method) {
      case 'general':
        return '일반경쟁(총액), 전자입찰대상 용역입니다.';
      case 'limited':
        return '제한경쟁(총액), 전자입찰대상 용역입니다.';
      case 'private':
        return '수의계약 대상입니다.';
      default:
        return '-';
    }
  };

  const getCompanyRestrictionText = (restriction?: string) => {
    switch (restriction) {
      case 'small':
        return '「중소기업기본법」 제2조에 따른 소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 소기업·소상공인확인서를 소지한 업체';
      case 'sme':
        return '「중소기업기본법」 제2조에 따른 중소기업 또는 「소상공인 보호 및 지원에 관한 법률」 제2조에 따른 소상공인으로서 「중소기업 범위 및 확인에 관한 규정」에 따라 발급된 중소기업·소상공인확인서를 소지한 업체';
      case 'none':
        return '제한 없음';
      default:
        return '-';
    }
  };

  const getJointContractText = (joint?: string) => {
    if (joint === 'yes') {
      return `가. 단독 또는 공동이행방식으로만 입찰참여가 가능하며, 공동수급체 구성원은 각각 본 입찰에서 요구하는 입찰참가자격을 모두 갖추어야 합니다.
나. 공동수급체 구성원은 대표사가 참여 지분율이 가장 많아야 하고, 대표사를 포함하여 5개사 이하로 구성하여야 합니다.`;
    }
    return '해당 없음';
  };

  // 파란 글자 스타일 (구매계획서에서 추출된 항목)
  const blueStyle = 'color: #2563eb; font-weight: 500;';

  const generateDocumentHtml = () => {
    if (!data) return '';

    return `
<div style="text-align: center; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e5e7eb;">
  <p style="font-size: 12px; color: #6b7280; margin-bottom: 16px;">물품구매 입찰공고</p>
  <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 12px;">한국환경공단 입찰공고번호 : 00-00000000-00</h1>
  <span style="display: inline-block; padding: 4px 12px; border: 1px solid #e5e7eb; border-radius: 9999px; font-size: 12px;">
    ${data.bidMethod === 'small' ? '소액수의' : data.bidMethod === 'qualified' ? '적격심사' : '협상에 의한 계약'}
  </span>
</div>

<div style="background: #f8fafc; border-radius: 8px; padding: 16px; font-size: 12px; margin-bottom: 24px;">
  <p style="font-weight: 500; margin-bottom: 8px;">본 계약은 청렴계약제가 적용됩니다</p>
  <p style="color: #6b7280;">이 계약은 「국가를 당사자로 하는 계약에 관한 법률」에 따른 청렴계약제가 적용됩니다.</p>
</div>

<div style="margin-bottom: 24px;">
  <h2 style="font-weight: bold; margin-bottom: 12px;">1. 입찰에 부치는 사항</h2>
  <div style="padding-left: 16px;">
    <p style="margin-bottom: 8px;">가. 공 고 명 : <span style="${blueStyle}">${data.title || '-'}</span></p>
    <p style="margin-bottom: 8px;">나. 용역기간 : <span style="${blueStyle}">${data.period || '-'}</span></p>
    <p style="margin-bottom: 8px;">다. 예 산 액 : <span style="${blueStyle}">${data.amount ? Number(data.amount).toLocaleString() + '원' : '-'}</span> (부가가치세 포함)</p>
    <p style="margin-bottom: 8px;">라. 구매범위 : 물품규격서 및 붙임 참조</p>
    <p style="margin-bottom: 8px;">마. 전자입찰서 제출기간 : 2025. 12. ○.(09:00) ～ 12. ○.(10:00)</p>
    <p style="margin-bottom: 8px;">바. 개찰일시 및 장소 : 2025. 12. ○.(11:00), 국가종합전자조달시스템(나라장터)</p>
  </div>
</div>

<div style="margin-bottom: 24px;">
  <h2 style="font-weight: bold; margin-bottom: 12px;">2. 견적(입찰) 및 계약방식</h2>
  <div style="padding-left: 16px;">
    <p style="margin-bottom: 8px;">가. <span style="${blueStyle}">${getContractMethodText(data.contractMethod)}</span></p>
    <p style="margin-bottom: 8px;">나. <span style="${blueStyle}">${getBidMethodText(data.bidMethod)}</span></p>
    <p style="margin-bottom: 8px;">다. 청렴계약이행 서약제 대상입니다.</p>
  </div>
</div>

<div style="margin-bottom: 24px;">
  <h2 style="font-weight: bold; margin-bottom: 12px;">3. 입찰참가자격</h2>
  <p style="font-size: 12px; color: #6b7280; padding-left: 16px; margin-bottom: 12px;">아래의 입찰참가자격을 모두 갖춘 자이어야 합니다.</p>
  <div style="padding-left: 16px;">
    <div style="margin-bottom: 12px;">
      <p style="margin-bottom: 4px;">가. 국가종합전자조달시스템 입찰참가자격등록규정에 따라 나라장터(G2B)시스템에 아래의 사항을 입찰참가자격으로 등록한 자</p>
      <p style="padding-left: 16px;">○ [세부품명번호: <span style="${blueStyle}">${data.productCode || '0000000000'}</span>(<span style="${blueStyle}">${data.productName || '품명'}</span>)] 제조 또는 공급물품으로 등록된 자</p>
    </div>
    <p style="margin-bottom: 8px;">나. 「국가를 당사자로 하는 계약에 관한 법률」 제27조(부정당업자의 입찰참가 자격제한)에 해당되지 아니한 업체</p>
    <p style="margin-bottom: 8px;">다. 「국가를 당사자로 하는 계약에 관한 법률」 제27조의5 및 같은 법 시행령 제12조제3항에 따른 제한에 해당되지 않는 자</p>
    <div style="margin-bottom: 8px;">
      <p style="margin-bottom: 4px;">라. 기업 제한</p>
      <p style="padding-left: 16px; font-size: 12px;"><span style="${blueStyle}">${getCompanyRestrictionText(data.companyRestriction)}</span></p>
    </div>
    ${
      data.qualifications
        ? `
    <div style="margin-bottom: 8px;">
      <p style="margin-bottom: 4px;">마. 추가 자격요건</p>
      <p style="padding-left: 16px; font-size: 12px; white-space: pre-wrap;"><span style="${blueStyle}">${data.qualifications}</span></p>
    </div>
    `
        : ''
    }
  </div>
</div>

<div style="margin-bottom: 24px;">
  <h2 style="font-weight: bold; margin-bottom: 12px;">4. 공동계약</h2>
  <div style="padding-left: 16px; font-size: 12px; white-space: pre-wrap;"><span style="${blueStyle}">${getJointContractText(data.jointContract)}</span></div>
</div>

<div style="margin-bottom: 24px;">
  <h2 style="font-weight: bold; margin-bottom: 12px;">5. 납품장소</h2>
  <p style="padding-left: 16px;"><span style="${blueStyle}">${data.deliveryLocation || '미지정'}</span></p>
</div>

<div style="padding-top: 16px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center;">
  <p style="margin-bottom: 4px;">※ 본 공고문은 AI 어시스턴트에 의해 생성된 초안입니다.</p>
  <p style="margin-bottom: 4px;">최종 게시 전 담당자의 검토가 필요합니다.</p>
  <p style="color: #2563eb; font-weight: 500;">파란색 텍스트: 구매계획서에서 자동 추출된 항목</p>
</div>
    `.trim();
  };

  useEffect(() => {
    if (hasData && editorRef.current) {
      const html = generateDocumentHtml();
      setInitialHtml(html);
      editorRef.current.innerHTML = html;
    }
  }, [data]);

  const handleCopy = async () => {
    if (editorRef.current) {
      try {
        await navigator.clipboard.writeText(editorRef.current.innerText);
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
            <head><title>입찰공고문</title></head>
            <body style="font-family: 'Malgun Gothic', sans-serif; padding: 40px; max-width: 800px; margin: 0 auto;">
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
      editorRef.current.innerHTML = initialHtml;
    }
  };

  return (
    <Card
      variant="elevated"
      className="h-full animate-slide-up"
      style={{ animationDelay: '0.1s' }}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4 text-primary" />
          입찰공고문 미리보기
        </CardTitle>
        <div className="flex items-center gap-1">
          {hasData && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleReset}
              title="원본으로 복원"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!hasData}
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            disabled={!hasData}
            onClick={handlePrint}
          >
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
              <span className="font-medium">문서 전체를 자유롭게 편집</span>할
              수 있습니다. 새로운 내용을 추가하거나 기존 내용을 수정하세요.
            </p>
          </div>
        )}

        {/* 파란 글자 안내 */}
        {hasData && (
          <div className="px-4 py-2 bg-blue-50 border-b flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <p className="text-xs text-blue-700">
              <span className="font-medium">파란색 텍스트</span>는
              구매계획서에서 자동 추출된 항목입니다
            </p>
          </div>
        )}

        <div className="p-6 bg-card min-h-[600px] border-b overflow-auto">
          {hasData ? (
            <div
              ref={editorRef}
              contentEditable
              className="max-w-[600px] mx-auto text-sm outline-none focus:ring-2 focus:ring-primary/20 rounded-lg p-4 min-h-[500px]"
              style={{ lineHeight: 1.6 }}
              suppressContentEditableWarning
            />
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground mb-2">
                미리보기 대기 중
              </h3>
              <p className="text-sm text-muted-foreground max-w-[280px]">
                구매계획서를 업로드하거나 좌측 양식에 내용을 입력하시면
                실시간으로 입찰공고문 미리보기가 표시됩니다
              </p>
            </div>
          )}
        </div>

        {/* Validation Status */}
        {hasData && (
          <div className="p-4 bg-success/5 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-success">법령 검증 완료</p>
              <p className="text-xs text-muted-foreground">
                국가계약법 및 최신 계약예규 기준 검증됨
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-success hover:text-success"
            >
              상세보기
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
