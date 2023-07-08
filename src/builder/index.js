const buildHomepage = require('./homepage');
const buildDocsPage = require('./docs');
const buildSourcePages = require('./source');
const buildSidebar = require('./sidebar');

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
 * @property {Record<keyof import('./docs').Sections, any>} fileTree
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
    fileTree,
  } = options;

  if (canOutputSourceFiles) {
    buildSourcePages({
      helper,
      sourceFilePaths,
      opts,
    });
  }

  buildSidebar({ fileTree });
  buildHomepage({ opts, packageJson, files, indexUrl });
  buildDocsPage({ sections, helper });
}

module.exports = builder;
