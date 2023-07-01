const buildHomepage = require('./homepage');
const buildDocsPage = require('./docs');

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
 */

/**
 * @param {BuilderOptions} options
 */
function builder(options) {
  const { opts, packageJson, files, indexUrl, sections, helper } = options;

  buildHomepage({ opts, packageJson, files, indexUrl });
  buildDocsPage({ sections, helper });
}

module.exports = builder;
