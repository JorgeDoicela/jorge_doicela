import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verse } from './entities/verse.entity';
import { BibleService } from './bible.service';
import { BibleController } from './bible.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'bibleConnection',
      type: 'better-sqlite3',
      database: 'bible.sqlite',
      entities: [Verse],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Verse], 'bibleConnection'),
  ],
  controllers: [BibleController],
  providers: [BibleService],
  exports: [BibleService],
})
export class BibleModule {}
