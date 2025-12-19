import { useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderToStaticMarkup } from 'react-dom/server';
import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { NoticeForm } from '@/components/create/NoticeForm';
import { TemplatePreview } from '@/components/common/TemplatePreview';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Save,
  FileDown,
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { saveDocumentApi } from '@/lib/apis/document';
// convertToExtractedData import is not used anymore in this file, or is it? It was imported.
import { convertToExtractedData } from '@/components/common/TemplatePreview';
import { generateDocumentApi, downloadDocument } from '@/lib/apis';

interface LocationState {
  documentId?: string;
  extractedData?: Record<string, string>;
  templateId?: number;
}




const NoticeEditor = () => {
  const { type, subType } = useParams<{ type: string; subType: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = location.state as LocationState;
  const documentId = state?.documentId;

  const [serverData, setServerData] = useState<Record<string, any> | null>(null);

  // 서버 원본 데이터 (기본값)
  const [originalData, setOriginalData] = useState<Record<string, string>>({});
  // 사용자가 편집한 필드만 저장 (부분 업데이트)
  const [editedFields, setEditedFields] = useState<Record<string, string>>({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'hwp' | 'docx' | 'pdf'>(
    'pdf'
  );
  const [generationStatus, setGenerationStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  // 초기 렌더링: 서버에서 받은 원본 데이터 저장
  useEffect(() => {
    if (!documentId) return;
    let cancelled = false;

    const fetchDocument = async () => {
      try {
        // API 대신 TanStack Query 캐시에서 데이터 조회
        const data = queryClient.getQueryData(['uploadedTemplateData', documentId]);

        if (cancelled) return;

        if (!data) {
          throw new Error('데이터를 찾을 수 없습니다. 다시 업로드해주세요.');
        }

        setServerData(data as Record<string, any>);

        if (!isInitialized) {
          const extractedData =
            ((data as any)?.extractedData as Record<string, string>) ||
            ((data as any)?.extracted_data as Record<string, string>) ||
            (data as Record<string, string>);

          if (extractedData && Object.keys(extractedData).length > 0) {
            // Map keys from snake_case (server) to camelCase (client components)
            const mappedData: Record<string, string> = {
              ...extractedData,
              title: extractedData.project_name || extractedData.title,
              productName: extractedData.item_name || extractedData.productName,
              // amount needs to be formatted or just string. Let's use total_budget_vat as primary.
              amount: extractedData.total_budget_vat
                ? new Intl.NumberFormat('ko-KR').format(Number(extractedData.total_budget_vat))
                : extractedData.estimated_amount
                  ? new Intl.NumberFormat('ko-KR').format(Number(extractedData.estimated_amount))
                  : '',
              period: extractedData.delivery_deadline_days
                ? `계약체결일로부터 ${extractedData.delivery_deadline_days}일`
                : extractedData.contract_period || extractedData.period,
              // Add other mappings if needed
            };
            setOriginalData(mappedData);
            setIsInitialized(true);
          }
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Failed to fetch document data:', error);
        toast({
          title: '데이터 불러오기 실패',
          description:
            error instanceof Error
              ? error.message
              : '캐시된 데이터를 가져오지 못했습니다.',
          variant: 'destructive',
        });
        // 데이터가 없으면 업로드 페이지로 이동 유도 가능
      } finally {
        // no-op
      }
    };

    fetchDocument();

    return () => {
      cancelled = true;
    };
  }, [documentId, isInitialized, toast, queryClient]);

  // 서버 원본 데이터 + 편집된 필드 병합 (NoticeForm에 전달할 데이터)
  const formData = useMemo(() => {
    // originalData가 비어있으면 빈 객체 반환 (초기화 전)
    if (Object.keys(originalData).length === 0) {
      return {};
    }

    // 값이 채워졌을 때만 병합된 데이터 반환
    const mergedData = {
      ...originalData,
      ...editedFields, // 편집된 필드가 우선
    };

    // 빈 값이면 원본 값으로 되돌리기 (period 필드 제외)
    const cleanedData: Record<string, string> = {};
    Object.keys(mergedData).forEach((key) => {
      const value = mergedData[key];
      // period 필드는 빈 값이 유지되고, 다른 필드는 원본으로 복구
      if (key === 'period') {
        cleanedData[key] = value || '';
      } else {
        cleanedData[key] =
          value === '' || value === undefined ? originalData[key] || '' : value;
      }
    });

    return cleanedData;
  }, [originalData, editedFields]);

  const getTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      goods: '물품 구매',
      'general-service': '일반용역',
      'tech-service': '기술용역',
      construction: '공사',
    };
    return type ? labels[type] || type : '';
  };

  const getSubTypeLabel = (subType?: string) => {
    const labels: Record<string, string> = {
      small: '소액수의계약',
      qualified: '적격심사',
      negotiation: '협상에 의한 계약',
      'two-stage': '2단계 입찰',
      turnkey: '턴키/대안',
    };
    return subType ? labels[subType] || subType : '';
  };

  const handleFormChange = (data: Record<string, string>) => {
    // 모든 변경된 데이터를 editedFields에 저장 (전체 formData를 저장)
    setEditedFields(data);
  };

  // Preview에 표시할 데이터 생성 (서버 원본 + 편집된 필드 병합)
  const previewData = useMemo(() => {
    if (!documentId && Object.keys(originalData).length === 0) return null;

    const sourceNode =
      serverData?.extractedData ||
      serverData?.extracted_data ||
      serverData ||
      state?.extractedData ||
      {};

    // 서버 원본 데이터 + 편집된 필드 병합 (editedFields 우선)
    const mergedData = {
      ...sourceNode,
      ...originalData,
      ...editedFields, // 편집된 필드가 최우선
    };

    // 필드별 명시적 매핑 (빈 값이면 원본으로 되돌리기, period 제외)
    const getFieldValue = (
      editedValue: string | undefined,
      originalValue: string | undefined,
      defaultValue: string,
      isOptional: boolean = false
    ) => {
      // isOptional이 true면 빈 값이 유지됨
      if (isOptional) {
        return editedValue === undefined ? '' : editedValue;
      }
      // 빈 문자열이면 원본 값 사용
      if (editedValue === '' || editedValue === undefined) {
        return originalValue || defaultValue;
      }
      return editedValue;
    };

    return {
      ...mergedData,
      noticeNumber: getFieldValue(
        editedFields.noticeNumber,
        originalData.noticeNumber || sourceNode?.noticeNumber,
        '2025-00123'
      ),
      projectName: getFieldValue(
        editedFields.title || editedFields.projectName,
        originalData.title ||
        originalData.projectName ||
        sourceNode?.project_name ||
        sourceNode?.projectName,
        ''
      ),
      contractPeriod: getFieldValue(
        editedFields.period || editedFields.contractPeriod,
        originalData.period ||
        originalData.contractPeriod ||
        (sourceNode?.delivery_deadline_days
          ? `계약체결일로부터 ${sourceNode.delivery_deadline_days}일`
          : sourceNode?.contractPeriod),
        '',
        true // isOptional: period 필드는 빈 값이 유지됨
      ),
      estimated_amount: getFieldValue(
        editedFields.amount || editedFields.estimated_amount,
        originalData.amount ||
        originalData.estimated_amount ||
        (sourceNode?.total_budget_vat
          ? new Intl.NumberFormat('ko-KR').format(sourceNode.total_budget_vat)
          : sourceNode?.estimated_amount),
        '0'
      ),
      contactPhone: getFieldValue(
        editedFields.contactPhone,
        originalData.contactPhone || sourceNode?.contactPhone,
        '032-590-4000'
      ),
      contactName: getFieldValue(
        editedFields.contactName,
        originalData.contactName || sourceNode?.contactName,
        '담당자'
      ),
      bidSubmitStart: getFieldValue(
        editedFields.bidSubmitStart,
        originalData.bidSubmitStart ||
        sourceNode?.schedule?.order_request ||
        sourceNode?.bidSubmitStart,
        '2025.11.01 10:00'
      ),
      bidSubmitEnd: getFieldValue(
        editedFields.bidSubmitEnd,
        originalData.bidSubmitEnd ||
        sourceNode?.schedule?.expected_delivery ||
        sourceNode?.bidSubmitEnd,
        '2025.11.08 10:00'
      ),
      bidOpenTime: getFieldValue(
        editedFields.bidOpenTime,
        originalData.bidOpenTime || sourceNode?.bidOpenTime,
        '2025.11.08 11:00'
      ),
      bidMethod:
        editedFields.bidMethod ||
        originalData.bidMethod ||
        (sourceNode?.procurement_method_raw?.includes('소액수의') ||
          sourceNode?.bidMethod === 'small'
          ? 'small'
          : 'general'),
      contractMethod:
        editedFields.contractMethod ||
        originalData.contractMethod ||
        (sourceNode?.procurement_method_raw?.includes('제한경쟁') ||
          sourceNode?.contractMethod === 'restricted'
          ? 'restricted'
          : 'general'),
      productName: getFieldValue(
        editedFields.productName,
        originalData.productName ||
        sourceNode?.item_name ||
        sourceNode?.productName,
        ''
      ),
      detail_item_codes: sourceNode?.detail_item_codes ||
        sourceNode?.detailItemCodes || [''],
      jointContract:
        editedFields.jointContract ||
        originalData.jointContract ||
        (sourceNode?.is_joint_contract || sourceNode?.jointContract === 'yes'
          ? 'yes'
          : 'no'),
      consortiumDeadline:
        editedFields.consortiumDeadline ||
        originalData.consortiumDeadline ||
        sourceNode?.consortiumDeadline ||
        '2025.11.07 18:00',
      orgName: getFieldValue(
        editedFields.orgName,
        originalData.orgName ||
        sourceNode?.requesting_department ||
        sourceNode?.orgName,
        '한국환경공단'
      ),
      goodsContactInfo:
        editedFields.goodsContactInfo ||
        originalData.goodsContactInfo ||
        'oooo처 ooo부(☎ oooo-oooo-oooo, 담당 : oooo)',
      bidContactInfo:
        editedFields.bidContactInfo ||
        originalData.bidContactInfo ||
        'oooo처 ooo부(☎ oooo-oooo-oooo, 담당 : oooo)',
      noticeDate:
        editedFields.noticeDate ||
        originalData.noticeDate ||
        (sourceNode?.document_date
          ? sourceNode.document_date.includes('일')
            ? sourceNode.document_date
            : `${sourceNode.document_date} 00일`
          : new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })),
    };
  }, [documentId, serverData, originalData, editedFields, state?.extractedData]);

  const handleSave = async () => {
    if (!documentId) {
      toast({
        title: '저장 실패',
        description: '문서 ID가 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // ExtractedData 형식으로 변환 (편집된 formData 포함)
      const extractedData = convertToExtractedData(previewData);

      // 서버에 저장
      const saveResponse = await saveDocumentApi(
        documentId,
        extractedData,
        type,
        subType
      );

      // 저장 성공 후 편집된 필드를 원본 데이터로 반영
      setOriginalData(extractedData as Record<string, string>);
      setServerData((prev) => ({
        ...(prev || {}),
        ...saveResponse,
        extractedData,
      }));
      setEditedFields({}); // 편집된 필드 초기화

      toast({
        title: '💾 저장 완료',
        description: '공고문이 서버에 저장되었습니다.',
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: '저장 실패',
        description:
          error instanceof Error
            ? error.message
            : '서버 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerate = async () => {
    if (!state?.templateId) {
      toast({
        title: '템플릿 ID 누락',
        description: '템플릿 ID가 없습니다. 다시 업로드해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGenerationStatus('loading');

    try {
      // 1. Render TemplatePreview to HTML string
      const queryClientForStatic = new QueryClient();

      const htmlString = renderToStaticMarkup(
        <QueryClientProvider client={queryClientForStatic}>
          <TemplatePreview
            data={previewData}
          // documentId omitted intentionally to force usage of propData
          />
        </QueryClientProvider>
      );

      // 2. Call API
      const classification = serverData?.classification || { type, subType };

      const response = await generateDocumentApi({
        extracted_data: previewData as Record<string, unknown>, // or serverData?.extractedData?
        classification,
        template_id: state.templateId,
        format: 'markdown',
        html: htmlString,
      });

      console.log('Generated content:', response.content);

      setGenerationStatus('success');
      toast({
        title: '최종 공고문 생성 완료',
        description: '공고문이 성공적으로 생성되었습니다.',
      });

      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStatus('idle');
      }, 1500);
    } catch (error) {
      console.error('Generation Error:', error);
      setGenerationStatus('error');
      toast({
        title: '생성 실패',
        description:
          error instanceof Error ? error.message : '서버 연결에 실패했습니다.',
        variant: 'destructive',
      });

      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStatus('idle');
      }, 2000);
    }
  };

  const handleGenerateNotice = () => {
    setShowPreview(true);
  };

  const handleExport = async (format: 'hwp' | 'docx' | 'pdf') => {
    if (!state?.templateId) {
      toast({
        title: '템플릿 ID 누락',
        description: '템플릿 ID가 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFormat(format);
    setIsGenerating(true);
    setGenerationStatus('loading');

    toast({
      title: '내보내기 시작',
      description: `공고문을 ${format === 'hwp' ? '한글' : format === 'docx' ? '워드' : 'PDF'} 형식으로 변환하고 있습니다.`,
    });

    try {
      const queryClientForStatic = new QueryClient();
      const htmlString = renderToStaticMarkup(
        <QueryClientProvider client={queryClientForStatic}>
          <TemplatePreview
            data={previewData}
          />
        </QueryClientProvider>
      );

      const classification = serverData?.classification || { type, subType };

      const response = await generateDocumentApi({
        extracted_data: previewData as Record<string, unknown>,
        classification,
        template_id: 6,
        format: format,
        html: htmlString,
      });

      // Download file
      downloadDocument(response);

      setGenerationStatus('success');
      toast({
        title: '내보내기 완료',
        description: '파일이 다운로드되었습니다.',
      });

    } catch (error) {
      console.error("Export failed:", error);
      setGenerationStatus('error');
      toast({
        title: '내보내기 실패',
        description: '파일 생성 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationStatus('idle');
      }, 1500);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentPath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-hidden">
          {/* Top Bar */}
          <div className="border-b bg-card px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  뒤로
                </Button>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    공고문 미리보기
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {getTypeLabel(type)} · {getSubTypeLabel(subType)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditMode ? (
                  <>
                    <Button
                      size="sm"
                      onClick={() => {
                        // 완료: editedFields를 formFields id에서 미리보기 필드명으로 매핑
                        if (Object.keys(editedFields).length > 0) {
                          const mappedData = { ...editedFields };

                          // formFields id → previewData 필드명 매핑
                          if (editedFields.title) {
                            mappedData.projectName = editedFields.title;
                          }
                          if (editedFields.period) {
                            mappedData.contractPeriod = editedFields.period;
                          }
                          if (editedFields.amount) {
                            mappedData.estimated_amount = editedFields.amount;
                          }

                          setOriginalData((prev) => ({
                            ...prev,
                            ...mappedData,
                          }));
                        }
                        setIsEditMode(false);
                      }}
                      className="gap-2 bg-success hover:bg-success/90"
                    >
                      <Check className="h-4 w-4" />
                      완료
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // 취소: 편집 내용 버림
                        setEditedFields({});
                        setIsEditMode(false);
                      }}
                      className="gap-2"
                    >
                      <X className="h-4 w-4" />
                      취소
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditMode(true)}
                      className="gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      편집
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSave}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      저장
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport(selectedFormat)}
                      className="gap-2"
                    >
                      <FileDown className="h-4 w-4" />
                      내보내기
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleGenerate}
                      className="gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      최종 생성
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Editor Layout */}
          {!showPreview ? (
            <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
              {/* Left Panel - Form */}
              <div className="w-1/2 border-r overflow-auto p-6">
                <div className="max-w-2xl mx-auto">
                  <NoticeForm
                    formData={formData}
                    type={type}
                    subType={subType}
                    onPreview={handleFormChange}
                    onGenerateNotice={handleGenerateNotice}
                    isEditMode={isEditMode}
                  />
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="w-full overflow-auto bg-muted/30 p-6">
                <div className="max-w-3xl mx-auto">
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      미리보기
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      실시간으로 공고문을 확인하세요
                    </p>
                  </div>
                  <TemplatePreview documentId={documentId} data={previewData} />
                </div>
              </div>
            </div>
          ) : (
            /* Full Screen Preview with Export */
            <div className="h-[calc(100vh-8rem)] overflow-auto bg-white p-6">
              <div className="max-w-4xl mx-auto">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      최종 공고문 미리보기
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      공고문 내용을 확인하고 파일 형식을 선택하여 다운로드하세요
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(false)}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    수정하기
                  </Button>
                </div>
                <TemplatePreview documentId={documentId} data={previewData} />

                {/* Export Options - TemplatePreview 외부 */}
                <div className="mt-8 pt-8 border-t border-gray-300 flex items-center gap-3 justify-center">
                  <span className="text-sm font-medium text-foreground">
                    파일 형식 선택:
                  </span>
                  <Select
                    defaultValue={selectedFormat}
                    onValueChange={(value) => {
                      setSelectedFormat(value as 'hwp' | 'docx' | 'pdf');
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hwp">한글 (.hwp)</SelectItem>
                      <SelectItem value="docx">워드 (.docx)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={() => handleExport(selectedFormat)}
                  >
                    <FileDown className="h-4 w-4" />
                    다운로드
                  </Button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 최종 생성 로딩 다이얼로그 */}
      <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {generationStatus === 'loading' && (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  최종 공고문 생성 중...
                </>
              )}
              {generationStatus === 'success' && (
                <>
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  생성 완료
                </>
              )}
              {generationStatus === 'error' && (
                <>
                  <XCircle className="h-5 w-5 text-destructive" />
                  생성 실패
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {generationStatus === 'loading' && (
                <div className="space-y-3 py-4">
                  <p>서버에서 최종 공고문을 생성하고 있습니다.</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      데이터 검증 중...
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      />
                      문서 포맷 생성 중...
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div
                        className="h-2 w-2 rounded-full bg-primary animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      />
                      최종 검토 중...
                    </div>
                  </div>
                </div>
              )}
              {generationStatus === 'success' && (
                <p className="py-4 text-success">
                  최종 공고문이 성공적으로 생성되었습니다.
                </p>
              )}
              {generationStatus === 'error' && (
                <div className="py-4 space-y-2">
                  <p className="text-destructive">
                    서버가 아직 준비되지 않았습니다.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    잠시 후 다시 시도해주세요.
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          {generationStatus === 'error' && (
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsGenerating(false)}>
                닫기
              </Button>
              <Button onClick={handleGenerate}>다시 시도</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticeEditor;
