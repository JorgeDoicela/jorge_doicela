import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { API_URL, SANDBOX_TUNNEL_URL } from '../../../../config';

export type SandboxStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'warning'
  | 'expired'
  | 'error'
  | 'disconnected'
  | 'concurrency_limit'
  | 'cooldown'
  | 'rate_limited'
  | 'blocked'
  | 'replaced';

export interface RejectInfo {
  code: string;
  message: string;
  remainingSeconds?: number;
  existingSocketId?: string;
}

export interface UseSandboxTerminalOptions {
  onSessionEnded?: (reason?: string) => void;
  autoStart?: boolean;
  targetMode?: 'vps' | 'tunnel';
}

export const useSandboxTerminal = (options?: UseSandboxTerminalOptions) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const xtermRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [status, _setStatus] = useState<SandboxStatus>('idle');
  const statusRef = useRef<SandboxStatus>('idle');

  const setStatus = useCallback((nextStatus: SandboxStatus) => {
    statusRef.current = nextStatus;
    _setStatus(nextStatus);
  }, []);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(300);
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sandboxMode, setSandboxMode] = useState<'vps' | 'tunnel' | null>(null);
  const [rejectInfo, setRejectInfo] = useState<RejectInfo | null>(null);

  // Identificador de instancia única de pestaña/hook para no auto-invalidarse
  const tabInstanceIdRef = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).substring(2),
  );

  // Temporizador regresivo de sesión
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (status === 'connected' || status === 'warning') {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status]);

  // Temporizador regresivo para Cooldown
  useEffect(() => {
    if (status !== 'cooldown' || cooldownSeconds <= 0) return;

    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          setStatus('idle');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, cooldownSeconds]);

  // Sincronización entre pestañas locales con BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;
    const channel = new BroadcastChannel('portfolio_sandbox_multitab');

    channel.onmessage = (event) => {
      const data = event.data;
      if (
        data?.type === 'SESSION_STARTED' &&
        data?.senderTabId !== tabInstanceIdRef.current
      ) {
        // Otra ventana o pestaña del mismo navegador acaba de iniciar una sesión
        if (status === 'connected' || status === 'connecting') {
          setStatus('replaced');
          if (xtermRef.current) {
            xtermRef.current.clear();
          }
          if (socketRef.current) {
            socketRef.current.disconnect();
          }
        }
      }
    };

    return () => {
      channel.close();
    };
  }, [status]);

  // Inicializar instancia de xterm.js
  const initTerminal = useCallback((container: HTMLDivElement) => {
    if (xtermRef.current) return;

    const isSmallScreen =
      typeof window !== 'undefined' && window.innerWidth < 640;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontSize: isSmallScreen ? 11 : 13,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      lineHeight: 1.25,
      scrollback: 1000,
      theme: {
        background: '#080705', // Dark Luxury background
        foreground: '#ede8df', // Dark Luxury foreground
        cursor: '#c5a87a', // Gold Luxury accent (--gold-300)
        cursorAccent: '#080705',
        selectionBackground: 'rgba(197, 168, 122, 0.22)',
        black: '#141209',
        red: '#f87171',
        green: '#4ade80',
        yellow: '#d9c49a',
        blue: '#60a5fa',
        magenta: '#c5a87a',
        cyan: '#38bdf8',
        white: '#ede8df',
        brightBlack: '#6b6055',
        brightRed: '#fca5a5',
        brightGreen: '#86efac',
        brightYellow: '#f0e4cb',
        brightBlue: '#93c5fd',
        brightMagenta: '#d9c49a',
        brightCyan: '#7dd3fc',
        brightWhite: '#ffffff',
      },
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);

    // Conectar entrada de teclado una sola vez a través de socketRef
    term.onData((inputData) => {
      // Ignorar secuencias de tracking del ratón (SGR / X10 Mouse events) al hacer clic
      if (inputData.startsWith('\x1b[<') || inputData.startsWith('\x1b[M')) {
        return;
      }
      // NOTA: no se loguea el inputData para preservar la privacidad del visitante
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('terminal-input', inputData);
      }
    });

    // Ajustar tamaño inicial al contenedor DOM
    try {
      fitAddon.fit();
    } catch {
      // Ignorar fallo de layout si no es visible aún
    }

    xtermRef.current = term;
    fitAddonRef.current = fitAddon;
  }, []);

  // Forzar foco en el canvas de xterm
  const focusTerminal = useCallback(() => {
    if (xtermRef.current) {
      xtermRef.current.focus();
    }
  }, []);

  // Conectar y arrancar la sesión de contenedor Docker
  const startSession = useCallback(
    (startOpts?: { forceReplace?: boolean }) => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }

      setStatus('connecting');
      setErrorMessage(null);
      setRejectInfo(null);
      setRemainingSeconds(300);

      const targetMode = options?.targetMode || 'vps';
      const isTunnel = targetMode === 'tunnel';
      const socketBaseUrl = isTunnel ? SANDBOX_TUNNEL_URL : API_URL;
      const socketUrl = `${socketBaseUrl}/sandbox`;
      const forceReplace = !!startOpts?.forceReplace;

    console.log('[Sandbox] startSession invocado. Modo:', targetMode, 'URL:', socketUrl);

    if (xtermRef.current) {
      xtermRef.current.clear();
    }

    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1500,
      timeout: 10000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Sandbox] WebSocket CONECTADO con ID:', socket.id);
      const cols = xtermRef.current?.cols || 80;
      // Reservar 2 filas de holgura visual para que el prompt nunca toque el fondo
      const rows = Math.max(10, (xtermRef.current?.rows || 24) - 2);
      console.log('[Sandbox] Solicitando inicio de contenedor Docker (cols, rows, targetMode):', {
        cols,
        rows,
        targetMode,
        forceReplace,
      });
      socket.emit('start-session', { cols, rows, targetMode, forceReplace });
    });

    socket.on('connect_error', (err) => {
      console.error('[Sandbox] Error de conexión WebSocket:', err);
      setStatus('error');
      const msg = isTunnel
        ? `No se pudo conectar con el Servidor Físico Propio (${SANDBOX_TUNNEL_URL}). El túnel o equipo local no están activos en este momento.`
        : `Fallo al conectar con el servidor Cloud en AWS: ${err.message}`;
      setErrorMessage(msg);
      if (xtermRef.current) {
        xtermRef.current.write(`\r\n\x1b[31m[ERROR DE CONEXIÓN]: ${msg}\x1b[0m\r\n`);
      }
    });

    socket.on(
      'session-ready',
      (data: {
        sessionId: string;
        maxTtlSeconds: number;
        mode?: 'vps' | 'tunnel';
      }) => {
        console.log('[Sandbox] Sesión Docker LISTA recibida del backend:', data);
        if (forceReplace && xtermRef.current) {
          xtermRef.current.clear();
        }
        setStatus('connected');
        setSessionId(data.sessionId);
        setRemainingSeconds(data.maxTtlSeconds || 300);
        if (data.mode) {
          setSandboxMode(data.mode);
        }

        // Notificar a otras ventanas a través de BroadcastChannel
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const channel = new BroadcastChannel('portfolio_sandbox_multitab');
          channel.postMessage({
            type: 'SESSION_STARTED',
            senderTabId: tabInstanceIdRef.current,
            senderSessionId: data.sessionId,
          });
          channel.close();
        }

        // Sincronización de geometría y enfoque del canvas con holgura inferior
        requestAnimationFrame(() => {
          if (fitAddonRef.current && xtermRef.current) {
            try {
              fitAddonRef.current.fit();
              xtermRef.current.focus();
              const cols = xtermRef.current.cols;
              const rows = Math.max(10, xtermRef.current.rows - 2);
              socket.emit('terminal-resize', { cols, rows });
            } catch {
              // Ignorar si aún está en transición
            }
          }
        });
      },
    );

    socket.on('terminal-output', (data: string) => {
      console.log('[Sandbox] Output recibido de Docker:', data.length, 'bytes');
      if (xtermRef.current) {
        xtermRef.current.write(data, () => {
          xtermRef.current?.scrollToBottom();
        });
      }
    });

    socket.on('session-warning', () => {
      setStatus('warning');
    });

    socket.on('session-expired', (data: { reason: string }) => {
      setStatus('expired');
      if (xtermRef.current) {
        xtermRef.current.write(`\r\n\x1b[31m[SESIÓN FINALIZADA] ${data.reason}\x1b[0m\r\n`);
      }
      if (options?.onSessionEnded) {
        options.onSessionEnded(data.reason);
      }
    });

    socket.on('session-ended', (data: { reason: string }) => {
      setStatus('disconnected');
      if (xtermRef.current) {
        xtermRef.current.write(`\r\n\x1b[38;5;242m[SESIÓN TERMINADA] ${data.reason}\x1b[0m\r\n`);
      }
      if (options?.onSessionEnded) {
        options.onSessionEnded(data.reason);
      }
    });

    // Manejo de rechazos de seguridad del backend (concurrencia, cooldown, límites)
    socket.on(
      'session-rejected',
      (data: {
        code: string;
        message: string;
        remainingSeconds?: number;
        existingSocketId?: string;
      }) => {
        console.warn('[Sandbox] Solicitud rechazada por backend:', data);
        setRejectInfo(data as RejectInfo);

        if (data.code === 'ACTIVE_SESSION_EXISTS') {
          setStatus('concurrency_limit');
          if (xtermRef.current) {
            xtermRef.current.clear();
          }
        } else if (data.code === 'COOLDOWN_ACTIVE') {
          setStatus('cooldown');
          setCooldownSeconds(data.remainingSeconds || 6);
          if (xtermRef.current) {
            xtermRef.current.clear();
          }
        } else if (data.code === 'HOURLY_LIMIT_REACHED') {
          setStatus('rate_limited');
          if (xtermRef.current) {
            xtermRef.current.clear();
          }
        } else if (data.code === 'IP_BLOCKED') {
          setStatus('blocked');
          if (xtermRef.current) {
            xtermRef.current.clear();
          }
        } else {
          setStatus('error');
          setErrorMessage(data.message);
        }

        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      },
    );

    // Notificación de que otra pestaña reclamó la sesión
    socket.on('session-replaced', (data: { reason: string }) => {
      setStatus('replaced');
      if (xtermRef.current) {
        xtermRef.current.clear();
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    });

    socket.on('session-error', (data: { message: string }) => {
      console.error('[Sandbox] Error devuelto por el contenedor:', data.message);
      setStatus('error');
      setErrorMessage(data.message);
      if (xtermRef.current) {
        xtermRef.current.write(`\r\n\x1b[31m[ERROR]: ${data.message}\x1b[0m\r\n`);
      }
    });

    socket.on('disconnect', () => {
      const current = statusRef.current;
      if (
        current !== 'expired' &&
        current !== 'replaced' &&
        current !== 'concurrency_limit' &&
        current !== 'cooldown' &&
        current !== 'rate_limited' &&
        current !== 'blocked'
      ) {
        setStatus('disconnected');
      }
    });
  }, [options, setStatus]);

  // Auto-inicio de sesión si se especifica en las opciones
  useEffect(() => {
    if (options?.autoStart && status === 'idle') {
      startSession();
    }
  }, [options?.autoStart, status, startSession]);

  // Copiar selección activa de xterm al portapapeles del sistema
  const copySelection = useCallback(() => {
    if (!xtermRef.current) return false;
    const selection = xtermRef.current.getSelection();
    if (selection) {
      navigator.clipboard.writeText(selection).catch(() => {});
      return true;
    }
    return false;
  }, []);

  // Pegar texto en la sesión interactiva del terminal
  const pasteToTerminal = useCallback(async (customText?: string) => {
    try {
      const text =
        customText !== undefined
          ? customText
          : await navigator.clipboard.readText();
      if (!text) return false;
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.emit('terminal-input', text);
      } else if (xtermRef.current) {
        xtermRef.current.paste(text);
      }
      return true;
    } catch (err) {
      console.warn('[Sandbox] Error al acceder al portapapeles:', err);
      return false;
    }
  }, []);

  // Desconectar y matar sesión manualmente
  const endSession = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setStatus('idle');
    setSessionId(null);
    if (xtermRef.current) {
      xtermRef.current.write('\r\n\x1b[33m[SESIÓN CERRADA POR EL USUARIO]\x1b[0m\r\n');
    }
  }, []);

  // Redimensionar xterm y notificar al backend Dockerode con 2 filas de margen inferior
  const handleResize = useCallback(() => {
    if (fitAddonRef.current && xtermRef.current && terminalRef.current) {
      try {
        const isSmall = window.innerWidth < 640;
        const targetFontSize = isSmall ? 11 : 13;
        if (xtermRef.current.options.fontSize !== targetFontSize) {
          xtermRef.current.options.fontSize = targetFontSize;
        }

        fitAddonRef.current.fit();
        const cols = xtermRef.current.cols;
        const rows = Math.max(10, xtermRef.current.rows - 2);
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('terminal-resize', { cols, rows });
        }
      } catch {
        // Ignorar fallo si el contenedor está oculto
      }
    }
  }, []);

  // Observer de redimensionado automático
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    resizeObserver.observe(el);
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (xtermRef.current) {
        xtermRef.current.dispose();
      }
    };
  }, []);

  return {
    terminalRef,
    initTerminal,
    status,
    errorMessage,
    remainingSeconds,
    cooldownSeconds,
    sessionId,
    sandboxMode,
    rejectInfo,
    startSession,
    endSession,
    handleResize,
    focusTerminal,
    copySelection,
    pasteToTerminal,
  };
};
