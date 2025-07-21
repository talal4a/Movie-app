import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const connectSocket = () => {
      const token = localStorage.getItem('token');

      // Only create new socket if one doesn't exist or is disconnected
      if (!socketRef.current || !socketRef.current.connected) {
        const newSocket = io('http://localhost:8000', {
          transports: ['websocket'],
          upgrade: false,
          auth: { token },
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          timeout: 20000,
        });

        // Connection established
        newSocket.on('connect', () => {
          console.log('✅ WebSocket connected');
          setIsConnected(true);
        });

        // Handle connection errors
        newSocket.on('connect_error', (error) => {
          console.error('❌ WebSocket connection error:', error.message);
          setIsConnected(false);
        });

        // Handle disconnection
        newSocket.on('disconnect', (reason) => {
          console.log('⚠️ WebSocket disconnected:', reason);
          setIsConnected(false);
        });

        // Handle reconnection
        newSocket.on('reconnect_attempt', (attemptNumber) => {
          console.log(`🔁 Reconnection attempt ${attemptNumber}`);
        });

        newSocket.on('reconnect', (attemptNumber) => {
          console.log(
            `✅ Successfully reconnected after ${attemptNumber} attempts`
          );
          setIsConnected(true);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
      }

      return () => {
        if (socketRef.current) {
          console.log('🧹 Cleaning up WebSocket connection');
          socketRef.current.off('connect');
          socketRef.current.off('connect_error');
          socketRef.current.off('disconnect');
          socketRef.current.disconnect();
          socketRef.current = null;
          setSocket(null);
          setIsConnected(false);
        }
      };
    };

    // Initialize connection
    connectSocket();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
