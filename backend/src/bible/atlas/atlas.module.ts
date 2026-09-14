import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoricalPlaceEntity } from './entities/historical-place.entity';
import { AtlasService } from './services/atlas.service';
import { AtlasController } from './controllers/atlas.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoricalPlaceEntity], 'bibleConnection'),
  ],
  providers: [AtlasService],
  controllers: [AtlasController],
  exports: [AtlasService],
})
export class AtlasModule {}
