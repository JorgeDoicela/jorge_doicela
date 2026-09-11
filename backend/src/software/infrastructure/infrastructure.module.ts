import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfrastructurePost } from './entities/infrastructure-post.entity';
import { InfrastructureController } from './controllers/infrastructure.controller';
import { InfrastructureService } from './services/infrastructure.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfrastructurePost], 'softwareConnection'),
  ],
  controllers: [InfrastructureController],
  providers: [InfrastructureService],
  exports: [InfrastructureService],
})
export class InfrastructureModule {}
