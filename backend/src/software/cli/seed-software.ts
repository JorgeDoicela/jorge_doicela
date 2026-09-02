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
  tags: string;
  language?: string;
  coverImage?: string;
  readTimeMinutes: number;
  views: number;
  likes: number;
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
  readTimeMinutes: number;
  views: number;
  likes: number;
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
    isSolved: boolean;
    isPinned: boolean;
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
  views: number;
  likes: number;
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
  views: number;
  likes: number;
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
  repoUrl?: string;
  liveUrl?: string;
  status: string;
  featured: boolean;
  stars: number;
  views: number;
  architectureDiagramUrl?: string;
}

export function seedSoftware(
  dbPath: string = resolveDatabasePath(
    'DATABASE_SOFTWARE_PATH',
    'software.sqlite',
  ),
) {
  const startTime = Date.now();
  console.log(`[SoftwareSeeder] Conectando a la base de datos: ${dbPath}...`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Asegurar estructura de tablas relacionales limpias
  db.exec(`
    DROP TABLE IF EXISTS articles;
    DROP TABLE IF EXISTS tutorial_steps;
    DROP TABLE IF EXISTS tutorials;
    DROP TABLE IF EXISTS security_posts;
    DROP TABLE IF EXISTS ai_resources;
    DROP TABLE IF EXISTS forum_replies;
    DROP TABLE IF EXISTS forum_topics;
    DROP TABLE IF EXISTS blog_posts;
    DROP TABLE IF EXISTS news_articles;
    DROP TABLE IF EXISTS projects;

    CREATE TABLE IF NOT EXISTS news_articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      sourceUrl TEXT,
      isBreaking INTEGER NOT NULL DEFAULT 0,
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
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
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_blog_posts_slug_lang ON blog_posts (slug, language);

    CREATE TABLE IF NOT EXISTS forum_topics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Comunidad Tech',
      category TEXT NOT NULL DEFAULT 'general',
      language TEXT NOT NULL DEFAULT 'es',
      isSolved INTEGER NOT NULL DEFAULT 0,
      isPinned INTEGER NOT NULL DEFAULT 0,
      repliesCount INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_forum_topics_slug_lang ON forum_topics (slug, language);

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
      FOREIGN KEY (topicId) REFERENCES forum_topics(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS ai_resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'tool',
      provider TEXT NOT NULL DEFAULT 'Open Source',
      description TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      license TEXT NOT NULL DEFAULT 'MIT',
      documentationUrl TEXT,
      paperUrl TEXT,
      githubUrl TEXT,
      tags TEXT NOT NULL DEFAULT 'ai,llm',
      language TEXT NOT NULL DEFAULT 'es',
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_ai_resources_slug_lang ON ai_resources (slug, language);

    CREATE TABLE IF NOT EXISTS security_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      severity TEXT NOT NULL DEFAULT 'MEDIUM',
      postType TEXT NOT NULL DEFAULT 'advisory',
      cveId TEXT,
      affectedSystems TEXT,
      remediation TEXT,
      excerpt TEXT NOT NULL,
      contentMarkdown TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      tags TEXT NOT NULL DEFAULT 'cybersecurity,devsecops',
      language TEXT NOT NULL DEFAULT 'es',
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_security_posts_slug_lang ON security_posts (slug, language);

    CREATE TABLE IF NOT EXISTS tutorials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      description TEXT NOT NULL,
      difficulty TEXT NOT NULL DEFAULT 'intermediate',
      estimatedMinutes INTEGER NOT NULL DEFAULT 15,
      prerequisites TEXT,
      techStack TEXT NOT NULL DEFAULT 'TypeScript,Node.js',
      author TEXT NOT NULL DEFAULT 'Jorge Doicela',
      tags TEXT NOT NULL DEFAULT 'tutorial,guide',
      language TEXT NOT NULL DEFAULT 'es',
      coverImage TEXT,
      views INTEGER NOT NULL DEFAULT 0,
      likes INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_tutorials_slug_lang ON tutorials (slug, language);

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

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      techStack TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      repoUrl TEXT,
      liveUrl TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      featured INTEGER NOT NULL DEFAULT 0,
      stars INTEGER NOT NULL DEFAULT 0,
      views INTEGER NOT NULL DEFAULT 0,
      architectureDiagramUrl TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_projects_slug_lang ON projects (slug, language);

  `);

  let corpusDir = path.resolve(__dirname, '../corpus');
  if (!fs.existsSync(corpusDir)) {
    const srcDir = path.resolve(__dirname, '../../../src/software/corpus');
    if (fs.existsSync(srcDir)) {
      corpusDir = srcDir;
    }
  }

  const readJson = <T>(filename: string): T => {
    const filePath = path.join(corpusDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  };

  const seedTransaction = db.transaction(() => {
    // 1. Noticias (news_articles)
    const insertNews = db.prepare(`
      INSERT OR REPLACE INTO news_articles 
        (slug, title, excerpt, contentMarkdown, sourceUrl, isBreaking, author, tags, language, coverImage, readTimeMinutes, views, likes)
      VALUES 
        (@slug, @title, @excerpt, @contentMarkdown, @sourceUrl, @isBreaking, @author, @tags, @language, @coverImage, @readTimeMinutes, @views, @likes)
    `);
    const newsData = readJson<NewsSeedItem[]>('news.json');
    for (const item of newsData) {
      insertNews.run({
        ...item,
        isBreaking: item.isBreaking ? 1 : 0,
        language: item.language || 'es',
      });
    }

    // 2. Blog Posts (blog_posts)
    const insertBlog = db.prepare(`
      INSERT OR REPLACE INTO blog_posts 
        (slug, title, subtitle, excerpt, contentMarkdown, author, tags, language, series, tableOfContents, readTimeMinutes, views, likes)
      VALUES 
        (@slug, @title, @subtitle, @excerpt, @contentMarkdown, @author, @tags, @language, @series, @tableOfContents, @readTimeMinutes, @views, @likes)
    `);
    const blogData = readJson<BlogSeedItem[]>('blog.json');
    for (const item of blogData) {
      insertBlog.run({
        ...item,
        language: item.language || 'es',
      });
    }

    // 3. Foros (forum_topics y forum_replies)
    const insertTopic = db.prepare(`
      INSERT OR REPLACE INTO forum_topics 
        (id, slug, title, content, author, category, language, isSolved, isPinned, repliesCount, views)
      VALUES 
        (@id, @slug, @title, @content, @author, @category, @language, @isSolved, @isPinned, @repliesCount, @views)
    `);
    const insertReply = db.prepare(`
      INSERT OR REPLACE INTO forum_replies
        (id, topicId, parentId, author, content, isAcceptedAnswer, likes)
      VALUES
        (@id, @topicId, @parentId, @author, @content, @isAcceptedAnswer, @likes)
    `);
    const forumData = readJson<ForumSeedData>('forum.json');
    for (const topic of forumData.topics) {
      insertTopic.run({
        ...topic,
        isSolved: topic.isSolved ? 1 : 0,
        isPinned: topic.isPinned ? 1 : 0,
        language: topic.language || 'es',
      });
    }
    for (const reply of forumData.replies) {
      insertReply.run({
        ...reply,
        isAcceptedAnswer: reply.isAcceptedAnswer ? 1 : 0,
      });
    }

    // 4. Inteligencia Artificial (ai_resources)
    const insertAi = db.prepare(`
      INSERT OR REPLACE INTO ai_resources
        (slug, name, type, provider, description, contentMarkdown, license, documentationUrl, paperUrl, githubUrl, tags, language, views, likes)
      VALUES
        (@slug, @name, @type, @provider, @description, @contentMarkdown, @license, @documentationUrl, @paperUrl, @githubUrl, @tags, @language, @views, @likes)
    `);
    const aiData = readJson<AiSeedItem[]>('ai.json');
    for (const item of aiData) {
      insertAi.run({
        ...item,
        language: item.language || 'es',
      });
    }

    // 5. Ciberseguridad (security_posts)
    const insertSec = db.prepare(`
      INSERT OR REPLACE INTO security_posts
        (slug, title, severity, postType, cveId, affectedSystems, remediation, excerpt, contentMarkdown, author, tags, language, views, likes)
      VALUES
        (@slug, @title, @severity, @postType, @cveId, @affectedSystems, @remediation, @excerpt, @contentMarkdown, @author, @tags, @language, @views, @likes)
    `);
    const secData = readJson<SecuritySeedItem[]>('security.json');
    for (const item of secData) {
      insertSec.run({
        ...item,
        language: item.language || 'es',
      });
    }

    // 6. Tutoriales y Pasos (tutorials y tutorial_steps)
    const insertTutorial = db.prepare(`
      INSERT OR REPLACE INTO tutorials
        (id, slug, title, excerpt, description, difficulty, estimatedMinutes, prerequisites, techStack, author, tags, language, coverImage, views, likes)
      VALUES
        (@id, @slug, @title, @excerpt, @description, @difficulty, @estimatedMinutes, @prerequisites, @techStack, @author, @tags, @language, @coverImage, @views, @likes)
    `);
    const insertStep = db.prepare(`
      INSERT OR REPLACE INTO tutorial_steps
        (id, tutorialId, stepOrder, title, contentMarkdown, codeSnippet, codeLanguage)
      VALUES
        (@id, @tutorialId, @stepOrder, @title, @contentMarkdown, @codeSnippet, @codeLanguage)
    `);
    const tutorialsData = readJson<TutorialsSeedData>('tutorials.json');
    for (const item of tutorialsData.tutorials) {
      insertTutorial.run({
        ...item,
        language: item.language || 'es',
      });
    }
    for (const step of tutorialsData.steps) {
      insertStep.run(step);
    }

    // 7. Proyectos (projects)
    const insertProj = db.prepare(`
      INSERT OR REPLACE INTO projects
        (slug, name, description, techStack, language, repoUrl, liveUrl, status, featured, stars, views, architectureDiagramUrl)
      VALUES
        (@slug, @name, @description, @techStack, @language, @repoUrl, @liveUrl, @status, @featured, @stars, @views, @architectureDiagramUrl)
    `);
    const projectsData = readJson<ProjectSeedItem[]>('projects.json');
    for (const item of projectsData) {
      insertProj.run({
        ...item,
        featured: item.featured ? 1 : 0,
        language: item.language || 'es',
      });
    }
  });

  seedTransaction();
  db.close();

  console.log(
    `[SoftwareSeeder] Sembrado transaccional desde corpus/*.json completado con éxito en ${Date.now() - startTime}ms.`,
  );
}

if (require.main === module) {
  seedSoftware();
}
