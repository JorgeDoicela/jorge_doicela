import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArchaeologyArticleEntity } from './entities/archaeology-article.entity';
import { ArchaeologyService } from './services/archaeology.service';
import { ArchaeologyController } from './controllers/archaeology.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArchaeologyArticleEntity], 'bibleConnection'),
  ],
  providers: [ArchaeologyService],
  controllers: [ArchaeologyController],
  exports: [ArchaeologyService],
})
export class ArchaeologyModule {}
