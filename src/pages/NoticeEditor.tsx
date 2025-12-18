import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { NoticeForm } from '@/components/create/NoticeForm';
import { DocumentPreview } from '@/components/create/DocumentPreview';
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
import { useQueryClient } from '@tanstack/react-query';
import { saveDocumentApi } from '@/lib/apis/document';
import { convertToExtractedData } from '@/components/common/TemplatePreview';

interface LocationState {
  documentId?: string;
  extractedData?: Record<string, string>;
}

const NoticeEditor = () => {
  const { type, subType } = useParams<{ type: string; subType: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const state = location.state as LocationState;

  // TanStack Query에서 저장된 데이터 조회
  const { data: documentData } = useQuery<{
    extractedData?: Record<string, string>;
    [key: string]: any;
  }>({
    queryKey: ['uploadedTemplateData', state?.documentId],
    queryFn: () => {
      // 캐시에서 직접 데이터를 가져옴
      return (
        queryClient.getQueryData<{
          extractedData?: Record<string, string>;
          [key: string]: any;
        }>(['uploadedTemplateData', state?.documentId]) || null
      );
    },
    enabled: !!state?.documentId,
    staleTime: Infinity,
    gcTime: Infinity, // 캐시가 삭제되지 않도록 설정
  });

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

  // 초기 렌더링: 서버에서 받은 원본 데이터 저장 (한 번만)
  useEffect(() => {
    if (isInitialized) return; // 이미 초기화되었으면 스킵

    // documentData에서 추출
    if (documentData) {
      const extractedData =
        (documentData.extractedData as Record<string, string>) ||
        (documentData as Record<string, string>);
      if (Object.keys(extractedData).length > 0) {
        setOriginalData(extractedData);
        setIsInitialized(true);
        return;
      }
    }

    // state에서 추출
    if (state?.extractedData && Object.keys(state.extractedData).length > 0) {
      setOriginalData(state.extractedData);
      setIsInitialized(true);
      return;
    }

    // 캐시에서 직접 조회
    if (state?.documentId) {
      const cachedData = queryClient.getQueryData([
        'uploadedTemplateData',
        state.documentId,
      ]) as Record<string, any> | null;

      if (cachedData) {
        const extractedData =
          (cachedData.extractedData as Record<string, string>) ||
          (cachedData.extracted_data as Record<string, string>) ||
          (cachedData as Record<string, string>);
        if (Object.keys(extractedData).length > 0) {
          setOriginalData(extractedData);
          setIsInitialized(true);
        }
      }
    }
  }, [
    documentData,
    state?.extractedData,
    state?.documentId,
    isInitialized,
    queryClient,
  ]);

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
    if (!state?.documentId) return null;

    // 서버 원본 데이터 조회
    const cachedData = queryClient.getQueryData([
      'uploadedTemplateData',
      state.documentId,
    ]) as Record<string, any> | null;

    if (!cachedData) return null;

    const sourceNode =
      cachedData?.extractedData || cachedData?.extracted_data || cachedData;

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
          : '2025년 00월 00일'),
    };
  }, [originalData, editedFields, state?.documentId, queryClient]);

  const handleSave = async () => {
    if (!state?.documentId) {
      toast({
        title: '저장 실패',
        description: '문서 ID가 없습니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // TanStack Query에서 저장된 데이터 조회
      const cachedData = queryClient.getQueryData([
        'uploadedTemplateData',
        state.documentId,
      ]) as Record<string, any> | null;

      if (!cachedData) {
        toast({
          title: '저장 실패',
          description: '저장할 데이터가 없습니다.',
          variant: 'destructive',
        });
        return;
      }

      // 서버 원본 데이터 조회 (캐시에 저장된 원본)
      const sourceNode =
        cachedData?.extractedData || cachedData?.extracted_data || cachedData;

      // 서버 원본 + 편집된 필드 병합 (editedFields 우선)
      const mergedData = {
        ...sourceNode,
        ...originalData,
        ...editedFields, // 편집된 필드가 최우선
      };

      // 필드별 명시적 매핑
      const previewData = {
        ...mergedData,
        noticeNumber:
          editedFields.noticeNumber ||
          originalData.noticeNumber ||
          sourceNode?.noticeNumber ||
          '2025-00123',
        projectName:
          editedFields.title ||
          editedFields.projectName ||
          originalData.title ||
          originalData.projectName ||
          sourceNode?.project_name ||
          sourceNode?.projectName ||
          '',
        contractPeriod:
          editedFields.period ||
          editedFields.contractPeriod ||
          originalData.period ||
          originalData.contractPeriod ||
          (sourceNode?.delivery_deadline_days
            ? `계약체결일로부터 ${sourceNode.delivery_deadline_days}일`
            : sourceNode?.contractPeriod || ''),
        estimated_amount:
          editedFields.amount ||
          editedFields.estimated_amount ||
          originalData.amount ||
          originalData.estimated_amount ||
          (sourceNode?.total_budget_vat
            ? new Intl.NumberFormat('ko-KR').format(sourceNode.total_budget_vat)
            : sourceNode?.estimated_amount || '0'),
        contactPhone:
          editedFields.contactPhone ||
          originalData.contactPhone ||
          sourceNode?.contactPhone ||
          '032-590-4000',
        contactName:
          editedFields.contactName ||
          originalData.contactName ||
          sourceNode?.contactName ||
          '담당자',
        bidSubmitStart:
          editedFields.bidSubmitStart ||
          originalData.bidSubmitStart ||
          sourceNode?.schedule?.order_request ||
          sourceNode?.bidSubmitStart ||
          '2025.11.01 10:00',
        bidSubmitEnd:
          editedFields.bidSubmitEnd ||
          originalData.bidSubmitEnd ||
          sourceNode?.schedule?.expected_delivery ||
          sourceNode?.bidSubmitEnd ||
          '2025.11.08 10:00',
        bidOpenTime:
          editedFields.bidOpenTime ||
          originalData.bidOpenTime ||
          sourceNode?.bidOpenTime ||
          '2025.11.08 11:00',
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
        productName:
          editedFields.productName ||
          originalData.productName ||
          sourceNode?.item_name ||
          sourceNode?.productName ||
          '',
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
        orgName:
          editedFields.orgName ||
          originalData.orgName ||
          sourceNode?.requesting_department ||
          sourceNode?.orgName ||
          '한국환경공단',
      };

      // ExtractedData 형식으로 변환 (편집된 formData 포함)
      const extractedData = convertToExtractedData(previewData);

      // 서버에 저장
      const saveResponse = await saveDocumentApi(
        state.documentId,
        extractedData,
        type,
        subType
      );

      // 저장 성공 후에만 캐시 업데이트 (편집된 데이터 반영)
      if (saveResponse) {
        queryClient.setQueryData(
          ['uploadedTemplateData', state.documentId],
          (oldData: any) => ({
            ...oldData,
            ...saveResponse,
            extractedData, // 편집된 데이터로 업데이트
            type,
            subType,
          })
        );
        // 저장 성공 후 편집된 필드를 원본 데이터로 반영
        setOriginalData(extractedData as Record<string, string>);
        setEditedFields({}); // 편집된 필드 초기화
      }

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
    setIsGenerating(true);
    setGenerationStatus('loading');

    try {
      // TODO: 실제 서버 API 호출로 교체
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.3) {
            resolve({ success: true });
          } else {
            reject(new Error('서버가 아직 준비되지 않았습니다'));
          }
        }, 2500);
      });

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

  const handleExport = (format: 'hwp' | 'docx' | 'pdf') => {
    setSelectedFormat(format);
    toast({
      title: '내보내기 준비',
      description: `공고문을 ${format === 'hwp' ? '한글' : format === 'docx' ? '워드' : 'PDF'} 형식으로 다운로드하고 있습니다.`,
    });
    // TODO: 실제 파일 내보내기 로직 구현
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
                  <TemplatePreview
                    documentId={state?.documentId}
                    data={previewData}
                  />
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
                <TemplatePreview
                  documentId={state?.documentId}
                  data={previewData}
                />

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
