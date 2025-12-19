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
    `${import.meta.env.VITE_BASE_URL}/api/v1/agent/upload`,
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

export async function uploadApi(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  let baseUrl = import.meta.env.VITE_BASE_URL;
  if (baseUrl && baseUrl.startsWith('=')) {
    baseUrl = baseUrl.slice(1);
  }

  const url = `${baseUrl}/api/agent/classify`;
  console.log('Uploading to URL:', url);

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Upload failed:', response.status, errorText);
    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log(data);

  return data;
}

// export async function fetchHtml(template_id: string, format: string) {
//   const response = await fetch(
//     `${import.meta.env.VITE_BASE_URL}/api/agent/upload`,
//     {
//       method: 'POST',
//       credentials: 'include',
//     }
//   );
//   const data = await response.text();
//   console.log(data);
//   if (!response.ok) {
//     throw new Error('import failed');
//   }

//   return data;
// }

export async function getData(sessionId: string) {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/agent/classify/${sessionId}`,

    {
      method: 'GET',
      credentials: 'include',
    }
  );
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error('get data failed');
  }

  return data;
}
