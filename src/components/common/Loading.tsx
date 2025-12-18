import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  type?: 'default' | 'ai'; // 일반 로딩 또는 AI 분석 스타일
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean; // 전체 화면 모드 여부
  className?: string;
}

export const Loading = ({
  type = 'default',
  size = 'md',
  text,
  fullScreen = false,
  className,
}: LoadingProps) => {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const containerClasses = cn(
    'flex flex-col items-center justify-center gap-3',
    fullScreen && 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
    className
  );

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {type === 'default' ? (
          <div className="animate-spin">
            <Loader2 className={cn('text-primary', sizeMap[size])} />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <div className="animate-spin">
              <Loader2
                className={cn('text-primary opacity-40', sizeMap[size])}
              />
            </div>
            <Sparkles
              className={cn(
                'absolute text-primary animate-pulse',
                size === 'sm'
                  ? 'h-2 w-2'
                  : size === 'md'
                    ? 'h-4 w-4'
                    : 'h-6 w-6'
              )}
            />
          </div>
        )}
      </div>
      {text && (
        <p
          className={cn(
            'text-muted-foreground font-medium animate-pulse',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}
        >
          {text}
        </p>
      )}
    </div>
  );
};
