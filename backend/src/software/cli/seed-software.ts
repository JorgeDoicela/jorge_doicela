import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { resolveDatabasePath } from '../../common/database/database-path.util';

// ─────────────────────────────────────────────────────────────────────────────
// Tipos de vocabulario controlado por módulo
// ─────────────────────────────────────────────────────────────────────────────

export type NewsCategory =
  | 'frameworks'
  | 'cloud'
  | 'ai'
  | 'devops'
  | 'security'
  | 'web'
  | 'tools'
  | 'databases';

export type BlogCategory =
  | 'architecture'
  | 'devops'
  | 'ai'
  | 'frontend'
  | 'backend'
  | 'career'
  | 'opinion'
  | 'databases';

export type AiCategory =
  | 'llm'
  | 'agent'
  | 'framework'
  | 'mcp_server'
  | 'tool'
  | 'dataset'
  | 'platform';

export type SecurityCategory =
  | 'advisory'
  | 'hardening_guide'
  | 'writeup'
  | 'cve_analysis'
  | 'pentest';

export type TutorialCategory =
  | 'web'
  | 'backend'
  | 'devops'
  | 'mobile'
  | 'ai'
  | 'databases'
  | 'security'
  | 'architecture';

export type ProjectCategory =
  | 'web'
  | 'backend'
  | 'mobile'
  | 'devops'
  | 'ai'
  | 'open_source'
  | 'tool';

export type InfrastructureCategory =
  | 'cloud'
  | 'servers'
  | 'containers'
  | 'networking'
  | 'ci_cd'
  | 'hardening'
  | 'zero_ram'
  | 'monitoring'
  | 'security';

export type ForumCategory =
  | 'architecture'
  | 'devops'
  | 'ai'
  | 'frontend'
  | 'backend'
  | 'help'
  | 'general';

export type GlossaryCategory =
  | 'frontend'
  | 'backend'
  | 'devops'
  | 'databases'
  | 'security'
  | 'ai'
  | 'architecture'
  | 'general';

// ─────────────────────────────────────────────────────────────────────────────
// Interfaces de los corpus JSON
// ─────────────────────────────────────────────────────────────────────────────

interface NewsSeedItem {
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  sourceUrl?: string;
  isBreaking: boolean;
  author: string;
  category: NewsCategory;
  tags: string; // CSV usado para sembrar content_tags
  language?: string;
  coverImage?: string;
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
  category: BlogCategory;
  tags: string;
  language?: string;
  series?: string;
  tableOfContents?: string;
  coverImage?: string;
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
    category: ForumCategory;
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
  category: AiCategory;
  provider: string;
  author: string;
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
  category: SecurityCategory;
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
    category: TutorialCategory;
    difficulty: string;
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
    imageUrl?: string;
  }[];
}

interface ProjectSeedItem {
  slug: string;
  name: string;
  category: ProjectCategory;
  description: string;
  techStack: string;
  author: string;
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
  category: InfrastructureCategory;
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

interface GlossarySeedItem {
  slug: string;
  term: string;
  aliases?: string;
  category?: GlossaryCategory;
  shortDefinition: string;
  keyDifference?: string;
  caseSensitive?: boolean;
  language?: string;
  orderPriority?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Función principal del seeder
// ─────────────────────────────────────────────────────────────────────────────

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
    DROP TABLE IF EXISTS content_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS infrastructure_posts;
    DROP TABLE IF EXISTS glossary_terms;
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

