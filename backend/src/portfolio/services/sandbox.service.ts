import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Docker from 'dockerode';
import * as stream from 'stream';

export interface SandboxSession {
  sessionId: string;
  socketId: string;
  container: Docker.Container;
  stream: stream.Duplex;
  createdAt: number;
  ttlTimer: NodeJS.Timeout;
  warningTimer: NodeJS.Timeout;
}

@Injectable()
export class SandboxService implements OnModuleDestroy {
  private readonly logger = new Logger(SandboxService.name);
  private readonly docker: Docker;
  private readonly sessions = new Map<string, SandboxSession>();

  private readonly maxSessions = parseInt(
    process.env.SANDBOX_MAX_SESSIONS || '3',
    10,
  );
  private readonly sessionTtlMs = 5 * 60 * 1000; // 5 minutos
  private readonly warningTtlMs = 4.5 * 60 * 1000; // 4 minutos 30 segundos
  private readonly imageName = 'portfolio-sandbox:latest';
  private readonly mode: 'vps' | 'tunnel' =
    (process.env.SANDBOX_MODE as 'vps' | 'tunnel') || 'vps';

  constructor() {
    const socketPath =
      process.env.DOCKER_SOCKET_PATH ||
      (process.platform === 'win32'
        ? '//./pipe/docker_engine'
        : '/var/run/docker.sock');

    this.docker = new Docker({ socketPath });
    this.logger.log(
      `Dockerode inicializado [Modo: ${this.mode.toUpperCase()}] conectado a: ${socketPath}`,
    );
  }

  getMode(): 'vps' | 'tunnel' {
    return this.mode;
  }

  async onModuleDestroy() {
    this.logger.log(
      'Cerrando SandboxService: Destruyendo todas las sesiones activas...',
    );
    for (const [socketId] of this.sessions) {
      await this.destroySession(socketId);
    }
  }

  getActiveSessionsCount(): number {
    return this.sessions.size;
  }

