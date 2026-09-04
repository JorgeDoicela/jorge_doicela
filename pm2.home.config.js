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
      env_file: './backend/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        SANDBOX_MODE: 'tunnel',
        SANDBOX_MAX_SESSIONS: '5',
        DATABASE_PORTFOLIO_PATH: './data/portfolio.sqlite',
        DATABASE_BIBLE_PATH: './data/bible.sqlite',
        DATABASE_SOFTWARE_PATH: './data/software.sqlite',
      },
    },
  ],
};
