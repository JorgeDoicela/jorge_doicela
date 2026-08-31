module.exports = {
  apps: [
    {
      name: 'backend-nest',
      script: './dist/main.js',
      cwd: './backend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env_file: './backend/.env',
      env: {
        NODE_ENV: 'production',
        DATABASE_PORTFOLIO_PATH: './data/portfolio.sqlite',
        DATABASE_BIBLE_PATH: './data/bible.sqlite',
        DATABASE_SOFTWARE_PATH: './data/software.sqlite',
      },
    },
    {
      name: 'frontend-next',
      script: './server.js',
      cwd: './frontend/web/.next/standalone/frontend/web',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
};
