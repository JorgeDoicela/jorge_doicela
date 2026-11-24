import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

import { resolveDatabasePath } from '../../common/database/database-path.util';

interface PortfolioProjectItem {
  id: number;
  slug: string;
  title: string;
  description: string;
  role: string;
  technologies: string[];
  language: string;
  repoUrl: string;
  demoUrl: string;
  featured: boolean;
  overview?: string;
  challenge?: string;
  architectureHighlights?: string[];
  metrics?: { label: string; value: string }[];
}

interface TerminalProfileItem {
  language: string;
  banner: string[];
  help: string[];
  tmux: string[];
  about: string[];
  skills: string[];
  contact: string[];
  files: Record<string, string[]>;
  manuals: Record<string, string[]>;
  messages: Record<string, string>;
}

interface PortfolioExperienceItem {
  id: number;
  slug: string;
  language: string;
  type: 'work' | 'education' | 'certification';
  title: string;
  subtitle: string;
  period?: string | null;
  companyUrl?: string | null;
  description: string;
  highlights?: string[];
  technologies?: string[];
  featured: boolean;
  orderIndex: number;
}

interface PortfolioProfileItem {
  language: string;
  fullName: string;
  headline: string;
  location: string;
  email: string;
  availability: string;
  bio: string[];
  extendedBio: string[];
  philosophyQuote: string;
  philosophyVerse: string;
  pillars: { title: string; description: string }[];
  focusAreas: { title: string; description: string }[];
}

interface PortfolioStackCorpusItem {
  id: number;
  slug: string;
  language: string;
  category: string;
  name: string;
  level?: string;
  summary?: string;
  featured: boolean;
  orderIndex: number;
}

interface PortfolioEngineeringCorpusItem {
  id: number;
  slug: string;
  language: string;
  domain: string;
  title: string;
  badge?: string;
  summary: string;
  details?: string[];
  metrics?: { label: string; value: string }[];
  technologies?: string[];
  featured: boolean;
  orderIndex: number;
}

