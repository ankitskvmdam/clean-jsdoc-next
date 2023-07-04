/**
 * @typedef {Object} Sections
 * @property {Array<Object>} classes
 * @property {Array<Object>} namespaces
 * @property {Array<Object>} externals
 * @property {Array<Object>} modules
 * @property {Array<Object>} interfaces
 * @property {Array<Object>} mixins
 * @property {*} globals
 * @property {*} tutorials
 *
 */

const { writePageData } = require('../utils/file');
const { attachLinkToParamsType } = require('../utils/helper');
const { stringifyData } = require('../utils/html');
const { getImportMap, getImportsString } = require('../utils/imports');

function getSectionPageString(section, helper) {
  const importMap = getImportMap();
  const imports = [importMap.link, importMap.docsPage];

  return `
  ${getImportsString(imports)}

  export default function Doc() {
    return <DocsPage data={${stringifyData(section, helper)}} />
  }
  `;
}

/**
 * @typedef {Object} BuildDocsData
 * @property {Sections} sections
 * @property {Object} helper
 */

/**
 * Build all pages for all sections.
 * @param {BuildDocsData} data
 */
function buildDocsPage(data) {
  const { sections, helper } = data;

  if (typeof sections !== 'object' || typeof helper !== 'object') return;

  const { globals, tutorials, ...otherSections } = sections;

  Object.values(otherSections).forEach((section) => {
    section.forEach((data) => {
      attachLinkToParamsType(data.data.params, helper);
      const dataToWrite = getSectionPageString(data, helper);
      const url = helper.longnameToUrl[data.data.longname];
      writePageData(url, dataToWrite);
    });
  });
}

module.exports = buildDocsPage;
