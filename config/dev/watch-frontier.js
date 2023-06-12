const path = require('path');

const chokidar = require('chokidar');
const chalk = require('chalk');

const {
  copyFile,
  createDir,
  removeDir,
  removeFile,
} = require('../src/utils/file');

const dest = path.join('.', '.clean-jsdoc-next');

// removing directory before creating.
removeDir(dest);

// Creating directory
createDir(dest);

chokidar.watch('./frontier/**').on('all', (event, actualPath) => {
  const pathname = actualPath.replace(/frontier/, '');
  const destPath = path.join(dest, pathname);
  switch (event) {
    case 'change':
    case 'add':
      copyFile(actualPath, destPath);
      break;
    case 'unlink':
      removeFile(destPath);
      break;
    case 'addDir':
      createDir(destPath);
      break;
    case 'unlinkDir':
      removeDir(destPath);
      break;
  }

  console.log(chalk.green(`[${event}]: ${destPath}`));
});
