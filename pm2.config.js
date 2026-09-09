const path = require('path');

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
      env_file: path.resolve(__dirname, 'backend/.env'),
      env: {
        NODE_ENV: 'production',
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
      env_file: path.resolve(__dirname, 'frontend/web/.env'),
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        HOSTNAME: 'localhost',
      },
    },
  ],
};
