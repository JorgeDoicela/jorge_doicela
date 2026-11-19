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

/**
 * Guard ligero en memoria para proteger interacciones del foro (respuestas y votos)
 * contra spam o abuso por IP en el VPS de 1 GB RAM.
 */
@Injectable()
export class ForumThrottleGuard implements CanActivate {
  private readonly logger = new Logger(ForumThrottleGuard.name);
  private readonly tracking = new Map<string, ThrottleRecord>();
  private readonly MAX_REQUESTS = 15;
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

    if (this.tracking.size > 300) {
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

    if (record.count >= this.MAX_REQUESTS) {
      this.logger.warn(`Rate limit alcanzado en foro para IP: ${clientIp}`);
      throw new HttpException(
        'Demasiadas interacciones en el foro. Espera un minuto antes de intentar nuevamente.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count += 1;
    return true;
  }
}
