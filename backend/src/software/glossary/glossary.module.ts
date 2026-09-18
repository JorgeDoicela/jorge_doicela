import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlossaryTerm } from './entities/glossary-term.entity';
import { GlossaryController } from './controllers/glossary.controller';
import { GlossaryService } from './services/glossary.service';

@Module({
  imports: [TypeOrmModule.forFeature([GlossaryTerm], 'softwareConnection')],
  controllers: [GlossaryController],
  providers: [GlossaryService],
  exports: [GlossaryService],
})
export class GlossaryModule {}