export function seedPortfolio(
  dbPath: string = resolveDatabasePath(
    'DATABASE_PORTFOLIO_PATH',
    'portfolio.sqlite',
  ),
): void {
  console.log(`[PortfolioSeeder] Sembrando base de datos: ${dbPath}...`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const resolveCorpusPath = (filename: string): string => {
    const srcPath = path.resolve(
      __dirname,
      `../../../src/portfolio/corpus/${filename}`,
    );
    const distPath = path.resolve(__dirname, `../corpus/${filename}`);
    return fs.existsSync(srcPath) ? srcPath : distPath;
  };

  const loadJson = <T>(filename: string): T => {
    const filePath = resolveCorpusPath(filename);
    if (!fs.existsSync(filePath)) {
      db.close();
      throw new Error(
        `[PortfolioSeeder] Archivo de corpus no encontrado: ${filePath}`,
      );
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  };

  const projects = loadJson<PortfolioProjectItem[]>('projects.json');
  const terminalProfiles = loadJson<TerminalProfileItem[]>('terminal.json');
  const experiences = loadJson<PortfolioExperienceItem[]>('experience.json');
  const profiles = loadJson<PortfolioProfileItem[]>('profile.json');
  const stackItems = loadJson<PortfolioStackCorpusItem[]>('stack.json');
  const engineeringPillars =
    loadJson<PortfolioEngineeringCorpusItem[]>('engineering.json');

  // Recrear tablas de catálogo preservando contact_messages (PII / mensajes reales)
  db.exec(`
    DROP TABLE IF EXISTS portfolio_projects;
    DROP TABLE IF EXISTS portfolio_terminal_profiles;
    DROP TABLE IF EXISTS portfolio_experiences;
    DROP TABLE IF EXISTS portfolio_profiles;
    DROP TABLE IF EXISTS portfolio_stack_items;
    DROP TABLE IF EXISTS portfolio_engineering_pillars;

    CREATE TABLE portfolio_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      role TEXT NOT NULL,
      technologies TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      repoUrl TEXT,
      demoUrl TEXT,
      featured INTEGER NOT NULL DEFAULT 1,
      overview TEXT,
      challenge TEXT,
      architectureHighlights TEXT,
      metrics TEXT,
      orderIndex INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_project_slug_lang ON portfolio_projects (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_portfolio_project_lang_order ON portfolio_projects (language, orderIndex);

    CREATE TABLE portfolio_terminal_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      language TEXT NOT NULL UNIQUE,
      banner TEXT NOT NULL,
      help TEXT NOT NULL,
      tmux TEXT NOT NULL,
      about TEXT NOT NULL,
      skills TEXT NOT NULL,
      contact TEXT NOT NULL,
      files TEXT NOT NULL,
      manuals TEXT NOT NULL,
      messages TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_terminal_lang ON portfolio_terminal_profiles (language);

    CREATE TABLE portfolio_experiences (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      type TEXT NOT NULL DEFAULT 'work',
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      period TEXT,
      companyUrl TEXT,
      description TEXT NOT NULL,
      highlights TEXT,
      technologies TEXT,
      featured INTEGER NOT NULL DEFAULT 1,
      orderIndex INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_experience_slug_lang ON portfolio_experiences (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_portfolio_experience_lang_type_order ON portfolio_experiences (language, type, orderIndex);

    CREATE TABLE portfolio_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      language TEXT NOT NULL UNIQUE,
      fullName TEXT NOT NULL,
      headline TEXT NOT NULL,
      location TEXT NOT NULL,
      email TEXT NOT NULL,
      availability TEXT NOT NULL,
      bio TEXT NOT NULL,
      extendedBio TEXT NOT NULL,
      philosophyQuote TEXT NOT NULL,
      philosophyVerse TEXT NOT NULL,
      pillars TEXT NOT NULL,
      focusAreas TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_profile_lang ON portfolio_profiles (language);

    CREATE TABLE portfolio_stack_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      level TEXT,
      summary TEXT,
      featured INTEGER NOT NULL DEFAULT 1,
      orderIndex INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_stack_slug_lang ON portfolio_stack_items (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_portfolio_stack_lang_cat_order ON portfolio_stack_items (language, category, orderIndex);

    CREATE TABLE portfolio_engineering_pillars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      domain TEXT NOT NULL,
      title TEXT NOT NULL,
      badge TEXT,
      summary TEXT NOT NULL,
      details TEXT,
      metrics TEXT,
      technologies TEXT,
      featured INTEGER NOT NULL DEFAULT 1,
      orderIndex INTEGER NOT NULL DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE UNIQUE INDEX IF NOT EXISTS IDX_portfolio_eng_slug_lang ON portfolio_engineering_pillars (slug, language);
    CREATE INDEX IF NOT EXISTS IDX_portfolio_eng_lang_dom_order ON portfolio_engineering_pillars (language, domain, orderIndex);

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT 'Consulta de Portafolio',
      message TEXT NOT NULL,
      phone TEXT,
      serviceType TEXT,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS IDX_contact_messages_created_at ON contact_messages (createdAt);
  `);

  const insertProject = db.prepare(`
    INSERT OR REPLACE INTO portfolio_projects (
      id, slug, title, description, role, technologies, language, repoUrl, demoUrl, featured,
      overview, challenge, architectureHighlights, metrics, orderIndex
    ) VALUES (
      @id, @slug, @title, @description, @role, @technologies, @language, @repoUrl, @demoUrl, @featured,
      @overview, @challenge, @architectureHighlights, @metrics, @orderIndex
    )
  `);

  const insertTerminalProfile = db.prepare(`
    INSERT OR REPLACE INTO portfolio_terminal_profiles (
      language, banner, help, tmux, about, skills, contact, files, manuals, messages
    ) VALUES (
      @language, @banner, @help, @tmux, @about, @skills, @contact, @files, @manuals, @messages
    )
  `);

  const insertExperience = db.prepare(`
    INSERT OR REPLACE INTO portfolio_experiences (
      id, slug, language, type, title, subtitle, period, companyUrl,
      description, highlights, technologies, featured, orderIndex
    ) VALUES (
      @id, @slug, @language, @type, @title, @subtitle, @period, @companyUrl,
      @description, @highlights, @technologies, @featured, @orderIndex
    )
  `);

  const insertProfile = db.prepare(`
    INSERT OR REPLACE INTO portfolio_profiles (
      language, fullName, headline, location, email, availability,
      bio, extendedBio, philosophyQuote, philosophyVerse, pillars, focusAreas
    ) VALUES (
      @language, @fullName, @headline, @location, @email, @availability,
      @bio, @extendedBio, @philosophyQuote, @philosophyVerse, @pillars, @focusAreas
    )
  `);

  const insertStack = db.prepare(`
    INSERT OR REPLACE INTO portfolio_stack_items (
      id, slug, language, category, name, level, summary, featured, orderIndex
    ) VALUES (
      @id, @slug, @language, @category, @name, @level, @summary, @featured, @orderIndex
    )
  `);

  const insertEngineering = db.prepare(`
    INSERT OR REPLACE INTO portfolio_engineering_pillars (
      id, slug, language, domain, title, badge, summary, details, metrics, technologies, featured, orderIndex
    ) VALUES (
      @id, @slug, @language, @domain, @title, @badge, @summary, @details, @metrics, @technologies, @featured, @orderIndex
    )
  `);

  const tx = db.transaction(() => {
    for (let idx = 0; idx < projects.length; idx++) {
      const p = projects[idx];
      insertProject.run({
        id: p.id,
        slug: p.slug,
        title: p.title,
        description: p.description,
        role: p.role,
        technologies: JSON.stringify(p.technologies),
        language: p.language || 'es',
        repoUrl: p.repoUrl || null,
        demoUrl: p.demoUrl || null,
        featured: p.featured ? 1 : 0,
        overview: p.overview || null,
        challenge: p.challenge || null,
        architectureHighlights: p.architectureHighlights
          ? JSON.stringify(p.architectureHighlights)
          : null,
        metrics: p.metrics ? JSON.stringify(p.metrics) : null,
        orderIndex: idx,
      });
    }

    for (const profile of terminalProfiles) {
      insertTerminalProfile.run({
        language: profile.language,
        banner: JSON.stringify(profile.banner),
        help: JSON.stringify(profile.help),
        tmux: JSON.stringify(profile.tmux),
        about: JSON.stringify(profile.about),
        skills: JSON.stringify(profile.skills),
        contact: JSON.stringify(profile.contact),
        files: JSON.stringify(profile.files),
        manuals: JSON.stringify(profile.manuals),
        messages: JSON.stringify(profile.messages),
      });
    }

    for (const exp of experiences) {
      insertExperience.run({
        id: exp.id,
        slug: exp.slug,
        language: exp.language || 'es',
        type: exp.type || 'work',
        title: exp.title,
        subtitle: exp.subtitle,
        period: exp.period || null,
        companyUrl: exp.companyUrl || null,
        description: exp.description,
        highlights: exp.highlights ? JSON.stringify(exp.highlights) : null,
        technologies: exp.technologies
          ? JSON.stringify(exp.technologies)
          : null,
        featured: exp.featured ? 1 : 0,
        orderIndex: exp.orderIndex ?? 0,
      });
    }

    for (const prof of profiles) {
      insertProfile.run({
        language: prof.language,
        fullName: prof.fullName,
        headline: prof.headline,
        location: prof.location,
        email: prof.email,
        availability: prof.availability,
        bio: JSON.stringify(prof.bio),
        extendedBio: JSON.stringify(prof.extendedBio),
        philosophyQuote: prof.philosophyQuote,
        philosophyVerse: prof.philosophyVerse,
        pillars: JSON.stringify(prof.pillars),
        focusAreas: JSON.stringify(prof.focusAreas),
      });
    }

    for (const item of stackItems) {
      insertStack.run({
        id: item.id,
        slug: item.slug,
        language: item.language || 'es',
        category: item.category,
        name: item.name,
        level: item.level || null,
        summary: item.summary || null,
        featured: item.featured ? 1 : 0,
        orderIndex: item.orderIndex ?? 0,
      });
    }

    for (const pillar of engineeringPillars) {
      insertEngineering.run({
        id: pillar.id,
        slug: pillar.slug,
        language: pillar.language || 'es',
        domain: pillar.domain,
        title: pillar.title,
        badge: pillar.badge || null,
        summary: pillar.summary,
        details: pillar.details ? JSON.stringify(pillar.details) : null,
        metrics: pillar.metrics ? JSON.stringify(pillar.metrics) : null,
        technologies: pillar.technologies
          ? JSON.stringify(pillar.technologies)
          : null,
        featured: pillar.featured ? 1 : 0,
        orderIndex: pillar.orderIndex ?? 0,
      });
    }
  });

  tx();

  console.log(
    `[PortfolioSeeder] OK: ${projects.length} proyectos, ${experiences.length} experiencias, ${profiles.length} perfiles, ${stackItems.length} tecnologías, ${engineeringPillars.length} pilares de ingeniería y ${terminalProfiles.length} perfiles de terminal sembrados con éxito.`,
  );
  db.close();
}

if (require.main === module) {
  seedPortfolio();
}
