import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { checkAuth } from '@/lib/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 쿠키 기반 인증을 확인하고, 인증되지 않은 경우 로그인 페이지로 리다이렉트합니다.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        checkAuth().then(setIsAuthenticated);
    }, []);

    // 로딩 중
    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">로딩 중...</div>
            </div>
        );
    }

    // 인증되지 않음
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 인증됨
    return <>{children}</>;
}
