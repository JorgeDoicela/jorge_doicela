import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LexiconEntry } from './entities/lexicon-entry.entity';
import { MorphologyToken } from './entities/morphology-token.entity';
import { MorphologyService } from './services/morphology.service';
import { MorphologyController } from './controllers/morphology.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [LexiconEntry, MorphologyToken],
      'bibleConnection',
    ),
  ],
  controllers: [MorphologyController],
  providers: [MorphologyService],
  exports: [MorphologyService],
})
export class MorphologyModule {}
