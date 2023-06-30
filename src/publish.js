const chalk = require('chalk');
const helper = require('jsdoc/util/templateHelper');
const path = require('jsdoc/path');
const env = require('jsdoc/env');

const {
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
} = require('./utils/helper');
const { copyStaticFiles } = require('./copy');
const builder = require('./builder');

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

  const sourceFilePaths = [];
  let sourceFiles = {};

  data().each((doclet) => {
    let sourcePath;

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
          code: code || example,
        };
      });
    }

    if (doclet.see) {
      doclet.see.forEach(function (seeItem, i) {
        doclet.see[i] = hashToLink(doclet, seeItem);
      });
    }

    // build a list of source files
    if (doclet.meta) {
      sourcePath = getPathFromDoclet(doclet);
      sourceFiles[sourcePath] = {
        resolved: sourcePath,
        shortened: null,
      };
      if (sourceFilePaths.indexOf(sourcePath) === -1) {
        sourceFilePaths.push(sourcePath);
      }
    }

    // to process yields.
    if (doclet.yields) {
      doclet.yields = getProcessedYield(doclet.yields);
    }
  });

  if (sourceFilePaths.length) {
    sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
  }

  data().each(function (doclet) {
    let docletPath;
    const url = helper.createLink(doclet);

    helper.registerLink(doclet.longname, url);

    // add a shortened version of the full path
    if (doclet.meta) {
      docletPath = getPathFromDoclet(doclet);
      docletPath = sourceFiles[docletPath].shortened;
      if (docletPath) {
        doclet.meta.shortpath = docletPath;
      }
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
  });

  const packageJson = helper.find(data, { kind: 'package' }) || [];
  const files = helper.find(data, { kind: 'file' });

  if (typeof packageJson[0] === 'object' && packageJson[0].name) {
    dest = path.join(dest, packageJson[0].name, packageJson[0].version || '');
  }

  const members = helper.getMembers(data);
  members.tutorials = tutorials.children;

  const sections = getSectionWiseData({ members, helper });

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
  });
}

module.exports = {
  publish,
};
