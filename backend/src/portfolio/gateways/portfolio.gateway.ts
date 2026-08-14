import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PortfolioService } from '../services/portfolio.service';

interface ClientSessionState {
  cwd: string;
  sharedSessionId?: string;
  cols?: number;
  rows?: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'terminal',
})
export class PortfolioGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(PortfolioGateway.name);
  private readonly clientStates = new Map<string, ClientSessionState>();

  @WebSocketServer()
  server: Server;

  constructor(private readonly portfolioService: PortfolioService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to terminal: ${client.id}`);
    this.clientStates.set(client.id, {
      cwd: '~',
      cols: 80,
      rows: 24,
    });

    // Enviar banner inicial de bienvenida con formato ANSI Dark Luxury
    const welcomeBanner = [
      '\x1b[90m┌────────────────────────────────────────────────────────────┐\x1b[0m',
      '\x1b[90m│\x1b[0m  \x1b[1;33mTerminal SSH Interactiva • Jorge Doicela\x1b[0m                  \x1b[90m│\x1b[0m',
      '\x1b[90m│\x1b[0m  \x1b[90mvps-1gb-ram (Debian 13 Trixie / Arch Hardened)             │\x1b[0m',
      '\x1b[90m└────────────────────────────────────────────────────────────┘\x1b[0m',
      'Escribe \x1b[1;33m"help"\x1b[0m para ver la lista de comandos disponibles.',
      'Escribe \x1b[1;33m"neofetch"\x1b[0m para ver las especificaciones del sistema.',
      '',
    ].join('\n');

    client.emit('terminal-output', {
      output: welcomeBanner,
      cwd: '~',
      prompt: 'jorge@vps-1gb-ram:~$ ',
      isBanner: true,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from terminal: ${client.id}`);
    this.clientStates.delete(client.id);
  }

  @SubscribeMessage('execute-command')
  handleCommand(
    @MessageBody() payload: { command: string; tabId?: string } | string,
    @ConnectedSocket() client: Socket,
  ) {
    const rawCommand =
      typeof payload === 'string' ? payload : payload?.command || '';
    const tabId = typeof payload === 'object' ? payload?.tabId : undefined;

    const state = this.clientStates.get(client.id) || { cwd: '~' };
    this.logger.log(
      `[${client.id}] Executing: "${rawCommand}" at [${state.cwd}]`,
    );

    const result = this.portfolioService.executeCommand(rawCommand, state.cwd);

    if (result.newCwd !== undefined) {
      state.cwd = result.newCwd;
      this.clientStates.set(client.id, state);
    }

    const responsePayload = {
      command: rawCommand,
      output: result.output,
      cwd: state.cwd,
      prompt: `jorge@vps-1gb-ram:${state.cwd}$ `,
      action: result.action,
      actionPayload: result.actionPayload,
      tabId,
    };

    // Emitir respuesta al cliente
    client.emit('terminal-output', responsePayload);

    // Si el cliente está transmitiendo una sesión compartida, emitir a los espectadores de la sala
    if (state.sharedSessionId) {
      this.server
        .to(`shared_${state.sharedSessionId}`)
        .emit('mirror-output', responsePayload);
    }
  }

  @SubscribeMessage('tab-complete')
  handleTabComplete(
    @MessageBody() payload: { input: string; cwd?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const state = this.clientStates.get(client.id);
    const cwd = payload?.cwd || state?.cwd || '~';
    const completions = this.portfolioService.getCompletions(
      payload?.input || '',
      cwd,
    );

    client.emit('tab-complete-result', {
      input: payload?.input,
      completions,
    });
  }

  @SubscribeMessage('pty-resize')
  handlePtyResize(
    @MessageBody() payload: { cols: number; rows: number },
    @ConnectedSocket() client: Socket,
  ) {
    const state = this.clientStates.get(client.id);
    if (state) {
      state.cols = payload.cols;
      state.rows = payload.rows;
      this.clientStates.set(client.id, state);
    }
  }

  @SubscribeMessage('create-shared-session')
  async handleCreateSharedSession(@ConnectedSocket() client: Socket) {
    const state = this.clientStates.get(client.id);
    const sessionId = Math.random().toString(36).substring(2, 10);

    if (state) {
      state.sharedSessionId = sessionId;
      this.clientStates.set(client.id, state);
    }

    await client.join(`shared_${sessionId}`);
    this.logger.log(
      `Created shared session: ${sessionId} for client ${client.id}`,
    );

    client.emit('shared-session-created', {
      sessionId,
      shareUrl: `?terminal_session=${sessionId}`,
    });
  }

  @SubscribeMessage('join-shared-session')
  async handleJoinSharedSession(
    @MessageBody() payload: { sessionId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const sessionId = payload?.sessionId;
    if (!sessionId) return;

    await client.join(`shared_${sessionId}`);
    this.logger.log(
      `Client ${client.id} joined shared session as viewer: ${sessionId}`,
    );

    client.emit('mirror-connected', {
      sessionId,
      message:
        '\x1b[1;36m[Modo Espejo]: Conectado a la sesión en vivo en modo solo lectura.\x1b[0m\n',
    });
  }
}
