const { nanoid } = require('nanoid');
const { linkto, linkToTutorial } = require('./helper');

/**
 * @typedef {Object} FileTree
 * @property {string} name
 * @property {string} id
 * @property {string} url
 * @property {Omit<FileTree, 'children'>} children
 *
 */

/**
 * @returns {Record<import('../builder/docs').Sections, FileTree[]>}
 */
function generateFileTreeUsingMembers({ members, helper }) {
  const {
    classes,
    externals,
    globals,
    interfaces,
    mixins,
    modules,
    namespaces,
    tutorials,
  } = members;

  /**
   * @returns {FileTree[]}
   */
  function generateFileTreeForIndividualMember(member, linkFn = linkto) {
    if (!Array.isArray(member)) return [];

    return member.map((item) => {
      if (!item.data) return {};

      const memberTree = {
        name: item.data.name || item.data.longname,
        url: linkFn(helper, item.data.longname),
        id: nanoid(),
        children: [],
      };

      if (item.additional) {
        const additional = [
          ...item.additional.methods,
          ...item.additional.members,
        ];

        additional.map((additionalItem) => {
          const url = linkto(helper, additionalItem.longname);
          memberTree.children.push({
            url,
            name: additionalItem.name || additionalItem.longname,
            id: nanoid(),
          });
        });
      }

      return memberTree;
    });
  }

  return {
    classes: generateFileTreeForIndividualMember(classes),
    externals: generateFileTreeForIndividualMember(externals),
    globals: generateFileTreeForIndividualMember(globals),
    interfaces: generateFileTreeForIndividualMember(interfaces),
    mixins: generateFileTreeForIndividualMember(mixins),
    modules: generateFileTreeForIndividualMember(modules),
    namespaces: generateFileTreeForIndividualMember(namespaces),
    tutorials: generateFileTreeForIndividualMember(tutorials, linkToTutorial),
  };
}

module.exports = {
  generateFileTreeUsingMembers,
};
