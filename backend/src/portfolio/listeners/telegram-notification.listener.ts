import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContactMessageCreatedEvent } from '../events/contact-message-created.event';
import { TelegramNotificationService } from '../services/telegram-notification.service';

@Injectable()
export class TelegramNotificationListener {
  private readonly logger = new Logger(TelegramNotificationListener.name);

  constructor(private readonly telegramService: TelegramNotificationService) {}

  @OnEvent('contact.message.created', { async: true })
  async handleContactMessageCreated(
    event: ContactMessageCreatedEvent,
  ): Promise<void> {
    this.logger.log(
      `Evento [contact.message.created] recibido para mensaje ID #${event.id} (${event.name}).`,
    );

    await this.telegramService.sendContactNotification({
      name: event.name,
      email: event.email,
      subject: event.subject,
      message: event.message,
      phone: event.phone,
      serviceType: event.serviceType,
    });
  }
}
