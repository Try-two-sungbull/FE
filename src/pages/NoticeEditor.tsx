import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { NoticeForm } from '@/components/create/NoticeForm';
import { DocumentPreview } from '@/components/create/DocumentPreview';
import { TemplatePreview } from '@/components/common/TemplatePreview';
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
    queryFn: () => null, // 클라이언트 상태만 사용하므로 fetch 함수는 null 반환
    enabled: !!state?.documentId,
    staleTime: Infinity,
  });

  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  // TanStack Query에서 조회한 데이터 또는 location.state의 데이터로 formData 초기화
  useEffect(() => {
    if (documentData) {
      const extractedData =
        (documentData.extractedData as Record<string, string>) ||
        (documentData as Record<string, string>);
      setFormData(extractedData);
    } else if (state?.extractedData) {
      setFormData(state.extractedData);
    }
  }, [documentData, state?.extractedData]);

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
    setFormData(data);
  };

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

      // 데이터 변환
      const sourceNode =
        cachedData?.extractedData || cachedData?.extracted_data || cachedData;

      const previewData = sourceNode
        ? {
            ...sourceNode,
            noticeNumber: sourceNode.noticeNumber || '2025-00123',
            projectName:
              sourceNode.project_name || sourceNode.projectName || '',
            contractPeriod: sourceNode.delivery_deadline_days
              ? `계약체결일로부터 ${sourceNode.delivery_deadline_days}일`
              : sourceNode.contractPeriod || '',
            estimated_amount: sourceNode.total_budget_vat
              ? new Intl.NumberFormat('ko-KR').format(
                  sourceNode.total_budget_vat
                )
              : sourceNode.estimated_amount || '0',
            contactPhone: sourceNode.contactPhone || '032-590-4000',
            contactName: sourceNode.contactName || '담당자',
            bidSubmitStart:
              sourceNode.schedule?.order_request ||
              sourceNode.bidSubmitStart ||
              '2025.11.01 10:00',
            bidSubmitEnd:
              sourceNode.schedule?.expected_delivery ||
              sourceNode.bidSubmitEnd ||
              '2025.11.08 10:00',
            bidOpenTime: sourceNode.bidOpenTime || '2025.11.08 11:00',
            bidMethod:
              sourceNode.procurement_method_raw?.includes('소액수의') ||
              sourceNode.bidMethod === 'small'
                ? 'small'
                : 'general',
            contractMethod:
              sourceNode.procurement_method_raw?.includes('제한경쟁') ||
              sourceNode.contractMethod === 'restricted'
                ? 'restricted'
                : 'general',
            productName: sourceNode.item_name || sourceNode.productName || '',
            detail_item_codes: sourceNode.detail_item_codes ||
              sourceNode.detailItemCodes || [''],
            jointContract:
              sourceNode.is_joint_contract || sourceNode.jointContract === 'yes'
                ? 'yes'
                : 'no',
            consortiumDeadline:
              sourceNode.consortiumDeadline || '2025.11.07 18:00',
            orgName:
              sourceNode.requesting_department ||
              sourceNode.orgName ||
              '한국환경공단',
          }
        : null;

      if (!previewData) {
        toast({
          title: '저장 실패',
          description: '저장할 데이터가 없습니다.',
          variant: 'destructive',
        });
        return;
      }

      // ExtractedData 형식으로 변환
      const extractedData = convertToExtractedData(previewData);

      // 서버에 저장
      await saveDocumentApi(state.documentId, extractedData, type, subType);

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

  const handleExport = () => {
    toast({
      title: '📥 내보내기 준비',
      description: '공고문을 다운로드합니다.',
    });
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
                  onClick={handleExport}
                  className="gap-2"
                >
                  <FileDown className="h-4 w-4" />
                  내보내기
                </Button>
                <Button size="sm" onClick={handleGenerate} className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  최종 생성
                </Button>
              </div>
            </div>
          </div>

          {/* Editor Layout */}
          <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
            {/* Left Panel - Form */}
            {/* <div className="w-1/2 border-r overflow-auto p-6">
              <div className="max-w-2xl mx-auto">
                <NoticeForm
                  formData={formData}
                  type={type}
                  subType={subType}
                  onPreview={handleFormChange}
                />
              </div>
            </div> */}

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
                <TemplatePreview documentId={state?.documentId} />
              </div>
            </div>
          </div>
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
