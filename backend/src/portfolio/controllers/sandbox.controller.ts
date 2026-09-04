import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request } from 'express';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateWakeRequestDto } from '../dto/create-wake-request.dto';
import { SandboxWakeRequestedEvent } from '../events/sandbox-wake-requested.event';
import { ContactThrottleGuard } from '../guards/contact-throttle.guard';

@Controller('portfolio/sandbox')
export class SandboxController {
  private readonly logger = new Logger(SandboxController.name);

  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('wake-request')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ContactThrottleGuard)
  requestWake(
    @Body() dto: CreateWakeRequestDto,
    @Req() req: Request,
  ): { success: boolean; message: string } {
    const clientIp =
      (req.headers['cf-connecting-ip'] as string) ||
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket?.remoteAddress ||
      'unknown-ip';

    this.logger.log(
      `Solicitud de encendido de servidor privado recibida desde IP: ${clientIp} (${dto.name || 'Anónimo'}).`,
    );

    this.eventEmitter.emit(
      'sandbox.wake.requested',
      new SandboxWakeRequestedEvent(
        dto.name,
        dto.contact,
        dto.note,
        clientIp,
        new Date(),
      ),
    );

    return {
      success: true,
      message: 'Solicitud de encendido registrada y notificada con éxito.',
    };
  }
}
