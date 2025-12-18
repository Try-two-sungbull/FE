/**
 * 서버에 현재 사용자 정보를 요청하여 인증 상태를 확인합니다.
 * httpOnly 쿠키를 사용하므로 쿠키는 자동으로 포함됩니다.
 */
export async function checkAuth(): Promise<boolean> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include', // 쿠키 포함
    });
    return response.ok;
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}

/**
 * 로그아웃 - 서버에 로그아웃 요청을 보냅니다.
 */
export async function logout(): Promise<void> {
  try {
    await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
