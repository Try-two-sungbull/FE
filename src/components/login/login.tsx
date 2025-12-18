import { useState } from 'react';
import { loginApi } from '@/lib/apis';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!id || !password) {
      alert('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const result = await loginApi(id, password);
      // TODO: 로그인 성공 후 처리 (예: 페이지 이동)
      console.log(result);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="flex flex-col justify-center max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h1 className="mb-8 text-2xl font-bold text-center text-gray-800">
        한국 환경 공사 로그인
      </h1>

      <div className="space-y-5">
        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-600">
            아이디
          </label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="아이디를 입력하세요"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-600">
            비밀번호
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            placeholder="비밀번호를 입력하세요"
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full px-4 py-3 mt-4 text-white font-bold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-colors duration-200"
        >
          로그인
        </button>
      </div>
    </div>
  );
}
