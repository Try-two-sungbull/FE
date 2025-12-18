import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FileText,
  Search,
  Plus,
  MoreVertical,
  Copy,
  Eye,
  RotateCw,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Template, TemplateType } from '@/types';
import { getTemplates, getTemplateById, validateTemplate } from '@/lib/apis/template';
import { DocumentPreview } from '@/components/create/DocumentPreview';
import { useToast } from '@/hooks/use-toast';

// 카테고리 타입 매핑 (UI용)
type CategoryType = 'goods' | 'general-service' | 'construction' | 'all';
type SubCategoryType = '소액수의' | '적격심사' | 'all';

const categorySelectLabels: Record<CategoryType, string> = {
  'goods': '물품',
  'general-service': '용역',
  'construction': '공사',
  'all': '전체',
};

const Templates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategoryType>('all');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [validatingTemplateId, setValidatingTemplateId] = useState<number | null>(null);
  const [validationProgress, setValidationProgress] = useState(0);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  // API는 template_type만 받으므로, 서브카테고리를 template_type으로 변환
  // selectedSubCategory가 'all'이 아니면 해당 값("소액수의" 또는 "적격심사")을 template_type으로 사용
  const templateType: TemplateType | null = 
    selectedSubCategory !== 'all' ? (selectedSubCategory as TemplateType) : null;

  // 템플릿 목록 조회 (template_type이 선택된 경우에만)
  const { data: templatesData, isLoading, error } = useQuery({
    queryKey: ['templates', templateType],
    queryFn: () => {
      if (!templateType) {
        // template_type이 선택되지 않은 경우, 빈 배열 반환
        return Promise.resolve({ total: 0, template_type: '소액수의' as TemplateType, templates: [] });
      }
      return getTemplates(templateType); // 기본 50개 조회
    },
    enabled: true, // 항상 쿼리 활성화 (template_type이 없어도 처리)
  });

  // 선택된 템플릿 상세 조회
  const { data: selectedTemplate, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['template', selectedTemplateId],
    queryFn: () => getTemplateById(selectedTemplateId!),
    enabled: !!selectedTemplateId,
  });

  const templates = templatesData?.templates || [];

  // 필터링 (검색어)
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.template_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.version.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleValidateTemplate = async (template: Template) => {
    let progressInterval: ReturnType<typeof setInterval> | null = null;
    try {
      setValidatingTemplateId(template.id);
      setValidationProgress(0);
      progressInterval = setInterval(() => {
        setValidationProgress((current) => Math.min(current + 10, 90));
      }, 400);

      const response = await validateTemplate(template.template_type);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setValidationProgress(100);

      const hasChanges = response.has_changes ?? response.changes_detected ?? false;
      if (response.status === 'unchanged' || !hasChanges) {
        toast({
          title: '이미 최신입니다!',
          description: `${template.template_type} 템플릿에 변경사항이 없습니다.`,
        });
        return;
      }

      const changeItems = response.changes ?? [];
      toast({
        title: '변경사항이 있습니다',
        description: (
          <div className="space-y-1">
            {changeItems.map((change, index) => (
              <div key={`${change.type ?? 'change'}-${index}`} className="text-sm">
                <span className="font-medium">{change.type ?? '변경'}</span>
                {change.reason ? (
                  <span className="text-muted-foreground"> — {change.reason}</span>
                ) : null}
              </div>
            ))}
          </div>
        ),
      });
    } catch (validateError) {
      console.error(validateError);
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      toast({
        title: '최신화 확인 실패',
        description: '잠시 후 다시 시도해주세요.',
      });
    } finally {
      setTimeout(() => {
        setValidatingTemplateId(null);
        setValidationProgress(0);
      }, 200);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {validatingTemplateId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-lg">
            <div className="text-sm font-medium text-foreground">최신화 확인 중...</div>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${validationProgress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">{validationProgress}%</div>
          </div>
        </div>
      )}
      <Sidebar currentPath={location.pathname} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  템플릿 관리
                </h1>
                <p className="text-muted-foreground mt-1">
                  공고문 템플릿을 관리하고 재사용하세요
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />새 템플릿 만들기
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="템플릿 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value as CategoryType);
                  // 카테고리를 변경하면 서브카테고리도 초기화
                  if (value === 'all') {
                    setSelectedSubCategory('all');
                  }
                }}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{categorySelectLabels['all']}</SelectItem>
                  <SelectItem value="goods">{categorySelectLabels['goods']}</SelectItem>
                  <SelectItem value="general-service">{categorySelectLabels['general-service']}</SelectItem>
                  <SelectItem value="construction">{categorySelectLabels['construction']}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={selectedSubCategory}
                onValueChange={(value) => setSelectedSubCategory(value as SubCategoryType)}
                disabled={selectedCategory === 'all'}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="서브카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="소액수의">소액수의</SelectItem>
                  <SelectItem value="적격심사">적격심사</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-destructive">템플릿 목록을 불러오는 중 오류가 발생했습니다.</p>
              </div>
            )}

            {/* Templates Grid */}
            {!isLoading && !error && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="group relative border rounded-lg p-5 hover:shadow-md transition-all bg-card"
                    >
                      {/* Template Icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Template Info */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground text-lg">
                          {template.template_type} v{template.version}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(template.created_at).toLocaleDateString('ko-KR')}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => setSelectedTemplateId(template.id)}
                        >
                          <Eye className="h-3 w-3" />
                          상세보기
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => handleValidateTemplate(template)}
                          disabled={validatingTemplateId === template.id}
                        >
                          {validatingTemplateId === template.id ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RotateCw className="h-3 w-3" />
                          )}
                          최신화 확인하기
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      템플릿이 없습니다
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      검색 조건을 변경하거나 새 템플릿을 만들어보세요
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />새 템플릿 만들기
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* 템플릿 상세 다이얼로그 */}
      <Dialog open={!!selectedTemplateId} onOpenChange={(open) => !open && setSelectedTemplateId(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate && `${selectedTemplate.template_type} v${selectedTemplate.version}`}
            </DialogTitle>
            <DialogDescription>
              {selectedTemplate && new Date(selectedTemplate.created_at).toLocaleDateString('ko-KR')}
            </DialogDescription>
          </DialogHeader>
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : selectedTemplate?.content ? (
            <div className="mt-4">
              <div className="prose max-w-none whitespace-pre-wrap bg-muted p-6 rounded-lg">
                {selectedTemplate.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              템플릿 내용이 없습니다.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
