import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PortfolioModule } from './portfolio/portfolio.module';
import { BibleModule } from './bible/bible.module';
import { SoftwareModule } from './software/software.module';

@Module({
  imports: [PortfolioModule, BibleModule, SoftwareModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
