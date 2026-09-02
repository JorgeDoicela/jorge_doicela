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

  constructor(private readonly sandboxService: SandboxService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado al Sandbox WebSocket: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado del Sandbox WebSocket: ${client.id}`);
    await this.sandboxService.destroySession(client.id);
  }

  @SubscribeMessage('start-session')
  async handleStartSession(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload?: { cols?: number; rows?: number; targetMode?: 'vps' | 'tunnel' },
  ) {
    const cols = payload?.cols || 80;
    const rows = payload?.rows || 24;
    // Validación estricta: solo valores del enum conocido; cualquier otro valor cae a 'vps'
    const targetMode: 'vps' | 'tunnel' =
      payload?.targetMode === 'tunnel' ? 'tunnel' : 'vps';
    this.logger.log(
      `Evento 'start-session' recibido de cliente ${client.id} (Cols: ${cols}, Rows: ${rows}, Mode: ${targetMode})`,
    );

    try {
      const { stream, sessionId, mode } =
        await this.sandboxService.createSession(
          client.id,
          cols,
          rows,
          targetMode,
          // Callback advertencia 4m 30s
          () => {
            client.emit('session-warning', {
              message:
                '\r\n\x1b[33m[AVISO] Tu sesión efímera expirará en 30 segundos.\x1b[0m\r\n',
              secondsRemaining: 30,
            });
          },
          // Callback expiración 5m
          () => {
            client.emit('session-expired', {
              reason: 'Tiempo límite de sesión de 5 minutos alcanzado.',
            });
          },
        );

      // Transmitir salida del contenedor hacia el cliente
      stream.on('data', (chunk: Buffer) => {
        let text = chunk.toString('utf-8');
        // Filtrar eco de handshake JSON de attach de Dockerode en Windows/WSL2
        if (text.includes('{"stream":true')) {
          text = text.replace(/\{"stream":true[^}]*\}\r?\n?/g, '');
          if (!text.trim()) return;
        }
        client.emit('terminal-output', text);
      });

      stream.on('end', () => {
        this.logger.log(
          `Stream PTY finalizado para ${client.id} (${sessionId})`,
        );
        client.emit('session-ended', {
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
