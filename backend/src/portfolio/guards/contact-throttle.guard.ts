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
export class ContactThrottleGuard implements CanActivate {
  private readonly logger = new Logger(ContactThrottleGuard.name);
  private readonly tracking = new Map<string, ThrottleRecord>();
  private readonly MAX_REQUESTS = 4; // Máximo 4 envíos
  private readonly WINDOW_MS = 60 * 1000; // Por ventana de 60 segundos

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const clientIp =
      (request.headers['cf-connecting-ip'] as string) ||
      (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      request.socket?.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    const record = this.tracking.get(clientIp);

    // Limpieza periódica de registros viejos para cuidar RAM (1 GB VPS)
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

    if (record.count >= this.MAX_REQUESTS) {
      const remainingSeconds = Math.ceil((record.resetTime - now) / 1000);
      this.logger.warn(
        `Rate limit excedido para IP [${clientIp}]. Bloqueado por ${remainingSeconds}s.`,
      );
      throw new HttpException(
        `Has enviado varias solicitudes recientemente. Por favor espera ${remainingSeconds} segundos antes de enviar otro mensaje.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count += 1;
    return true;
  }
}
