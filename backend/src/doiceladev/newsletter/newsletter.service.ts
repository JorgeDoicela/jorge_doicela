import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { NewsletterSubscriptionResult } from './interfaces/newsletter.interface';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    @InjectRepository(NewsletterSubscriber, 'doiceladevConnection')
    private readonly subscriberRepository: Repository<NewsletterSubscriber>,
  ) {}

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
        this.logger.debug(`Suscriptor ya activo: ${normalizedEmail}`);
        return {
          success: true,
          message: 'Suscripción confirmada previamente.',
          isNew: false,
          status: 'already_active',
        };
      }

      // Si estaba dado de baja ('unsubscribed'), reactivar
      existing.status = 'active';
      existing.source = source;
      existing.language = language;
      await this.subscriberRepository.save(existing);

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
    const subscriber = this.subscriberRepository.create({
      email: normalizedEmail,
      status: 'active',
      source,
      language,
    });

    await this.subscriberRepository.save(subscriber);
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
