import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactMessage } from './entities/contact-message.entity';
import { PortfolioService } from './services/portfolio.service';
import { ContactMessagesService } from './services/contact-messages.service';
import { PortfolioGateway } from './gateways/portfolio.gateway';
import { ContactController } from './controllers/contact.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'portfolioConnection',
      type: 'better-sqlite3',
      database: 'portfolio.sqlite',
      entities: [ContactMessage],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ContactMessage], 'portfolioConnection'),
  ],
  controllers: [ContactController],
  providers: [PortfolioService, ContactMessagesService, PortfolioGateway],
  exports: [PortfolioService, ContactMessagesService],
})
export class PortfolioModule {}
