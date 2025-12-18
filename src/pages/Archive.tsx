import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  Download,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notice {
  id: string;
  title: string;
  noticeNumber: string;
  type: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  publishedAt?: string;
  amount: string;
}

const mockNotices: Notice[] = [
  {
    id: '1',
    title: '2026년도 환경달력 제작',
    noticeNumber: 'N1-20251657-06',
    type: '물품',
    status: 'published',
    createdAt: '2025-01-15',
    publishedAt: '2025-01-16',
    amount: '89,670,000원',
  },
  {
    id: '2',
    title: '청사 시설물 유지보수 용역',
    noticeNumber: 'N1-20251658-01',
    type: '용역',
    status: 'draft',
    createdAt: '2025-01-14',
    amount: '125,000,000원',
  },
  {
    id: '3',
    title: '도로 포장 공사',
    noticeNumber: 'N1-20251659-02',
    type: '공사',
    status: 'closed',
    createdAt: '2025-01-10',
    publishedAt: '2025-01-11',
    amount: '450,000,000원',
  },
];

const statusConfig = {
  draft: { label: '임시저장', color: 'bg-gray-100 text-gray-800' },
  published: { label: '게시중', color: 'bg-green-100 text-green-800' },
  closed: { label: '마감', color: 'bg-red-100 text-red-800' },
};

const Archive = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const filteredNotices = mockNotices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.noticeNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || notice.status === selectedStatus;
    return matchesSearch && matchesStatus;
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
                  공고문 보관함
                </h1>
                <p className="text-muted-foreground mt-1">
                  작성한 공고문을 관리하고 다운로드하세요
                </p>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="공고문 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedStatus === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('all')}
                  size="sm"
                >
                  전체
                </Button>
                <Button
                  variant={selectedStatus === 'draft' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('draft')}
                  size="sm"
                >
                  임시저장
                </Button>
                <Button
                  variant={
                    selectedStatus === 'published' ? 'default' : 'outline'
                  }
                  onClick={() => setSelectedStatus('published')}
                  size="sm"
                >
                  게시중
                </Button>
                <Button
                  variant={selectedStatus === 'closed' ? 'default' : 'outline'}
                  onClick={() => setSelectedStatus('closed')}
                  size="sm"
                >
                  마감
                </Button>
              </div>
            </div>

            {/* Notices Table */}
            <div className="border rounded-lg bg-card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-semibold text-sm">
                        공고번호
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        제목
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        유형
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        금액
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        상태
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        작성일
                      </th>
                      <th className="text-left p-4 font-semibold text-sm">
                        작업
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredNotices.map((notice) => (
                      <tr
                        key={notice.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <span className="font-mono text-sm text-muted-foreground">
                            {notice.noticeNumber}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{notice.title}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            {notice.type}
                          </span>
                        </td>
                        <td className="p-4 text-sm">{notice.amount}</td>
                        <td className="p-4">
                          <span
                            className={cn(
                              'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium',
                              statusConfig[notice.status].color
                            )}
                          >
                            {statusConfig[notice.status].label}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {notice.createdAt}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Empty State */}
            {filteredNotices.length === 0 && (
              <div className="text-center py-12 border rounded-lg bg-card">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  공고문이 없습니다
                </h3>
                <p className="text-muted-foreground">
                  검색 조건을 변경하거나 새 공고문을 작성해보세요
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Archive;
