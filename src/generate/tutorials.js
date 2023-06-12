/**
 * @typedef {Object} ParserDocOptions
 * @property {string} title
 * @property {any} docs
 * @property {string} filename
 * @property {boolean} canResolveLink
 * @property {any} env
 */
/**
 *
 * @param {ParserDocOptions} options
 */
function parseDoc(options = {}) {
  const { title, filename, docs, canResolveLink = true, env } = options;

  const docData = {
    env,
    title,
    docs,
  };

  return docData;
}

module.exports = {
  parseDoc,
};
