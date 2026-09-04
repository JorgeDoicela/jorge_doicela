import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ContactMessageCreatedEvent } from '../events/contact-message-created.event';
import { SandboxWakeRequestedEvent } from '../events/sandbox-wake-requested.event';
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

  @OnEvent('sandbox.wake.requested', { async: true })
  async handleSandboxWakeRequested(
    event: SandboxWakeRequestedEvent,
  ): Promise<void> {
    this.logger.log(
      `Evento [sandbox.wake.requested] recibido para solicitante "${event.name || 'Anónimo'}".`,
    );

    await this.telegramService.sendWakeRequestNotification({
      name: event.name,
      contact: event.contact,
      note: event.note,
      clientIp: event.clientIp,
      createdAt: event.createdAt,
    });
  }
}
