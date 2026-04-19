import axios from 'axios';
import { clearAuth, getToken, isTokenExpiringSoon, saveAuth } from './auth';
import type { User } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// Prevent concurrent refresh calls
let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await axios.post<{ token: string; user: User }>(
        `${API_URL}/api/v1/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      saveAuth(res.data.token, res.data.user);
      return res.data.token;
    } catch {
      clearAuth();
      if (typeof window !== 'undefined') window.location.href = '/login';
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config;

  let token = getToken();
  if (!token) return config;

  // Silently refresh if the token will expire within 5 minutes
  if (isTokenExpiringSoon(300)) {
    token = await refreshToken();
    if (!token) return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      clearAuth();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const patchContractContent = (id: string, title: string, contentJson: any, renderedHtml: string) =>
  api.patch(`/contracts/${id}/html`, { title, content_json: contentJson, rendered_html: renderedHtml });

// ─── Folder API ───────────────────────────────────────────────────────────────

export const createFolder = (name: string, parentId?: string | null) =>
  api.post('/folders', { name, parent_id: parentId ?? null });

export const listRootContents = () =>
  api.get('/folders');

export const listFolderContents = (folderId: string) =>
  api.get(`/folders/${folderId}`);

export const renameFolder = (folderId: string, name: string) =>
  api.put(`/folders/${folderId}`, { name });

export const deleteFolder = (folderId: string) =>
  api.delete(`/folders/${folderId}`);

// ─── Document API ─────────────────────────────────────────────────────────────

export const createBlankDocument = (title: string, folderId?: string | null) =>
  api.post('/documents', { title, source: 'blank', folder_id: folderId ?? null });

export const listRecentDocuments = () =>
  api.get('/documents/recent');

export const moveDocument = (docId: string, folderId: string | null) =>
  api.patch(`/documents/${docId}/move`, { folder_id: folderId });

export const createNamedVersion = (docId: string, name: string) =>
  api.post(`/documents/${docId}/versions`, { name });

/**
 * Fire an anonymous visit beacon exactly once per browser session.
 * Safe to call from any public page; silently no-ops if already sent this session.
 */
export function trackVisit(): void {
  if (typeof window === 'undefined') return;
  if (sessionStorage.getItem('_v')) return;
  sessionStorage.setItem('_v', '1');
  api.post('/track/visit').catch(() => {});
}

export default api;