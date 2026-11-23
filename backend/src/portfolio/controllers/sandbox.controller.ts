import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateWakeRequestDto } from '../dto/create-wake-request.dto';
import { ContactThrottleGuard } from '../guards/contact-throttle.guard';
import { SandboxService } from '../services/sandbox.service';

@Controller('portfolio/sandbox')
export class SandboxController {
  constructor(private readonly sandboxService: SandboxService) {}

  @Get('health')
  @HttpCode(HttpStatus.OK)
  health(): { status: string; mode: string; activeSessions: number } {
    return {
      status: 'ready',
      mode: this.sandboxService.getMode(),
      activeSessions: this.sandboxService.getActiveSessionsCount(),
    };
  }

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

    return this.sandboxService.requestWake(dto, clientIp);
  }
}
