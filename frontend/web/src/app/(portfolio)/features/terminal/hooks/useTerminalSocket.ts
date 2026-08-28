import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../../../config';
import {
  TerminalTab,
  TerminalHistoryItem,
  TerminalOutputPayload,
  ConnectionStatus,
} from '../types';

export const useTerminalSocket = () => {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: 'tab-1',
      title: 'main',
      cwd: '~',
      history: [],
      commandHistory: [],
      historyIndex: -1,
      inputDraft: '',
    },
  ]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isMatrixActive, setIsMatrixActive] = useState<boolean>(false);
  const [isMirrorMode, setIsMirrorMode] = useState<boolean>(false);
  const [completions, setCompletions] = useState<string[]>([]);
  const [completionInput, setCompletionInput] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);

  // Inicializar Socket.io y comprobar si estamos en modo espectador (mirror mode)
  useEffect(() => {
    // Revisar query params para ver si hay una sesión compartida
    const urlParams = new URLSearchParams(window.location.search);
    const sharedSessionId = urlParams.get('terminal_session');

    if (sharedSessionId) {
      setIsMirrorMode(true);
    }

    const socket = io(`${API_URL}/terminal`, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      if (sharedSessionId) {
        socket.emit('join-shared-session', { sessionId: sharedSessionId });
      }
    });

    socket.on('reconnect_attempt', () => {
      setConnectionStatus('reconnecting');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    // Salida estándar de la terminal
    socket.on('terminal-output', (data: TerminalOutputPayload | string) => {
      handleIncomingOutput(data);
    });

    // Salida en modo espejo (espectador)
    socket.on('mirror-output', (data: TerminalOutputPayload) => {
      handleIncomingOutput(data);
    });

    socket.on('mirror-connected', (data: { message: string }) => {
      setTabs((prev) =>
        prev.map((t) => ({
          ...t,
          history: [
            ...t.history,
            {
              id: Math.random().toString(36),
              type: 'system',
              content: data.message,
              timestamp: Date.now(),
            },
          ],
        }))
      );
    });

    socket.on('tab-complete-result', (data: { input: string; completions: string[] }) => {
      setCompletionInput(data.input);
      setCompletions(data.completions);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleIncomingOutput = (data: TerminalOutputPayload | string) => {
    const rawOutput = typeof data === 'string' ? data : data.output;
    const newCwd = typeof data === 'object' ? data.cwd : undefined;
    const action = typeof data === 'object' ? data.action : undefined;
    const actionPayload = typeof data === 'object' ? data.actionPayload : undefined;
    const targetTabId = typeof data === 'object' && data.tabId ? data.tabId : undefined;

    if (action === 'clear') {
      setTabs((prev) =>
        prev.map((t) => {
          if (!targetTabId || t.id === targetTabId) {
            return { ...t, history: [] };
          }
          return t;
        })
      );
      return;
    }

    if (action === 'matrix') {
      setIsMatrixActive(true);
    }

    if (action === 'open' && actionPayload) {
      window.open(actionPayload, '_blank', 'noopener,noreferrer');
    }

    const isBanner =
      (typeof data === 'object' && data.isBanner) ||
      rawOutput.includes('Bienvenido a la Terminal SSH');

    if (rawOutput) {
      const historyItem: TerminalHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: isBanner ? 'banner' : 'output',
        content: rawOutput,
        cwd: newCwd,
        timestamp: Date.now(),
      };

      setTabs((prev) =>
        prev.map((tab) => {
          if (!targetTabId || tab.id === targetTabId) {
            // Si es un banner y la pestaña ya tiene uno, no duplicar
            if (
              isBanner &&
              tab.history.some(
                (item) =>
                  item.type === 'banner' ||
                  item.content.includes('Bienvenido a la Terminal SSH')
              )
            ) {
              return {
                ...tab,
                cwd: newCwd || tab.cwd,
              };
            }

            return {
              ...tab,
              cwd: newCwd || tab.cwd,
              history: [...tab.history, historyItem],
            };
          }
          return tab;
        })
      );
    }
  };

  // Enviar comando
  const sendCommand = useCallback(
    (commandText: string) => {
      const trimmed = commandText.trim();
      const currentTab = tabs.find((t) => t.id === activeTabId);
      if (!currentTab) return;

      // Eco local del comando ingresado
      const commandItem: TerminalHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'command',
        content: commandText,
        prompt: `jorge@vps-1gb-ram:${currentTab.cwd}$ `,
        cwd: currentTab.cwd,
        timestamp: Date.now(),
      };

      // Manejar comando clear local
      if (trimmed.toLowerCase() === 'clear') {
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId
              ? {
                  ...t,
                  history: [],
                  commandHistory: trimmed ? [...t.commandHistory, commandText] : t.commandHistory,
                  historyIndex: -1,
                  inputDraft: '',
                }
              : t
          )
        );
        return;
      }

      // Actualizar historial local de la pestaña
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                history: [...t.history, commandItem],
                commandHistory: trimmed ? [...t.commandHistory, commandText] : t.commandHistory,
                historyIndex: -1,
                inputDraft: '',
              }
            : t
        )
      );

      // Emitir al backend
      if (socketRef.current && connectionStatus === 'connected') {
        socketRef.current.emit('execute-command', {
          command: commandText,
          tabId: activeTabId,
        });
      } else {
        const errorItem: TerminalHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'system',
          content: '\x1b[31m[Error]: Conexión SSH perdida. Intentando reconectar...\x1b[0m',
          timestamp: Date.now(),
        };
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId ? { ...t, history: [...t.history, errorItem] } : t
          )
        );
      }
    },
    [activeTabId, tabs, connectionStatus]
  );

  // Solicitar autocompletado con Tab
  const requestTabComplete = useCallback(
    (input: string) => {
      const currentTab = tabs.find((t) => t.id === activeTabId);
      if (socketRef.current && connectionStatus === 'connected') {
        socketRef.current.emit('tab-complete', {
          input,
          cwd: currentTab?.cwd || '~',
        });
      }
    },
    [activeTabId, tabs, connectionStatus]
  );

  // Navegar historial de comandos con Flechas Arriba y Abajo
  const navigateHistory = useCallback(
    (direction: 'up' | 'down', currentInput: string): string => {
      const currentTab = tabs.find((t) => t.id === activeTabId);
      if (!currentTab || currentTab.commandHistory.length === 0) return currentInput;

      const history = currentTab.commandHistory;
      let newIndex = currentTab.historyIndex;

      if (direction === 'up') {
        if (newIndex === -1) {
          // Guardar borrador actual
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId ? { ...t, inputDraft: currentInput } : t
            )
          );
          newIndex = history.length - 1;
        } else if (newIndex > 0) {
          newIndex -= 1;
        }
      } else {
        if (newIndex === -1) {
          return currentInput;
        } else if (newIndex < history.length - 1) {
          newIndex += 1;
        } else {
          // Restaurar borrador
          newIndex = -1;
          const restoredDraft = currentTab.inputDraft;
          setTabs((prev) =>
            prev.map((t) =>
              t.id === activeTabId ? { ...t, historyIndex: -1 } : t
            )
          );
          return restoredDraft;
        }
      }

      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId ? { ...t, historyIndex: newIndex } : t
        )
      );

      return history[newIndex] || '';
    },
    [activeTabId, tabs]
  );

  // Gestión de pestañas (Tmux)
  const addTab = useCallback(() => {
    if (tabs.length >= 5) return;
    const newId = `tab-${Date.now().toString(36)}`;
    const newTabTitle = tabs.length === 1 ? 'dev' : tabs.length === 2 ? 'logs' : `session-${tabs.length + 1}`;

    const newTab: TerminalTab = {
      id: newId,
      title: newTabTitle,
      cwd: '~',
      history: [
        {
          id: Math.random().toString(36),
          type: 'banner',
          content: `\x1b[1;36m[Nueva sesión SSH abierta: ${newTabTitle}]\x1b[0m\nEscribe "help" para ver los comandos disponibles.`,
          timestamp: Date.now(),
        },
      ],
      commandHistory: [],
      historyIndex: -1,
      inputDraft: '',
    };

    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
  }, [tabs.length]);

  const closeTab = useCallback(
    (tabId: string) => {
      if (tabs.length <= 1) return;
      const remainingTabs = tabs.filter((t) => t.id !== tabId);
      setTabs(remainingTabs);
      if (activeTabId === tabId) {
        setActiveTabId(remainingTabs[0].id);
      }
    },
    [activeTabId, tabs]
  );

  // Compartir sesión en modo espejo
  const shareSession = useCallback(() => {
    if (socketRef.current && connectionStatus === 'connected') {
      socketRef.current.emit('create-shared-session');
      socketRef.current.once('shared-session-created', (data: { sessionId: string }) => {
        const fullUrl = `${window.location.origin}${window.location.pathname}?terminal_session=${data.sessionId}`;
        navigator.clipboard.writeText(fullUrl);
      });
    }
  }, [connectionStatus]);

  // Notificar redimensionado PTY
  const notifyResize = useCallback((cols: number, rows: number) => {
    if (socketRef.current) {
      socketRef.current.emit('pty-resize', { cols, rows });
    }
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  return {
    tabs,
    activeTab,
    activeTabId,
    setActiveTabId,
    addTab,
    closeTab,
    sendCommand,
    requestTabComplete,
    navigateHistory,
    completions,
    completionInput,
    setCompletions,
    connectionStatus,
    isMatrixActive,
    setIsMatrixActive,
    isMirrorMode,
    shareSession,
    notifyResize,
  };
};
