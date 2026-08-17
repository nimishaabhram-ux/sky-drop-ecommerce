export const API_BASE_URL = '/api';

/**
 * Helper to handle API responses and standard errors
 */
export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };

    // If uploading FormData, let the browser set the Content-Type with boundary
    if (options?.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) errorMessage = errorData.message;
        if (errorData.error) errorMessage = errorData.error;
      } catch (e) {
        // ignore JSON parse error for error responses
      }
      throw new Error(errorMessage);
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${endpoint}:`, error);
    throw error;
  }
}
