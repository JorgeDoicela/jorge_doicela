import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';

export type SandboxRejectCode =
  | 'IP_BLOCKED'
  | 'COOLDOWN_ACTIVE'
  | 'ACTIVE_SESSION_EXISTS'
  | 'HOURLY_LIMIT_REACHED'
  | 'GLOBAL_CAPACITY_REACHED';

export interface AccessDecision {
  allowed: boolean;
  code?: SandboxRejectCode;
  message?: string;
  remainingSeconds?: number;
  existingSocketId?: string;
  isTransfer?: boolean;
}

interface HourlyUsage {
  count: number;
  resetAt: number;
}

interface JailRecord {
  blockedUntil: number;
  reason: string;
}

@Injectable()
export class SandboxSecurityService implements OnModuleDestroy {
  private readonly logger = new Logger(SandboxSecurityService.name);

  // 1 contenedor activo como máximo por IP
  private readonly sessionsByIp = new Map<string, string>(); // IP -> socketId

  // Cooldown mínimo de 6 segundos entre creaciones de contenedor por IP
  private readonly cooldownByIp = new Map<string, number>(); // IP -> timestamp de última creación
  private readonly cooldownMs = 6 * 1000;

  // Límite de 8 sesiones por hora por IP
  private readonly hourlyRateLimitByIp = new Map<string, HourlyUsage>();
  private readonly maxHourlySessions = 8;
  private readonly hourlyWindowMs = 60 * 60 * 1000;

  // Jail temporal de 15 minutos ante abusos repetidos
  private readonly jailByIp = new Map<string, JailRecord>();
  private readonly jailDurationMs = 15 * 60 * 1000;

  // Límite de tamaño en memoria para Maps para protección de RAM (< 1 MB en VPS de 1 GB)
  private readonly maxMapEntries = 1000;

  // Temporizador de auto-purga cada 10 minutos
  private readonly purgeInterval: NodeJS.Timeout;

  constructor() {
    this.purgeInterval = setInterval(
      () => {
        this.purgeExpiredRecords();
      },
      10 * 60 * 1000,
    );
  }

  onModuleDestroy() {
    clearInterval(this.purgeInterval);
  }

  /**
   * Evalúa si una IP cliente tiene autorización para instanciar o transferir un contenedor.
   * Si forceReplace es true y existe una sesión previa viva de esa misma IP,
   * se autoriza el Handover PTY en caliente sin penalizar cuota ni exigir cooldown de Docker.
   */
  evaluateAccess(
    clientIp: string,
    currentSocketId: string,
    forceReplace = false,
  ): AccessDecision {
    const now = Date.now();

    // 1. Verificar si la IP está en Jail
    const jail = this.jailByIp.get(clientIp);
    if (jail) {
      if (now < jail.blockedUntil) {
        const remainingSeconds = Math.ceil((jail.blockedUntil - now) / 1000);
        this.logger.warn(
          `[Seguridad Sandbox] Acceso denegado: IP ${clientIp} bloqueada temporalmente (${remainingSeconds}s restantes). Motivo: ${jail.reason}`,
        );
        return {
          allowed: false,
          code: 'IP_BLOCKED',
          message: `Acceso restringido temporalmente por actividad inusual. Reintenta en ${remainingSeconds} segundos.`,
          remainingSeconds,
        };
      }
      this.jailByIp.delete(clientIp);
    }

    // 2. Verificar concurrencia estricta 1:1 por IP
    const existingSocketId = this.sessionsByIp.get(clientIp);
    if (existingSocketId && existingSocketId !== currentSocketId) {
      if (!forceReplace) {
        this.logger.log(
          `[Seguridad Sandbox] IP ${clientIp} ya posee una sesión activa en socket ${existingSocketId}. Rechazando solicitud en ${currentSocketId}`,
        );
        return {
          allowed: false,
          code: 'ACTIVE_SESSION_EXISTS',
          message:
            'Ya tienes una sesión de terminal activa en otra ventana o pestaña.',
          existingSocketId,
        };
      }
      // Si forceReplace es true, se autoriza la transferencia en caliente (Handover PTY)
      this.logger.log(
        `[Seguridad Sandbox] IP ${clientIp} autorizada para transferencia en caliente (Handover PTY) desde ${existingSocketId} hacia ${currentSocketId}`,
      );
      return {
        allowed: true,
        existingSocketId,
        isTransfer: true,
      };
    }

    // 3. Verificar Cooldown de instanciación (25s) para mitigar estrés en Docker daemon
    // Solo aplica si NO es una transferencia forzada o si se está iniciando una nueva sesión muy rápido
    const lastCreationTime = this.cooldownByIp.get(clientIp);
    if (lastCreationTime) {
      const elapsed = now - lastCreationTime;
      if (elapsed < this.cooldownMs && !forceReplace) {
        const remainingSeconds = Math.ceil((this.cooldownMs - elapsed) / 1000);
        return {
          allowed: false,
          code: 'COOLDOWN_ACTIVE',
          message: `Sincronizando entorno seguro. Podrás reconectar en ${remainingSeconds} segundos.`,
          remainingSeconds,
        };
      }
    }

    // 4. Verificar Rate Limit Horario (Máximo 8 sesiones/hora)
    let usage = this.hourlyRateLimitByIp.get(clientIp);
    if (!usage || now > usage.resetAt) {
      usage = { count: 0, resetAt: now + this.hourlyWindowMs };
      this.hourlyRateLimitByIp.set(clientIp, usage);
    }

    if (usage.count >= this.maxHourlySessions) {
      const remainingSeconds = Math.ceil((usage.resetAt - now) / 1000);
      // Si sobrepasa el límite en más de 4 intentos extra, enviar a Jail de 15 min
      if (usage.count >= this.maxHourlySessions + 4) {
        this.jailByIp.set(clientIp, {
          blockedUntil: now + this.jailDurationMs,
          reason: 'Límite de solicitudes de terminal excedido reiteradamente',
        });
      } else {
        usage.count++;
      }

      this.logger.warn(
        `[Seguridad Sandbox] Límite horario alcanzado para IP ${clientIp} (${usage.count}/${this.maxHourlySessions})`,
      );
      return {
        allowed: false,
        code: 'HOURLY_LIMIT_REACHED',
        message: `Has alcanzado el límite de ${this.maxHourlySessions} sesiones por hora. Reintenta más tarde.`,
        remainingSeconds,
      };
    }

    return { allowed: true };
  }

