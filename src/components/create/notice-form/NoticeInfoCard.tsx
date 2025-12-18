import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function NoticeInfoCard() {
    return (
        <Card
            variant="glass"
            className="border-l-4 border-l-info animate-fade-in"
        >
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-info shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-sm mb-1">파란 글자 항목 안내</h4>
                        <p className="text-xs text-muted-foreground">
                            <span className="text-blue-600 font-medium">파란색</span>으로
                            표시된 항목은 구매계획서에서 자동 추출되어 입찰공고에
                            반영됩니다. 발주계획서를 업로드하면 해당 항목들이 자동으로
                            채워집니다.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
