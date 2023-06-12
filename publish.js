const {
  createDirectory,
  getAbsolutePathOf,
  copyAllFiles,
} = require('./src/common');

const path = require('path');

const outDir = path.join(__dirname, '.clean-jsdoc-next');
createDirectory(outDir);

const frontierDir = getAbsolutePathOf('frontier');

copyAllFiles(frontierDir, outDir);
