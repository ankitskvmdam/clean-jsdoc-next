const chokidar = require('chokidar');
const path = require('path');
const {
  copyAllFiles,
  copyFile,
  createDir,
  removeDir,
} = require('./src/utils/file');

const dest = path.join('.', '.clean-jsdoc-theme');

// removing directory before creating.
removeDir(dest);

// Creating directory
createDir(dest);

chokidar.watch('./frontier/**').on('all', (event, actualPath) => {
  const pathname = actualPath.replace(/frontier\//, '');
  switch (event) {
    case 'change':
    case 'add':
      copyFile(actualPath, path.join(dest, pathname));
      break;
    case 'unlink':
      break;
    case 'addDir':
      createDir(path.join(dest, pathname));
      break;
    case 'unlinkDir':
      removeDir(path.join(dest, pathname));
      break;
  }
});
