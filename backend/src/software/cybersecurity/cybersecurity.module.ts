import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityPost } from './entities/security-post.entity';
import { CybersecurityController } from './controllers/cybersecurity.controller';
import { CybersecurityService } from './services/cybersecurity.service';

@Module({
  imports: [TypeOrmModule.forFeature([SecurityPost], 'softwareConnection')],
  controllers: [CybersecurityController],
  providers: [CybersecurityService],
  exports: [CybersecurityService],
})
export class CybersecurityModule {}
