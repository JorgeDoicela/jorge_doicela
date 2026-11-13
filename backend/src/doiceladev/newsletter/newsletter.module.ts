import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { NewsletterThrottleGuard } from './guards/newsletter-throttle.guard';
import { NewsletterMailerService } from './newsletter-mailer.service';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([NewsletterSubscriber], 'doiceladevConnection'),
  ],
  controllers: [NewsletterController],
  providers: [
    NewsletterService,
    NewsletterMailerService,
    NewsletterThrottleGuard,
  ],
  exports: [NewsletterService, NewsletterMailerService],
})
export class NewsletterModule {}
