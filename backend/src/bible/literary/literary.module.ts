import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChiasmStructureEntity } from './entities/chiasm-structure.entity';
import { PaulineDiscourseEntity } from './entities/pauline-discourse.entity';
import { LiteraryService } from './services/literary.service';
import { LiteraryController } from './controllers/literary.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [ChiasmStructureEntity, PaulineDiscourseEntity],
      'bibleConnection',
    ),
  ],
  controllers: [LiteraryController],
  providers: [LiteraryService],
  exports: [LiteraryService],
})
export class LiteraryModule {}
