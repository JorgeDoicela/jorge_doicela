import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { SoftwareService } from './software.service';
import { SoftwareController } from './software.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'softwareConnection',
      type: 'better-sqlite3',
      database: 'software.sqlite',
      entities: [Project],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Project], 'softwareConnection'),
  ],
  controllers: [SoftwareController],
  providers: [SoftwareService],
  exports: [SoftwareService],
})
export class SoftwareModule {}
