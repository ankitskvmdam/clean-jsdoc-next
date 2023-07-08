const { nanoid } = require('nanoid');
const showdown = require('showdown');
const { taffy } = require('@jsdoc/salty');

const {
  hasAnchorElement,
  extractURLFromAnchorElement,
} = require('../utils/html');

const mdToHTMLConverter = new showdown.Converter();

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

function getURLUsingHelperLinkto(name, helper) {
  let url = linkto(helper, name);

  if (!hasAnchorElement(url)) return undefined;
  return extractURLFromAnchorElement(url);
}

/**
 *
 * @param {string} anchorElement anchor element
 * @returns {string}
 */
function replaceUnbalanceClosedHTMLTagsWithHTMLEntity(anchorElement) {
  if (typeof anchorElement !== 'string') return anchorElement;

  const stack = [];
  let balanced = '';

  for (const char of anchorElement) {
    if (char === '<') {
      stack.push('<');
      balanced += '<';
    } else if (char === '>' && stack.length > 0) {
      stack.pop();
      balanced += '>';
    } else if (char === '>' && stack.length === 0) {
      balanced += '&gt;';
    } else {
      balanced += char;
    }
  }

  return balanced;
}

function linkto(helper, name, linktext) {
  const url = helper.linkto(name, linktext).replace('.html', '');
  return replaceUnbalanceClosedHTMLTagsWithHTMLEntity(url);
}

function addNonParamAttributes(items, helper) {
  let types = [];

  items.forEach(function (item) {
    types = types.concat(buildItemTypeStrings(item, helper));
  });

  return types;
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

function addParamAttributes(params) {
  return params
    .filter(({ name }) => name && !name.includes('.'))
    .map(updateItemName);
}

function addSignatureParams(f) {
  const params = f.params ? addParamAttributes(f.params) : [];

  f.signature = `${f.signature || ''}(${params.join(', ')})`;
}

function buildAttribsString(attribs, helper) {
  let attribsString = '';

  if (attribs && attribs.length) {
    attribsString = helper.htmlsafe(`(${attribs.join(', ')}) `);
  }

  return attribsString;
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

function buildItemTypeStrings(item, helper) {
  const types = [];

  if (item && item.type && item.type.names) {
    item.type.names.forEach(function (name) {
      const url = linkto(helper, name, helper.htmlsafe(name));
      types.push(url);
    });
  }

  return types;
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
 * @param {*} options
 */
function getSectionWiseData(options) {
  const { members, helper, data } = options;
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

    let additional = {};

    function extractLinkAndSummary(arr) {
      return arr.map((item) => {
        const url = linkto(helper, item.longname, item.name);

        return {
          id: nanoid(),
          nameOrUrl: url,
          summary: item.summary,
        };
      });
    }

    if (
      _module.length ||
      _class.length ||
      _namespace.length ||
      _mixin.length ||
      _external.length ||
      _interface.length
    ) {
      additional = {
        classes: extractLinkAndSummary(
          helper.find(data, { kind: 'class', memberof: longname })
        ),
        interfaces: extractLinkAndSummary(
          helper.find(data, {
            kind: 'interface',
            memberof: longname,
          })
        ),
        mixins: extractLinkAndSummary(
          helper.find(data, { kind: 'mixin', memberof: longname })
        ),
        namespaces: extractLinkAndSummary(
          helper.find(data, {
            kind: 'namespace',
            memberof: longname,
          })
        ),
        members: helper.find(data, { kind: 'member', memberof: longname }),
        methods: helper.find(data, { kind: 'function', memberof: longname }),
        typedefs: helper.find(data, { kind: 'typedef', memberof: longname }),
        events: helper.find(data, { kind: 'event', memberof: longname }),
      };
    }

    if (_module.length) {
      modulesToGenerate.push({ data: _module[0], additional });
    }

    if (_class.length) {
      classesToGenerate.push({ data: _class[0], additional });
    }

    if (_namespace.length) {
      namespacesToGenerate.push({ data: _namespace[0], additional });
    }

    if (_mixin.length) {
      mixinsToGenerate.push({ data: _mixin[0], additional });
    }

    if (_external.length) {
      externalsToGenerate({ data: _external[0], additional });
    }

    if (_interface.length) {
      interfacesToGenerate({ data: _interface[0], additional });
    }
  });

  return {
    classes: classesToGenerate,
    namespaces: namespacesToGenerate,
    externals: externalsToGenerate,
    modules: modulesToGenerate,
    interfaces: interfacesToGenerate,
    mixins: mixinsToGenerate,
    globals: members.globals,
    tutorials: members.tutorials,
  };
}

function convertNamesIntoNameURLMap(arr, helper) {
  if (!Array.isArray(arr)) return arr;

  return arr.map((name) => ({
    id: nanoid(),
    nameOrUrl: linkto(helper, name, name),
  }));
}

module.exports = {
  hashToLink,
  getProcessedYield,
  addAttribs,
  addSignatureTypes,
  needsSignature,
  addSignatureParams,
  addSignatureReturns,
  getSectionWiseData,
  getURLUsingHelperLinkto,
  convertNamesIntoNameURLMap,
};
