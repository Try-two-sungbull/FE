import { useState, useEffect } from 'react';
import { loginApi } from '@/lib/apis';

export function login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    async function performLogin() {
      try {
        const result = await loginApi(id, password);
        console.log('Login successful:', result);
      } catch (error) {
        console.error('Login failed:', error);
      }
    }

    if (id && password) {
      performLogin();
    }
  }, [id, password]);

  return (
    <>
      <div>
        <div>
          <h1>한국 환경 공사 로그인</h1>
        </div>
        <div>
          <div>
            <label>아이디</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </div>
          <div>
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
