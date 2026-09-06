import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SandboxService } from '../services/sandbox.service';
import { SandboxSecurityService } from '../services/sandbox-security.service';

@WebSocketGateway({
  namespace: '/sandbox',
  cors: {
    origin: [
      'https://portfolio.jorgedoicela.com',
      'https://jorgedoicela.com',
      // Permitir localhost solo en desarrollo local
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3001', 'http://localhost:3000']
        : []),
    ],
    credentials: true,
  },
})
export class SandboxGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SandboxGateway.name);

  constructor(
    private readonly sandboxService: SandboxService,
    private readonly sandboxSecurityService: SandboxSecurityService,
  ) {}

  private extractClientIp(client: Socket): string {
    const headers = client.handshake.headers;
    const cfConnectingIp = headers['cf-connecting-ip'];
    if (cfConnectingIp && typeof cfConnectingIp === 'string') {
      return cfConnectingIp.trim();
    }
    const xRealIp = headers['x-real-ip'];
    if (xRealIp && typeof xRealIp === 'string') {
      return xRealIp.trim();
    }
    const xForwardedFor = headers['x-forwarded-for'];
    if (xForwardedFor && typeof xForwardedFor === 'string') {
      return xForwardedFor.split(',')[0].trim();
    }
    return client.conn.remoteAddress || '127.0.0.1';
  }

  handleConnection(client: Socket) {
    const clientIp = this.extractClientIp(client);
    this.logger.log(
      `Cliente conectado al Sandbox WebSocket: ${client.id} (IP: ${clientIp})`,
    );
  }

  async handleDisconnect(client: Socket) {
    const clientIp = this.extractClientIp(client);
    this.logger.log(
      `Cliente desconectado del Sandbox WebSocket: ${client.id} (IP: ${clientIp})`,
    );
    // Solo destruir y liberar si este socket sigue siendo el dueño activo de la sesión
    const activeSocketId =
      this.sandboxSecurityService.getActiveSocketByIp(clientIp);
    if (activeSocketId === client.id) {
      this.sandboxSecurityService.releaseSession(clientIp, client.id);
      await this.sandboxService.destroySession(client.id);
    } else {
      this.logger.log(
        `Socket ${client.id} desconectado pero la sesión activa de IP ${clientIp} pertenece a ${activeSocketId}. Contenedor preservado.`,
      );
    }
  }

  @SubscribeMessage('start-session')
  async handleStartSession(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload?: {
      cols?: number;
      rows?: number;
      targetMode?: 'vps' | 'tunnel';
      forceReplace?: boolean;
    },
  ) {
    const cols = payload?.cols || 80;
    const rows = payload?.rows || 24;
    const forceReplace = !!payload?.forceReplace;
    const clientIp = this.extractClientIp(client);

    // Validación estricta: solo valores del enum conocido; cualquier otro valor cae a 'vps'
    const targetMode: 'vps' | 'tunnel' =
      payload?.targetMode === 'tunnel' ? 'tunnel' : 'vps';

    this.logger.log(
      `Evento 'start-session' recibido de cliente ${client.id} (IP: ${clientIp}, Cols: ${cols}, Rows: ${rows}, Mode: ${targetMode}, Force: ${forceReplace})`,
    );

    // 1. Evaluación de Seguridad Perimetral y Concurrencia por IP (Zero-Docker call if rejected)
    const decision = this.sandboxSecurityService.evaluateAccess(
      clientIp,
      client.id,
      forceReplace,
    );

    if (!decision.allowed) {
      this.logger.warn(
        `[SandboxGateway] Sesión rechazada para ${client.id} (IP: ${clientIp}). Razón: ${decision.code} - ${decision.message}`,
      );
      client.emit('session-rejected', {
        code: decision.code,
        message: decision.message,
        remainingSeconds: decision.remainingSeconds,
        existingSocketId: decision.existingSocketId,
      });
      return;
    }

    // 2. Si es una transferencia en caliente (Handover PTY) de una sesión viva:
    const previousSocketId =
      this.sandboxSecurityService.getActiveSocketByIp(clientIp);

    if (
      forceReplace &&
      previousSocketId &&
      previousSocketId !== client.id &&
      this.sandboxService.getSession(previousSocketId)
    ) {
      this.logger.log(
        `[SandboxGateway] Handover PTY en caliente para IP ${clientIp}: reasignando ${previousSocketId} → ${client.id} (Zero-Docker destroy)`,
      );

      // 1. Reclamar de inmediato la titularidad síncrona en seguridad (previene race condition con disconnect)
      this.sandboxSecurityService.transferSession(clientIp, client.id);

      // 2. Notificar al socket previo para que actualice su interfaz a estado reemplazado
      this.server.to(previousSocketId).emit('session-replaced', {
        reason: 'La terminal ha sido transferida a otra ventana o pestaña.',
      });

      // 3. Transferir en memoria en SandboxService (reasigna socketId y redimensiona PTY)
      const handover = await this.sandboxService.transferSession(
        previousSocketId,
        client.id,
        cols,
        rows,
      );

      if (handover) {
        this.logger.log(
          `Enviando 'session-ready' tras Handover PTY a cliente ${client.id} (sessionId: ${handover.sessionId}, mode: ${handover.mode})`,
        );

        client.emit('session-ready', {
          sessionId: handover.sessionId,
          cols,
          rows,
          maxTtlSeconds: handover.remainingTtlSeconds,
          mode: handover.mode,
        });

        // Enviar historial reciente acumulado (scrollback) para renderizado inmediato
        if (handover.scrollback) {
          client.emit('terminal-output', handover.scrollback);
        }

        return; // ¡Handover completado en caliente!
      }
    }

    // Si existía sesión previa pero ya no está viva, limpiar antes de crear una nueva
    if (previousSocketId && previousSocketId !== client.id) {
      this.server.to(previousSocketId).emit('session-replaced', {
        reason: 'La terminal ha sido transferida a otra ventana o pestaña.',
      });
      await this.sandboxService.destroySession(previousSocketId);
      this.sandboxSecurityService.releaseSession(clientIp, previousSocketId);
    }

    try {
      const { stream, sessionId, mode, session } =
        await this.sandboxService.createSession(
          client.id,
          cols,
          rows,
          targetMode,
          // Callback advertencia 4m 30s dirigida dinámicamente al socketId activo
          (currentSocketId: string) => {
            this.server.to(currentSocketId).emit('session-warning', {
              message:
                '\r\n\x1b[33m[AVISO] Tu sesión efímera expirará en 30 segundos.\x1b[0m\r\n',
              secondsRemaining: 30,
            });
          },
          // Callback expiración 5m dirigida dinámicamente al socketId activo
          (currentSocketId: string) => {
            this.sandboxSecurityService.releaseSession(
              clientIp,
              currentSocketId,
            );
            this.server.to(currentSocketId).emit('session-expired', {
              reason: 'Tiempo límite de sesión de 5 minutos alcanzado.',
            });
          },
        );

      // Registrar sesión activa bajo la IP
      this.sandboxSecurityService.registerSession(clientIp, client.id);

      // Transmitir salida del contenedor hacia el cliente activo actual
      stream.on('data', (chunk: Buffer) => {
        let text = chunk.toString('utf-8');
        // Filtrar eco de handshake JSON de attach de Dockerode en Windows/WSL2
        if (text.includes('{"stream":true')) {
          text = text.replace(/\{"stream":true[^}]*\}\r?\n?/g, '');
          if (!text.trim()) return;
        }

        // Acumular en buffer de scrollback de la sesión (máx 32 KB)
        session.scrollbackBuffer = (session.scrollbackBuffer + text).slice(
          -32768,
        );

        // Emitir siempre al socketId actualmente activo
        this.server.to(session.socketId).emit('terminal-output', text);
      });

      stream.on('end', () => {
        this.logger.log(
          `Stream PTY finalizado para ${session.socketId} (${sessionId})`,
        );
        this.sandboxSecurityService.releaseSession(clientIp, session.socketId);
        this.server.to(session.socketId).emit('session-ended', {
          reason: 'El proceso del shell ha finalizado.',
        });
      });

      this.logger.log(
        `Enviando 'session-ready' a cliente ${client.id} (sessionId: ${sessionId}, mode: ${mode})`,
      );
      client.emit('session-ready', {
        sessionId,
        cols,
        rows,
        maxTtlSeconds: 300,
        mode,
      });
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Error al inicializar el contenedor sandbox.';
      this.logger.error(
        `Error al iniciar sandbox para ${client.id}: ${errorMessage}`,
      );
      this.sandboxSecurityService.releaseSession(clientIp, client.id);
      client.emit('session-error', {
        message: errorMessage,
      });
    }
  }

  @SubscribeMessage('terminal-input')
  handleTerminalInput(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    // No logear el contenido del input: puede contener datos privados del visitante
    this.sandboxService.writeInput(
      client.id,
      typeof data === 'string' ? data : String(data),
    );
  }

  @SubscribeMessage('terminal-resize')
  async handleTerminalResize(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { cols: number; rows: number },
  ) {
    if (payload && payload.cols && payload.rows) {
      await this.sandboxService.resizeTerminal(
        client.id,
        payload.cols,
        payload.rows,
      );
    }
  }
}
