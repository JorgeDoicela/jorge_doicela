import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutorial } from './entities/tutorial.entity';
import { TutorialStep } from './entities/tutorial-step.entity';
import { TutorialsController } from './controllers/tutorials.controller';
import { TutorialsService } from './services/tutorials.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutorial, TutorialStep], 'softwareConnection'),
  ],
  controllers: [TutorialsController],
  providers: [TutorialsService],
  exports: [TutorialsService],
})
export class TutorialsModule {}
