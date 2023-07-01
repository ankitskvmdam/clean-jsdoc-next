/**
 * @typedef {Object} GenerateDoc
 * @property {any} data
 */
/**
 * @typedef {Object} GenerateOptions
 * @property {'readme' | 'sources' | 'tutorials' | 'docs'} type
 * @property {string} pageTitle
 * @property {string} filename output file name.
 * @property {boolean} isNeededToResolveLinks if true then link it will turn {@link foo} into <a href="foodoc.html">foo</a>
 * @property {boolean} [canOutputSourceFiles] if true then it will output source files.
 * @property {GenerateDoc[]} docs
 * @property {string} dest destination root directory
 * @property {any} env
 * @property {any} helper
 */

const { writePageData } = require('../utils/file');
const { getReadmePageJSX } = require('../utils/page-builder');
const buildHomepage = require('./homepage');

/**
 * @param {GenerateOptions} options
 */
function generateReadmePage(options) {
  const { docs, filename, dest } = options;

  const pageJsx = getReadmePageJSX(docs[0].data);

  writePageData(dest, filename, pageJsx);
}

/**
 * @param {GenerateOptions} options
 */

/**
 * @typedef {Object} BuilderOptions
 * @property {Array<any>} sections
 * @property {boolean} canOutputSourceFiles
 * @property {Object} helper
 * @property {any} data
 * @property {Object} themeConfig
 * @property {Object} config
 * @property {Object} opts
 * @property {string} dest
 * @property {Array<Object>} packageJson
 * @property {Array<string>} files
 * @property {string} globalUrl
 * @property {string} indexUrl
 * @property {Object} env
 */

/**
 * @param {BuilderOptions} options
 */
function builder(options) {
  const { opts, packageJson, files, indexUrl } = options;

  buildHomepage({ opts, packageJson, files, indexUrl });
}

module.exports = builder;
