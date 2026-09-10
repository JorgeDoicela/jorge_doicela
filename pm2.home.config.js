const path = require('path');
const fs = require('fs');

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
      name: 'portfolio-sandbox-home',
      script: './dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        SANDBOX_MODE: 'tunnel',
        SANDBOX_MAX_SESSIONS: '5',
        DATABASE_PORTFOLIO_PATH: './data/portfolio.sqlite',
        DATABASE_BIBLE_PATH: './data/bible.sqlite',
        DATABASE_SOFTWARE_PATH: './data/software.sqlite',
        ...loadEnvFile(path.resolve(__dirname, 'backend/.env')),
      },
    },
  ],
};
