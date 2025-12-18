import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { formFields, NoticeFormProps } from './notice-form/constants';
import { NoticeInfoCard } from './notice-form/NoticeInfoCard';
import { NoticeFormFields } from './notice-form/NoticeFormFields';

export function NoticeForm({
  type,
  subType,
  onPreview,
  formData: externalFormData,
}: NoticeFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>(
    externalFormData || {}
  );
  // unused state removed
  const navigate = useNavigate();
  // unused refs removed

  // 외부에서 데이터가 변경되면 동기화
  useEffect(() => {
    if (externalFormData) {
      setFormData(externalFormData);
    }
  }, [externalFormData]);

  const handleChange = (id: string, value: string) => {
    const newData = { ...formData, [id]: value };

    // 금액에 따른 자동 기업 제한 설정
    if (id === 'amount') {
      const amount = parseInt(value.replace(/,/g, '')) || 0;
      const amountExcludingVat = amount / 1.1; // 부가세 제외 금액

      if (amountExcludingVat < 100000000) {
        newData.companyRestriction = 'small';
      } else if (amountExcludingVat < 230000000) {
        newData.companyRestriction = 'sme';
      } else {
        newData.companyRestriction = 'none';
      }

      // 금액에 따른 낙찰 방법 자동 설정
      if (amountExcludingVat <= 100000000) {
        newData.bidMethod = 'small'; // 소액수의 가능
      } else {
        newData.bidMethod = 'qualified'; // 적격심사 필수
      }
    }

    setFormData(newData);
    onPreview?.(newData);
  };

  const handleGenerateNotice = () => {
    navigate('/loading', {
      state: {
        initialData: formData,
        type: type,
        subType: subType,
      },
    });
  };

  const requiredFields = formFields.filter((f) => f.required);
  const filledRequired = requiredFields.filter((f) => formData[f.id]).length;

  return (
    <div className="space-y-6">
      <NoticeInfoCard />

      <NoticeFormFields
        formData={formData}
        handleChange={handleChange}
        filledRequired={filledRequired}
        requiredFieldsCount={requiredFields.length}
        handleGenerateNotice={handleGenerateNotice}
      />
    </div>
  );
}
