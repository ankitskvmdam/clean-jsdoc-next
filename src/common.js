const fs = require('fs');
const path = require('path');

/**
 * To create a directory. If directory already exists then
 * this function will do nothing.
 *
 * Will return false if there is any error.
 *
 * @param {string} pathname directory name
 * @returns {boolean} true if created successfully
 */
function createDirectory(pathname) {
  try {
    if (!fs.existsSync(pathname)) {
      fs.mkdirSync(pathname);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

/**
 * Copy a file or a directory
 *
 * @param {string} src src file or directory path
 * @param {string} dest destination file or directory path
 */
function copyFileOrDirectory(src, dest) {
  try {
    fs.copyFileSync(src, dest);
  } catch (error) {
    console.error('Failed to copy file', src, dest);
  }
}

/**
 * Copy all the files form source directory to the
 * destination directory
 **Note: src and dest path should be absolute path.
 * @param {string} src src directory
 * @param {string} dest destination directory
 */
function copyAllFiles(src, dest) {
  const files = fs.readdirSync(src);

  for (const file of files) {
    const basename = path.basename(file);
    const from = path.join(src, file);
    const to = path.join(dest, basename);

    const stat = fs.lstatSync(from);

    if (stat.isDirectory()) {
      createDirectory(to);
      copyAllFiles(from, to);
    } else {
      copyFileOrDirectory(from, to);
    }
  }
}

/**
 * To get the absolute path of src, frontier etc
 * @param {'frontier' | 'package'} pathOf name of directory or file which path is required
 * @returns {string} absolute path of the asked file or directory
 */
function getAbsolutePathOf(pathOf) {
  const srcDir = path.join(__dirname, '..');

  switch (pathOf) {
    case 'frontier':
      return path.join(srcDir, 'frontier');
    case 'package':
      return path.join(srcDir, 'package.json');

    default:
      return srcDir;
  }
}

module.exports = {
  createDirectory,
  copyFileOrDirectory,
  copyAllFiles,
  getAbsolutePathOf,
};
