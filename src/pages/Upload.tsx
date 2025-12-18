import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/common/Loading';
import {
  Upload as UploadIcon,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UploadedFile } from '@/types';
import { uploadApi } from '@/lib/apis';

const Upload = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [actualFiles, setActualFiles] = useState<Map<string, File>>(new Map());

  const getTypeText = (type: string | undefined) => {
    switch (type) {
      case 'goods':
        return '물품 구매';
      case 'general-service':
        return '일반용역';
      case 'tech-service':
        return '기술용역';
      case 'construction':
        return '공사';
      default:
        return '문서';
    }
  };

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Store actual File objects
    const newFileMap = new Map(actualFiles);
    newFiles.forEach((uploadedFile, index) => {
      newFileMap.set(uploadedFile.id, fileList[index]);
    });
    setActualFiles(newFileMap);

    // Upload files to server
    newFiles.forEach((uploadedFile, index) => {
      uploadFileToServer(uploadedFile.id, fileList[index]);
    });
  };

  const uploadFileToServer = async (fileId: string, file: File) => {
    try {
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 10;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 90) } : f
          )
        );

        if (progress >= 90) {
          clearInterval(progressInterval);
        }
      }, 200);

      // Call real API
      const response = await uploadApi(file);

      // Save to Query Cache with fileId as key
      queryClient.setQueryData(['uploadedTemplateData', fileId], response);

      clearInterval(progressInterval);

      // Transition to processing state
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: 'processing',
                progress: 100,
              }
            : f
        )
      );

      // Get data from Query Cache and update file
      const cachedData = queryClient.getQueryData(['uploadedTemplateData', fileId]);

      // Update file with cached data
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: 'completed',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                type: (type || cachedData?.type || 'goods') as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                subType: (cachedData?.bidMethod || cachedData?.subType || 'small') as any,
                extractedData: cachedData
                  ? {
                      ...cachedData,
                      // Ensure mandatory fields for display are present if API returns different names
                      noticeNumber: cachedData.noticeNumber || '-',
                      title: cachedData.title || '-',
                      amount: cachedData.amount || '-',
                    }
                  : undefined,
              }
            : f
        )
      );
    } catch (error) {
      console.error('Upload error:', error);
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
              ...f,
              status: 'error',
              error:
                error instanceof Error
                  ? error.message
                  : '업로드 중 오류가 발생했습니다',
            }
            : f
        )
      );
    }
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    const newFileMap = new Map(actualFiles);
    newFileMap.delete(fileId);
    setActualFiles(newFileMap);
  };

  const handleGenerateNotice = (file: UploadedFile) => {
    if (file.type && file.subType && file.extractedData) {
      navigate(`/editor/${file.type}/${file.subType}`, {
        state: {
          documentId: file.id,
          extractedData: file.extractedData,
        },
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={location.pathname} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Page Header */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {getTypeText(type)} 업로드
              </h1>
              <p className="text-muted-foreground mt-1">
                발주계획서나 기존 공고문을 업로드하면 AI가 자동으로 정보를
                추출합니다
              </p>
            </div>

            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                'border-2 border-dashed rounded-lg p-12 text-center transition-all',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              )}
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <UploadIcon className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    파일을 드래그하여 업로드
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    또는 클릭하여 파일을 선택하세요
                  </p>
                </div>
                <div className="flex gap-2 text-xs text-muted-foreground">
                  <span>지원 형식: PDF, DOCX, HWP</span>
                  <span>•</span>
                  <span>최대 크기: 10MB</span>
                </div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  multiple
                  accept=".pdf,.docx,.hwp"
                  onChange={handleFileInput}
                />
                <label htmlFor="file-upload">
                  <Button asChild>
                    <span className="cursor-pointer">파일 선택</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Uploaded Files List */}
            {files.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-foreground">
                  업로드된 파일 ({files.length})
                </h2>
                <div className="space-y-3">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="border rounded-lg p-4 bg-card"
                    >
                      <div className="flex items-start gap-4">
                        {/* File Icon */}
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-foreground truncate">
                                {file.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 shrink-0"
                              onClick={() => removeFile(file.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Status */}
                          {file.status === 'uploading' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                  업로드 중...
                                </span>
                                <span className="text-muted-foreground">
                                  {file.progress}%
                                </span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all duration-300"
                                  style={{ width: `${file.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          {file.status === 'processing' && (
                            <div className="py-2">
                              <Loading
                                type="ai"
                                size="sm"
                                text="AI가 문서를 분석하고 있습니다..."
                                className="items-start"
                              />
                            </div>
                          )}

                          {file.status === 'completed' && (
                            <div className="space-y-3">
                              <div className="flex items-center gap-2 text-sm text-green-600">
                                <CheckCircle2 className="h-4 w-4" />
                                <span>추출 완료</span>
                              </div>
                              {file.extractedData && (
                                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                                  <h4 className="text-sm font-semibold text-foreground mb-2">
                                    추출된 정보
                                  </h4>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">
                                        제목:
                                      </span>
                                      <span className="ml-2 text-foreground">
                                        {file.extractedData.title}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        공고번호:
                                      </span>
                                      <span className="ml-2 text-foreground">
                                        {file.extractedData.noticeNumber}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        금액:
                                      </span>
                                      <span className="ml-2 text-foreground">
                                        {file.extractedData.amount}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        유형:
                                      </span>
                                      <span className="ml-2 text-foreground">
                                        {file.type && file.subType
                                          ? `${file.type} - ${file.subType}`
                                          : '-'}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 mt-3">
                                    <Button
                                      size="sm"
                                      className="gap-2"
                                      onClick={() => handleGenerateNotice(file)}
                                      disabled={!file.type || !file.subType}
                                    >
                                      <Sparkles className="h-3 w-3" />
                                      공고문 생성
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="gap-2"
                                    >
                                      <Download className="h-3 w-3" />
                                      데이터 다운로드
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {file.status === 'error' && (
                            <div className="flex items-center gap-2 text-sm text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span>
                                {file.error || '업로드 중 오류가 발생했습니다'}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Upload;
