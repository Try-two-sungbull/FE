import { DocumentUploadResponse } from '@/types';

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
