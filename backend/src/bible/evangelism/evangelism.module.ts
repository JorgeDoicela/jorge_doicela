import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EvangelismPathwayEntity } from './entities/evangelism-pathway.entity';
import { EvangelismObjectionEntity } from './entities/evangelism-objection.entity';
import { EvangelismTractEntity } from './entities/evangelism-tract.entity';
import { EvangelismService } from './services/evangelism.service';
import { EvangelismController } from './controllers/evangelism.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        EvangelismPathwayEntity,
        EvangelismObjectionEntity,
        EvangelismTractEntity,
      ],
      'bibleConnection',
    ),
  ],
  controllers: [EvangelismController],
  providers: [EvangelismService],
  exports: [EvangelismService],
})
export class EvangelismModule {}
