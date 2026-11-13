import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

export interface BroadcastEmailPayload {
  to: string;
  subject: string;
  html: string;
  text: string;
  unsubscribeToken?: string | null;
}

/**
 * Servicio de envío de correo para DoicelaDev vía Amazon SES SMTP.
 * Diseñado con huella mínima en memoria (VPS 1 GB RAM) y degradación segura
 * cuando las credenciales SMTP aún no están configuradas en el entorno.
 */
@Injectable()
export class NewsletterMailerService {
  private readonly logger = new Logger(NewsletterMailerService.name);
  private transporter: Transporter | null = null;
  private readonly fromEmail: string;
  private readonly publicUrl: string;
  private readonly smtpConfigured: boolean;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    const host =
      this.configService.get<string>('SES_SMTP_HOST') ||
      `email-smtp.${region}.amazonaws.com`;
    const port = Number(this.configService.get<string>('SES_SMTP_PORT') || 587);
    const user = this.configService.get<string>('SES_SMTP_USER')?.trim() || '';
    const pass = this.configService.get<string>('SES_SMTP_PASS')?.trim() || '';

    this.fromEmail =
      this.configService.get<string>('AWS_SES_FROM_EMAIL')?.trim() ||
      'newsletter@doiceladev.jorgedoicela.com';
    this.publicUrl = (
      this.configService.get<string>('DOICELADEV_PUBLIC_URL') ||
      'https://doiceladev.jorgedoicela.com'
    ).replace(/\/$/, '');

    this.smtpConfigured = Boolean(host && user && pass);

    if (this.smtpConfigured) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        pool: false,
      });
      this.logger.log(`Amazon SES SMTP inicializado (${host}:${port})`);
    } else {
      this.logger.warn(
        'SES_SMTP_USER/SES_SMTP_PASS no configurados; envío de correos en modo pasivo.',
      );
    }
  }

  isConfigured(): boolean {
    return this.smtpConfigured && this.transporter !== null;
  }

  buildUnsubscribeUrl(email: string, unsubscribeToken?: string | null): string {
    if (unsubscribeToken) {
      return `${this.publicUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
    }
    return `${this.publicUrl}/unsubscribe?email=${encodeURIComponent(email)}`;
  }

  async sendWelcomeEmail(
    email: string,
    language: string,
    unsubscribeToken?: string | null,
  ): Promise<void> {
    if (!this.transporter) return;

    const isEn = language.toLowerCase().startsWith('en');
    const unsubscribeUrl = this.buildUnsubscribeUrl(email, unsubscribeToken);

    const subject = isEn
      ? '[DoicelaDev] Subscription confirmed to technical updates'
      : '[DoicelaDev] Suscripción confirmada al boletín técnico';

    const text = isEn
      ? [
          'Hello,',
          '',
          'Your subscription to DoicelaDev technical updates is now active.',
          'You will receive notifications when new deep-dive articles on software architecture, Linux infrastructure, and cybersecurity are published.',
          '',
          `Portal: ${this.publicUrl}`,
          `Unsubscribe at any time: ${unsubscribeUrl}`,
        ].join('\n')
      : [
          'Hola,',
          '',
          'Tu suscripción al boletín técnico de DoicelaDev ha quedado confirmada.',
          'Recibirás notificaciones cuando se publiquen nuevos artículos sobre arquitectura de software, infraestructura Linux y ciberseguridad.',
          '',
          `Portal: ${this.publicUrl}`,
          `Darse de baja en cualquier momento: ${unsubscribeUrl}`,
        ].join('\n');

    const html = isEn
      ? `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #0f172a; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; font-size: 20px; color: #090e17;">DoicelaDev</h2>
          <p style="margin: 0 0 12px;">Your subscription to DoicelaDev technical updates is now active.</p>
          <p style="margin: 0 0 20px; color: #475569;">You will receive notifications when new engineering essays, security advisories, and infrastructure guides are published.</p>
          <p style="margin: 0 0 24px;">
            <a href="${this.publicUrl}" style="display: inline-block; padding: 10px 18px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Visit DoicelaDev</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            You received this email because you subscribed at DoicelaDev.
            <a href="${unsubscribeUrl}" style="color: #2563eb;">Unsubscribe</a>.
          </p>
        </div>
      `
      : `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; color: #0f172a; line-height: 1.6;">
          <h2 style="margin: 0 0 12px; font-size: 20px; color: #090e17;">DoicelaDev</h2>
          <p style="margin: 0 0 12px;">Tu suscripción al boletín técnico de DoicelaDev ha quedado confirmada.</p>
          <p style="margin: 0 0 20px; color: #475569;">Recibirás notificaciones cuando se publiquen nuevos ensayos de arquitectura, avisos de seguridad y guías de infraestructura.</p>
          <p style="margin: 0 0 24px;">
            <a href="${this.publicUrl}" style="display: inline-block; padding: 10px 18px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Ir a DoicelaDev</a>
          </p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="margin: 0; font-size: 12px; color: #64748b;">
            Recibiste este correo porque te suscribiste en DoicelaDev.
            <a href="${unsubscribeUrl}" style="color: #2563eb;">Darse de baja</a>.
          </p>
        </div>
      `;

    await this.sendBroadcastEmail({
      to: email,
      subject,
      html,
      text,
      unsubscribeToken,
    });
  }

  async sendBroadcastEmail(payload: BroadcastEmailPayload): Promise<void> {
    if (!this.transporter) return;

    const unsubscribeUrl = this.buildUnsubscribeUrl(
      payload.to,
      payload.unsubscribeToken,
    );

    try {
      await this.transporter.sendMail({
        from: `DoicelaDev <${this.fromEmail}>`,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.warn(`No se pudo enviar correo a ${payload.to}: ${msg}`);
    }
  }
}
