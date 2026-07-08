import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Book], 'bibleConnection')],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
