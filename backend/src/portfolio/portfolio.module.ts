import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { PortfolioProject } from './entities/portfolio-project.entity';
import { PortfolioService } from './services/portfolio.service';
import { ContactMessagesService } from './services/contact-messages.service';
import { PortfolioGateway } from './gateways/portfolio.gateway';
import { ContactController } from './controllers/contact.controller';
import { PortfolioProjectsController } from './controllers/portfolio-projects.controller';

import { PortfolioProjectsService } from './services/portfolio-projects.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'portfolioConnection',
      type: 'better-sqlite3',
      database: process.env.DATABASE_PORTFOLIO_PATH || 'portfolio.sqlite',
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
    PortfolioGateway,
    PortfolioProjectsService,
  ],
  exports: [PortfolioService, ContactMessagesService, PortfolioProjectsService],
})
export class PortfolioModule {}
