const API_BASE = '/api';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function getToken() {
  try { return localStorage.getItem('kairo_token'); }
  catch { return null; }
}

async function request(method, path, body) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(data.error || 'Request failed', res.status, data);
  }

  return data;
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(email, password) {
  const data = await request('POST', '/auth/token', { email, password });
  localStorage.setItem('kairo_token', data.token);
  localStorage.setItem('kairo_user', JSON.stringify(data.user));
  localStorage.setItem('kairo_workspaces', JSON.stringify(data.workspaces));
  if (data.workspaces?.[0]?.slug) {
    localStorage.setItem('kairo_workspace_slug', data.workspaces[0].slug);
  }
  return data;
}

export function apiLogout() {
  ['kairo_token', 'kairo_user', 'kairo_workspaces', 'kairo_workspace_slug'].forEach(
    k => localStorage.removeItem(k)
  );
}

export function getStoredUser() {
  try { return JSON.parse(localStorage.getItem('kairo_user') || 'null'); }
  catch { return null; }
}

export function getStoredWorkspaces() {
  try { return JSON.parse(localStorage.getItem('kairo_workspaces') || '[]'); }
  catch { return []; }
}

export function getActiveWorkspaceSlug() {
  return localStorage.getItem('kairo_workspace_slug') || '';
}

export function setActiveWorkspaceSlug(slug) {
  localStorage.setItem('kairo_workspace_slug', slug);
}

export { ApiError };

// ─── Products ─────────────────────────────────────────────────────────────────

export const productsApi = {
  list: (workspaceSlug, page = 1, limit = 50) =>
    api.get(`/products?workspaceSlug=${encodeURIComponent(workspaceSlug)}&page=${page}&limit=${limit}`),

  get: (id) =>
    api.get(`/products/${id}`),

  create: (workspaceSlug, data) =>
    api.post('/products', { workspaceSlug, ...data }),

  update: (id, data) =>
    api.patch(`/products/${id}`, data),

  delete: (id) =>
    api.delete(`/products/${id}`),
};

// ─── Workspaces ───────────────────────────────────────────────────────────────

export const workspacesApi = {
  list: () => api.get('/workspaces'),
};