  // ── DDL Definitivo ──────────────────────────────────────────────────────────
  db.exec(`
    -- ── Registro central de tags (vocabulario técnico normalizado) ──────────
    CREATE TABLE IF NOT EXISTS tags (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      slug  TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS IDX_tags_slug ON tags (slug);

    -- ── Tabla de unión polimórfica para etiquetas por contenido ────────────
    CREATE TABLE IF NOT EXISTS content_tags (
      content_type TEXT    NOT NULL,
      content_id   INTEGER NOT NULL,
      tag_id       INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (content_type, content_id, tag_id)
    );
    CREATE INDEX IF NOT EXISTS IDX_content_tags_tag     ON content_tags (tag_id);
    CREATE INDEX IF NOT EXISTS IDX_content_tags_content ON content_tags (content_type, content_id);

    -- ── NOTICIAS ────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS news_articles (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT    NOT NULL,
      title         TEXT    NOT NULL,
      excerpt       TEXT    NOT NULL,
      contentMarkdown TEXT  NOT NULL,
      sourceUrl     TEXT,
      isBreaking    INTEGER NOT NULL DEFAULT 0,
      featured      INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      author        TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      category      TEXT    NOT NULL DEFAULT 'frameworks'
                    CHECK (category IN ('frameworks','cloud','ai','devops','security','web','tools','databases')),
      tags          TEXT    NOT NULL DEFAULT 'news,tech',
      language      TEXT    NOT NULL DEFAULT 'es',
      coverImage    TEXT,
      views         INTEGER NOT NULL DEFAULT 0,
      likes         INTEGER NOT NULL DEFAULT 0,
      publishedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_news_articles_slug_lang    ON news_articles (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_news_articles_feed          ON news_articles (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_news_articles_cat_feed      ON news_articles (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_news_articles_feat_feed     ON news_articles (language, featured, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_news_articles_break_feed    ON news_articles (language, isBreaking, orderPriority DESC, publishedAt DESC);

    -- ── BLOG ────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS blog_posts (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT    NOT NULL,
      title         TEXT    NOT NULL,
      subtitle      TEXT,
      excerpt       TEXT    NOT NULL,
      contentMarkdown TEXT  NOT NULL,
      author        TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      category      TEXT    NOT NULL DEFAULT 'architecture'
                    CHECK (category IN ('architecture','devops','ai','frontend','backend','career','opinion','databases')),
      tags          TEXT    NOT NULL DEFAULT 'architecture,clean-code',
      language      TEXT    NOT NULL DEFAULT 'es',
      series        TEXT,
      tableOfContents TEXT,
      coverImage    TEXT,
      views         INTEGER NOT NULL DEFAULT 0,
      likes         INTEGER NOT NULL DEFAULT 0,
      featured      INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_blog_posts_slug_lang    ON blog_posts (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_blog_posts_feed          ON blog_posts (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_blog_posts_cat_feed      ON blog_posts (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_blog_posts_series_feed   ON blog_posts (language, series, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_blog_posts_feat_feed     ON blog_posts (language, featured, orderPriority DESC, publishedAt DESC);

    -- ── FORO ────────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS forum_topics (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT    NOT NULL,
      title         TEXT    NOT NULL,
      content       TEXT    NOT NULL,
      author        TEXT    NOT NULL DEFAULT 'Comunidad Tech',
      category      TEXT    NOT NULL DEFAULT 'general'
                    CHECK (category IN ('architecture','devops','ai','frontend','backend','help','general')),
      language      TEXT    NOT NULL DEFAULT 'es',
      coverImage    TEXT,
      isSolved      INTEGER NOT NULL DEFAULT 0,
      isPinned      INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      repliesCount  INTEGER NOT NULL DEFAULT 0,
      views         INTEGER NOT NULL DEFAULT 0,
      createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_forum_topics_slug_lang   ON forum_topics (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_forum_topics_feed         ON forum_topics (language, isPinned DESC, orderPriority DESC, createdAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_forum_topics_cat_feed     ON forum_topics (language, category, isPinned DESC, orderPriority DESC, createdAt DESC);

    CREATE TABLE IF NOT EXISTS forum_replies (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      topicId          INTEGER NOT NULL,
      parentId         INTEGER,
      author           TEXT    NOT NULL,
      content          TEXT    NOT NULL,
      isAcceptedAnswer INTEGER NOT NULL DEFAULT 0,
      likes            INTEGER NOT NULL DEFAULT 0,
      createdAt        DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt        DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (topicId)  REFERENCES forum_topics(id)   ON DELETE CASCADE,
      FOREIGN KEY (parentId) REFERENCES forum_replies(id)  ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS IDX_forum_replies_topic         ON forum_replies (topicId);
    CREATE INDEX IF NOT EXISTS IDX_forum_replies_parent        ON forum_replies (parentId);
    CREATE INDEX IF NOT EXISTS IDX_forum_replies_topic_created ON forum_replies (topicId, createdAt ASC);

    -- ── IA & AGENTES ────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS ai_resources (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      slug             TEXT    NOT NULL,
      name             TEXT    NOT NULL,
      category         TEXT    NOT NULL DEFAULT 'tool'
                       CHECK (category IN ('llm','agent','framework','mcp_server','tool','dataset','platform')),
      provider         TEXT    NOT NULL DEFAULT 'Open Source',
      author           TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      description      TEXT    NOT NULL,
      contentMarkdown  TEXT    NOT NULL,
      license          TEXT    NOT NULL DEFAULT 'MIT',
      documentationUrl TEXT,
      paperUrl         TEXT,
      githubUrl        TEXT,
      tags             TEXT    NOT NULL DEFAULT 'ai,llm',
      language         TEXT    NOT NULL DEFAULT 'es',
      coverImage       TEXT,
      views            INTEGER NOT NULL DEFAULT 0,
      likes            INTEGER NOT NULL DEFAULT 0,
      featured         INTEGER NOT NULL DEFAULT 0,
      orderPriority    INTEGER NOT NULL DEFAULT 0,
      publishedAt      DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt        DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt        DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_ai_resources_slug_lang  ON ai_resources (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_ai_resources_feed        ON ai_resources (language, orderPriority DESC, createdAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_ai_resources_cat_feed    ON ai_resources (language, category, orderPriority DESC, createdAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_ai_resources_feat_feed   ON ai_resources (language, featured, orderPriority DESC, createdAt DESC);

    -- ── CIBERSEGURIDAD ──────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS security_posts (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      slug            TEXT    NOT NULL,
      title           TEXT    NOT NULL,
      severity        TEXT    NOT NULL DEFAULT 'MEDIUM'
                      CHECK (severity IN ('LOW','MEDIUM','HIGH','CRITICAL')),
      category        TEXT    NOT NULL DEFAULT 'advisory'
                      CHECK (category IN ('advisory','hardening_guide','writeup','cve_analysis','pentest')),
      cveId           TEXT,
      affectedSystems TEXT,
      remediation     TEXT,
      excerpt         TEXT    NOT NULL,
      contentMarkdown TEXT    NOT NULL,
      author          TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      tags            TEXT    NOT NULL DEFAULT 'cybersecurity,devsecops',
      language        TEXT    NOT NULL DEFAULT 'es',
      coverImage      TEXT,
      views           INTEGER NOT NULL DEFAULT 0,
      likes           INTEGER NOT NULL DEFAULT 0,
      featured        INTEGER NOT NULL DEFAULT 0,
      orderPriority   INTEGER NOT NULL DEFAULT 0,
      publishedAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_security_posts_slug_lang  ON security_posts (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_security_posts_feed        ON security_posts (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_security_posts_sev_feed    ON security_posts (language, severity, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_security_posts_cat_feed    ON security_posts (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_security_posts_feat_feed   ON security_posts (language, featured, orderPriority DESC, publishedAt DESC);

    -- ── TUTORIALES ──────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS tutorials (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      slug          TEXT    NOT NULL,
      title         TEXT    NOT NULL,
      excerpt       TEXT    NOT NULL,
      description   TEXT    NOT NULL,
      category      TEXT    NOT NULL DEFAULT 'backend'
                    CHECK (category IN ('web','backend','devops','mobile','ai','databases','security','architecture')),
      difficulty    TEXT    NOT NULL DEFAULT 'intermediate'
                    CHECK (difficulty IN ('beginner','intermediate','advanced')),
      prerequisites TEXT,
      techStack     TEXT    NOT NULL DEFAULT 'TypeScript,Node.js',
      author        TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      tags          TEXT    NOT NULL DEFAULT 'tutorial,guide',
      language      TEXT    NOT NULL DEFAULT 'es',
      coverImage    TEXT,
      views         INTEGER NOT NULL DEFAULT 0,
      likes         INTEGER NOT NULL DEFAULT 0,
      featured      INTEGER NOT NULL DEFAULT 0,
      orderPriority INTEGER NOT NULL DEFAULT 0,
      publishedAt   DATETIME DEFAULT CURRENT_TIMESTAMP,
      createdAt     DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt     DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_tutorials_slug_lang   ON tutorials (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_tutorials_feed         ON tutorials (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_tutorials_cat_feed     ON tutorials (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_tutorials_diff_feed    ON tutorials (language, difficulty, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_tutorials_feat_feed    ON tutorials (language, featured, orderPriority DESC, publishedAt DESC);

    CREATE TABLE IF NOT EXISTS tutorial_steps (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      tutorialId      INTEGER NOT NULL,
      stepOrder       INTEGER NOT NULL DEFAULT 1,
      title           TEXT    NOT NULL,
      contentMarkdown TEXT    NOT NULL,
      codeSnippet     TEXT,
      codeLanguage    TEXT    NOT NULL DEFAULT 'typescript',
      imageUrl        TEXT,
      createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutorialId) REFERENCES tutorials(id) ON DELETE CASCADE
    );
    CREATE INDEX IF NOT EXISTS IDX_tutorial_steps_tut       ON tutorial_steps (tutorialId);
    CREATE INDEX IF NOT EXISTS IDX_tutorial_steps_tut_order ON tutorial_steps (tutorialId, stepOrder ASC);

    -- ── PROYECTOS ───────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS projects (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      slug                 TEXT    NOT NULL,
      name                 TEXT    NOT NULL,
      category             TEXT    NOT NULL DEFAULT 'web'
                           CHECK (category IN ('web','backend','mobile','devops','ai','open_source','tool')),
      description          TEXT    NOT NULL,
      techStack            TEXT    NOT NULL,
      author               TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      language             TEXT    NOT NULL DEFAULT 'es',
      coverImage           TEXT,
      repoUrl              TEXT,
      liveUrl              TEXT,
      status               TEXT    NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active','archived','wip')),
      featured             INTEGER NOT NULL DEFAULT 0,
      orderPriority        INTEGER NOT NULL DEFAULT 0,
      stars                INTEGER NOT NULL DEFAULT 0,
      views                INTEGER NOT NULL DEFAULT 0,
      architectureDiagramUrl TEXT,
      createdAt            DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt            DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_projects_slug_lang    ON projects (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_projects_feed          ON projects (language, orderPriority DESC, stars DESC);
    CREATE INDEX        IF NOT EXISTS IDX_projects_cat_feed      ON projects (language, category, orderPriority DESC, stars DESC);
    CREATE INDEX        IF NOT EXISTS IDX_projects_status_feed   ON projects (language, status, orderPriority DESC, stars DESC);
    CREATE INDEX        IF NOT EXISTS IDX_projects_feat_feed     ON projects (language, featured, orderPriority DESC, stars DESC);

    -- ── INFRAESTRUCTURA ─────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS infrastructure_posts (
      id                   INTEGER PRIMARY KEY AUTOINCREMENT,
      slug                 TEXT    NOT NULL,
      title                TEXT    NOT NULL,
      subtitle             TEXT,
      category             TEXT    NOT NULL DEFAULT 'servers'
                           CHECK (category IN ('cloud','servers','containers','networking','ci_cd','hardening','zero_ram','monitoring','security')),
      environment          TEXT    NOT NULL DEFAULT 'production'
                           CHECK (environment IN ('production','edge','hybrid','vps','bare_metal')),
      difficulty           TEXT    NOT NULL DEFAULT 'intermediate'
                           CHECK (difficulty IN ('beginner','intermediate','advanced','expert')),
      techStack            TEXT    NOT NULL DEFAULT 'Debian, Linux, Nginx',
      architectureOverview TEXT,
      specs                TEXT,
      contentMarkdown      TEXT    NOT NULL,
      author               TEXT    NOT NULL DEFAULT 'Jorge Doicela',
      tags                 TEXT    NOT NULL DEFAULT 'infrastructure,cloud,sysadmin',
      language             TEXT    NOT NULL DEFAULT 'es',
      coverImage           TEXT,
      views                INTEGER NOT NULL DEFAULT 0,
      likes                INTEGER NOT NULL DEFAULT 0,
      featured             INTEGER NOT NULL DEFAULT 0,
      orderPriority        INTEGER NOT NULL DEFAULT 0,
      publishedAt          DATETIME,
      createdAt            DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt            DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_infrastructure_posts_slug_lang ON infrastructure_posts (slug, language);
    CREATE INDEX        IF NOT EXISTS IDX_infrastructure_posts_feed       ON infrastructure_posts (language, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_infrastructure_posts_cat_feed   ON infrastructure_posts (language, category, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_infrastructure_posts_env_feed   ON infrastructure_posts (language, environment, orderPriority DESC, publishedAt DESC);
    CREATE INDEX        IF NOT EXISTS IDX_infrastructure_posts_feat_feed  ON infrastructure_posts (language, featured, orderPriority DESC, publishedAt DESC);

    -- ── GLOSARIO ────────────────────────────────────────────────────────────
    CREATE TABLE IF NOT EXISTS glossary_terms (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      slug            TEXT    NOT NULL,
      term            TEXT    NOT NULL,
      aliases         TEXT,
      category        TEXT    NOT NULL DEFAULT 'general'
                      CHECK (category IN ('frontend','backend','devops','database','databases','security','ai','architecture','linux','networking','general')),
      shortDefinition TEXT    NOT NULL,
      keyDifference   TEXT,
      caseSensitive   INTEGER NOT NULL DEFAULT 0,
      language        TEXT    NOT NULL DEFAULT 'es',
      orderPriority   INTEGER NOT NULL DEFAULT 0,
      createdAt       DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE UNIQUE INDEX IF NOT EXISTS IDX_glossary_terms_term_lang ON glossary_terms (term, language);
    CREATE INDEX        IF NOT EXISTS IDX_glossary_terms_lang_prio  ON glossary_terms (language, orderPriority DESC);
    CREATE INDEX        IF NOT EXISTS IDX_glossary_terms_cat        ON glossary_terms (language, category, orderPriority DESC);
  `);

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

