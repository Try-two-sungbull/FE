import type { Template, TemplateDetail, TemplateListResponse, TemplateType } from '@/types';

export type TemplateChange = {
  type?: string;
  reason?: string;
  [key: string]: unknown;
};

export type ValidateTemplateResponse = {
  status: 'unchanged' | 'updated' | 'changed' | string;
  template_type?: TemplateType;
  changes_detected?: boolean;
  has_changes?: boolean;
  summary?: string;
  changes?: TemplateChange[];
  latest_template_id?: number;
  saved_template?: TemplateDetail | null;
  new_version_recommended?: boolean;
  updated_template?: string;
};

/**
 * 템플릿 목록 조회
 * @param template_type - 템플릿 유형 ("적격심사" | "소액수의")
 * @param limit - 조회 개수 (기본 10, 최대 50)
 */
export async function getTemplates(
  template_type: TemplateType,
  limit: number = 10
): Promise<TemplateListResponse> {
  const params = new URLSearchParams({
    template_type,
    limit: limit.toString(),
  });

  const response = await fetch(
    `${import.meta.env.VITE_AI_BASE_URL}/api/v1/agent/templates/retrieve?${params}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Template list fetch failed:', response.status, errorText);
    throw new Error(`Template list fetch failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * 템플릿 최신화 확인
 * @param cntrctCnclsMthdNm - 계약체결방법명 ("적격심사" | "소액수의")
 */
export async function validateTemplate(
  cntrctCnclsMthdNm: TemplateType
): Promise<ValidateTemplateResponse> {
  const params = new URLSearchParams({
    cntrctCnclsMthdNm,
  });

  const response = await fetch(
    `${import.meta.env.VITE_AI_BASE_URL}/api/v1/agent/validate-template?${params}`,
    {
      method: 'POST',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Template validate failed:', response.status, errorText);
    throw new Error(`Template validate failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * 템플릿 상세 조회
 * @param template_id - 템플릿 ID
 */
export async function getTemplateById(template_id: number): Promise<TemplateDetail> {
  const response = await fetch(
    `${import.meta.env.VITE_AI_BASE_URL}/api/v1/agent/templates/${template_id}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Template detail fetch failed:', response.status, errorText);
    throw new Error(`Template detail fetch failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}
