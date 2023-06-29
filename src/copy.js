const fs = require('fs');
const path = require('path');

const chalk = require('chalk');

const { cleanJSDocNextPath } = require('../constants/paths');
const { copyAllFiles, isDir, copyFile, createDir } = require('./utils/file');

function copyStaticFiles(staticFiles) {
  if (staticFiles) {
    const staticPaths = staticFiles.include || staticFiles.paths || [];
    const toFlattenPath = Boolean(staticFiles.toFlattenPath);

    staticPaths.forEach((dirOrFile) => {
      if (!fs.existsSync(dirOrFile)) {
        console.warn(
          chalk.yellow(
            `[Warn]: ${dirOrFile} doesn't exist. Make sure you have entered the correct path.`
          )
        );
        return;
      }

      const outPath = path.join(
        cleanJSDocNextPath,
        'public',
        toFlattenPath ? '' : dirOrFile
      );

      if (isDir(dirOrFile)) {
        createDir(outPath);
        copyAllFiles(dirOrFile, outPath);
      } else {
        if (!toFlattenPath) {
          createDir(path.dirname(outPath));
        }
        copyFile(
          dirOrFile,
          toFlattenPath ? path.join(outPath, path.basename(dirOrFile)) : outPath
        );
      }
    });
  }
}

module.exports = {
  copyStaticFiles,
};
