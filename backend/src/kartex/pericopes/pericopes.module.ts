import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pericope } from './entities/pericope.entity';
import { PericopesService } from './services/pericopes.service';
import { PericopesController } from './controllers/pericopes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Pericope], 'kartexConnection')],
  controllers: [PericopesController],
  providers: [PericopesService],
  exports: [PericopesService],
})
export class PericopesModule {}
