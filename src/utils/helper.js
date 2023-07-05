const path = require('jsdoc/path');
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
  let url = helper.linkto(name);

  if (!hasAnchorElement(url)) return undefined;
  return extractURLFromAnchorElement(url);
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
function getTypeNameAndURL(item, helper) {
  const types = [];

  if (item && item.type && item.type.names) {
    item.type.names.forEach(function (name) {
      types.push({ name, url: getURLUsingHelperLinkto(name, helper) });
    });
  }

  return types;
}

function addNonParamAttributes(items, helper) {
  let types = [];

  items.forEach(function (item) {
    types = types.concat(getTypeNameAndURL(item, helper));
  });

  return types;
}

function addSignatureParams(f) {
  const params = f.params || [];

  f.signature = {
    name: f.signature || f.name,
    params,
  };
}

function addSignatureReturns(f, helper) {
  const attribs = [];
  let returnTypes = [];
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
  }

  if (source) {
    returnTypes = addNonParamAttributes(source, helper);
  }

  f.signature = {
    fn: f.signature,
    returnTypes,
    attribs,
  };
}

function addSignatureTypes(f, helper) {
  const types = f.type ? getTypeNameAndURL(f, helper) : [];

  f.signature = {
    name: f.signature,
    types,
  };
}

function addAttribs(f, helper) {
  const attribs = helper.getAttribs(f);

  f.attribs = attribs;
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

    if (
      _module.length ||
      _class.length ||
      _namespace.length ||
      _mixin.length ||
      _external.length ||
      _interface.length
    ) {
      additional = {
        classes: helper.find(data, { kind: 'class', memberof: longname }),
        interfaces: helper.find(data, {
          kind: 'interface',
          memberof: longname,
        }),
        mixins: helper.find(data, { kind: 'mixin', memberof: longname }),
        namespaces: helper.find(data, {
          kind: 'namespace',
          memberof: longname,
        }),
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

  return arr.map((name) => {
    let url = '';

    if (/@link/.test(name)) {
      url = getURLUsingHelperLinkto(name, helper);
      if (url) {
        name = url;
      }
    } else {
      url = getURLUsingHelperLinkto(name, helper);
    }

    return {
      name,
      url: typeof url === 'string' ? url.replace('.html', '') : url,
    };
  });
}

function attachLinkToParamsType(params, helper) {
  if (!Array.isArray(params)) return;

  for (const param of params) {
    const names = param.type.names ?? [];
    const links = convertNamesIntoNameURLMap(names, helper);

    param.type = { names: links };
  }
}

module.exports = {
  hashToLink,
  getProcessedYield,
  shortenPaths,
  addAttribs,
  addSignatureTypes,
  needsSignature,
  addSignatureParams,
  addSignatureReturns,
  attachLinkToParamsType,
  getSectionWiseData,
  getURLUsingHelperLinkto,
  convertNamesIntoNameURLMap,
};
