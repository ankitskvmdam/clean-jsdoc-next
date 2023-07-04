const fs = require('fs');
const path = require('path');

const chalk = require('chalk');

const { cleanJSDocNextPath } = require('../../constants/paths');

/**
 * To delete/remove directory. It will also delete the directory
 * if the directory is not empty.
 *
 * @param {string} pathname path of the directory to delete
 */
function removeDir(pathname) {
  try {
    fs.rmSync(pathname, { recursive: true, force: true });
  } catch (error) {
    console.error(chalk.red('Failed to delete directory'), error);
  }
}

function removeFile(pathname) {
  try {
    fs.rmSync(pathname);
  } catch (error) {
    console.error(chalk.red('Failed to remove file', pathname));
  }
}

/**
 * To create a directory. If directory already exists then
 * this function will do nothing.
 *
 * Will return false if there is any error.
 *
 * @param {string} pathname directory name
 * @returns {boolean} true if created successfully
 */
function createDir(pathname) {
  try {
    if (!fs.existsSync(pathname)) {
      fs.mkdirSync(pathname, { recursive: true });
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
 * @param {string} src src file path
 * @param {string} dest destination file path
 */
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
  } catch (error) {
    console.error('Failed to copy file', src, dest);
  }
}

/**
 * To check whether the path is directory or a file.
 *
 * @param {string} src path of the file
 * @returns {boolean} True if the path is a directory
 */
function isDir(src) {
  try {
    return fs.lstatSync(src).isDirectory();
  } catch (e) {
    return false;
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

    if (isDir(from)) {
      createDir(to);
      copyAllFiles(from, to);
    } else {
      copyFile(from, to);
    }
  }
}

/**
 * To get the absolute path of src, frontier etc
 * @param {'frontier' | 'package'} pathOf name of directory or file which path is required
 * @returns {string} absolute path of the asked file or directory
 */
function getAbsolutePathOf(pathOf) {
  const rootDir = path.join(__dirname, '..', '..');

  switch (pathOf) {
    case 'frontier':
      return path.join(rootDir, 'frontier');
    case 'package':
      return path.join(rootDir, 'package.json');

    default:
      return rootDir;
  }
}

/**
 * @param {string} pathname path/url of the file
 * @returns {string} Returns the name of the file without extension
 */
function getFilenameWithoutExtension(pathname) {
  return path.basename(pathname).replace(path.extname(pathname), '');
}

/**
 * To write data into file.
 * @param {string} dest destination/output path of the file
 * @param {string} data data/string to write
 */
function writeDataIntoFile(dest, data) {
  try {
    fs.writeFileSync(dest, data);
  } catch (error) {
    console.error(chalk.red('[Error:] Failed to write data at', dest, error));
  }
}

/**
 * To write page (Next.js Page) data
 * @param {string} url expected url of the data
 * @param {string} data data to write
 * @param {string} root default is .clean-jsdoc-next/app path
 */
function writePageData(url, data, root) {
  root = root ? root : path.join(cleanJSDocNextPath, 'app');

  const basename = getFilenameWithoutExtension(url);

  console.log('Basname', basename, 'url', url);

  let pathname = root;

  if (basename !== 'index' && basename !== '/') {
    pathname = path.join(pathname, basename);
    createDir(pathname);
  }

  pathname = path.join(pathname, 'page.jsx');

  writeDataIntoFile(pathname, data);
}

module.exports = {
  createDir,
  copyFile,
  isDir,
  removeFile,
  copyAllFiles,
  getAbsolutePathOf,
  removeDir,
  writeDataIntoFile,
  writePageData,
  getFilenameWithoutExtension,
};
