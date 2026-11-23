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

  const projectsPath = resolveCorpusPath('projects.json');
  const terminalPath = resolveCorpusPath('terminal.json');

  if (!fs.existsSync(projectsPath)) {
    console.error(
      `[PortfolioSeeder] ERROR: Archivo de corpus no encontrado en src ni en dist: ${projectsPath}`,
    );
    db.close();
    return;
  }

  if (!fs.existsSync(terminalPath)) {
    console.error(
      `[PortfolioSeeder] ERROR: Archivo de corpus de terminal no encontrado: ${terminalPath}`,
    );
    db.close();
    return;
  }

  const projects = JSON.parse(
    fs.readFileSync(projectsPath, 'utf-8'),
  ) as PortfolioProjectItem[];
  const terminalProfiles = JSON.parse(
    fs.readFileSync(terminalPath, 'utf-8'),
  ) as TerminalProfileItem[];

  // Recrear tablas de catálogo (proyectos + perfiles de terminal) y preservar mensajes de contacto
  db.exec(`
    DROP TABLE IF EXISTS portfolio_projects;
    DROP TABLE IF EXISTS portfolio_terminal_profiles;

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

  // Sembrar proyectos usando INSERT OR REPLACE
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
  });

  tx();

  console.log(
    `[PortfolioSeeder] OK: ${projects.length} proyectos y ${terminalProfiles.length} perfiles de terminal sembrados con éxito.`,
  );
  db.close();
}

if (require.main === module) {
  seedPortfolio();
}
