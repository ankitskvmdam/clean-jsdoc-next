/**
 * @typedef {Object} HomepageData
 * @property {Object} opts
 * @property {Array<Object>} packageJson
 * @property {Array<string>} files
 * @property {string} indexUrl
 */

const { writePageData } = require('../utils/file');
const { getImportMap, getImportsString } = require('../utils/imports');

/**
 * @param {string} htmlString
 * @returns {string}
 */
function getHomePageString(htmlString) {
  const importMap = getImportMap();
  const imports = [importMap.htmlPage];

  return `
  ${getImportsString(imports)}

  export default function Homepage() {
    return <HTMLPage htmlString={\`${htmlString}\`} />
  }
  `;
}

/**
 * Process readme.md package.json and opts data to build homepage.
 * It will also write the homepage.
 *
 * @param {HomepageData} data
 */
function buildHomepage(data) {
  const { opts, indexUrl } = data;
  const dataToWrite = getHomePageString(opts.readme);

  writePageData(indexUrl, dataToWrite);
}

module.exports = buildHomepage;
