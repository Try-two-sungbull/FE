import { Sparkles } from 'lucide-react';

export interface FormField {
    id: string;
    label: string;
    sourceLabel?: string; // 구매계획서에서의 항목명
    type: 'text' | 'number' | 'select' | 'textarea' | 'date';
    placeholder?: string;
    required?: boolean;
    options?: { value: string; label: string }[];
    hint?: string;
    isBlueField?: boolean; // 파란 글자 (구매계획서에서 추출되는 항목)
}

// 구매계획서 → 입찰공고 매핑 필드
export const formFields: FormField[] = [
    {
        id: 'title',
        label: '공고명',
        sourceLabel: '물품명/구매물품',
        type: 'text',
        placeholder: '예: 실내공기질 자동측정망 가스상 측정장비 구매',
        required: true,
        isBlueField: true,
        hint: "구매계획서의 '물품명' 또는 '구매물품'에서 자동 추출됩니다",
    },
    {
        id: 'amount',
        label: '예산액',
        sourceLabel: '소요예산',
        type: 'number',
        placeholder: '부가세 포함 금액',
        required: true,
        isBlueField: true,
        hint: "구매계획서의 '소요예산'에서 자동 추출됩니다 (부가세 포함)",
    },
    {
        id: 'period',
        label: '용역기간/계약기간',
        sourceLabel: '납품기한/계약기간',
        type: 'text',
        placeholder: '예: 계약 후 120일',
        required: true,
        isBlueField: true,
        hint: "구매계획서의 '납품기한' 또는 '계약기간'에서 자동 추출됩니다",
    },
    {
        id: 'productCode',
        label: '세부품명번호',
        sourceLabel: '세부품명번호(10자리)',
        type: 'text',
        placeholder: '예: 4111319901',
        required: true,
        isBlueField: true,
        hint: '10자리 세부품명번호 입력 시 품명이 자동 생성됩니다',
    },
    {
        id: 'productName',
        label: '품명',
        type: 'text',
        placeholder: '세부품명번호 입력 시 자동 생성',
        isBlueField: true,
    },
    {
        id: 'deliveryLocation',
        label: '납품장소',
        sourceLabel: '납품장소/설치지점',
        type: 'text',
        placeholder: '예: 생활환경지원부 장비실',
        isBlueField: true,
        hint: "구매계획서의 '납품장소'에서 자동 추출됩니다",
    },
    {
        id: 'bidMethod',
        label: '낙찰 방법',
        sourceLabel: '낙찰자 선정방법',
        type: 'select',
        required: true,
        options: [
            { value: 'small', label: '소액수의계약' },
            { value: 'qualified', label: '적격심사' },
            { value: 'negotiation', label: '협상에 의한 계약' },
        ],
        hint: '금액 및 구매계획서 내용에 따라 자동 결정됩니다',
    },
    {
        id: 'contractMethod',
        label: '계약 방법',
        sourceLabel: '계약방법/입찰방법',
        type: 'select',
        required: true,
        isBlueField: true,
        options: [
            { value: 'general', label: '일반경쟁' },
            { value: 'limited', label: '제한경쟁' },
            { value: 'private', label: '수의계약' },
        ],
        hint: "구매계획서의 '계약방법' 또는 '입찰방법'에서 추출됩니다",
    },
    {
        id: 'companyRestriction',
        label: '기업 제한',
        sourceLabel: '입찰참가자격',
        type: 'select',
        required: true,
        isBlueField: true,
        options: [
            { value: 'small', label: '소기업 제한 (1억 미만)' },
            { value: 'sme', label: '중소기업 제한 (1억~2.3억)' },
            { value: 'none', label: '제한 없음 (2.3억 이상)' },
        ],
        hint: '금액에 따라 자동 결정: 1억 미만=소기업, 1억~2.3억=중소기업',
    },
    {
        id: 'jointContract',
        label: '공동계약',
        sourceLabel: '공동계약 허용 여부',
        type: 'select',
        isBlueField: true,
        options: [
            { value: 'no', label: '해당 없음 (단독)' },
            { value: 'yes', label: '공동이행방식 허용' },
        ],
        hint: '구매계획서에 명시되지 않으면 단독 참여로 간주됩니다',
    },
    {
        id: 'qualifications',
        label: '입찰참가자격 (상세)',
        sourceLabel: '입찰참가자격',
        type: 'textarea',
        placeholder: '추가 입찰 참가 자격 요건',
        isBlueField: true,
        hint: "구매계획서의 '입찰참가자격'에서 자동 추출됩니다",
    },
];

export interface NoticeFormProps {
    type?: string;
    subType?: string;
    onPreview?: (data: Record<string, string>) => void;
    formData?: Record<string, string>;
}
