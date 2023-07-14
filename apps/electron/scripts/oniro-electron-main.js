const path = require('path');
// Enables the discovery of the VS Code extensions in the embedded `plugins` folder in the final app.
process.env.THEIA_DEFAULT_PLUGINS = `local-dir:${path.resolve(
  __dirname,
  '..',
  'plugins'
)}`;
console.log(`THEIA_DEFAULT_PLUGINS: ${process.env.THEIA_DEFAULT_PLUGINS}`);
require('../lib/backend/electron-main.js');