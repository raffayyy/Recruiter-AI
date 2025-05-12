import { useState, useEffect, useCallback } from 'react';
import { WebSocketClient } from '../lib/websocket';
import { useAuth } from '../contexts/AuthContext';

// Define a generic WebSocket message type
interface WebSocketMessage {
  type: string;
  [key: string]: unknown;
}

export function useWebSocket(url: string) {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [client, setClient] = useState<WebSocketClient | null>(null);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [reconnectCount, setReconnectCount] = useState(0);
  const MAX_RECONNECTS = 5;

  const handleMessage = useCallback((data: WebSocketMessage) => {
    console.log('Received WebSocket message:', data);
    setMessages(prev => [...prev, data]);
  }, []);

  const handleConnectionChange = useCallback((connected: boolean) => {
    console.log('WebSocket connection changed:', connected);
    setIsConnected(connected);
    
    if (connected) {
      // Reset reconnect count when successfully connected
      setReconnectCount(0);
    }
  }, []);

  const handleReconnect = useCallback(() => {
    setReconnectCount(prev => {
      const newCount = prev + 1;
      console.log(`WebSocket reconnect attempt ${newCount}/${MAX_RECONNECTS}`);
      return newCount;
    });
  }, []);

  useEffect(() => {
    if (token && url) {
      console.log('Initializing WebSocket with URL:', url);
      
      const wsClient = new WebSocketClient(
        url,
        token,
        handleMessage,
        handleConnectionChange,
        handleReconnect
      );
      
      wsClient.connect();
      setClient(wsClient);

      // Keep-alive ping every 30 seconds to prevent connection timeouts
      const pingInterval = setInterval(() => {
        if (wsClient.isConnected()) {
          console.log('Sending ping to keep WebSocket alive');
          wsClient.send({ type: 'ping' });
        }
      }, 30000);

      return () => {
        console.log('Cleaning up WebSocket connection');
        clearInterval(pingInterval);
        wsClient.disconnect();
      };
    }
  }, [url, token, handleMessage, handleConnectionChange, handleReconnect]);

  // Automatically reconnect when URL changes or when max reconnects not reached
  useEffect(() => {
    if (client && !isConnected && reconnectCount < MAX_RECONNECTS) {
      const timeout = setTimeout(() => {
        console.log('Reconnecting to WebSocket...');
        client.connect();
      }, Math.min(1000 * reconnectCount, 5000)); // Exponential backoff up to 5 seconds

      return () => clearTimeout(timeout);
    }
  }, [client, isConnected, reconnectCount]);

  const sendMessage = useCallback((data: WebSocketMessage) => {
    if (client?.isConnected()) {
      console.log('Sending WebSocket message:', data);
      client.send(data);
      return true;
    } else {
      console.warn('Cannot send message - WebSocket not connected');
      return false;
    }
  }, [client]);

  return {
    isConnected,
    messages,
    sendMessage,
    reconnectCount,
  };
}