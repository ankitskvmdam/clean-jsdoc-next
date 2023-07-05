const fs = require('fs');

const { writePageData } = require('../utils/file');
const { getImportMap, getImportsString } = require('../utils/imports');

/**
 * @typedef {Object} SourcePageData
 * @property {Object} opts
 * @property {Record<string, string>} sourceFilePaths
 * @property {*} helper
 * @property {string} helper
 */

/**
 * @param {*} data
 * @returns {string}
 */
function getSourcePageString(data) {
  const importMap = getImportMap();
  const imports = [importMap.sourcePage];

  return `
  ${getImportsString(imports)}

  export default function Source() {
    return (
      <SourcePage data={${JSON.stringify(data)}} />
    )
  }
  `;
}

/**
 * Build and write source page data into files
 *
 * @param {SourcePageData} data
 */
function buildSourcePages(data) {
  const { sourceFilePaths, opts, helper } = data;

  for (const filepath in sourceFilePaths) {
    const url = sourceFilePaths[filepath];

    const sourceFileData = fs.readFileSync(filepath, opts.encoding || 'utf8');

    const dataToWrite = getSourcePageString({
      code: sourceFileData,
      title: url.replace('.html'),
      outPath: url,
    });

    writePageData(url, dataToWrite);
  }
}

module.exports = buildSourcePages;
