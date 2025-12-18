import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { StatCard } from '@/components/dashboard/StatCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentNotices } from '@/components/dashboard/RecentNotices';
import { LegalUpdates } from '@/components/dashboard/LegalUpdates';
import { TypeSelector } from '@/components/create/TypeSelector';
import { NoticeForm } from '@/components/create/NoticeForm';
import { DocumentPreview } from '@/components/create/DocumentPreview';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { TemplatePreview } from '@/components/common/TemplatePreview';

type ViewMode = 'dashboard' | 'select-type' | 'create-form';

const sampleData = {
  noticeNumber: 'N1-20251657-06',
  title: '2026년도 환경달력 제작',
  orgName: '한국환경공단',
  contractPeriod: '계약후 80일',
  amount: '89,670,000원(부가가치세 포함)',
  bidSubmitStart: '2025. 09. .(09:00)',
  bidSubmitEnd: '2025. 09. .(10:00)',
  bidOpenTime: '2025. 09. .(11:00)',
  productCode: '4411200201',
  productName: '달력',
  contactPhone: '032-590-3020',
  contactName: '박찬형 대리',
  contractPhone: '032-590-3274',
  contractName: '이미선 과장',
  consortiumDeadline: '2025. 09. .(18:00)',
};

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedType, setSelectedType] = useState<{
    type: string;
    subType: string;
  } | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location.pathname === '/create') {
      setViewMode('select-type');
    } else if (location.pathname === '/') {
      setViewMode('dashboard');
      setSelectedType(null);
      setFormData({});
    }
  }, [location.pathname]);

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleTypeSelect = (type: string, subType: string) => {
    setSelectedType({ type, subType });
    setViewMode('create-form');
  };

  const handleQuickAction = (type: string) => {
    navigate('/create');
  };

  const handleBackToSelect = () => {
    setViewMode('select-type');
    setSelectedType(null);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={location.pathname} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          {viewMode === 'dashboard' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    대시보드
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    공고문 작성 현황을 한눈에 확인하세요
                  </p>
                </div>
                <Button
                  onClick={() => handleNavigate('/create')}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />새 공고문 작성
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* {data.map((stat) => (
                <StatCard
                  key={stat.title}
                  {...stat}
                />
                ))} */}
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <QuickActions onSelectType={handleQuickAction} />
                </div>
                <div className="lg:col-span-2">
                  <RecentNotices />
                </div>
              </div>

              {/* Legal Updates */}
              <div className="lg:grid-cols-2 w-full">
                <LegalUpdates />
              </div>
            </div>
          )}

          {viewMode === 'select-type' && (
            <div className="max-w-7xl mx-auto py-8">
              <div className="mb-8">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNavigate('/')}
                  className="gap-1 -ml-2 mb-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  대시보드로 돌아가기
                </Button>
                <h1 className="text-2xl font-bold text-foreground">
                  새 공고문 작성
                </h1>
                <p className="text-muted-foreground mt-1">
                  구매 유형과 낙찰 방법을 선택하여 AI 템플릿을 생성하세요
                </p>
              </div>
              <TypeSelector onSelect={handleTypeSelect} />
            </div>
          )}

          {viewMode === 'create-form' && (
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToSelect}
                  className="gap-1 -ml-2 mb-4"
                >
                  <ArrowLeft className="h-4 w-4" />
                  유형 다시 선택
                </Button>
                <h1 className="text-2xl font-bold text-foreground">
                  공고문 작성
                </h1>
                <p className="text-muted-foreground mt-1">
                  필수 항목을 입력하거나 발주계획서를 업로드하세요
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <NoticeForm
                  type={selectedType?.type}
                  subType={selectedType?.subType}
                  onPreview={setFormData}
                  formData={formData}
                />
                <DocumentPreview data={formData} onDataChange={setFormData} />
                <TemplatePreview data={sampleData} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
