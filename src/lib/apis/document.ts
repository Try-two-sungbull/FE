import { DocumentUploadResponse, ExtractedData } from '@/types';

/**
 * 문서 업로드 API (Mock)
 * 아직 서버 API가 준비되지 않아 Mock 데이터를 반환합니다.
 */
export async function uploadDocument(
  file: File
): Promise<DocumentUploadResponse> {
  // 실제 네트워크 요청을 시뮬레이션하기 위해 지연 시간을 둡니다.
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock 응답 데이터
  return {
    id: `doc-${Date.now()}`,
    type: 'goods',
    subType: 'small',
    extractedData: {
      title: file.name.replace(/\.[^/.]+$/, ''), // 파일명에서 확장자 제거하여 제목으로 사용
      noticeNumber: `20251218-${Math.floor(Math.random() * 1000)}`,
      amount: '50,000,000원',
      deadline: '2025-12-31',
    },
    status: 'completed',
  };
}

/**
 * 추출된 문서 데이터를 서버에 저장
 */
export async function saveDocumentApi(
  documentId: string,
  extractedData: ExtractedData,
  type?: string,
  subType?: string
): Promise<{ id: string; success: boolean }> {
  const baseUrl = import.meta.env.VITE_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/v1/agent/classify/${documentId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      documentId,
      extractedData,
      type,
      subType,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Save document failed:', response.status, errorText);
    throw new Error(`문서 저장 실패: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}

/**
 * documentId로 문서 데이터 조회
 */
export async function getDocumentApi(documentId: string): Promise<{
  id: string;
  documentId: string;
  extractedData: ExtractedData;
  type?: string;
  subType?: string;
}> {
  const baseUrl = import.meta.env.VITE_BASE_URL || '';

  const response = await fetch(`${baseUrl}/api/documents/${documentId}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Get document failed:', response.status, errorText);
    throw new Error(`문서 조회 실패: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data;
}
