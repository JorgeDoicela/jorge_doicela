const path = require('path');

module.exports = {
  'frontend/web/src/app/**/*.{ts,tsx}': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative('frontend/web', file));
    return `pnpm --filter web exec eslint --fix ${relativeFiles.join(' ')}`;
  },
  'backend/src/**/*.ts': (filenames) => {
    const relativeFiles = filenames.map((file) => path.relative('backend', file));
    return `pnpm --filter backend exec eslint --fix ${relativeFiles.join(' ')}`;
  },
};
