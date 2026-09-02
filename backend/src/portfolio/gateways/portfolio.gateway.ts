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
    origin: [
      'https://portfolio.jorgedoicela.com',
      'https://jorgedoicela.com',
      // Permitir localhost solo en entornos de desarrollo local
      ...(process.env.NODE_ENV !== 'production'
        ? ['http://localhost:3001', 'http://localhost:3000']
        : []),
    ],
    credentials: true,
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

    // Enviar banner inicial de bienvenida profesional con formato ANSI
    const welcomeBanner = [
      '\x1b[90m┌────────────────────────────────────────────────────────────┐\x1b[0m',
      '\x1b[90m│\x1b[0m  \x1b[1;33mJorge Ismael Doicela Molina • Portfolio Shell\x1b[0m             \x1b[90m│\x1b[0m',
      '\x1b[90m│\x1b[0m  \x1b[36mFull-Stack & DevSecOps Engineer • Debian GNU/Linux 13\x1b[0m     \x1b[90m│\x1b[0m',
      '\x1b[90m└────────────────────────────────────────────────────────────┘\x1b[0m',
      '',
      '¡Bienvenido/a! Esta consola interactiva te permite explorar mi',
      'perfil profesional, proyectos destacados y habilidades técnicas.',
      '',
      '\x1b[1;33mComandos recomendados para comenzar:\x1b[0m',
      '  • \x1b[1;33mabout\x1b[0m     \x1b[90m→\x1b[0m Perfil profesional, formación y valores',
      '  • \x1b[1;33mprojects\x1b[0m  \x1b[90m→\x1b[0m Proyectos de ingeniería destacados',
      '  • \x1b[1;33mskills\x1b[0m    \x1b[90m→\x1b[0m Stack tecnológico y especialidades',
      '  • \x1b[1;33mcontact\x1b[0m   \x1b[90m→\x1b[0m Canales oficiales (LinkedIn, GitHub, Email)',
      '  • \x1b[1;33mneofetch\x1b[0m  \x1b[90m→\x1b[0m Especificaciones del sistema y servidor',
      '  • \x1b[1;33mhelp\x1b[0m      \x1b[90m→\x1b[0m Lista completa de comandos Unix disponibles',
      '',
    ].join('\n');

    client.emit('terminal-output', {
      output: welcomeBanner,
      cwd: '~',
      prompt: 'jorge@debian:~$ ',
      isBanner: true,
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from terminal: ${client.id}`);
    this.clientStates.delete(client.id);
  }

  @SubscribeMessage('execute-command')
  handleCommand(
    @MessageBody()
    payload: { command: string; tabId?: string; paneId?: string } | string,
    @ConnectedSocket() client: Socket,
  ) {
    const rawCommand =
      typeof payload === 'string' ? payload : payload?.command || '';
    const tabId = typeof payload === 'object' ? payload?.tabId : undefined;
    const paneId = typeof payload === 'object' ? payload?.paneId : undefined;

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
      prompt: `jorge@debian:${state.cwd}$ `,
      action: result.action,
      actionPayload: result.actionPayload,
      tabId,
      paneId,
    };

    // Emitir respuesta al cliente
    client.emit('terminal-output', responsePayload);
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
}
