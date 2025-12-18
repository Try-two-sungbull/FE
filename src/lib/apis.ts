export async function loginApi(id: string, password: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/auth/sign-in`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: id,
        password,
      }),
    }
  );
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error('Login failed');
  }

  return data;
}

export async function productsApi(productsNo: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/reference/products`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error('import failed');
  }

  return data;
}

export async function businessesApi(businessCode: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/reference/businesses`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const data = response.json();

  if (!response.ok) {
    throw new Error('import failed');
  }

  return data;
}
