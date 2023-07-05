const chalk = require('chalk');
const helper = require('jsdoc/util/templateHelper');
const path = require('jsdoc/path');
const env = require('jsdoc/env');
const getId = require('nanoid').nanoid;

const {
  hashToLink,
  getProcessedYield,
  addAttribs,
  addSignatureTypes,
  needsSignature,
  addSignatureParams,
  addSignatureReturns,
  getSectionWiseData,
  convertNamesIntoNameURLMap,
} = require('./utils/helper');
const { copyStaticFiles } = require('./copy');
const builder = require('./builder');
const { highlightCode } = require('./utils/code');

const config = env.conf;
const cleanConfig = config.clean || config.opts.clean;
let dest = path.resolve(path.normalize(config.opts.destination));

function publish(_data, opts, tutorials) {
  /**
   * If we don't able to find config file then we are returning
   * after showing proper message
   */
  if (!config) {
    console.error(
      chalk.red(
        [
          '[Error]:',
          'Unable to load config files.',
          'Make sure you have added the path to the',
          'config file correctly. For more visit',
          'https://jsdoc.app/about-configuring-jsdoc.html',
        ].join(' ')
      )
    );
    return;
  }

  if (config.clean && config.opts.clean) {
    console.warn(
      chalk.yellow(
        [
          '[Warn]:',
          'We found `clean` key more than one place in you config file.',
          'One at the root of the config file and another one inside',
          '`opts`. We are using the one that is in the root.',
        ].join(' ')
      )
    );
  }

  const templateConfig = env.conf.templates || {};
  templateConfig.default = templateConfig.default || {};
  const themeConfig = cleanConfig.theme || { mode: 'dark' };

  const staticFiles = templateConfig.default.staticFiles;
  copyStaticFiles(staticFiles);

  // claim some special filenames in advance, so the All-Powerful Overseer of Filename Uniqueness
  // doesn't try to hand them out later
  const indexUrl = helper.getUniqueFilename('index');
  // don't call registerLink() on this one! 'index' is also a valid longname

  const globalUrl = helper.getUniqueFilename('global');
  helper.registerLink('global', globalUrl);

  const data = helper.prune(_data);

  if (themeConfig.sort !== false) {
    data.sort('longname, version, since');
  }

  helper.addEventListeners(data);

  const sourceFilePaths = {};

  data().each((doclet) => {
    doclet.attribs = '';

    if (doclet.examples) {
      doclet.examples = doclet.examples.map((example) => {
        let caption;
        let code;

        if (
          example.match(
            /^\s*<caption>([\s\S]+?)<\/caption>(\s*[\n\r])([\s\S]+)$/i
          )
        ) {
          caption = RegExp.$1;
          code = RegExp.$3;
        }

        return {
          caption: caption || '',
          code: highlightCode(code || example),
          id: getId(),
        };
      });
    }

    if (doclet.see) {
      doclet.see.forEach(function (seeItem, i) {
        doclet.see[i] = hashToLink(doclet, seeItem);
      });
    }

    // to process yields.
    if (doclet.yields) {
      doclet.yields = getProcessedYield(doclet.yields);
    }

    if (doclet.meta) {
      const meta = doclet.meta;
      if (meta) {
        sourceFilePaths[path.join(meta.path || '', meta.filename)] = meta;
      }
    }
  });

  const commonPrefix = path.commonPrefix(Object.keys(sourceFilePaths));
  const registeredURLOfSource = {};

  data().each(function (doclet) {
    const url = helper.createLink(doclet);
    helper.registerLink(doclet.longname, url);
    const meta = doclet.meta;

    // add a shortened version of the full path
    if (meta) {
      const filepath = path.join(meta.path || '', meta.filename);
      const fileShortPath = filepath.replace(commonPrefix, '');
      let sourceOutFile = registeredURLOfSource[filepath];
      if (!sourceOutFile) {
        sourceOutFile = helper.getUniqueFilename(fileShortPath);
        helper.registerLink(fileShortPath, sourceOutFile);
        registeredURLOfSource[filepath] = sourceOutFile;
      }

      meta.sourceOutFile = sourceOutFile.replace('.html', '');

      // In windows path separator is backward slash.
      // So we are replacing backward slash with forward.
      meta.displayName = fileShortPath.replace(/\\/g, '/');
    }
  });

  data().each(function (doclet) {
    const url = helper.longnameToUrl[doclet.longname];

    if (url.indexOf('#') > -1) {
      doclet.id = helper.longnameToUrl[doclet.longname].split(/#/).pop();
    } else {
      doclet.id = doclet.name;
    }

    if (needsSignature(doclet)) {
      addSignatureParams(doclet);
      addSignatureReturns(doclet, helper);
      addAttribs(doclet, helper);
    }
  });

  // do this after the urls have all been generated
  data().each((doclet) => {
    doclet.ancestors = helper.getAncestorLinks(data, doclet);

    if (doclet.kind === 'member') {
      addSignatureTypes(doclet, helper);
      addAttribs(doclet, helper);
    }

    if (doclet.kind === 'constant') {
      addSignatureTypes(doclet, helper);
      addAttribs(doclet, helper);
      doclet.kind = 'member';
    }

    if (doclet.augments) {
      doclet.augments = convertNamesIntoNameURLMap(doclet.augments, helper);
    }

    if (doclet.see) {
      doclet.see = convertNamesIntoNameURLMap(doclet.see, helper);
    }
  });

  const packageJson = helper.find(data, { kind: 'package' }) || [];
  const files = helper.find(data, { kind: 'file' });

  if (typeof packageJson[0] === 'object' && packageJson[0].name) {
    dest = path.join(dest, packageJson[0].name, packageJson[0].version || '');
  }

  const members = helper.getMembers(data);
  members.tutorials = tutorials.children;

  const sections = getSectionWiseData({ members, helper, data });

  const canOutputSourceFiles = Boolean(
    templateConfig.default && templateConfig.default.outputSourceFiles !== false
  );

  builder({
    sections,
    canOutputSourceFiles,
    helper,
    data,
    themeConfig,
    config,
    opts,
    dest,
    packageJson,
    files,
    globalUrl,
    indexUrl,
    env,
    sourceFilePaths: registeredURLOfSource,
  });
}

module.exports = {
  publish,
};
