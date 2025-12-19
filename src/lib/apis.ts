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

export type DocumentFormat = 'markdown' | 'pdf' | 'docx' | 'hwp';

export interface GenerateDocumentParams {
  extracted_data: Record<string, unknown>;
  classification: Record<string, unknown>;
  template_id: number | string;
  format?: DocumentFormat;
  html?: string;
}

export interface GenerateDocumentResponse {
  content: string | Blob;
  format: DocumentFormat;
  filename?: string;
}

export async function generateDocumentApi(
  params: GenerateDocumentParams
): Promise<GenerateDocumentResponse> {
  const { extracted_data, classification, template_id, format = 'pdf', html } = params;

  let baseUrl = import.meta.env.VITE_AI_BASE_URL;
  if (baseUrl && baseUrl.startsWith('=')) {
    baseUrl = baseUrl.slice(1);
  }

  const url = `${baseUrl}/api/v1/agent/upload`;
  console.log('Generating document with URL:', url);

  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      extracted_data,
      classification,
      template_id,
      format,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Document generation failed:', response.status, errorText);
    throw new Error(`Document generation failed: ${response.status} - ${errorText}`);
  }

  // Handle different response formats
  if (format === 'markdown') {
    const data = await response.json();
    return {
      content: data.content || data,
      format: 'markdown',
    };
  } else {
    // For pdf and docx, return as Blob for file download
    const blob = await response.blob();
    const contentDisposition = response.headers.get('Content-Disposition');
    let filename = `document.${format}`;

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, '');
      }
    }

    return {
      content: blob,
      format,
      filename,
    };
  }
}

// Helper function to download generated document
export function downloadDocument(response: GenerateDocumentResponse) {
  if (response.format === 'markdown') {
    // For markdown, create a text file download
    const blob = new Blob([response.content as string], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.filename || 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } else {
    // For pdf and docx, directly download the blob
    const url = URL.createObjectURL(response.content as Blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = response.filename || `document.${response.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