  async createSession(
    socketId: string,
    cols = 80,
    rows = 24,
    targetMode: 'vps' | 'tunnel' = 'vps',
    onWarning?: () => void,
    onExpire?: () => void,
  ): Promise<{
    stream: stream.Duplex;
    sessionId: string;
    mode: 'vps' | 'tunnel';
  }> {
    if (this.sessions.has(socketId)) {
      await this.destroySession(socketId);
    }

    if (this.sessions.size >= this.maxSessions) {
      throw new Error(
        `Capacidad máxima alcanzada (${this.maxSessions} sesiones activas). Intenta nuevamente en unos minutos.`,
      );
    }

    // Validación estricta de targetMode: solo valores conocidos y explícitos del enum
    const effectiveMode: 'vps' | 'tunnel' =
      targetMode === 'tunnel' ? 'tunnel' : 'vps';
    const isTunnel = effectiveMode === 'tunnel';

    // Sanitización de dimensiones del terminal: rangos seguros para evitar inyección en variables de entorno
    const safeCols = Math.max(
      40,
      Math.min(300, Math.floor(Number(cols) || 80)),
    );
    const safeRows = Math.max(
      10,
      Math.min(100, Math.floor(Number(rows) || 24)),
    );

    const sessionId = `sandbox_${isTunnel ? 'tunnel_' : 'vps_'}${socketId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20)}_${Date.now()}`;
    this.logger.log(
      `[1/4] Creando contenedor Docker [Modo: ${effectiveMode.toUpperCase()}] para sesión ${sessionId} con imagen ${this.imageName}...`,
    );

    // Hardening dinámico: Cuota de hardware diferenciada según si corre en VPS (64MB) o Túnel Casero (256MB)
    const memoryLimit = isTunnel ? 256 * 1024 * 1024 : 64 * 1024 * 1024;
    const cpuLimit = isTunnel ? 1000000000 : 250000000; // 1.0 CPU en casa vs 0.25 en VPS
    const pidsLimit = isTunnel ? 100 : 50;

    const container = await this.docker.createContainer({
      Image: this.imageName,
      name: sessionId,
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Env: [
        `COLUMNS=${safeCols}`,
        `LINES=${safeRows}`,
        'TERM=xterm-256color',
        `SANDBOX_MODE=${effectiveMode}`,
      ],
      HostConfig: {
        Memory: memoryLimit,
        MemorySwap: memoryLimit,
        NanoCpus: cpuLimit,
        PidsLimit: pidsLimit,
        ReadonlyRootfs: true,
        Tmpfs: {
          '/home/guest': 'size=15M,uid=1000,gid=1000,mode=700,noexec,nosuid',
          '/tmp': 'size=10M,mode=1777,noexec,nosuid',
        },
        CapDrop: ['ALL'],
        SecurityOpt: ['no-new-privileges:true'],
        NetworkMode: 'none',
        AutoRemove: true,
      },
    });

    this.logger.log(
      `[2/4] Conectando stream interactivo TTY al contenedor ${sessionId}...`,
    );
    const streamObj = (await container.attach({
      stream: true,
      stdin: true,
      stdout: true,
      stderr: true,
      hijack: true,
    })) as stream.Duplex;

    this.logger.log(`[3/4] Arrancando contenedor ${sessionId}...`);
    await container.start();
    this.logger.log(`[4/4] Contenedor ${sessionId} iniciado exitosamente.`);

    // Redimensionar al tamaño inicial reportado por el cliente
    try {
      await container.resize({ w: safeCols, h: safeRows });
    } catch {
      // Ignorar si el contenedor recién iniciado tarda unos ms en ajustar el tty
    }

    // Programar advertencia visual a los 4:30 minutos
    const warningTimer = setTimeout(() => {
      this.logger.warn(`Sesión ${sessionId} próxima a expirar (4m 30s).`);
      if (onWarning) onWarning();
    }, this.warningTtlMs);

    // Programar expiración obligatoria a los 5 minutos
    const ttlTimer = setTimeout(() => {
      void (async () => {
        this.logger.log(`Sesión ${sessionId} expirada por TTL (5m).`);
        if (onExpire) onExpire();
        await this.destroySession(socketId);
      })();
    }, this.sessionTtlMs);

    const session: SandboxSession = {
      sessionId,
      socketId,
      container,
      stream: streamObj,
      createdAt: Date.now(),
      ttlTimer,
      warningTimer,
    };

    this.sessions.set(socketId, session);

    return { stream: streamObj, sessionId, mode: effectiveMode };
  }

  writeInput(socketId: string, data: string): void {
    const session = this.sessions.get(socketId);
    if (session && session.stream) {
      this.logger.log(
        `Escribiendo en Docker (${session.sessionId}): ${JSON.stringify(data)} (writable: ${session.stream.writable})`,
      );
      if (session.stream.writable) {
        session.stream.write(Buffer.from(data, 'utf-8'));
      }
    } else {
      this.logger.warn(
        `writeInput: No existe sesión activa en memoria para el socket ${socketId}`,
      );
    }
  }

  async resizeTerminal(
    socketId: string,
    cols: number,
    rows: number,
  ): Promise<void> {
    const session = this.sessions.get(socketId);
    if (session && session.container) {
      try {
        await session.container.resize({ w: cols, h: rows });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.debug(
          `Error al redimensionar sandbox ${session.sessionId}: ${message}`,
        );
      }
    }
  }

  async destroySession(socketId: string): Promise<void> {
    const session = this.sessions.get(socketId);
    if (!session) return;

    this.sessions.delete(socketId);
    clearTimeout(session.ttlTimer);
    clearTimeout(session.warningTimer);

    try {
      if (session.stream) {
        session.stream.end();
      }
      await session.container.kill();
    } catch (err: unknown) {
      // El contenedor puede haber finalizado si el usuario ejecutó 'exit'
      const message = err instanceof Error ? err.message : String(err);
      this.logger.debug(
        `Contenedor ${session.sessionId} ya finalizado o detenido: ${message}`,
      );
    }

    try {
      await session.container.remove({ force: true });
    } catch {
      // Ignorar si AutoRemove ya eliminó el contenedor
    }

    this.logger.log(`Sesión Sandbox destruida: ${session.sessionId}`);
  }
}
