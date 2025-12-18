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
    isBlueField: true,
    hint: "구매계획서의 '물품명' 또는 '구매물품'에서 자동 추출됩니다",
  },
  {
    id: 'amount',
    label: '예산액',
    sourceLabel: '소요예산',
    type: 'number',
    placeholder: '부가세 포함 금액',
    isBlueField: true,
    hint: "구매계획서의 '소요예산'에서 자동 추출됩니다 (부가세 포함)",
  },
  {
    id: 'period',
    label: '용역기간/계약기간',
    sourceLabel: '납품기한/계약기간',
    type: 'text',
    placeholder: '예: 계약 후 120일',
    hint: '선택 사항: 계약 기간을 입력하세요',
  },
  {
    id: 'productCode',
    label: '세부품명번호',
    sourceLabel: '세부품명번호(10자리)',
    type: 'text',
    placeholder: '예: 4111319901',
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
  {
    id: 'goodsContactInfo',
    label: '물품 규격 담당자',
    type: 'text',
    placeholder: '예: 생활환경지원부(☎ 032-590-4000, 담당 : 홍길동)',
    hint: '물품 규격 등 관련사항 담당자 정보',
  },
  {
    id: 'bidContactInfo',
    label: '입찰․계약 담당자',
    type: 'text',
    placeholder: '예: 조달기획부(☎ 032-590-3000, 담당 : 김영희)',
    hint: '입찰 및 계약 관련사항 담당자 정보',
  },
  {
    id: 'noticeDate',
    label: '공고 날짜',
    type: 'date',
    placeholder: 'YYYY년 MM월 DD일',
    hint: '공고문 발행 날짜',
  },
];

export interface NoticeFormProps {
  type?: string;
  subType?: string;
  onPreview?: (data: Record<string, string>) => void;
  formData?: Record<string, string>;
  isEditMode?: boolean;
}
