/**
 * @typedef {Object} Tutorial
 * @property {string} longname
 * @property {string} name
 * @property {string} title
 * @property {string} content
 * @property {string} type
 * @property {string} children
 * @property {function} parse parse tutorial content.
 */
/**
 * @param {Tutorial} tutorial
 * @param {Object} helper
 */
function buildTutorial(tutorial, helper) {
  if (typeof tutorial !== 'object') return;

  const title = tutorial.title;
  const header = tutorial.title;
  const content = helper.resolveLinks(tutorial.parse());
  const children = tutorial.children;

  const url = helper.tutorialToUrl(tutorial.name).replace('.html', '');
  writeDataIntoFile;
}

/**
 * @typedef {Object} BuildTutorialsData
 * @property {import("./docs").Sections} sections
 * @property {helper} helper
 */

/**
 * Build all tutorial pages.
 * @param {BuildTutorialsData} data
 */
function buildTutorials(data) {
  const { sections, helper } = data;

  if (typeof sections !== 'object' || typeof helper !== 'object') return;

  const { tutorials } = sections;

  if (!Array.isArray(tutorials) || tutorials.length === 0) return;

  tutorials.forEach((tutorial) => buildTutorial(tutorial.data, helper));
}

module.exports = buildTutorials;
