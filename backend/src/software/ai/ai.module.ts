import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiResource } from './entities/ai-resource.entity';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';

@Module({
  imports: [TypeOrmModule.forFeature([AiResource], 'softwareConnection')],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