  /**
   * Registra exitosamente una nueva sesión activa para una IP.
   */
  registerSession(clientIp: string, socketId: string): void {
    const now = Date.now();
    this.sessionsByIp.set(clientIp, socketId);
    this.cooldownByIp.set(clientIp, now);

    const usage = this.hourlyRateLimitByIp.get(clientIp);
    if (usage && now <= usage.resetAt) {
      usage.count++;
    } else {
      this.hourlyRateLimitByIp.set(clientIp, {
        count: 1,
        resetAt: now + this.hourlyWindowMs,
      });
    }

    this.logger.log(
      `[Seguridad Sandbox] Sesión registrada para IP ${clientIp} en socket ${socketId}. Total IPs activas: ${this.sessionsByIp.size}`,
    );
  }

  /**
   * Transfiere la sesión activa de una IP a un nuevo socket sin alterar la cuota horaria.
   */
  transferSession(clientIp: string, newSocketId: string): void {
    this.sessionsByIp.set(clientIp, newSocketId);
    this.logger.log(
      `[Seguridad Sandbox] Sesión transferida exitosamente para IP ${clientIp} hacia socket ${newSocketId} (Sin penalización de cuota horaria).`,
    );
  }

  /**
   * Libera la sesión de una IP cuando el socket se desconecta o la sesión se finaliza.
   */
  releaseSession(clientIp: string, socketId: string): void {
    const activeSocket = this.sessionsByIp.get(clientIp);
    if (activeSocket === socketId) {
      this.sessionsByIp.delete(clientIp);
      this.logger.log(
        `[Seguridad Sandbox] Sesión liberada para IP ${clientIp} (socket: ${socketId}).`,
      );
    }
  }

  /**
   * Obtiene el socketId de la sesión activa de una IP (si existe).
   */
  getActiveSocketByIp(clientIp: string): string | undefined {
    return this.sessionsByIp.get(clientIp);
  }

  /**
   * Limpieza periódica determinista de registros expirados para garantizar Zero-RAM leak.
   */
  private purgeExpiredRecords(): void {
    const now = Date.now();

    // 1. Limpiar Cooldowns expirados
    for (const [ip, timestamp] of this.cooldownByIp.entries()) {
      if (now - timestamp > this.cooldownMs) {
        this.cooldownByIp.delete(ip);
      }
    }

    // 2. Limpiar Rate limits horarios expirados
    for (const [ip, usage] of this.hourlyRateLimitByIp.entries()) {
      if (now > usage.resetAt) {
        this.hourlyRateLimitByIp.delete(ip);
      }
    }

    // 3. Limpiar Jails cumplidos
    for (const [ip, record] of this.jailByIp.entries()) {
      if (now >= record.blockedUntil) {
        this.jailByIp.delete(ip);
      }
    }

    // 4. Salvaguarda de tamaño máximo (LRU rudimentario en caso de inundación de IPs)
    if (this.cooldownByIp.size > this.maxMapEntries) {
      this.cooldownByIp.clear();
    }
    if (this.hourlyRateLimitByIp.size > this.maxMapEntries) {
      this.hourlyRateLimitByIp.clear();
    }
    if (this.jailByIp.size > this.maxMapEntries) {
      this.jailByIp.clear();
    }
  }
}
