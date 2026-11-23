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
import {
  PortfolioService,
  SupportedLocale,
} from '../services/portfolio.service';

interface ClientSessionState {
  cwd: string;
  lang: SupportedLocale;
  sharedSessionId?: string;
  cols?: number;
  rows?: number;
}

@WebSocketGateway({
  cors: {
    origin: [
      'https://portfolio.jorgedoicela.com',
      'https://jorgedoicela.com',
      // Permitir localhost y subdominios en desarrollo local
      ...(process.env.NODE_ENV !== 'production'
        ? [
            'http://localhost:3001',
            'http://portfolio.localhost:3001',
            'http://doiceladev.localhost:3001',
            'http://kartex.localhost:3001',
            'http://127.0.0.1:3001',
            'http://localhost:3000',
            'http://127.0.0.1:3000',
          ]
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
  private readonly commandRateLimits = new Map<string, number[]>();
  private readonly maxCommandsPerSecond = 15;
  private readonly maxCommandLength = 1024;

  @WebSocketServer()
  server: Server;

  constructor(private readonly portfolioService: PortfolioService) {}

  private extractLocale(raw?: unknown): SupportedLocale {
    return raw === 'en' ? 'en' : 'es';
  }

  async handleConnection(client: Socket) {
    const lang = this.extractLocale(client.handshake.query?.lang);
    this.logger.log(
      `Client connected to terminal: ${client.id} (lang: ${lang})`,
    );
    this.clientStates.set(client.id, {
      cwd: '~',
      lang,
      cols: 80,
      rows: 24,
    });

    const welcomeBanner = await this.portfolioService.getWelcomeBanner(lang);

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
    this.commandRateLimits.delete(client.id);
  }

  @SubscribeMessage('set-locale')
  handleSetLocale(
    @MessageBody() payload: { lang?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const state = this.clientStates.get(client.id);
    if (state) {
      state.lang = this.extractLocale(payload?.lang);
      this.clientStates.set(client.id, state);
    }
  }

  @SubscribeMessage('execute-command')
  async handleCommand(
    @MessageBody()
    payload:
      | { command: string; tabId?: string; paneId?: string; lang?: string }
      | string,
    @ConnectedSocket() client: Socket,
  ) {
    const state = this.clientStates.get(client.id) || {
      cwd: '~',
      lang: 'es' as SupportedLocale,
    };
    const effectiveLang =
      typeof payload === 'object' && payload?.lang
        ? this.extractLocale(payload.lang)
        : state.lang;
    state.lang = effectiveLang;

    const now = Date.now();
    let timestamps = this.commandRateLimits.get(client.id) || [];
    timestamps = timestamps.filter((t) => now - t < 1000);

    if (timestamps.length >= this.maxCommandsPerSecond) {
      this.logger.warn(
        `[${client.id}] Rate limit de comandos excedido (> ${this.maxCommandsPerSecond}/s)`,
      );
      const rateLimitMsg =
        await this.portfolioService.getRateLimitMessage(effectiveLang);
      client.emit('terminal-output', {
        command: '',
        output: rateLimitMsg,
        cwd: state.cwd,
        prompt: `jorge@debian:${state.cwd}$ `,
      });
      return;
    }

    timestamps.push(now);
    this.commandRateLimits.set(client.id, timestamps);

    let rawCommand =
      typeof payload === 'string' ? payload : payload?.command || '';

    if (rawCommand.length > this.maxCommandLength) {
      rawCommand = rawCommand.slice(0, this.maxCommandLength);
    }

    const tabId = typeof payload === 'object' ? payload?.tabId : undefined;
    const paneId = typeof payload === 'object' ? payload?.paneId : undefined;

    this.logger.debug(
      `[${client.id}] Executing command at [${state.cwd}] (${effectiveLang}) — ${rawCommand.length} chars`,
    );

    const result = await this.portfolioService.executeCommand(
      rawCommand,
      state.cwd,
      effectiveLang,
    );

    if (result.newCwd !== undefined) {
      state.cwd = result.newCwd;
      this.clientStates.set(client.id, state);
    }

    client.emit('terminal-output', {
      command: rawCommand,
      output: result.output,
      cwd: state.cwd,
      prompt: `jorge@debian:${state.cwd}$ `,
      action: result.action,
      actionPayload: result.actionPayload,
      tabId,
      paneId,
    });
  }

  @SubscribeMessage('tab-complete')
  async handleTabComplete(
    @MessageBody() payload: { input: string; cwd?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const state = this.clientStates.get(client.id);
    const cwd = payload?.cwd || state?.cwd || '~';
    const completions = await this.portfolioService.getCompletions(
      payload?.input || '',
      cwd,
      state?.lang,
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
    if (state && payload) {
      state.cols = Math.max(
        40,
        Math.min(300, Math.floor(Number(payload.cols) || 80)),
      );
      state.rows = Math.max(
        10,
        Math.min(100, Math.floor(Number(payload.rows) || 24)),
      );
      this.clientStates.set(client.id, state);
    }
  }
}
