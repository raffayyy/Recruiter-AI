import { useState, useEffect, useCallback } from 'react';
import { WebSocketClient } from '../lib/websocket';
import { useAuth } from '../contexts/AuthContext';

export function useWebSocket(url: string) {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [messages, setMessages] = useState<any[]>([]);

  const handleMessage = useCallback((data: any) => {
    setMessages(prev => [...prev, data]);
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  useEffect(() => {
    if (token) {
      const wsClient = new WebSocketClient(
        url,
        token,
        handleMessage,
        handleConnectionChange
      );
      
      wsClient.connect();
      setClient(wsClient);

      return () => {
        wsClient.disconnect();
      };
    }
  }, [url, token, handleMessage, handleConnectionChange]);

  const sendMessage = useCallback((data: any) => {
    client?.send(data);
  }, [client]);

  return {
    isConnected,
    messages,
    sendMessage,
  };
}