import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Package,
  Briefcase,
  Wrench,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
} from 'lucide-react';

interface TypeOption {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  subTypes?: SubType[];
}

interface SubType {
  id: string;
  title: string;
  description: string;
  recommended?: boolean;
}

const purchaseTypes: TypeOption[] = [
  {
    id: 'goods',
    icon: Package,
    title: '물품 구매',
    description: '사무용품, 장비, 소모품 등의 구매',
    subTypes: [
      {
        id: 'small',
        title: '소액수의계약',
        description: '1억 이하 물품',
        recommended: true,
      },
      { id: 'qualified', title: '적격심사', description: '1억 초과 물품' },
      {
        id: 'negotiation',
        title: '협상에 의한 계약',
        description: '제안서 평가 방식',
      },
    ],
  },
  {
    id: 'general-service',
    icon: Briefcase,
    title: '일반용역',
    description: '시설관리, 청소, 경비 등의 용역',
    subTypes: [
      { id: 'small', title: '소액수의계약', description: '2천만원 이하 용역' },
      {
        id: 'qualified',
        title: '적격심사',
        description: '2천만원 초과 용역',
        recommended: true,
      },
      {
        id: 'negotiation',
        title: '협상에 의한 계약',
        description: '제안서 평가 방식',
      },
    ],
  },
  {
    id: 'tech-service',
    icon: Wrench,
    title: '기술용역',
    description: '시스템 개발, 컨설팅 등의 기술용역',
    subTypes: [
      {
        id: 'negotiation',
        title: '협상에 의한 계약',
        description: '제안서 평가 방식',
        recommended: true,
      },
      {
        id: 'two-stage',
        title: '2단계 입찰',
        description: '기술·가격 분리 평가',
      },
    ],
  },
  {
    id: 'construction',
    icon: Building2,
    title: '공사',
    description: '건설, 시설공사 등',
    subTypes: [
      { id: 'small', title: '소액수의계약', description: '5천만원 이하 공사' },
      { id: 'qualified', title: '적격심사', description: '일반 공사 입찰' },
      { id: 'turnkey', title: '턴키/대안', description: '설계·시공 일괄 입찰' },
    ],
  },
];

interface TypeSelectorProps {
  onSelect?: (type: string, subType: string) => void;
  onTypeClick?: (typeId: string) => void;
}

export function TypeSelector({ onSelect, onTypeClick }: TypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSubType, setSelectedSubType] = useState<string | null>(null);

  const currentType = purchaseTypes.find((t) => t.id === selectedType);

  const handleTypeSelect = (typeId: string) => {
    if (onTypeClick) {
      onTypeClick(typeId);
    }
    setSelectedType(typeId);
    setSelectedSubType(null);
  };

  const handleSubTypeSelect = (subTypeId: string) => {
    setSelectedSubType(subTypeId);
  };

  const handleConfirm = () => {
    if (selectedType && selectedSubType) {
      onSelect?.(selectedType, selectedSubType);
    }
  };

  const handleBack = () => {
    setSelectedType(null);
    setSelectedSubType(null);
  };

  return (
    <Card variant="elevated" className="max-w-2xl mx-auto animate-scale-in">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <CardTitle className="text-xl">
          {selectedType ? '낙찰 방법 선택' : '구매 유형 선택'}
        </CardTitle>
        <CardDescription>
          {selectedType
            ? '해당 구매 유형에 적합한 낙찰 방법을 선택해주세요'
            : '작성하실 공고문의 구매 유형을 선택해주세요'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        {!selectedType ? (
          // Step 1: Purchase Type Selection
          <div className="grid grid-cols-2 gap-3">
            {purchaseTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleTypeSelect(type.id)}
                className={cn(
                  'group flex flex-col items-start p-5 rounded-xl border-2 border-border/50',
                  'hover:border-primary/50 hover:bg-primary/5 transition-all duration-200',
                  'text-left'
                )}
              >
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <type.icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-foreground mb-1">
                  {type.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </button>
            ))}
          </div>
        ) : (
          // Step 2: Sub-type Selection
          <div className="space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-1 -ml-2 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              뒤로
            </Button>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 mb-4">
              {currentType && (
                <>
                  <div className="p-2 rounded-lg bg-primary text-primary-foreground">
                    <currentType.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{currentType.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {currentType.description}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              {currentType?.subTypes?.map((subType) => (
                <button
                  key={subType.id}
                  onClick={() => handleSubTypeSelect(subType.id)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                    'text-left',
                    selectedSubType === subType.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/30 hover:bg-secondary/30'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                      selectedSubType === subType.id
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                    )}
                  >
                    {selectedSubType === subType.id && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{subType.title}</h4>
                      {subType.recommended && (
                        <Badge className="bg-accent/10 text-accent border-accent/20 text-[10px]">
                          추천
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subType.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!selectedSubType}
              className="w-full mt-4 gap-2"
              size="lg"
            >
              템플릿 생성하기
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
