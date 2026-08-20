import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Verse } from './entities/verse.entity';
import { Book } from '../books/entities/book.entity';
import { Translation } from '../translations/entities/translation.entity';
import { VersesService } from './services/verses.service';
import { ApiBibleService } from './services/api-bible.service';
import { VersesController } from './controllers/verses.controller';
import { BooksModule } from '../books/books.module';
import { TranslationsModule } from '../translations/translations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Verse, Book, Translation], 'bibleConnection'),
    BooksModule,
    TranslationsModule,
  ],
  controllers: [VersesController],
  providers: [VersesService, ApiBibleService],
  exports: [VersesService, ApiBibleService],
})
export class VersesModule {}
