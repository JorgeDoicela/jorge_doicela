import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidades de los 7 dominios
import { NewsArticle } from './news/entities/news-article.entity';
import { BlogPost } from './blog/entities/blog-post.entity';
import { ForumTopic } from './forum/entities/forum-topic.entity';
import { ForumReply } from './forum/entities/forum-reply.entity';
import { AiResource } from './ai/entities/ai-resource.entity';
import { SecurityPost } from './cybersecurity/entities/security-post.entity';
import { Tutorial } from './tutorials/entities/tutorial.entity';
import { TutorialStep } from './tutorials/entities/tutorial-step.entity';
import { Project } from './projects/entities/project.entity';

// 7 Submódulos Verticales Desacoplados
import { NewsModule } from './news/news.module';
import { BlogModule } from './blog/blog.module';
import { ForumModule } from './forum/forum.module';
import { AiModule } from './ai/ai.module';
import { CybersecurityModule } from './cybersecurity/cybersecurity.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { ProjectsModule } from './projects/projects.module';
import { resolveDatabasePath } from '../common/database/database-path.util';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'softwareConnection',
      type: 'better-sqlite3',
      database: resolveDatabasePath(
        'DATABASE_SOFTWARE_PATH',
        'software.sqlite',
      ),
      entities: [
        NewsArticle,
        BlogPost,
        ForumTopic,
        ForumReply,
        AiResource,
        SecurityPost,
        Tutorial,
        TutorialStep,
        Project,
      ],
      synchronize: true,
    }),
    NewsModule,
    BlogModule,
    ForumModule,
    AiModule,
    CybersecurityModule,
    TutorialsModule,
    ProjectsModule,
  ],
})
export class SoftwareModule {}
