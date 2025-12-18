import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Template {
  id: string;
  name: string;
  type: string;
  subType: string;
  createdAt: string;
  lastModified: string;
  usageCount: number;
}

const mockTemplates: Template[] = [
  {
    id: '1',
    name: '물품 일반경쟁 기본 템플릿',
    type: '물품',
    subType: '일반경쟁',
    createdAt: '2025-01-15',
    lastModified: '2025-01-15',
    usageCount: 24,
  },
  {
    id: '2',
    name: '용역 제한경쟁 템플릿',
    type: '용역',
    subType: '제한경쟁',
    createdAt: '2025-01-10',
    lastModified: '2025-01-12',
    usageCount: 15,
  },
  {
    id: '3',
    name: '공사 적격심사 템플릿',
    type: '공사',
    subType: '적격심사',
    createdAt: '2025-01-05',
    lastModified: '2025-01-08',
    usageCount: 8,
  },
];

const Templates = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedType === 'all' || template.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentPath={location.pathname} onNavigate={handleNavigate} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  템플릿 관리
                </h1>
                <p className="text-muted-foreground mt-1">
                  공고문 템플릿을 관리하고 재사용하세요
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />새 템플릿 만들기
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="템플릿 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedType === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('all')}
                  size="sm"
                >
                  전체
                </Button>
                <Button
                  variant={selectedType === '물품' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('물품')}
                  size="sm"
                >
                  물품
                </Button>
                <Button
                  variant={selectedType === '용역' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('용역')}
                  size="sm"
                >
                  용역
                </Button>
                <Button
                  variant={selectedType === '공사' ? 'default' : 'outline'}
                  onClick={() => setSelectedType('공사')}
                  size="sm"
                >
                  공사
                </Button>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="group relative border rounded-lg p-5 hover:shadow-md transition-all bg-card"
                >
                  {/* Template Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Template Info */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground line-clamp-2">
                      {template.name}
                    </h3>
                    <div className="flex gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        {template.type}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                        {template.subType}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>사용 횟수: {template.usageCount}회</p>
                      <p>최근 수정: {template.lastModified}</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      미리보기
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      편집
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  템플릿이 없습니다
                </h3>
                <p className="text-muted-foreground mb-4">
                  검색 조건을 변경하거나 새 템플릿을 만들어보세요
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />새 템플릿 만들기
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Templates;
