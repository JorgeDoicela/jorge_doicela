import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { SubscribeNewsletterDto } from './dto/subscribe-newsletter.dto';
import { NewsletterSubscriptionResult } from './interfaces/newsletter.interface';

@Controller('doiceladev/newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async subscribe(
    @Body() dto: SubscribeNewsletterDto,
  ): Promise<NewsletterSubscriptionResult> {
    return this.newsletterService.subscribe(dto);
  }
}
