/**
 * API Configuration
 * =================
 * Base configuration for API calls
 */

// API base URL - change this in production
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Get auth header with token
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = sessionStorage.getItem('auth_token');
  if (token) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
  return {};
};

/**
 * Generic API request handler
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
  };
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

/**
 * API request for form data (file uploads)
 */
export const apiFormRequest = async <T>(
  endpoint: string,
  formData: FormData
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};
