/**
 * @typedef {Object} BuildSidebarData
 * @property {Record<import("./docs").Sections, import("../utils/file-tree").FileTree>} fileTree
 */
/**
 * Build and write sidebar
 * @param {BuildSidebarData} data
 */
function buildSidebar(data) {
  const { fileTree } = data;
}

module.exports = buildSidebar;
