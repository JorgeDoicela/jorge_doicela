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

export function seedPortfolio(
  dbPath: string = resolveDatabasePath(
    'DATABASE_PORTFOLIO_PATH',
    'portfolio.sqlite',
  ),
): void {
  console.log(`[PortfolioSeeder] 🚀 Sembrando base de datos: ${dbPath}...`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const corpusDir = path.resolve(__dirname, '../corpus');
  let projectsPath = path.join(corpusDir, 'projects.json');

  if (!fs.existsSync(projectsPath)) {
    const srcPath = path.resolve(
      __dirname,
      '../../../src/portfolio/corpus/projects.json',
    );
    if (fs.existsSync(srcPath)) {
      projectsPath = srcPath;
    } else {
      console.error(
        `[PortfolioSeeder] ❌ Archivo de corpus no encontrado en dist ni en src: ${projectsPath}`,
      );
      return;
    }
  }

  const rawProjects = fs.readFileSync(projectsPath, 'utf-8');
  const projects = JSON.parse(rawProjects) as PortfolioProjectItem[];

  // Recrear tabla de proyectos (catálogo puro) y preservar tabla de mensajes
  db.exec(`
    DROP TABLE IF EXISTS portfolio_projects;

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

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      read INTEGER NOT NULL DEFAULT 0
    );
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
  });

  tx();

  console.log(
    `[PortfolioSeeder] ✅ ${projects.length} proyectos sembrados con éxito.`,
  );
  db.close();
}

if (require.main === module) {
  seedPortfolio();
}
