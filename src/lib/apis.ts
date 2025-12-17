import path from 'path';

export async function loginApi(id: string, password: string) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      credentials: 'include',
    },
    body: JSON.stringify({ id, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}
