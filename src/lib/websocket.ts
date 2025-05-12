// Define a generic WebSocket message type
export interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000;
  private connectionStatus = false;
  private authToken: string;

  constructor(
    private url: string,
    token: string,
    private onMessage: (data: WebSocketMessage) => void,
    private onConnectionChange: (connected: boolean) => void,
    private onReconnectAttempt?: () => void
  ) {
    // Remove the Bearer prefix if present
    this.authToken = token.startsWith('Bearer ') ? token.substring(7) : token;
  }

  connect() {
    try {
      // Special handling for '/interview/ws/' path to ensure proper URL formatting
      let urlWithToken = this.url;
      
      if (this.url.includes('/interview/ws/')) {
        // Format: Extract the application ID
        const parts = this.url.split('/');
        const applicationId = parts[parts.length - 1].split('?')[0];
        
        // Base URL without application ID
        const baseUrl = this.url.substring(0, this.url.lastIndexOf('/') + 1);
        
        // Properly encode application ID and token
        urlWithToken = `${baseUrl}${applicationId}?token=${encodeURIComponent(this.authToken)}`;
      } else if (this.url.includes('?token=')) {
        // URL already has token, don't modify
        urlWithToken = this.url;
      } else {
        // Standard case, just append token
        urlWithToken = `${this.url}${this.url.includes('?') ? '&' : '?'}token=${encodeURIComponent(this.authToken)}`;
      }
      
      console.log(`Connecting to WebSocket at: ${urlWithToken.replace(/token=([^&]+)/, 'token=***')}`);
      
      this.ws = new WebSocket(urlWithToken);
      
      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
        this.connectionStatus = true;
        this.onConnectionChange(true);
      };

      this.ws.onmessage = (event) => {
        try {
          // Log the raw message for debugging
          console.log('Raw WebSocket message received:', event.data);
          
          const data = JSON.parse(event.data) as WebSocketMessage;
          this.onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          console.log('Raw message:', event.data);
        }
      };

      this.ws.onclose = (event) => {
        console.log(`WebSocket closed with code ${event.code}: ${event.reason}`);
        this.connectionStatus = false;
        this.onConnectionChange(false);
        
        // Only attempt reconnection for unexpected closures
        // Don't attempt to reconnect if the connection was closed cleanly
        if (event.code !== 1000 && event.code !== 1001) {
          this.reconnect();
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        // Don't close here, let the onclose handler decide what to do
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      this.reconnect();
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      if (this.onReconnectAttempt) {
        this.onReconnectAttempt();
      }
      
      const delay = this.reconnectTimeout * Math.min(this.reconnectAttempts, 5);
      console.log(`Will attempt to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (!this.connectionStatus) {
          this.connect();
        }
      }, delay);
    } else {
      console.error(`Failed to reconnect after ${this.maxReconnectAttempts} attempts`);
    }
  }

  disconnect() {
    if (this.ws) {
      try {
        this.ws.close(1000, 'Client disconnecting');
        this.connectionStatus = false;
        this.onConnectionChange(false);
      } catch (error) {
        console.error('Error during WebSocket disconnection:', error);
      }
      this.ws = null;
    }
  }

  send(data: WebSocketMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        // Format the data to match the backend expectations
        // For interview response, ensure we use the right format
        if (data.type === 'response' && data.audio_data) {
          data = {
            type: 'response',
            response: data.audio_data
          };
        }
        
        const messageStr = JSON.stringify(data);
        console.log('Sending WebSocket message:', messageStr.substring(0, 100) + (messageStr.length > 100 ? '...' : ''));
        this.ws.send(messageStr);
        return true;
      } catch (error) {
        console.error('Error sending WebSocket message:', error);
        return false;
      }
    } else {
      console.warn('Cannot send message: WebSocket is not open', {
        readyState: this.ws?.readyState,
        data
      });
      return false;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}