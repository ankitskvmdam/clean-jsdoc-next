const buildHomepage = require('./homepage');
const buildDocsPage = require('./docs');
const buildSourcePages = require('./source');

/**
 * @typedef {Object} BuilderOptions
 * @property {import('./docs').Sections} sections
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
 * @property {Record<string, string>} sourceFilePaths
 */

/**
 * @param {BuilderOptions} options
 */
function builder(options) {
  const {
    opts,
    packageJson,
    files,
    indexUrl,
    sections,
    helper,
    sourceFilePaths,
    canOutputSourceFiles,
  } = options;

  if (canOutputSourceFiles) {
    buildSourcePages({
      helper,
      sourceFilePaths,
      opts,
    });
  }

  buildHomepage({ opts, packageJson, files, indexUrl });
  buildDocsPage({ sections, helper });
}

module.exports = builder;
