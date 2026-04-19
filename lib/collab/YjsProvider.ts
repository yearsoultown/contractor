import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { getToken } from '@/lib/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Creates a Yjs WebSocket provider that connects to our Go relay server.
 * The URL format is: ws(s)://<host>/api/v1/ws/collab?doc=<docId>&token=<jwt>
 */
export function createYjsProvider(docId: string, yjsDoc: Y.Doc): WebsocketProvider | null {
  if (typeof window === 'undefined') return null;

  const token = getToken();
  if (!token) return null;

  // Convert http(s) to ws(s)
  const wsBase = API_URL.replace(/^http/, 'ws');
  const wsUrl = `${wsBase}/api/v1/ws/collab`;

  const provider = new WebsocketProvider(wsUrl, docId, yjsDoc, {
    params: { token },
    connect: true,
  });

  return provider;
}