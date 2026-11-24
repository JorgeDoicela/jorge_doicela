import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';

interface ThrottleRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class LabsThrottleGuard implements CanActivate {
  private readonly logger = new Logger(LabsThrottleGuard.name);
  private readonly tracking = new Map<string, ThrottleRecord>();
  private readonly MAX_ATTEMPTS = 15; // Máximo 15 intentos de flag por minuto
  private readonly WINDOW_MS = 60 * 1000;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientIp =
      (request.headers['cf-connecting-ip'] as string) ||
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const record = this.tracking.get(clientIp);

    if (this.tracking.size > 200) {
      for (const [ip, data] of this.tracking.entries()) {
        if (now > data.resetTime) {
          this.tracking.delete(ip);
        }
      }
    }

    if (!record || now > record.resetTime) {
      this.tracking.set(clientIp, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return true;
    }

    if (record.count >= this.MAX_ATTEMPTS) {
      const remainingSeconds = Math.ceil((record.resetTime - now) / 1000);
      this.logger.warn(
        `[LabsThrottle] Rate limit CTF excedido para IP [${clientIp}]. Bloqueado ${remainingSeconds}s.`,
      );
      throw new HttpException(
        `Demasiados intentos de validación. Espera ${remainingSeconds}s antes de volver a intentar.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count += 1;
    return true;
  }
}
