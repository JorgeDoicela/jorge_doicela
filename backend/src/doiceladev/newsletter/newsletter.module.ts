import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterSubscriber } from './entities/newsletter-subscriber.entity';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { NewsletterThrottleGuard } from './guards/newsletter-throttle.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([NewsletterSubscriber], 'doiceladevConnection'),
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService, NewsletterThrottleGuard],
  exports: [NewsletterService],
})
export class NewsletterModule {}
