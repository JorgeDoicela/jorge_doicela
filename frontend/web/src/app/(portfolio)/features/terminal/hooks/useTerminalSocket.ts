import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '../../../../config';
import {
  TerminalTab,
  TerminalPane,
  TerminalHistoryItem,
  TerminalOutputPayload,
  ConnectionStatus,
} from '../types';

export const useTerminalSocket = () => {
  const [tabs, setTabs] = useState<TerminalTab[]>([
    {
      id: 'tab-1',
      title: 'main',
      layout: 'single',
      activePaneId: 'pane-1',
      panes: [
        {
          id: 'pane-1',
          cwd: '~',
          history: [],
          commandHistory: [],
          historyIndex: -1,
          inputDraft: '',
        },
      ],
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
  const [completions, setCompletions] = useState<string[]>([]);
  const [completionInput, setCompletionInput] = useState<string>('');

  const socketRef = useRef<Socket | null>(null);

  // Inicializar Socket.io
  useEffect(() => {
    const socket = io(`${API_URL}/terminal`, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 15,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
    });

    socket.on('reconnect_attempt', () => {
      setConnectionStatus('reconnecting');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('terminal-output', (data: TerminalOutputPayload | string) => {
      handleIncomingOutput(data);
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
    const targetPaneId = typeof data === 'object' && data.paneId ? data.paneId : undefined;

    if (action === 'clear') {
      setTabs((prev) =>
        prev.map((t) => {
          if (!targetTabId || t.id === targetTabId) {
            const updatedPanes = t.panes.map((p) =>
              !targetPaneId || p.id === (targetPaneId || t.activePaneId)
                ? { ...p, history: [] }
                : p
            );
            return {
              ...t,
              history: [],
              panes: updatedPanes,
            };
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
            const paneToUpdate = targetPaneId || tab.activePaneId || tab.panes[0]?.id || 'pane-1';

            const updatedPanes = tab.panes.map((pane) => {
              if (pane.id === paneToUpdate) {
                if (
                  isBanner &&
                  pane.history.some(
                    (item) =>
                      item.type === 'banner' ||
                      item.content.includes('Jorge Ismael Doicela Molina')
                  )
                ) {
                  return { ...pane, cwd: newCwd || pane.cwd };
                }
                return {
                  ...pane,
                  cwd: newCwd || pane.cwd,
                  history: [...pane.history, historyItem],
                };
              }
              return pane;
            });

            // Compatibilidad directa con tab.history
            const firstPane = updatedPanes[0];
            return {
              ...tab,
              cwd: newCwd || tab.cwd,
              history: firstPane ? firstPane.history : [...tab.history, historyItem],
              panes: updatedPanes,
            };
          }
          return tab;
        })
      );
    }
  };

  // Dividir panel en modo tmux
  const splitPane = useCallback(
    (direction: 'vertical' | 'horizontal' = 'vertical') => {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === activeTabId) {
            if (tab.panes.length >= 2) {
              // Si ya tiene 2 panes, solo cambiar orientación
              return {
                ...tab,
                layout: direction === 'vertical' ? 'split-vertical' : 'split-horizontal',
              };
            }

            const newPaneId = `pane-${Date.now().toString(36)}`;
            const newPane: TerminalPane = {
              id: newPaneId,
              cwd: tab.cwd || '~',
              history: [
                {
                  id: Math.random().toString(36),
                  type: 'banner',
                  content: [
                    '\x1b[1;33m[Nueva Sesión • Debian GNU/Linux 13]\x1b[0m',
                    '\x1b[90mEscribe "about", "projects" o "skills". Usa "exit" para cerrar este panel.\x1b[0m',
                    '',
                  ].join('\n'),
                  timestamp: Date.now(),
                },
              ],
              commandHistory: [],
              historyIndex: -1,
              inputDraft: '',
            };

            return {
              ...tab,
              layout: direction === 'vertical' ? 'split-vertical' : 'split-horizontal',
              activePaneId: newPaneId,
              panes: [...tab.panes, newPane],
            };
          }
          return tab;
        })
      );
    },
    [activeTabId]
  );

  // Cerrar panel secundario
  const closePane = useCallback(
    (paneIdToClose?: string) => {
      setTabs((prev) =>
        prev.map((tab) => {
          if (tab.id === activeTabId && tab.panes.length > 1) {
            const targetId = paneIdToClose || tab.activePaneId;
            const remaining = tab.panes.filter((p) => p.id !== targetId);
            const fallbackPane = remaining[0] || tab.panes[0];

            return {
              ...tab,
              layout: 'single',
              activePaneId: fallbackPane.id,
              panes: remaining.length > 0 ? remaining : [tab.panes[0]],
              history: fallbackPane.history,
              cwd: fallbackPane.cwd,
            };
          }
          return tab;
        })
      );
    },
    [activeTabId]
  );

  // Alternar split
  const toggleSplit = useCallback(() => {
    const currentTab = tabs.find((t) => t.id === activeTabId);
    if (!currentTab) return;
    if (currentTab.layout === 'single') {
      splitPane('vertical');
    } else {
      closePane();
    }
  }, [activeTabId, tabs, splitPane, closePane]);

  // Cambiar panel activo
  const setActivePaneId = useCallback(
    (paneId: string) => {
      setTabs((prev) =>
        prev.map((tab) =>
          tab.id === activeTabId ? { ...tab, activePaneId: paneId } : tab
        )
      );
    },
    [activeTabId]
  );

  // Enviar comando con soporte para comandos tmux locales
  const sendCommand = useCallback(
    (commandText: string, specificPaneId?: string) => {
      const trimmed = commandText.trim();
      const currentTab = tabs.find((t) => t.id === activeTabId);
      if (!currentTab) return;

      const targetPaneId = specificPaneId || currentTab.activePaneId || currentTab.panes[0]?.id || 'pane-1';
      const targetPane = currentTab.panes.find((p) => p.id === targetPaneId) || currentTab.panes[0];
      const currentCwd = targetPane?.cwd || currentTab.cwd || '~';

      // Eco local del comando ingresado
      const commandItem: TerminalHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        type: 'command',
        content: commandText,
        prompt: `jorge@debian:${currentCwd}$ `,
        cwd: currentCwd,
        timestamp: Date.now(),
      };

      // Manejo de comandos locales de tmux / split
      const lower = trimmed.toLowerCase();
      if (lower === 'split' || lower === 'split-v' || lower === 'vsplit' || lower === 'tmux split -h' || lower === 'tmux split-h') {
        splitPane('vertical');
        return;
      }
      if (lower === 'split-h' || lower === 'hsplit' || lower === 'tmux split -v' || lower === 'tmux split-v') {
        splitPane('horizontal');
        return;
      }
      if (lower === 'unsplit' || lower === 'kill-pane' || lower === 'close-pane' || lower === 'tmux kill-pane') {
        closePane(targetPaneId);
        return;
      }

      // Si escribe exit y hay más de 1 panel, cierra el panel
      if (lower === 'exit' && currentTab.panes.length > 1) {
        closePane(targetPaneId);
        return;
      }

      // Comando tmux informativo
      if (lower === 'tmux' || lower === 'tmux help') {
        const tmuxHelpItem: TerminalHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'output',
          content: [
            '\x1b[1;33mTerminal Multiplexer (tmux) • Comandos & Atajos:\x1b[0m',
            '\x1b[90m------------------------------------------------------------\x1b[0m',
            '  \x1b[1;33msplit-v\x1b[0m (o \x1b[33mCtrl+B %\x1b[0m)    \x1b[90m→\x1b[0m Divide la pantalla en 2 columnas verticales',
            '  \x1b[1;33msplit-h\x1b[0m (o \x1b[33mCtrl+B "\x1b[0m)    \x1b[90m→\x1b[0m Divide la pantalla en 2 filas horizontales',
            '  \x1b[1;33munsplit\x1b[0m (o \x1b[33mexit\x1b[0m)        \x1b[90m→\x1b[0m Cierra el panel secundario y vuelve a 1 panel',
            '  \x1b[1;33mCtrl+B c\x1b[0m               \x1b[90m→\x1b[0m Crea una nueva ventana/pestaña',
            '  \x1b[1;33mCtrl+B 0..4\x1b[0m            \x1b[90m→\x1b[0m Cambia a la ventana número N',
            '\x1b[90m(También puedes usar el botón de división en la barra superior)\x1b[0m',
          ].join('\n'),
          timestamp: Date.now(),
        };

        setTabs((prev) =>
          prev.map((t) => {
            if (t.id === activeTabId) {
              const updatedPanes = t.panes.map((p) =>
                p.id === targetPaneId
                  ? {
                      ...p,
                      history: [...p.history, commandItem, tmuxHelpItem],
                      commandHistory: trimmed ? [...p.commandHistory, commandText] : p.commandHistory,
                      historyIndex: -1,
                      inputDraft: '',
                    }
                  : p
              );
              return { ...t, panes: updatedPanes, history: updatedPanes[0].history };
            }
            return t;
          })
        );
        return;
      }

      // Manejar comando clear local
      if (lower === 'clear') {
        setTabs((prev) =>
          prev.map((t) => {
            if (t.id === activeTabId) {
              const updatedPanes = t.panes.map((p) =>
                p.id === targetPaneId
                  ? {
                      ...p,
                      history: [],
                      commandHistory: trimmed ? [...p.commandHistory, commandText] : p.commandHistory,
                      historyIndex: -1,
                      inputDraft: '',
                    }
                  : p
              );
              return { ...t, panes: updatedPanes, history: updatedPanes[0].history };
            }
            return t;
          })
        );
        return;
      }

      // Actualizar historial local del pane
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId) {
            const updatedPanes = t.panes.map((p) =>
              p.id === targetPaneId
                ? {
                    ...p,
                    history: [...p.history, commandItem],
                    commandHistory: trimmed ? [...p.commandHistory, commandText] : p.commandHistory,
                    historyIndex: -1,
                    inputDraft: '',
                  }
                : p
            );
            return { ...t, panes: updatedPanes, history: updatedPanes[0].history };
          }
          return t;
        })
      );

      // Emitir al backend
      if (socketRef.current && connectionStatus === 'connected') {
        socketRef.current.emit('execute-command', {
          command: commandText,
          tabId: activeTabId,
          paneId: targetPaneId,
        });
      } else {
        const errorItem: TerminalHistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'system',
          content: '\x1b[31m[Error]: Conexión con el servidor perdida. Intentando reconectar...\x1b[0m',
          timestamp: Date.now(),
        };
        setTabs((prev) =>
          prev.map((t) => {
            if (t.id === activeTabId) {
              const updatedPanes = t.panes.map((p) =>
                p.id === targetPaneId ? { ...p, history: [...p.history, errorItem] } : p
              );
              return { ...t, panes: updatedPanes, history: updatedPanes[0].history };
            }
            return t;
          })
        );
      }
    },
    [activeTabId, tabs, connectionStatus, splitPane, closePane]
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
    (direction: 'up' | 'down', currentInput: string, paneId?: string): string => {
      const currentTab = tabs.find((t) => t.id === activeTabId);
      if (!currentTab) return currentInput;

      const targetPaneId = paneId || currentTab.activePaneId || currentTab.panes[0]?.id || 'pane-1';
      const targetPane = currentTab.panes.find((p) => p.id === targetPaneId) || currentTab.panes[0];
      if (!targetPane || targetPane.commandHistory.length === 0) return currentInput;

      const history = targetPane.commandHistory;
      let newIndex = targetPane.historyIndex;

      if (direction === 'up') {
        if (newIndex === -1) {
          setTabs((prev) =>
            prev.map((t) => {
              if (t.id === activeTabId) {
                const updatedPanes = t.panes.map((p) =>
                  p.id === targetPaneId ? { ...p, inputDraft: currentInput } : p
                );
                return { ...t, panes: updatedPanes };
              }
              return t;
            })
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
          newIndex = -1;
          const restoredDraft = targetPane.inputDraft;
          setTabs((prev) =>
            prev.map((t) => {
              if (t.id === activeTabId) {
                const updatedPanes = t.panes.map((p) =>
                  p.id === targetPaneId ? { ...p, historyIndex: -1 } : p
                );
                return { ...t, panes: updatedPanes };
              }
              return t;
            })
          );
          return restoredDraft;
        }
      }

      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeTabId) {
            const updatedPanes = t.panes.map((p) =>
              p.id === targetPaneId ? { ...p, historyIndex: newIndex } : p
            );
            return { ...t, panes: updatedPanes };
          }
          return t;
        })
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

    const newPaneId = `pane-${Date.now().toString(36)}`;
    const initialHistoryItem: TerminalHistoryItem = {
      id: Math.random().toString(36),
      type: 'banner',
      content: `\x1b[1;36m[Nueva sesión de consola: ${newTabTitle}]\x1b[0m\nEscribe "help" o "about" para ver los comandos disponibles.`,
      timestamp: Date.now(),
    };

    const newTab: TerminalTab = {
      id: newId,
      title: newTabTitle,
      layout: 'single',
      activePaneId: newPaneId,
      panes: [
        {
          id: newPaneId,
          cwd: '~',
          history: [initialHistoryItem],
          commandHistory: [],
          historyIndex: -1,
          inputDraft: '',
        },
      ],
      cwd: '~',
      history: [initialHistoryItem],
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
    splitPane,
    closePane,
    toggleSplit,
    setActivePaneId,
    sendCommand,
    requestTabComplete,
    navigateHistory,
    completions,
    completionInput,
    setCompletions,
    connectionStatus,
    isMatrixActive,
    setIsMatrixActive,
    notifyResize,
  };
};
