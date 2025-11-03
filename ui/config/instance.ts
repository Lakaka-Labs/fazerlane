import { WebSocketManager } from "./socket";

let wsManager: WebSocketManager | null = null;

export function getWebSocketManager(
  url: string,
  onMessage?: (data: any) => void,
  onError?: (error: Event) => void
) {
  if (!wsManager) {
    wsManager = new WebSocketManager({ url, onMessage, onError });
    wsManager.connect();
  }
  return wsManager;
}

export function closeWebSocketManager() {
  if (wsManager) {
    wsManager.disconnect();
    wsManager = null;
  }
}
