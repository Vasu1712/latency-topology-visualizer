'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import { LatencyData } from '@/lib/types';

interface UseWebSocketOptions {
  url: string;
  onMessage?: (data: unknown) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export const useWebSocket = (options: UseWebSocketOptions) => {
  const {
    url,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
  } = options;

  const { isRealTime, updateLatencyData } = useStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttemptsRef.current = 0;
        onOpen?.();
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage?.(data);
          
          // Handle latency data updates
          if (data.type === 'latencyUpdate' && data.data) {
            updateLatencyData(data.data as LatencyData[]);
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        onClose?.();
        
        // Attempt to reconnect if still needed and haven't exceeded max attempts
        if (
          isRealTime && 
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          reconnectAttemptsRef.current++;
          console.log(
            `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [url, onMessage, onError, onOpen, onClose, isRealTime, reconnectInterval, maxReconnectAttempts, updateLatencyData]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Connect when real-time is enabled
  useEffect(() => {
    if (isRealTime) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [isRealTime, connect, disconnect]);

  return {
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    sendMessage,
    connect,
    disconnect,
  };
};

// Hook specifically for latency data WebSocket
export const useLatencyWebSocket = () => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/latency';
  
  return useWebSocket({
    url: wsUrl,
    onMessage: (data) => {
      console.log('Received latency data:', data);
    },
    onError: (error) => {
      console.error('Latency WebSocket error:', error);
    },
    onOpen: () => {
      console.log('Connected to latency stream');
    },
    onClose: () => {
      console.log('Disconnected from latency stream');
    },
  });
};
