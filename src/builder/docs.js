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
const { getImportMap, getImportsString } = require('../utils/imports');
const {
  hasAnchorElement,
  extractURLFromAnchorElement,
} = require('../utils/link');

function getSectionPageString(section) {
  const importMap = getImportMap();
  const imports = [importMap.docsPage];

  return `
  ${getImportsString(imports)}

  export default function Doc() {
    return <DocsPage data={${JSON.stringify(section)}} />
  }
  `;
}

function attachLinkToParamsType(params, helper) {
  if (!Array.isArray(params)) return;

  for (const param of params) {
    const names = param.type.names ?? [];
    const links = [];

    for (const name of names) {
      let url = helper.linkto(name);

      if (!hasAnchorElement(url)) {
        url = '';
      } else {
        url = extractURLFromAnchorElement(url);
      }

      links.push({ name, url });
    }
    param.type = { names: links };
  }
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

  // writeLinkMap(helper);

  const { globals, tutorials, ...otherSections } = sections;

  Object.values(otherSections).forEach((section) =>
    section.forEach((data) => {
      attachLinkToParamsType(data.data.params, helper);
      const dataToWrite = getSectionPageString(data);
      const url = helper.longnameToUrl[data.data.longname];
      writePageData(url, dataToWrite);
    })
  );
}

module.exports = buildDocsPage;
