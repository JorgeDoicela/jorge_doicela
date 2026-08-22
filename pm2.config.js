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
      env: {
        NODE_ENV: 'production',
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
