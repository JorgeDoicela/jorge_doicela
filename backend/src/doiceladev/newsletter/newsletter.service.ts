import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'node:crypto';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { UnsubscribeNewsletterDto } from './dto/unsubscribe-newsletter.dto';
import {
  NewsletterSubscriptionResult,
  NewsletterUnsubscribeResult,
} from './interfaces/newsletter.interface';
import { NewsletterMailerService } from './newsletter-mailer.service';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectRepository(NewsletterSubscriber, 'doiceladevConnection')
    private readonly subscriberRepository: Repository<NewsletterSubscriber>,
    private readonly mailerService: NewsletterMailerService,
  ) {}

  private generateUnsubscribeToken(): string {
    return randomBytes(24).toString('hex');
  }

  /**
   * Registra o actualiza de forma idempotente una suscripción al newsletter técnico.
   */
  async subscribe(
    dto: SubscribeNewsletterDto,
  ): Promise<NewsletterSubscriptionResult> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const source = (dto.source || 'general').trim().slice(0, 64);
    const language = (dto.language || 'es').trim().toLowerCase().slice(0, 5);

    const existing = await this.subscriberRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (existing.status === 'active') {
        if (!existing.unsubscribeToken) {
          existing.unsubscribeToken = this.generateUnsubscribeToken();
          await this.subscriberRepository.save(existing);
        }
        this.logger.debug(`Suscriptor ya activo: ${normalizedEmail}`);
        return {
          success: true,
          message: 'Suscripción confirmada previamente.',
          isNew: false,
          status: 'already_active',
        };
      }

      // Si estaba dado de baja ('unsubscribed'), reactivar con token fresco
      existing.status = 'active';
      existing.source = source;
      existing.language = language;
      existing.unsubscribeToken =
        existing.unsubscribeToken || this.generateUnsubscribeToken();
      await this.subscriberRepository.save(existing);

      void this.mailerService.sendWelcomeEmail(
        normalizedEmail,
        language,
        existing.unsubscribeToken,
      );

      this.logger.log(
        `Suscripción reactivada: ${normalizedEmail} (origen: ${source})`,
      );
      return {
        success: true,
        message: 'Suscripción reactivada exitosamente.',
        isNew: false,
        status: 'reactivated',
      };
    }

    // Nueva suscripción
    const unsubscribeToken = this.generateUnsubscribeToken();
    const subscriber = this.subscriberRepository.create({
      email: normalizedEmail,
      status: 'active',
      source,
      language,
      unsubscribeToken,
    });

    await this.subscriberRepository.save(subscriber);
    void this.mailerService.sendWelcomeEmail(
      normalizedEmail,
      language,
      unsubscribeToken,
    );

    this.logger.log(
      `Nuevo suscriptor técnico registrado: ${normalizedEmail} (origen: ${source}, idioma: ${language})`,
    );

    return {
      success: true,
      message: 'Suscripción completada exitosamente.',
      isNew: true,
      status: 'active',
    };
  }

  /**
   * Procesa la baja de un suscriptor mediante token único (preferido) o correo.
   */
  async unsubscribe(
    dto: UnsubscribeNewsletterDto,
  ): Promise<NewsletterUnsubscribeResult> {
    if (!dto.token && !dto.email) {
      throw new BadRequestException(
        'Se requiere un token o una dirección de correo para procesar la baja.',
      );
    }

    const subscriber = dto.token
      ? await this.subscriberRepository.findOne({
          where: { unsubscribeToken: dto.token },
        })
      : await this.subscriberRepository.findOne({
          where: { email: dto.email },
        });

    if (!subscriber) {
      return {
        success: true,
        message: 'No se encontró una suscripción activa asociada.',
        status: 'not_found',
      };
    }

    if (subscriber.status === 'unsubscribed') {
      return {
        success: true,
        message: 'La suscripción ya se encontraba dada de baja.',
        status: 'already_unsubscribed',
      };
    }

    subscriber.status = 'unsubscribed';
    await this.subscriberRepository.save(subscriber);
    this.logger.log(`Suscriptor dado de baja: ${subscriber.email}`);

    return {
      success: true,
      message: 'Baja procesada exitosamente.',
      status: 'unsubscribed',
    };
  }

  /**
   * Devuelve métricas operativas de suscriptores para monitoreo interno.
   */
  async getMetrics(): Promise<{
    totalActive: number;
    totalUnsubscribed: number;
  }> {
    const [totalActive, totalUnsubscribed] = await Promise.all([
      this.subscriberRepository.count({ where: { status: 'active' } }),
      this.subscriberRepository.count({ where: { status: 'unsubscribed' } }),
    ]);

    return { totalActive, totalUnsubscribed };
  }
}
