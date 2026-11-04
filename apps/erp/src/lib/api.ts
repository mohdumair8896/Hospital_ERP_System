export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';

export const AUTH_TOKEN_KEY = 'prohealth_erp_token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

/**
 * fetch() against the API gateway with the signed-in user's Bearer token attached,
 * so RBAC-protected routes (audit, clinical, staff provisioning) resolve the session.
 */
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getAuthToken();
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(`${API_BASE_URL}${path}`, { ...init, headers });
}