  // ── Helper: insertar tags normalizados y crear asociaciones ────────────────
  const insertTagStmt = db.prepare(`
    INSERT INTO tags (slug, label)
    VALUES (@slug, @label)
    ON CONFLICT(slug) DO NOTHING
  `);

  const insertContentTagStmt = db.prepare(`
    INSERT OR IGNORE INTO content_tags (content_type, content_id, tag_id)
    SELECT @contentType, @contentId, id FROM tags WHERE slug = @tagSlug
  `);

  const seedTags = (
    contentType: string,
    contentId: number | bigint,
    tagsCSV: string,
  ) => {
    const id = typeof contentId === 'bigint' ? Number(contentId) : contentId;
    const slugs = tagsCSV
      .split(',')
      .map((t) => t.trim().toLowerCase().replace(/\s+/g, '-'))
      .filter(Boolean);
    for (const slug of slugs) {
      insertTagStmt.run({ slug, label: slug });
      insertContentTagStmt.run({ contentType, contentId: id, tagSlug: slug });
    }
  };

  const seedTransaction = db.transaction(() => {
    // ── 1. Noticias ─────────────────────────────────────────────────────────
    const insertNews = db.prepare(`
      INSERT INTO news_articles
        (slug, title, excerpt, contentMarkdown, sourceUrl, isBreaking, featured, orderPriority,
         author, category, tags, language, coverImage, views, likes, publishedAt)
      VALUES
        (@slug, @title, @excerpt, @contentMarkdown, @sourceUrl, @isBreaking, @featured,
         @orderPriority, @author, @category, @tags, @language, @coverImage, @views, @likes, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title         = excluded.title,
        excerpt       = excluded.excerpt,
        contentMarkdown = excluded.contentMarkdown,
        sourceUrl     = excluded.sourceUrl,
        isBreaking    = excluded.isBreaking,
        featured      = excluded.featured,
        orderPriority = excluded.orderPriority,
        author        = excluded.author,
        category      = excluded.category,
        tags          = excluded.tags,
        coverImage    = excluded.coverImage,
        updatedAt     = CURRENT_TIMESTAMP
    `);
    const newsData = readJson<NewsSeedItem[]>('news.json');
    for (const item of newsData) {
      const result = insertNews.run({
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
      const rowId =
        result.lastInsertRowid ||
        (db
          .prepare(
            'SELECT id FROM news_articles WHERE slug = ? AND language = ?',
          )
          .get(item.slug, item.language || 'es') as { id: number } | undefined);
      const id =
        result.lastInsertRowid !== 0n && result.lastInsertRowid !== BigInt(0)
          ? result.lastInsertRowid
          : (rowId as { id: number })?.id;
      if (id) seedTags('news', id, item.tags);
    }

    // ── 2. Blog ─────────────────────────────────────────────────────────────
    const insertBlog = db.prepare(`
      INSERT INTO blog_posts
        (slug, title, subtitle, excerpt, contentMarkdown, author, category, tags, language,
         series, tableOfContents, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @title, @subtitle, @excerpt, @contentMarkdown, @author, @category, @tags, @language,
         @series, @tableOfContents, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title           = excluded.title,
        subtitle        = excluded.subtitle,
        excerpt         = excluded.excerpt,
        contentMarkdown = excluded.contentMarkdown,
        author          = excluded.author,
        category        = excluded.category,
        tags            = excluded.tags,
        series          = excluded.series,
        tableOfContents = excluded.tableOfContents,
        coverImage      = excluded.coverImage,
        featured        = excluded.featured,
        orderPriority   = excluded.orderPriority,
        updatedAt       = CURRENT_TIMESTAMP
    `);
    const blogData = readJson<BlogSeedItem[]>('blog.json');
    for (const item of blogData) {
      const result = insertBlog.run({
        ...item,
        category: item.category || 'architecture',
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
        subtitle: item.subtitle ?? null,
        series: item.series ?? null,
        tableOfContents: item.tableOfContents ?? null,
      });
      const rowId =
        result.lastInsertRowid !== 0n && result.lastInsertRowid !== BigInt(0)
          ? result.lastInsertRowid
          : (
              db
                .prepare(
                  'SELECT id FROM blog_posts WHERE slug = ? AND language = ?',
                )
                .get(item.slug, item.language || 'es') as
                | { id: number }
                | undefined
            )?.id;
      if (rowId) seedTags('blog', rowId, item.tags);
    }

    // ── 3. Foros ────────────────────────────────────────────────────────────
    const insertTopic = db.prepare(`
      INSERT OR IGNORE INTO forum_topics
        (id, slug, title, content, author, category, language, coverImage,
         isSolved, isPinned, orderPriority, repliesCount, views)
      VALUES
        (@id, @slug, @title, @content, @author, @category, @language, @coverImage,
         @isSolved, @isPinned, @orderPriority, @repliesCount, @views)
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
        category: topic.category || 'general',
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

    // ── 4. IA ───────────────────────────────────────────────────────────────
    const insertAi = db.prepare(`
      INSERT INTO ai_resources
        (slug, name, category, provider, author, description, contentMarkdown, license,
         documentationUrl, paperUrl, githubUrl, tags, language, coverImage,
         views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @name, @category, @provider, @author, @description, @contentMarkdown, @license,
         @documentationUrl, @paperUrl, @githubUrl, @tags, @language, @coverImage,
         @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        name            = excluded.name,
        category        = excluded.category,
        provider        = excluded.provider,
        author          = excluded.author,
        description     = excluded.description,
        contentMarkdown = excluded.contentMarkdown,
        license         = excluded.license,
        documentationUrl = excluded.documentationUrl,
        paperUrl        = excluded.paperUrl,
        githubUrl       = excluded.githubUrl,
        tags            = excluded.tags,
        coverImage      = excluded.coverImage,
        featured        = excluded.featured,
        orderPriority   = excluded.orderPriority,
        updatedAt       = CURRENT_TIMESTAMP
    `);
    const aiData = readJson<AiSeedItem[]>('ai.json');
    for (const item of aiData) {
      const result = insertAi.run({
        ...item,
        category: item.category || 'tool',
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
        documentationUrl: item.documentationUrl ?? null,
        paperUrl: item.paperUrl ?? null,
        githubUrl: item.githubUrl ?? null,
      });
      const rowId =
        result.lastInsertRowid !== 0n && result.lastInsertRowid !== BigInt(0)
          ? result.lastInsertRowid
          : (
              db
                .prepare(
                  'SELECT id FROM ai_resources WHERE slug = ? AND language = ?',
                )
                .get(item.slug, item.language || 'es') as
                | { id: number }
                | undefined
            )?.id;
      if (rowId) seedTags('ai', rowId, item.tags);
    }

    // ── 5. Ciberseguridad ───────────────────────────────────────────────────
    const insertSec = db.prepare(`
      INSERT INTO security_posts
        (slug, title, severity, category, cveId, affectedSystems, remediation,
         excerpt, contentMarkdown, author, tags, language, coverImage,
         views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @title, @severity, @category, @cveId, @affectedSystems, @remediation,
         @excerpt, @contentMarkdown, @author, @tags, @language, @coverImage,
         @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title           = excluded.title,
        severity        = excluded.severity,
        category        = excluded.category,
        cveId           = excluded.cveId,
        affectedSystems = excluded.affectedSystems,
        remediation     = excluded.remediation,
        excerpt         = excluded.excerpt,
        contentMarkdown = excluded.contentMarkdown,
        author          = excluded.author,
        tags            = excluded.tags,
        coverImage      = excluded.coverImage,
        featured        = excluded.featured,
        orderPriority   = excluded.orderPriority,
        updatedAt       = CURRENT_TIMESTAMP
    `);
    const secData = readJson<SecuritySeedItem[]>('security.json');
    for (const item of secData) {
      const result = insertSec.run({
        ...item,
        category: item.category || 'advisory',
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
        cveId: item.cveId ?? null,
        affectedSystems: item.affectedSystems ?? null,
        remediation: item.remediation ?? null,
      });
      const rowId =
        result.lastInsertRowid !== 0n && result.lastInsertRowid !== BigInt(0)
          ? result.lastInsertRowid
          : (
              db
                .prepare(
                  'SELECT id FROM security_posts WHERE slug = ? AND language = ?',
                )
                .get(item.slug, item.language || 'es') as
                | { id: number }
                | undefined
            )?.id;
      if (rowId) seedTags('security', rowId, item.tags);
    }

    // ── 6. Tutoriales ───────────────────────────────────────────────────────
    const insertTutorial = db.prepare(`
      INSERT INTO tutorials
        (id, slug, title, excerpt, description, category, difficulty, prerequisites,
         techStack, author, tags, language, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@id, @slug, @title, @excerpt, @description, @category, @difficulty, @prerequisites,
         @techStack, @author, @tags, @language, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title           = excluded.title,
        excerpt         = excluded.excerpt,
        description     = excluded.description,
        category        = excluded.category,
        difficulty      = excluded.difficulty,
        prerequisites   = excluded.prerequisites,
        techStack       = excluded.techStack,
        author          = excluded.author,
        tags            = excluded.tags,
        coverImage      = excluded.coverImage,
        featured        = excluded.featured,
        orderPriority   = excluded.orderPriority,
        updatedAt       = CURRENT_TIMESTAMP
    `);
    const insertStep = db.prepare(`
      INSERT INTO tutorial_steps
        (id, tutorialId, stepOrder, title, contentMarkdown, codeSnippet, codeLanguage, imageUrl)
      VALUES
        (@id, @tutorialId, @stepOrder, @title, @contentMarkdown, @codeSnippet, @codeLanguage, @imageUrl)
      ON CONFLICT(id) DO UPDATE SET
        tutorialId      = excluded.tutorialId,
        stepOrder       = excluded.stepOrder,
        title           = excluded.title,
        contentMarkdown = excluded.contentMarkdown,
        codeSnippet     = excluded.codeSnippet,
        codeLanguage    = excluded.codeLanguage,
        imageUrl        = excluded.imageUrl,
        updatedAt       = CURRENT_TIMESTAMP
    `);
    const tutorialsData = readJson<TutorialsSeedData>('tutorials.json');
    for (const item of tutorialsData.tutorials) {
      insertTutorial.run({
        ...item,
        category: item.category || 'backend',
        coverImage: item.coverImage ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
        publishedAt: item.publishedAt || new Date().toISOString(),
        prerequisites: item.prerequisites ?? null,
      });
      seedTags('tutorial', item.id, item.tags);
    }
    for (const step of tutorialsData.steps) {
      insertStep.run({
        ...step,
        codeSnippet: step.codeSnippet ?? null,
        imageUrl: step.imageUrl ?? null,
      });
    }

    // ── 7. Proyectos ────────────────────────────────────────────────────────
    const insertProj = db.prepare(`
      INSERT INTO projects
        (slug, name, category, description, techStack, author, language, coverImage,
         repoUrl, liveUrl, status, featured, orderPriority, stars, views, architectureDiagramUrl)
      VALUES
        (@slug, @name, @category, @description, @techStack, @author, @language, @coverImage,
         @repoUrl, @liveUrl, @status, @featured, @orderPriority, @stars, @views, @architectureDiagramUrl)
      ON CONFLICT(slug, language) DO UPDATE SET
        name                 = excluded.name,
        category             = excluded.category,
        description          = excluded.description,
        techStack            = excluded.techStack,
        author               = excluded.author,
        coverImage           = excluded.coverImage,
        repoUrl              = excluded.repoUrl,
        liveUrl              = excluded.liveUrl,
        status               = excluded.status,
        featured             = excluded.featured,
        orderPriority        = excluded.orderPriority,
        architectureDiagramUrl = excluded.architectureDiagramUrl,
        updatedAt            = CURRENT_TIMESTAMP
    `);
    const projectsData = readJson<ProjectSeedItem[]>('projects.json');
    for (const item of projectsData) {
      const result = insertProj.run({
        ...item,
        category: item.category || 'web',
        coverImage: item.coverImage ?? null,
        architectureDiagramUrl: item.architectureDiagramUrl ?? null,
        repoUrl: item.repoUrl ?? null,
        liveUrl: item.liveUrl ?? null,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        language: item.language || 'es',
      });
      const rowId =
        result.lastInsertRowid !== 0n && result.lastInsertRowid !== BigInt(0)
          ? result.lastInsertRowid
          : (
              db
                .prepare(
                  'SELECT id FROM projects WHERE slug = ? AND language = ?',
                )
                .get(item.slug, item.language || 'es') as
                | { id: number }
                | undefined
            )?.id;
      if (rowId) seedTags('project', rowId, item.techStack);
    }

    // ── 8. Infraestructura ──────────────────────────────────────────────────
    const insertInfra = db.prepare(`
      INSERT INTO infrastructure_posts
        (slug, title, subtitle, category, environment, difficulty, techStack, architectureOverview,
         specs, contentMarkdown, author, tags, language, coverImage, views, likes, featured, orderPriority, publishedAt)
      VALUES
        (@slug, @title, @subtitle, @category, @environment, @difficulty, @techStack, @architectureOverview,
         @specs, @contentMarkdown, @author, @tags, @language, @coverImage, @views, @likes, @featured, @orderPriority, @publishedAt)
      ON CONFLICT(slug, language) DO UPDATE SET
        title                = excluded.title,
        subtitle             = excluded.subtitle,
        category             = excluded.category,
        environment          = excluded.environment,
        difficulty           = excluded.difficulty,
        techStack            = excluded.techStack,
        architectureOverview = excluded.architectureOverview,
        specs                = excluded.specs,
        contentMarkdown      = excluded.contentMarkdown,
        author               = excluded.author,
        tags                 = excluded.tags,
        coverImage           = excluded.coverImage,
        featured             = excluded.featured,
        orderPriority        = excluded.orderPriority,
        updatedAt            = CURRENT_TIMESTAMP
    `);
    const infraData = readJson<InfrastructureSeedItem[]>('infrastructure.json');
    for (const item of infraData) {
      const result = insertInfra.run({
        ...item,
        coverImage: item.coverImage ?? null,
        subtitle: item.subtitle ?? null,
        architectureOverview: item.architectureOverview ?? null,
        specs: item.specs ?? null,
        author: item.author || 'Jorge Doicela',
        tags: item.tags || 'infrastructure,cloud,sysadmin',
        language: item.language || 'es',
        views: item.views || 0,
        likes: item.likes || 0,
        featured: item.featured ? 1 : 0,
        orderPriority: item.orderPriority || 0,
        publishedAt: item.publishedAt ?? null,
      });
      const rawTags = item.tags || item.techStack || 'infrastructure';
      const rowId =
        result.lastInsertRowid !== 0n && result.lastInsertRowid !== BigInt(0)
          ? result.lastInsertRowid
          : (
              db
                .prepare(
                  'SELECT id FROM infrastructure_posts WHERE slug = ? AND language = ?',
                )
                .get(item.slug, item.language || 'es') as
                | { id: number }
                | undefined
            )?.id;
      if (rowId) seedTags('infrastructure', rowId, rawTags);
    }

    // ── 9. Glosario ─────────────────────────────────────────────────────────
    const insertGlossary = db.prepare(`
      INSERT INTO glossary_terms
        (slug, term, aliases, category, shortDefinition, keyDifference, caseSensitive, language, orderPriority)
      VALUES
        (@slug, @term, @aliases, @category, @shortDefinition, @keyDifference, @caseSensitive, @language, @orderPriority)
      ON CONFLICT(term, language) DO UPDATE SET
        slug            = excluded.slug,
        aliases         = excluded.aliases,
        category        = excluded.category,
        shortDefinition = excluded.shortDefinition,
        keyDifference   = excluded.keyDifference,
        caseSensitive   = excluded.caseSensitive,
        orderPriority   = excluded.orderPriority,
        updatedAt       = CURRENT_TIMESTAMP
    `);
    const glossaryData = readJson<GlossarySeedItem[]>('glossary.json');
    for (const item of glossaryData) {
      insertGlossary.run({
        slug: item.slug,
        term: item.term,
        aliases: item.aliases ?? null,
        category: item.category || 'general',
        shortDefinition: item.shortDefinition,
        keyDifference: item.keyDifference ?? null,
        caseSensitive: item.caseSensitive ? 1 : 0,
        language: item.language || 'es',
        orderPriority: item.orderPriority || 0,
      });
    }
  });

  seedTransaction();
  db.close();

  console.log(
    `[SoftwareSeeder] ✅ Reinicio y sembrado completado en ${Date.now() - startTime}ms.`,
  );
}

if (require.main === module) {
  seedSoftware();
}
