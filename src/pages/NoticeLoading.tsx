import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loading } from '@/components/common/Loading';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming this exists or simple join

const LOADING_STEPS = [
    "문서 내용을 분석하고 있습니다...",
    "핵심 키워드를 추출하고 있습니다...",
    "공고문 초안을 생성하고 있습니다...",
    "최종 검토를 진행 중입니다..."
];

const NoticeLoading = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [stepIndex, setStepIndex] = useState(0);

    // Initial data passed from NoticeForm
    const state = location.state as {
        file?: File;
        initialData?: Record<string, string>;
        type?: string;
        subType?: string
    } || {};

    useEffect(() => {
        // Step animation
        const interval = setInterval(() => {
            setStepIndex(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
        }, 800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const processGeneration = async () => {
            try {
                // TODO: Replace with actual API call
                // await generateNoticeApi(state.file, state.initialData);

                // Simulation
                await new Promise(resolve => setTimeout(resolve, 3000));

                const mockExtractedData = {
                    ...state.initialData,
                    title: state.initialData?.title || "AI 생성 공고문 제목",
                    // Add more simulated data if needed or use what came from form
                };

                // Navigate to Editor
                navigate(`/editor/${state.type || 'goods'}/${state.subType || 'qualified'}`, {
                    state: {
                        extractedData: mockExtractedData,
                        fromGeneration: true // Flag to show success toast in editor if needed
                    },
                    replace: true
                });

            } catch (error) {
                console.error("Generation failed", error);
                toast({
                    title: "생성 실패",
                    description: "공고문 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
                    variant: "destructive"
                });
                navigate(-1); // Go back to form
            }
        };

        const timer = setTimeout(() => {
            processGeneration();
        }, 1000); // Small delay to start

        return () => clearTimeout(timer);
    }, [navigate, state, toast]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8 text-center animate-fade-in">

                {/* Visualizer Area */}
                <div className="relative h-48 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl animate-pulse" />
                    <Loading type="ai" size="lg" />
                </div>

                <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">
                        AI가 공고문을 생성하고 있습니다
                    </h2>

                    <div className="space-y-2">
                        {LOADING_STEPS.map((step, idx) => (
                            <div
                                key={idx}
                                className={cn(
                                    "flex items-center gap-3 text-sm transition-all duration-500",
                                    idx === stepIndex
                                        ? "text-primary font-medium scale-105 opacity-100"
                                        : idx < stepIndex
                                            ? "text-muted-foreground/50 opacity-50"
                                            : "text-muted-foreground/20 opacity-20"
                                )}
                            >
                                {idx < stepIndex ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : idx === stepIndex ? (
                                    <Sparkles className="h-4 w-4 animate-spin" />
                                ) : (
                                    <div className="h-4 w-4" />
                                )}
                                {step}
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground animate-pulse">
                    잠시만 기다려주세요, 거의 다 됐습니다...
                </p>
            </div>
        </div>
    );
};

export default NoticeLoading;
