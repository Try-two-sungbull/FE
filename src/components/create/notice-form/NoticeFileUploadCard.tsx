import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RefObject } from 'react';

interface NoticeFileUploadCardProps {
    isUploading: boolean;
    fileInputRef: RefObject<HTMLInputElement>;
    handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export function NoticeFileUploadCard({
    isUploading,
    fileInputRef,
    handleFileUpload,
}: NoticeFileUploadCardProps) {
    return (
        <Card variant="glass" className="border-dashed border-2 animate-fade-in">
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div
                        className={cn(
                            'p-3 rounded-xl transition-colors',
                            isUploading ? 'bg-accent/20' : 'bg-secondary'
                        )}
                    >
                        <Upload
                            className={cn(
                                'h-6 w-6',
                                isUploading
                                    ? 'text-accent animate-pulse'
                                    : 'text-muted-foreground'
                            )}
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-1">구매계획서 업로드</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            한글(.hwp) 또는 PDF 파일을 업로드하면 AI가{' '}
                            <span className="text-blue-600 font-medium">
                                파란 글자 항목
                            </span>
                            을 자동으로 추출합니다
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="gap-2"
                        >
                            {isUploading ? (
                                <>
                                    <Sparkles className="h-4 w-4 animate-spin" />
                                    구매계획서 분석 중...
                                </>
                            ) : (
                                <>
                                    <Upload className="h-4 w-4" />
                                    파일 선택
                                </>
                            )}
                        </Button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".hwp,.hwpx,.pdf"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
