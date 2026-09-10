const path = require('path');
const fs = require('fs');

/**
 * Carga y parsea un archivo .env si existe físicamente en el disco.
 * PM2 no soporta la propiedad 'env_file' de forma nativa en su archivo ecosystem,
 * por lo que expandir las variables en el objeto 'env' garantiza que estén
 * disponibles en process.env del proceso Node.js (especialmente para Next.js Standalone).
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const env = {};
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

module.exports = {
  apps: [
    {
      name: 'backend-nest',
      script: './dist/main.js',
      cwd: path.resolve(__dirname, 'backend'),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env: {
        ...loadEnvFile(path.resolve(__dirname, 'backend/.env')),
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '127.0.0.1',
        DATABASE_PORTFOLIO_PATH: './data/portfolio.sqlite',
        DATABASE_BIBLE_PATH: './data/bible.sqlite',
        DATABASE_SOFTWARE_PATH: './data/software.sqlite',
      },
    },
    {
      name: 'frontend-next',
      script: './server.js',
      cwd: path.resolve(__dirname, 'frontend/web/.next/standalone/frontend/web'),
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env: {
        ...loadEnvFile(path.resolve(__dirname, 'frontend/web/.env')),
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: 'localhost',
      },
    },
  ],
};
