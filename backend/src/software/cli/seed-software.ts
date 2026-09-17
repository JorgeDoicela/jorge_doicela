import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { resolveDatabasePath } from '../../common/database/database-path.util';

interface NewsSeedItem {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  sourceUrl?: string;
  isBreaking: boolean;
  author: string;
  category?: string;
  tags: string;
  language?: string;
  coverImage?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
}

interface BlogSeedItem {
  slug: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  language?: string;
  series?: string;
  tableOfContents?: string;
  coverImage?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
}

interface ForumSeedData {
  topics: {
    id: number;
    slug: string;
    title: string;
    content: string;
    author: string;
    category: string;
    language?: string;
    coverImage?: string;
    isSolved: boolean;
    isPinned: boolean;
    orderPriority?: number;
    repliesCount: number;
    views: number;
  }[];
  replies: {
    id: number;
    topicId: number;
    parentId: number | null;
    author: string;
    content: string;
    isAcceptedAnswer: boolean;
    likes: number;
  }[];
}

interface AiSeedItem {
  slug: string;
  name: string;
  type: string;
  provider: string;
  description: string;
  contentMarkdown: string;
  license: string;
  documentationUrl?: string;
  paperUrl?: string;
  githubUrl?: string;
  tags: string;
  language?: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
}

interface SecuritySeedItem {
  slug: string;
  title: string;
  severity: string;
  postType: string;
  cveId?: string;
  affectedSystems?: string;
  remediation?: string;
  excerpt: string;
  contentMarkdown: string;
  author: string;
  tags: string;
  language?: string;
  coverImage?: string;
  views: number;
  likes: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
}

interface TutorialsSeedData {
  tutorials: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    description: string;
    difficulty: string;
    estimatedMinutes: number;
    prerequisites?: string;
    techStack: string;
    author: string;
    tags: string;
    language?: string;
    coverImage?: string;
    views: number;
    likes: number;
    featured?: boolean;
    orderPriority?: number;
    publishedAt?: string;
  }[];
  steps: {
    id: number;
    tutorialId: number;
    stepOrder: number;
    title: string;
    contentMarkdown: string;
    codeSnippet?: string;
    codeLanguage: string;
  }[];
}

interface ProjectSeedItem {
  slug: string;
  name: string;
  description: string;
  techStack: string;
  language?: string;
  coverImage?: string;
  repoUrl?: string;
  liveUrl?: string;
  status: string;
  featured: boolean;
  orderPriority?: number;
  stars: number;
  views: number;
  architectureDiagramUrl?: string;
}

interface InfrastructureSeedItem {
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  environment: string;
  difficulty: string;
  techStack: string;
  architectureOverview?: string;
  specs?: string;
  contentMarkdown: string;
  author?: string;
  tags?: string;
  language?: string;
  coverImage?: string;
  views?: number;
  likes?: number;
  featured?: boolean;
  orderPriority?: number;
  publishedAt?: string;
}

