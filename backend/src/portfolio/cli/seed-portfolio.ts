import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

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
}

export function seedPortfolio(
  dbPath: string = process.env.DATABASE_PORTFOLIO_PATH || 'portfolio.sqlite',
): void {
  console.log(`[PortfolioSeeder] 🚀 Sembrando base de datos: ${dbPath}...`);

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  const corpusDir = path.resolve(__dirname, '../corpus');
  const projectsPath = path.join(corpusDir, 'projects.json');

  if (!fs.existsSync(projectsPath)) {
    console.error(
      `[PortfolioSeeder] ❌ Archivo de corpus no encontrado: ${projectsPath}`,
    );
    return;
  }

  const rawProjects = fs.readFileSync(projectsPath, 'utf-8');
  const projects = JSON.parse(rawProjects) as PortfolioProjectItem[];

  // Crear tablas si no existen
  db.exec(`
    CREATE TABLE IF NOT EXISTS portfolio_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      role TEXT NOT NULL,
      technologies TEXT NOT NULL,
      language TEXT NOT NULL DEFAULT 'es',
      repoUrl TEXT,
      demoUrl TEXT,
      featured INTEGER NOT NULL DEFAULT 1
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
      id, slug, title, description, role, technologies, language, repoUrl, demoUrl, featured
    ) VALUES (
      @id, @slug, @title, @description, @role, @technologies, @language, @repoUrl, @demoUrl, @featured
    )
  `);

  const tx = db.transaction(() => {
    for (const p of projects) {
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
