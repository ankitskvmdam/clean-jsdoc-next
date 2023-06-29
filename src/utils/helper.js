const path = require('jsdoc/path');
const showdown = require('showdown');
const { taffy } = require('@jsdoc/salty');

const mdToHTMLConverter = new showdown.Converter();

function getPathFromDoclet({ meta }) {
  if (!meta) {
    return null;
  }

  return meta.path && meta.path !== 'null'
    ? path.join(meta.path, meta.filename)
    : meta.filename;
}

function hashToLink(doclet, hash, dependencies, helper) {
  let url;

  if (!/^(#.+)/.test(hash)) {
    return hash;
  }

  url = helper.createLink(doclet, dependencies);
  url = url.replace(/(#.+|$)/, hash);

  return `<a href="${url}">${hash}</a>`;
}

/**
 * Currently for some reason yields markdown is
 * not processed by jsdoc. So, we are processing it here
 *
 * @param {Array<{type: string, description: string}>} yields
 */
function getProcessedYield(yields) {
  if (!Array.isArray(yields)) return [];

  return yields.map((y) => ({
    ...y,
    description: mdToHTMLConverter.makeHtml(y.description),
  }));
}

function shortenPaths(files, commonPrefix) {
  Object.keys(files).forEach(function (file) {
    files[file].shortened = files[file].resolved
      .replace(commonPrefix, '')
      // always use forward slashes
      .replace(/\\/g, '/');
  });

  return files;
}

// JSDoc helpers
function buildItemTypeStrings(item, helper) {
  const types = [];

  if (item && item.type && item.type.names) {
    item.type.names.forEach(function (name) {
      types.push(helper.linkto(name, helper.htmlsafe(name)));
    });
  }

  return types;
}

function buildAttribsString(attribs, helper) {
  let attribsString = '';

  if (attribs && attribs.length) {
    attribsString = helper.htmlsafe(`(${attribs.join(', ')}) `);
  }

  return attribsString;
}

function updateItemName(item) {
  const attributes = getSignatureAttributes(item);
  let itemName = item.name || '';

  if (item.variable) {
    itemName = '&hellip;' + itemName;
  }

  if (attributes && attributes.length) {
    itemName = `${itemName}<span class="signature-attributes">${attributes.join(
      ', '
    )}</span>`;
  }

  return itemName;
}

function getSignatureAttributes({ optional, nullable }) {
  const attributes = [];

  if (optional) {
    attributes.push('opt');
  }

  if (nullable === true) {
    attributes.push('nullable');
  } else if (nullable === false) {
    attributes.push('non-null');
  }

  return attributes;
}

function addParamAttributes(params) {
  return params
    .filter(({ name }) => name && !name.includes('.'))
    .map(updateItemName);
}

function addNonParamAttributes(items, helper) {
  let types = [];

  items.forEach(function (item) {
    types = types.concat(buildItemTypeStrings(item, helper));
  });

  return types;
}

function addSignatureParams(f) {
  const params = f.params ? addParamAttributes(f.params) : [];

  f.signature = `${f.signature || ''}(${params.join(', ')})`;
}

function addSignatureReturns(f, helper) {
  const attribs = [];
  let attribsString = '';
  let returnTypes = [];
  let returnTypesString = '';
  const source = f.yields || f.returns;

  // jam all the return-type attributes into an array. this could create odd results (for example,
  // if there are both nullable and non-nullable return types), but let's assume that most people
  // who use multiple @return tags aren't using Closure Compiler type annotations, and vice-versa.
  if (source) {
    source.forEach((item) => {
      helper.getAttribs(item).forEach((attrib) => {
        if (!attribs.includes(attrib)) {
          attribs.push(attrib);
        }
      });
    });

    attribsString = buildAttribsString(attribs, helper);
  }

  if (source) {
    returnTypes = addNonParamAttributes(source, helper);
  }
  if (returnTypes.length) {
    returnTypesString = ` &rarr; ${attribsString}{${returnTypes.join('|')}}`;
  }

  let signatureOutput = '';

  if (f.signature) {
    signatureOutput =
      '<span class="signature">' + (f.signature || '') + '</span>';
  }
  if (returnTypesString) {
    signatureOutput +=
      '<span class="type-signature">' + returnTypesString + '</span>';
  }

  f.signature = signatureOutput;
}

function addSignatureTypes(f, helper) {
  const types = f.type ? buildItemTypeStrings(f, helper) : [];

  f.signature =
    `${f.signature || ''}<span class="type-signature">` +
    `${types.length ? ` :${types.join('|')}` : ''}</span>`;
}

function addAttribs(f, helper) {
  const attribs = helper.getAttribs(f);
  const attribsString = buildAttribsString(attribs, helper);

  f.attribs = `<span class="type-signature">${attribsString}</span>`;
}

function needsSignature({ kind, type, meta }) {
  let needsSig = false;

  // function and class definitions always get a signature
  if (kind === 'function' || kind === 'class') {
    needsSig = true;
  }

  // typedefs that contain functions get a signature, too
  else if (kind === 'typedef' && type && type.names && type.names.length) {
    for (let i = 0, l = type.names.length; i < l; i++) {
      if (type.names[i].toLowerCase() === 'function') {
        needsSig = true;
        break;
      }
    }
  }

  // and namespaces that are functions get a signature (but finding them is a
  // bit messy)
  else if (
    kind === 'namespace' &&
    meta &&
    meta.code &&
    meta.code.type &&
    meta.code.type.match(/[Ff]unction/)
  ) {
    needsSig = true;
  }

  return needsSig;
}

/**
 * Generate section wise data.
 * @param {*} data
 */
function getSectionWiseData(data) {
  const { members, helper } = data;
  const classes = taffy(members.classes);
  const modules = taffy(members.modules);
  const namespaces = taffy(members.namespaces);
  const mixins = taffy(members.mixins);
  const externals = taffy(members.externals);
  const interfaces = taffy(members.interfaces);

  const classesToGenerate = [];
  const modulesToGenerate = [];
  const namespacesToGenerate = [];
  const mixinsToGenerate = [];
  const externalsToGenerate = [];
  const interfacesToGenerate = [];

  Object.keys(helper.longnameToUrl).forEach(async function (longname) {
    const _class = helper.find(classes, { longname: longname });
    const _external = helper.find(externals, { longname: longname });
    const _interface = helper.find(interfaces, { longname: longname });
    const _mixin = helper.find(mixins, { longname: longname });
    const _module = helper.find(modules, { longname: longname });
    const _namespace = helper.find(namespaces, { longname: longname });

    if (_module.length) {
      modulesToGenerate.push(_module);
    }

    if (_class.length) {
      classesToGenerate.push(_class);
    }

    if (_namespace.length) {
      namespacesToGenerate.push(_namespace);
    }

    if (_mixin.length) {
      mixinsToGenerate.push(_mixin);
    }

    if (_external.length) {
      externalsToGenerate(_external);
    }

    if (_interface.length) {
      interfacesToGenerate(_interface);
    }
  });

  return {
    classes: classesToGenerate,
    namespaces: namespacesToGenerate,
    externals: externalsToGenerate,
    module: modulesToGenerate,
    interfaces: interfacesToGenerate,
    mixins: mixinsToGenerate,
    globals: members.globals,
    tutorials: members.tutorials,
  };
}

module.exports = {
  getPathFromDoclet,
  hashToLink,
  getProcessedYield,
  shortenPaths,
  addAttribs,
  addSignatureTypes,
  needsSignature,
  addSignatureParams,
  addSignatureReturns,
  getSectionWiseData,
};
