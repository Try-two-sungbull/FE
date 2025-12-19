// Document upload and job posting types

export type PurchaseType = 'goods' | 'general-service' | 'tech-service' | 'construction';
export type PurchaseSubType = 'small' | 'qualified' | 'negotiation' | 'two-stage' | 'turnkey';

export interface ExtractedData {
    title: string;
    noticeNumber: string;
    amount: string;
    period?: string;
    location?: string;
    department?: string;
    manager?: string;
    phone?: string;
    email?: string;
    deadline?: string;
    openingDate?: string;
    description?: string;
    requirements?: string;
    [key: string]: string | undefined;
}

export interface DocumentUploadResponse {
    id: string;
    type: PurchaseType;
    subType: PurchaseSubType;
    extractedData: ExtractedData;
    status: 'completed' | 'processing' | 'error';
    message?: string;
}

export interface JobPostingResponse {
    id: string;
    documentId: string;
    content: string;
    createdAt: string;
    status: 'draft' | 'published';
}

export interface UploadedFile {
    id: string;
    name: string;
    size: number;
    status: 'uploading' | 'processing' | 'completed' | 'error';
    progress: number;
    type?: PurchaseType;
    subType?: PurchaseSubType;
    extractedData?: ExtractedData;
    template_id?: number;
    session_id?: string;
    error?: string;
}

// Template types (API 스펙에 맞춤)
export type TemplateType = '적격심사' | '소액수의';

export interface Template {
    id: number;
    template_type: TemplateType;
    version: string;
    created_at: string;
}

export interface TemplateDetail extends Template {
    content: string; // 상세 조회 시에만 포함
}

export interface TemplateListResponse {
    total: number;
    template_type: TemplateType;
    templates: Template[];
}
