import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { NoticeForm } from '@/components/create/NoticeForm';
import { DocumentPreview } from '@/components/create/DocumentPreview';
import { Save, FileDown, Sparkles, ArrowLeft } from 'lucide-react';
import { ExtractedData, PurchaseType, PurchaseSubType } from '@/types';

interface LocationState {
    documentId: string;
    extractedData: ExtractedData;
}

const TemplateEditor = () => {
    const { type, subType } = useParams<{ type: PurchaseType; subType: PurchaseSubType }>();
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;

    const [formData, setFormData] = useState<ExtractedData>(
        state?.extractedData
    );

    useEffect(() => {
        // Redirect if no state data
        if (!state?.extractedData) {
            navigate('/upload');
        }
    }, [state, navigate]);

    const handleFormChange = (data: ExtractedData) => {
        setFormData(data);
    };

    const handleSave = () => {
        // TODO: Implement save functionality
        console.log('Saving template...', formData);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log('Exporting document...', formData);
    };

    const handleGenerate = () => {
        // TODO: Implement final generation
        console.log('Generating final document...', formData);
    };

    const getTypeLabel = (type?: string) => {
        const labels: Record<string, string> = {
            'goods': '물품 구매',
            'general-service': '일반용역',
            'tech-service': '기술용역',
            'construction': '공사'
        };
        return type ? labels[type] || type : '';
    };

    const getSubTypeLabel = (subType?: string) => {
        const labels: Record<string, string> = {
            'small': '소액수의계약',
            'qualified': '적격심사',
            'negotiation': '협상에 의한 계약',
            'two-stage': '2단계 입찰',
            'turnkey': '턴키/대안'
        };
        return subType ? labels[subType] || subType : '';
    };

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

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
                                    onClick={() => navigate('/upload')}
                                    className="gap-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    뒤로
                                </Button>
                                <div>
                                    <h1 className="text-xl font-bold text-foreground">
                                        공고문 편집
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
                                <Button
                                    size="sm"
                                    onClick={handleGenerate}
                                    className="gap-2"
                                >
                                    <Sparkles className="h-4 w-4" />
                                    최종 생성
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Editor Layout */}
                    <div className="flex h-[calc(100vh-8rem)] overflow-hidden">
                        {/* Left Panel - Form */}
                        <div className="w-1/2 border-r overflow-auto p-6">
                            <div className="max-w-2xl mx-auto">
                                <NoticeForm
                                    formData={formData}
                                    type={type}
                                    subType={subType}
                                    onPreview={handleFormChange}
                                />
                            </div>
                        </div>

                        {/* Right Panel - Preview */}
                        <div className="w-1/2 overflow-auto bg-muted/30 p-6">
                            <div className="max-w-3xl mx-auto">
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-foreground">
                                        미리보기
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        실시간으로 공고문을 확인하세요
                                    </p>
                                </div>
                                <DocumentPreview data={formData} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TemplateEditor;
