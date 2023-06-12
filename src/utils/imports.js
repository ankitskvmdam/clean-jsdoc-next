/**
 * @typedef {Object} ImportObject
 * @property {string} import
 * @property {string} [from]
 */

function getImportMap() {
  return {
    react: {
      import: 'React',
      from: 'react',
    },
    nextImage: {
      import: 'Image',
      from: 'next/image',
    },
    inter: {
      import: '{ Inter }',
      from: 'next/font/google',
    },
    readmePage: {
      import: 'ReadmePage',
      from: '@/components/page/readme',
    },
  };
}

/**
 * Get import string using import obj.
 * @param {ImportObject} importObj
 */
function getImportString(importObj) {
  const i = `import ${importObj.import}`;

  if (!importObj.from) {
    return `${i};`;
  }

  return `${i} from '${importObj.from}';`;
}

/**
 *
 * @param {ImportObject[]} arr
 */
function getImportsString(arr) {
  const imports = [];
  for (const i of arr) {
    imports.push(getImportString(i));
  }

  return imports.join('\n');
}

module.exports = {
  getImportMap,
  getImportString,
  getImportsString,
};
