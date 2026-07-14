module.exports = {
  apps: [
    {
      name: 'backend-nest',
      script: './backend/dist/main.js',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'frontend-next',
      script: 'node_modules/next/dist/bin/next',
      args: 'start ./frontend/web -p 3001',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '450M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