export function seedSoftware(
  dbPath: string = resolveDatabasePath(
    'DATABASE_SOFTWARE_PATH',
    'software.sqlite',
  ),
) {
  const startTime = Date.now();
  console.log(
    `[SoftwareSeeder] 🚀 Recreando base de datos limpia desde cero: ${dbPath}...`,
  );

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  db.pragma('synchronous = NORMAL');
  db.pragma('busy_timeout = 5000');
  db.pragma('cache_size = -20000');
  db.pragma('journal_size_limit = 67108864');
  db.pragma('temp_store = MEMORY');

  // Purga limpia de tablas anteriores para reinicio total instantáneo
  db.exec(`
    DROP TABLE IF EXISTS infrastructure_posts;
    DROP TABLE IF EXISTS tutorial_steps;
    DROP TABLE IF EXISTS tutorials;
    DROP TABLE IF EXISTS security_posts;
    DROP TABLE IF EXISTS ai_resources;
    DROP TABLE IF EXISTS forum_replies;
    DROP TABLE IF EXISTS forum_topics;
    DROP TABLE IF EXISTS blog_posts;
    DROP TABLE IF EXISTS news_articles;
    DROP TABLE IF EXISTS projects;
    DROP TABLE IF EXISTS articles;
  `);

  // Estructura relacional blindada con CHECK constraints, claves foráneas e índices compuestos
  db.exec(`
    CREATE TABLE IF NOT EXISTS news_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      sourceUrl TEXT,
      isBreaking INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      category TEXT NOT NULL DEFAULT 'frameworks',
      tags TEXT NOT NULL DEFAULT 'news,tech',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      readTimeMinutes INTEGER NOT NULL DEFAULT 4,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_news_articles_slug_lang ON news_articles (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_news_articles_feed ON news_articles (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_news_articles_cat_feed ON news_articles (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_news_articles_feat_feed ON news_articles (language, featured, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_news_articles_break_feed ON news_articles (language, isBreaking, orderPriority DESC, publishedAt DESC);

    CREATE TABLE IF NOT EXISTS blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      excerpt TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      tags TEXT NOT NULL DEFAULT 'architecture,clean-code',
      language TEXT NOT NULL DEFAULT 'es',
      series TEXT,
      tableOfContents TEXT,
      coverImage TEXT,
      readTimeMinutes INTEGER NOT NULL DEFAULT 8,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_blog_posts_slug_lang ON blog_posts (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_blog_posts_feed ON blog_posts (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_blog_posts_series_feed ON blog_posts (language, series, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_blog_posts_feat_feed ON blog_posts (language, featured, orderPriority DESC, publishedAt DESC);

    CREATE TABLE IF NOT EXISTS forum_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Comunidad Tech',
      category TEXT NOT NULL DEFAULT 'general',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      isSolved INTEGER NOT NULL DEFAULT 0,
      isPinned INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      repliesCount INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_forum_topics_slug_lang ON forum_topics (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_forum_topics_feed ON forum_topics (language, isPinned DESC, orderPriority DESC, createdAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_forum_topics_cat_feed ON forum_topics (language, category, isPinned DESC, orderPriority DESC, createdAt DESC);

    CREATE TABLE IF NOT EXISTS forum_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      topicId INTEGER NOT NULL,
      parentId INTEGER,
      author TEXT NOT NULL,
      content TEXT NOT NULL,
      isAcceptedAnswer INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topicId) REFERENCES forum_topics(id) ON DELETE CASCADE,
      FOREIGN KEY (parentId) REFERENCES forum_replies(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS IDX_forum_replies_topic ON forum_replies (topicId);
    CREATE INDEX IF NOT EXISTS IDX_forum_replies_parent ON forum_replies (parentId);
    CREATE INDEX IF NOT EXISTS IDX_forum_replies_topic_created ON forum_replies (topicId, createdAt ASC);

    CREATE TABLE IF NOT EXISTS ai_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'tool' CHECK (type IN ('llm', 'agent', 'framework', 'mcp_server', 'tool')),
      provider TEXT NOT NULL DEFAULT 'Open Source',
      description TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      license TEXT NOT NULL DEFAULT 'MIT',
      documentationUrl TEXT,
      paperUrl TEXT,
      githubUrl TEXT,
      tags TEXT NOT NULL DEFAULT 'ai,llm',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_ai_resources_slug_lang ON ai_resources (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_ai_resources_feed ON ai_resources (language, orderPriority DESC, createdAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_ai_resources_type_feed ON ai_resources (language, type, orderPriority DESC, createdAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_ai_resources_feat_feed ON ai_resources (language, featured, orderPriority DESC, createdAt DESC);

    CREATE TABLE IF NOT EXISTS security_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'MEDIUM' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
      postType TEXT NOT NULL DEFAULT 'advisory' CHECK (postType IN ('advisory', 'hardening_guide', 'writeup')),
      cveId TEXT,
      affectedSystems TEXT,
      remediation TEXT,
      excerpt TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      tags TEXT NOT NULL DEFAULT 'cybersecurity,devsecops',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_security_posts_slug_lang ON security_posts (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_security_posts_feed ON security_posts (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_security_posts_sev_feed ON security_posts (language, severity, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_security_posts_type_feed ON security_posts (language, postType, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_security_posts_feat_feed ON security_posts (language, featured, orderPriority DESC, publishedAt DESC);

    CREATE TABLE IF NOT EXISTS tutorials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
      estimatedMinutes INTEGER NOT NULL DEFAULT 15,
      prerequisites TEXT,
      techStack TEXT NOT NULL DEFAULT 'TypeScript,Node.js',
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      tags TEXT NOT NULL DEFAULT 'tutorial,guide',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_tutorials_slug_lang ON tutorials (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_tutorials_feed ON tutorials (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_tutorials_diff_feed ON tutorials (language, difficulty, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_tutorials_feat_feed ON tutorials (language, featured, orderPriority DESC, publishedAt DESC);

    CREATE TABLE IF NOT EXISTS tutorial_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tutorialId INTEGER NOT NULL,
      stepOrder INTEGER NOT NULL DEFAULT 1,
      title TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      codeSnippet TEXT,
      codeLanguage TEXT NOT NULL DEFAULT 'typescript',
      imageUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutorialId) REFERENCES tutorials(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS IDX_tutorial_steps_tut ON tutorial_steps (tutorialId);
    CREATE INDEX IF NOT EXISTS IDX_tutorial_steps_tut_order ON tutorial_steps (tutorialId, stepOrder ASC);

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      techStack TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      repoUrl TEXT,
      liveUrl TEXT,
      status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'wip')),
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      stars INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      architectureDiagramUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_projects_slug_lang ON projects (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_projects_feed ON projects (language, orderPriority DESC, stars DESC);
    CREATE INDEX IF NOT EXISTS IDX_projects_status_feed ON projects (language, status, orderPriority DESC, stars DESC);
    CREATE INDEX IF NOT EXISTS IDX_projects_feat_feed ON projects (language, featured, orderPriority DESC, stars DESC);

    CREATE TABLE IF NOT EXISTS infrastructure_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      category TEXT NOT NULL DEFAULT 'servers' CHECK (category IN ('cloud', 'servers', 'containers', 'networking', 'ci_cd', 'hardening', 'zero_ram')),
      environment TEXT NOT NULL DEFAULT 'production' CHECK (environment IN ('production', 'edge', 'hybrid', 'vps', 'bare_metal')),
      difficulty TEXT NOT NULL DEFAULT 'intermediate' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced', 'expert')),
      techStack TEXT NOT NULL DEFAULT 'Debian, Linux, Nginx',
      architectureOverview TEXT,
      specs TEXT,
      contentMarkdown TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      tags TEXT NOT NULL DEFAULT 'infrastructure,cloud,sysadmin',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt DATETIME,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_infrastructure_posts_slug_lang ON infrastructure_posts (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_infrastructure_posts_feed ON infrastructure_posts (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_infrastructure_posts_cat_feed ON infrastructure_posts (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_infrastructure_posts_env_feed ON infrastructure_posts (language, environment, orderPriority DESC, publishedAt DESC);
    CREATE INDEX IF NOT EXISTS IDX_infrastructure_posts_feat_feed ON infrastructure_posts (language, featured, orderPriority DESC, publishedAt DESC);
  `);

  const ensureColumn = (
    tableName: string,
    columnName: string,
    columnDef: string,
  ) => {
    try {
      const columns = db.pragma(`table_info(${tableName})`) as {
        name: string;
      }[];
      if (!columns.some((c) => c.name === columnName)) {
        db.exec(
          `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDef};`,
        );
      }
    } catch {
      // Ignore if table does not exist yet
    }
  };

  ensureColumn('news_articles', 'coverImage', 'TEXT');
  ensureColumn(
    'news_articles',
    'category',
    "TEXT NOT NULL DEFAULT 'frameworks'",
  );
  ensureColumn('blog_posts', 'coverImage', 'TEXT');
  ensureColumn('ai_resources', 'coverImage', 'TEXT');
  ensureColumn('security_posts', 'coverImage', 'TEXT');
  ensureColumn('tutorials', 'coverImage', 'TEXT');
  ensureColumn('projects', 'coverImage', 'TEXT');
  ensureColumn('infrastructure_posts', 'coverImage', 'TEXT');
  ensureColumn('forum_topics', 'coverImage', 'TEXT');

  const srcDir = path.resolve(__dirname, '../../../src/software/corpus');
  const distDir = path.resolve(__dirname, '../corpus');
  const corpusDir = fs.existsSync(srcDir) ? srcDir : distDir;

  if (!fs.existsSync(corpusDir)) {
    console.warn(
      `[SoftwareSeeder] Directorio de corpus no encontrado en src ni en dist: ${corpusDir}`,
    );
    return;
  }

  const readJson = <T>(filename: string): T => {
    const filePath = path.join(corpusDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  };

  const seedTransaction = db.transaction(() => {
    // 1. Noticias (news_articles) - UPSERT no destructivo preservando métricas
    const insertNews = db.prepare(`
      INSERT INTO news_articles 
        (slug, title, excerpt, contentMarkdown, sourceUrl, isBreaking, featured, orderPriority, author, category, tags, language, coverImage, readTimeMinutes, views, likes, publishedAt)
      VALUES 
        (@slug, @title, @excerpt, @contentMarkdown, @sourceUrl, @isBreaking, @featured, @orderPriority, @author, @category, @tags, @language, @coverImage, @readTimeMinutes, @views, @likes, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title = excluded.title,
        excerpt = excluded.excerpt,
        contentMarkdown = excluded.contentMarkdown,
        sourceUrl = excluded.sourceUrl,
        isBreaking = excluded.isBreaking,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        author = excluded.author,
        category = excluded.category,
        tags = excluded.tags,
        coverImage = excluded.coverImage,
        readTimeMinutes = excluded.readTimeMinutes,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const newsData = readJson<NewsSeedItem[]>('news.json');
    for (const item of newsData) {
      insertNews.run({
        ...item,
        category: item.category || 'frameworks',
        coverImage: item.coverImage ?? null,
        sourceUrl: item.sourceUrl ?? null,
        isBreaking: item.isBreaking ? 1 : 0,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
      });
    }

    // 2. Blog Posts (blog_posts) - UPSERT no destructivo preservando métricas
    const insertBlog = db.prepare(`
      INSERT INTO blog_posts 
        (slug, title, subtitle, excerpt, contentMarkdown, author, tags, language, series, tableOfContents, coverImage, readTimeMinutes, views, likes, featured, orderPriority, publishedAt)
      VALUES 
        (@slug, @title, @subtitle, @excerpt, @contentMarkdown, @author, @tags, @language, @series, @tableOfContents, @coverImage, @readTimeMinutes, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title = excluded.title,
        subtitle = excluded.subtitle,
        excerpt = excluded.excerpt,
        contentMarkdown = excluded.contentMarkdown,
        author = excluded.author,
        tags = excluded.tags,
        series = excluded.series,
        tableOfContents = excluded.tableOfContents,
        coverImage = excluded.coverImage,
        readTimeMinutes = excluded.readTimeMinutes,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const blogData = readJson<BlogSeedItem[]>('blog.json');
    for (const item of blogData) {
      insertBlog.run({
        ...item,
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
      });
    }

    // 3. Foros (forum_topics y forum_replies) - INSERT OR IGNORE para jamás pisar contenido comunitario
    const insertTopic = db.prepare(`
      INSERT OR IGNORE INTO forum_topics 
        (id, slug, title, content, author, category, language, coverImage, isSolved, isPinned, orderPriority, repliesCount, views)
      VALUES 
        (@id, @slug, @title, @content, @author, @category, @language, @coverImage, @isSolved, @isPinned, @orderPriority, @repliesCount, @views)
    `);
    const insertReply = db.prepare(`
      INSERT OR IGNORE INTO forum_replies
        (id, topicId, parentId, author, content, isAcceptedAnswer, likes)
      VALUES
        (@id, @topicId, @parentId, @author, @content, @isAcceptedAnswer, @likes)
    `);
    const forumData = readJson<ForumSeedData>('forum.json');
    for (const topic of forumData.topics) {
      insertTopic.run({
        ...topic,
        coverImage: topic.coverImage ?? null,
        isSolved: topic.isSolved ? 1 : 0,
        isPinned: topic.isPinned ? 1 : 0,
        orderPriority: topic.orderPriority || 0,
        language: topic.language || 'es',
      });
    }
    for (const reply of forumData.replies) {
      insertReply.run({
        ...reply,
        parentId: reply.parentId ?? null,
        isAcceptedAnswer: reply.isAcceptedAnswer ? 1 : 0,
      });
    }

    // 4. Inteligencia Artificial (ai_resources) - UPSERT no destructivo
    const insertAi = db.prepare(`
      INSERT INTO ai_resources
        (slug, name, type, provider, description, contentMarkdown, license, documentationUrl, paperUrl, githubUrl, tags, language, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @name, @type, @provider, @description, @contentMarkdown, @license, @documentationUrl, @paperUrl, @githubUrl, @tags, @language, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        name = excluded.name,
        type = excluded.type,
        provider = excluded.provider,
        description = excluded.description,
        contentMarkdown = excluded.contentMarkdown,
        license = excluded.license,
        documentationUrl = excluded.documentationUrl,
        paperUrl = excluded.paperUrl,
        githubUrl = excluded.githubUrl,
        tags = excluded.tags,
        coverImage = excluded.coverImage,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const aiData = readJson<AiSeedItem[]>('ai.json');
    for (const item of aiData) {
      insertAi.run({
        ...item,
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
      });
    }

    // 5. Ciberseguridad (security_posts) - UPSERT no destructivo
    const insertSec = db.prepare(`
      INSERT INTO security_posts
        (slug, title, severity, postType, cveId, affectedSystems, remediation, excerpt, contentMarkdown, author, tags, language, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @title, @severity, @postType, @cveId, @affectedSystems, @remediation, @excerpt, @contentMarkdown, @author, @tags, @language, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title = excluded.title,
        severity = excluded.severity,
        postType = excluded.postType,
        cveId = excluded.cveId,
        affectedSystems = excluded.affectedSystems,
        remediation = excluded.remediation,
        excerpt = excluded.excerpt,
        contentMarkdown = excluded.contentMarkdown,
        author = excluded.author,
        tags = excluded.tags,
        coverImage = excluded.coverImage,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const secData = readJson<SecuritySeedItem[]>('security.json');
    for (const item of secData) {
      insertSec.run({
        ...item,
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
      });
    }

    // 6. Tutoriales y Pasos (tutorials y tutorial_steps) - UPSERT no destructivo
    const insertTutorial = db.prepare(`
      INSERT INTO tutorials
        (id, slug, title, excerpt, description, difficulty, estimatedMinutes, prerequisites, techStack, author, tags, language, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@id, @slug, @title, @excerpt, @description, @difficulty, @estimatedMinutes, @prerequisites, @techStack, @author, @tags, @language, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title = excluded.title,
        excerpt = excluded.excerpt,
        description = excluded.description,
        difficulty = excluded.difficulty,
        estimatedMinutes = excluded.estimatedMinutes,
        prerequisites = excluded.prerequisites,
        techStack = excluded.techStack,
        author = excluded.author,
        tags = excluded.tags,
        coverImage = excluded.coverImage,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const insertStep = db.prepare(`
      INSERT INTO tutorial_steps
        (id, tutorialId, stepOrder, title, contentMarkdown, codeSnippet, codeLanguage, imageUrl)
      VALUES
        (@id, @tutorialId, @stepOrder, @title, @contentMarkdown, @codeSnippet, @codeLanguage, @imageUrl)
      ON CONFLICT(id) DO UPDATE SET
        tutorialId = excluded.tutorialId,
        stepOrder = excluded.stepOrder,
        title = excluded.title,
        contentMarkdown = excluded.contentMarkdown,
        codeSnippet = excluded.codeSnippet,
        codeLanguage = excluded.codeLanguage,
        imageUrl = excluded.imageUrl,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const tutorialsData = readJson<TutorialsSeedData>('tutorials.json');
    for (const item of tutorialsData.tutorials) {
      insertTutorial.run({
        ...item,
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
      });
    }
    for (const step of tutorialsData.steps) {
      insertStep.run({
        ...step,
        codeSnippet: step.codeSnippet ?? null,
        imageUrl: (step as { imageUrl?: string }).imageUrl ?? null,
      });
    }

    // 7. Proyectos (projects) - UPSERT no destructivo
    const insertProj = db.prepare(`
      INSERT INTO projects
        (slug, name, description, techStack, language, coverImage, repoUrl, liveUrl, status, featured, orderPriority, stars, views, architectureDiagramUrl)
      VALUES
        (@slug, @name, @description, @techStack, @language, @coverImage, @repoUrl, @liveUrl, @status, @featured, @orderPriority, @stars, @views, @architectureDiagramUrl)
      ON CONFLICT(slug, language) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        techStack = excluded.techStack,
        coverImage = excluded.coverImage,
        repoUrl = excluded.repoUrl,
        liveUrl = excluded.liveUrl,
        status = excluded.status,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        architectureDiagramUrl = excluded.architectureDiagramUrl,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const projectsData = readJson<ProjectSeedItem[]>('projects.json');
    for (const item of projectsData) {
      insertProj.run({
        ...item,
        coverImage: item.coverImage ?? null,
        architectureDiagramUrl: item.architectureDiagramUrl ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
      });
    }

    // 8. Infraestructura (infrastructure_posts) - UPSERT no destructivo
    const insertInfra = db.prepare(`
      INSERT INTO infrastructure_posts
        (slug, title, subtitle, category, environment, difficulty, techStack, architectureOverview, specs, contentMarkdown, author, tags, language, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @title, @subtitle, @category, @environment, @difficulty, @techStack, @architectureOverview, @specs, @contentMarkdown, @author, @tags, @language, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title = excluded.title,
        subtitle = excluded.subtitle,
        category = excluded.category,
        environment = excluded.environment,
        difficulty = excluded.difficulty,
        techStack = excluded.techStack,
        architectureOverview = excluded.architectureOverview,
        specs = excluded.specs,
        contentMarkdown = excluded.contentMarkdown,
        author = excluded.author,
        tags = excluded.tags,
        coverImage = excluded.coverImage,
        featured = excluded.featured,
        orderPriority = excluded.orderPriority,
        updatedAt = CURRENT_TIMESTAMP
    `);
    const infraData = readJson<InfrastructureSeedItem[]>('infrastructure.json');
    for (const item of infraData) {
      insertInfra.run({
        ...item,
        coverImage: item.coverImage ?? null,
        subtitle: item.subtitle || null,
        architectureOverview: item.architectureOverview || null,
        specs: item.specs || null,
        author: item.author || 'Jorge Doicela',
        tags: item.tags || 'infrastructure,cloud,sysadmin',
        language: item.language || 'es',
        views: item.views || 0,
        likes: item.likes || 0,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        publishedAt: item.publishedAt || null,
      });
    }
  });

  seedTransaction();
  db.close();

  console.log(
    `[SoftwareSeeder] Reinicio y sembrado completado con éxito en ${Date.now() - startTime}ms.`,
  );
}

if (require.main === module) {
  seedSoftware();
}
