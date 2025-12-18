import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Upload,
  Scale,
  Bell,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
}

const mainNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: '대시보드', href: '/' },
  { icon: Sparkles, label: '공고문 생성', href: '/create', badge: 'AI' },
  { icon: FileText, label: '템플릿 관리', href: '/templates' },
  { icon: FolderOpen, label: '공고문 보관함', href: '/archive' },
];

const bottomNavItems: NavItem[] = [
  // { icon: Scale, label: '법령 업데이트', href: '/legal' },
  // { icon: Bell, label: '알림', href: '/notifications', badge: '3' },
  // { icon: HelpCircle, label: '도움말', href: '/help' },
  // { icon: Settings, label: '설정', href: '/settings' },
];

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ currentPath = '/', onNavigate }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const NavButton = ({
    item,
    isActive,
  }: {
    item: NavItem;
    isActive: boolean;
  }) => (
    <Button
      variant="ghost"
      onClick={() => onNavigate?.(item.href)}
      className={cn(
        'w-full justify-start gap-3 h-11 px-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200',
        isActive && 'bg-sidebar-accent text-sidebar-foreground font-medium',
        isCollapsed && 'justify-center px-0'
      )}
    >
      <item.icon
        className={cn('h-5 w-5 shrink-0', isActive && 'text-sidebar-primary')}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && (
            <span
              className={cn(
                'px-2 py-0.5 text-xs rounded-full',
                item.badge === 'AI'
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'bg-sidebar-accent text-sidebar-foreground'
              )}
            >
              {item.badge}
            </span>
          )}
        </>
      )}
    </Button>
  );

  return (
    <aside
      className={cn(
        'h-screen flex flex-col border-r border-sidebar-border transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-sidebar to-sidebar/95',
        isCollapsed ? 'w-[72px]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'h-16 flex items-center border-b border-sidebar-border px-4',
          isCollapsed && 'justify-center px-2'
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sidebar-foreground text-sm">
                스마트 공고문
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                어시스턴트
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {mainNavItems.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            isActive={currentPath === item.href}
          />
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-3 space-y-1 border-t border-sidebar-border">
        {bottomNavItems.map((item) => (
          <NavButton
            key={item.href}
            item={item}
            isActive={currentPath === item.href}
          />
        ))}
      </div>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            'w-full h-9 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent',
            isCollapsed && 'justify-center'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>접기</span>
            </>
          )}
        </Button>
      </div>
    </aside>
  );
}
