module.exports = {
  apps: [
    {
      name: 'backend-nestjs',
      cwd: './backend',
      script: 'dist/main.js',
      max_memory_restart: '150M',
      env: {
        PORT: 3000,
        NODE_ENV: 'production',
      },
    },
    {
      name: 'frontend-nextjs',
      cwd: './frontend/web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3001',
      max_memory_restart: '200M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
