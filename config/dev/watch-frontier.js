const path = require('path');

const chokidar = require('chokidar');
const chalk = require('chalk');

const {
  copyFile,
  createDir,
  removeDir,
  removeFile,
} = require('../../src/utils/file');
const { cleanJSDocNextPath } = require('../../constants/paths');

// removing directory before creating.
removeDir(cleanJSDocNextPath);

// Creating directory
createDir(cleanJSDocNextPath);

chokidar.watch('./frontier/**').on('all', (event, actualPath) => {
  const pathname = actualPath.replace(/frontier/, '');
  const destPath = path.join(cleanJSDocNextPath, pathname);
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
