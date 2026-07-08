import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export const useTerminalSocket = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Connect to backend namespace 'terminal' on port 3000
    const socket = io('http://localhost:3000/terminal', {
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('terminal-output', (output: string) => {
      setHistory((prev) => [...prev, output]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendCommand = useCallback((command: string) => {
    if (socketRef.current && isConnected) {
      // Clean command locally
      const cmd = command.trim().toLowerCase();
      if (cmd === 'clear') {
        setHistory(['jorge@vps-1gb-ram:~$ ']);
        return;
      }
      
      // Append the command local echo
      setHistory((prev) => {
        // If the last item ends with prompt prefix, replace or append properly
        return [...prev, command];
      });
      socketRef.current.emit('execute-command', command);
    } else {
      setHistory((prev) => [...prev, '\n[Error]: Terminal desconectada. No se pudo enviar el comando.']);
    }
  }, [isConnected]);

  return {
    history,
    sendCommand,
    isConnected,
  };
};
