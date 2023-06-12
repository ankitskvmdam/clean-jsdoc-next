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

/**
 * @param {GenerateOptions} options
 */
function generateReadmePage(options) {
  const { docs, filename, dest } = options;

  const pageJsx = getReadmePageJSX(docs[0].data);

  console.log('Dest', docs);

  writePageData(dest, filename, pageJsx);
}

/**
 * @param {GenerateOptions} options
 */
function generate(options) {
  const { type } = options;

  switch (type) {
    case 'readme':
      generateReadmePage(options);
      break;
  }
}

module.exports = {
  generate,
};
