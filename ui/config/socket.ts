// type WebSocketMessage = {
//   type: string;
//   data: any;
//   timestamp?: string;
// };

type WebSocketConfig = {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  heartbeatInterval?: number;
  onOpen?: (event: Event) => void;
  onMessage?: (data: any) => void;
  onError?: (error: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onReconnect?: (attempt: number) => void;
};

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private heartbeatInterval: number;
  private reconnectAttempts: number = 0;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isManualClose: boolean = false;

  private onOpenCallback?: (event: Event) => void;
  private onMessageCallback?: (data: any) => void;
  private onErrorCallback?: (error: Event) => void;
  private onCloseCallback?: (event: CloseEvent) => void;
  private onReconnectCallback?: (attempt: number) => void;

  constructor(config: WebSocketConfig) {
    this.url = config.url;
    this.reconnectInterval = config.reconnectInterval || 3000;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 5;
    this.heartbeatInterval = config.heartbeatInterval || 30000;

    this.onOpenCallback = config.onOpen;
    this.onMessageCallback = config.onMessage;
    this.onErrorCallback = config.onError;
    this.onCloseCallback = config.onClose;
    this.onReconnectCallback = config.onReconnect;
  }

  public connect(): void {
    try {
      this.isManualClose = false;
      this.ws = new WebSocket(this.url);

      this.ws.onopen = this.handleOpen.bind(this);
      this.ws.onmessage = this.handleMessage.bind(this);
      this.ws.onerror = this.handleError.bind(this);
      this.ws.onclose = this.handleClose.bind(this);
    } catch (error) {
      console.error("WebSocket connection error:", error);
      this.attemptReconnect();
    }
  }

  private handleOpen(event: Event): void {
    console.log("WebSocket connected successfully");
    this.reconnectAttempts = 0;
    this.startHeartbeat();

    if (this.onOpenCallback) {
      this.onOpenCallback(event);
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      if (this.onMessageCallback) {
        this.onMessageCallback(data);
      }
    } catch (error) {
      // If message is not JSON, pass raw data
      console.log("WebSocket raw message:", event.data, error);
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    }
  }

  private handleError(error: Event): void {
    console.error("WebSocket error:", error);

    if (this.onErrorCallback) {
      this.onErrorCallback(error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log("WebSocket closed:", event.code, event.reason);
    this.stopHeartbeat();

    if (this.onCloseCallback) {
      this.onCloseCallback(event);
    }

    // Attempt reconnection if not manually closed
    if (!this.isManualClose) {
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`
    );

    if (this.onReconnectCallback) {
      this.onReconnectCallback(this.reconnectAttempts);
    }

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: "ping" });
      }
    }, this.heartbeatInterval);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  public send(data: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = typeof data === "string" ? data : JSON.stringify(data);
      this.ws.send(message);
    } else {
      console.warn("WebSocket is not connected. Unable to send message.");
    }
  }

  public disconnect(): void {
    this.isManualClose = true;
    this.stopHeartbeat();

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Manual disconnect");
      this.ws = null;
    }
  }

  public getState(): number {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}
