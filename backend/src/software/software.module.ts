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
import { InfrastructurePost } from './infrastructure/entities/infrastructure-post.entity';
import { GlossaryTerm } from './glossary/entities/glossary-term.entity';

// Submódulos Verticales Desacoplados
import { NewsModule } from './news/news.module';
import { BlogModule } from './blog/blog.module';
import { ForumModule } from './forum/forum.module';
import { AiModule } from './ai/ai.module';
import { CybersecurityModule } from './cybersecurity/cybersecurity.module';
import { TutorialsModule } from './tutorials/tutorials.module';
import { ProjectsModule } from './projects/projects.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { HubModule } from './hub/hub.module';
import { GlossaryModule } from './glossary/glossary.module';
import type Database from 'better-sqlite3';
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
      enableWAL: true,
      prepareDatabase: (db: Database.Database) => {
        db.pragma('foreign_keys = ON');
        db.pragma('synchronous = NORMAL');
        db.pragma('busy_timeout = 5000');
        db.pragma('cache_size = -20000'); // 20 MB de caché en RAM para alto rendimiento
        db.pragma('journal_size_limit = 67108864'); // 64 MB límite de WAL para proteger disco en 1 GB RAM
        db.pragma('temp_store = MEMORY'); // Tablas y ordenamientos temporales en RAM
      },
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
        InfrastructurePost,
        GlossaryTerm,
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
    InfrastructureModule,
    HubModule,
    GlossaryModule,
  ],
})
export class SoftwareModule {}
