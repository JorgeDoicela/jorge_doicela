import { Injectable, Logger } from '@nestjs/common';

export interface ContactNotificationPayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
  phone?: string;
  serviceType?: string;
}

@Injectable()
export class TelegramNotificationService {
  private readonly logger = new Logger(TelegramNotificationService.name);

  async sendContactNotification(
    payload: ContactNotificationPayload,
  ): Promise<boolean> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      this.logger.debug(
        'TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID no configurados. Se omite notificación.',
      );
      return false;
    }

    const timestamp = new Intl.DateTimeFormat('es-EC', {
      timeZone: 'America/Guayaquil',
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date());

    const isAdLead = Boolean(payload.serviceType || payload.phone);
    const subjectText =
      payload.subject?.trim() ||
      (isAdLead ? 'Consulta de Proyecto / Anuncio' : 'Consulta General');

    const cleanPhone = payload.phone?.replace(/[^0-9]/g, '') || '';
    const phoneLine = payload.phone?.trim()
      ? `📱 *WhatsApp/Teléfono:* [${this.escapeMarkdown(payload.phone)}](https://wa.me/${cleanPhone})`
      : null;
    const serviceLine = payload.serviceType?.trim()
      ? `💼 *Servicio:* ${this.escapeMarkdown(payload.serviceType)}`
      : null;

    const lines = [
      isAdLead
        ? '🎯 *¡NUEVO CLIENTE / CONSULTA DE PROYECTO!*'
        : '📬 *NUEVO MENSAJE DE CONTACTO*',
      '────────────────────────────',
      `👤 *Cliente:* ${this.escapeMarkdown(payload.name)}`,
      `📧 *Email:* [${this.escapeMarkdown(payload.email)}](mailto:${payload.email})`,
      ...(phoneLine ? [phoneLine] : []),
      ...(serviceLine ? [serviceLine] : []),
      `📌 *Asunto:* ${this.escapeMarkdown(subjectText)}`,
      `⏰ *Fecha:* ${this.escapeMarkdown(timestamp)} (Quito UTC-5)`,
      '────────────────────────────',
      '💬 *Detalle del Proyecto / Mensaje:*',
      `${this.escapeMarkdown(payload.message)}`,
    ];

    const text = lines.join('\n');

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/sendMessage`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        this.logger.error(
          `Error al enviar notificación a Telegram (${response.status}): ${errorBody}`,
        );
        return false;
      }

      this.logger.log(
        `Notificación de contacto enviada a Telegram con éxito para "${payload.name}".`,
      );
      return true;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Excepción al comunicar con la API de Telegram: ${errorMessage}`,
      );
      return false;
    }
  }

  private escapeMarkdown(text: string): string {
    return text.replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&');
  }
}
