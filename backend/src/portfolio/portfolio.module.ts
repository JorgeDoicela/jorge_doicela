import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioGateway } from './portfolio.gateway';

@Module({
  providers: [PortfolioService, PortfolioGateway],
  exports: [PortfolioService],
})
export class PortfolioModule {}
