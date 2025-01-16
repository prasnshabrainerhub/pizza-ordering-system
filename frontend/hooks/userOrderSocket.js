// src/hooks/useOrderSocket.js
import { useState, useEffect, useRef } from 'react';

export const useOrderSocket = (isAuthenticated) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  useEffect(() => {
    const connectWebSocket = () => {
      if (!isAuthenticated) {
        console.log('Not authenticated, skipping WebSocket connection');
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.log('No access token found');
          return;
        }

        // Close existing socket if it exists
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.close();
        }

        console.log('Attempting WebSocket connection...');
        const ws = new WebSocket(`ws://localhost:8000/ws/orders?token=${encodeURIComponent(token)}`);

        ws.onopen = () => {
          console.log('WebSocket connection established');
          setIsConnected(true);
          reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log('Received WebSocket message:', data);
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket Error:', error);
          setIsConnected(false);
        };

        ws.onclose = (event) => {
          console.log('WebSocket connection closed:', {
            code: event.code,
            reason: event.reason,
            wasClean: event.wasClean
          });
          setIsConnected(false);
          
          // Only attempt to reconnect if:
          // 1. We're still authenticated
          // 2. It wasn't a clean closure
          // 3. Haven't exceeded max reconnect attempts
          if (isAuthenticated && 
              event.code !== 1000 && 
              reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            console.log(`Attempting to reconnect... (Attempt ${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`);
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
            }
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectAttemptsRef.current += 1;
              connectWebSocket();
            }, 5000);
          }
        };

        socketRef.current = ws;
      } catch (error) {
        console.error('Error setting up WebSocket:', error);
        setIsConnected(false);
      }
    };

    if (isAuthenticated) {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [isAuthenticated]);

  // Expose a method to manually retry connection
  const retryConnection = () => {
    reconnectAttemptsRef.current = 0;
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    retryConnection
  };
};