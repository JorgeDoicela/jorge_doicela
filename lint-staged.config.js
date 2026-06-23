const path = require('path');

module.exports = {
  'apps/**/*.{ts,tsx}': (filenames) => {
    const filesByApp = {};
    filenames.forEach((file) => {
      const relative = path.relative(process.cwd(), file);
      const parts = relative.split(path.sep);
      if (parts.length >= 2 && parts[0] === 'apps') {
        const app = parts[1];
        const appDir = path.join('apps', app);
        if (!filesByApp[appDir]) {
          filesByApp[appDir] = [];
        }
        const fileInApp = path.relative(appDir, file);
        filesByApp[appDir].push(fileInApp);
      }
    });

    return Object.entries(filesByApp).map(([appDir, files]) => {
      const appName = appDir.split(path.sep)[1];
      return `pnpm --filter ${appName} exec eslint --fix ${files.join(' ')}`;
    });
  },
  'backend/src/**/*.ts': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative('backend', file));
    return `pnpm --filter backend exec eslint --fix ${relativeFiles.join(' ')}`;
  },
};
