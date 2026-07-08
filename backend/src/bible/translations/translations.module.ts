import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Translation } from './entities/translation.entity';
import { TranslationsService } from './services/translations.service';
import { TranslationsController } from './controllers/translations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Translation], 'bibleConnection')],
  controllers: [TranslationsController],
  providers: [TranslationsService],
  exports: [TranslationsService],
})
export class TranslationsModule {}
