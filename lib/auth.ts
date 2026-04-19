import { User } from '@/types';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('user');
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function saveAuth(token: string, user: User): void {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

/**
 * Decode the JWT payload and return the `exp` field as a Unix timestamp,
 * or null if the token is missing / malformed.
 */
export function getTokenExpiry(): number | null {
  const token = getToken();
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return typeof payload.exp === 'number' ? payload.exp : null;
  } catch {
    return null;
  }
}

/**
 * Returns true only when a token exists AND has not yet expired.
 */
export function isAuthenticated(): boolean {
  const exp = getTokenExpiry();
  if (exp === null) return false;
  // Compare against current time in seconds
  return Date.now() / 1000 < exp;
}

/**
 * Returns true when the token exists but will expire within the given
 * number of seconds (default: 5 minutes). Used by the API interceptor
 * to trigger a silent refresh before the token actually expires.
 */
export function isTokenExpiringSoon(withinSeconds = 300): boolean {
  const exp = getTokenExpiry();
  if (exp === null) return false;
  return Date.now() / 1000 > exp - withinSeconds;
}

export function isAdmin(): boolean {
  return getUser()?.role === 'admin';
}

export function downloadDOCX(contractId: string, title: string): void {
  const token = getToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  fetch(`${apiUrl}/api/v1/contracts/${contractId}/docx`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    });
}

export function downloadPDF(contractId: string, title: string): void {
  const token = getToken();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  fetch(`${apiUrl}/api/v1/contracts/${contractId}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    });
}