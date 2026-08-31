import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { PortfolioProject } from './entities/portfolio-project.entity';
import { PortfolioService } from './services/portfolio.service';
import { ContactMessagesService } from './services/contact-messages.service';
import { TelegramNotificationService } from './services/telegram-notification.service';
import { TelegramNotificationListener } from './listeners/telegram-notification.listener';
import { ContactThrottleGuard } from './guards/contact-throttle.guard';
import { PortfolioGateway } from './gateways/portfolio.gateway';
import { ContactController } from './controllers/contact.controller';
import { PortfolioProjectsController } from './controllers/portfolio-projects.controller';
import { PortfolioProjectsService } from './services/portfolio-projects.service';

import { resolveDatabasePath } from '../common/database/database-path.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'portfolioConnection',
      type: 'better-sqlite3',
      database: resolveDatabasePath(
        'DATABASE_PORTFOLIO_PATH',
        'portfolio.sqlite',
      ),
      entities: [ContactMessage, PortfolioProject],
      synchronize: true,
    }),
    TypeOrmModule.forFeature(
      [ContactMessage, PortfolioProject],
      'portfolioConnection',
    ),
  ],
  controllers: [ContactController, PortfolioProjectsController],
  providers: [
    PortfolioService,
    ContactMessagesService,
    TelegramNotificationService,
    TelegramNotificationListener,
    ContactThrottleGuard,
    PortfolioGateway,
    PortfolioProjectsService,
  ],
  exports: [
    PortfolioService,
    ContactMessagesService,
    TelegramNotificationService,
    PortfolioProjectsService,
  ],
})
export class PortfolioModule {}
