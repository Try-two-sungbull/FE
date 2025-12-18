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
    error?: string;
}
