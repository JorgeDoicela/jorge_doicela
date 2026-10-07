import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BibleDictionaryEntity } from './entities/bible-dictionary.entity';
import { BibleDictionaryEntryEntity } from './entities/bible-dictionary-entry.entity';
import { DictionariesService } from './services/dictionaries.service';
import { DictionariesController } from './controllers/dictionaries.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [BibleDictionaryEntity, BibleDictionaryEntryEntity],
      'kartexConnection',
    ),
  ],
  controllers: [DictionariesController],
  providers: [DictionariesService],
  exports: [DictionariesService],
})
export class DictionariesModule {}
