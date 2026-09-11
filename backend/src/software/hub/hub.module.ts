import { Module } from '@nestjs/common';
import { HubController } from './hub.controller';
import { HubService } from './hub.service';
import { NewsModule } from '../news/news.module';
import { BlogModule } from '../blog/blog.module';
import { CybersecurityModule } from '../cybersecurity/cybersecurity.module';
import { TutorialsModule } from '../tutorials/tutorials.module';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AiModule } from '../ai/ai.module';
import { ProjectsModule } from '../projects/projects.module';
import { ForumModule } from '../forum/forum.module';

@Module({
  imports: [
    NewsModule,
    BlogModule,
    CybersecurityModule,
    TutorialsModule,
    InfrastructureModule,
    AiModule,
    ProjectsModule,
    ForumModule,
  ],
  controllers: [HubController],
  providers: [HubService],
  exports: [HubService],
})
export class HubModule {}
