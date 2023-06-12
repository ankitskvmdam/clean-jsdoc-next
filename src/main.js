const fs = require('fs');

const chalk = require('chalk');
const { taffy } = require('@jsdoc/salty');
const helper = require('jsdoc/util/templateHelper');
const logger = require('jsdoc/util/logger');
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
} = require('./utils/helper');
const { generate } = require('./generate/generate');

const config = env.conf;
const cleanJSDocNextPath = path.join(env.pwd, '.clean-jsdoc-next');
let dest = path.resolve(path.normalize(config.opts.destination));

function publish(_data, opts, tutorials) {
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

  const templateConfig = env.conf.templates || {};
  templateConfig.default = templateConfig.default || {};
  const themeConfig = config.theme || { mode: 'dark' };

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

    // added by clean-jsdoc-theme-dev.
    // to process yields.
    if (doclet.yields) {
      doclet.yields = getProcessedYield(doclet.yields);
    }
  });

  if (sourceFilePaths.length) {
    sourceFiles = shortenPaths(sourceFiles, path.commonPrefix(sourceFilePaths));
  }

  // update dest if necessary, then create dest
  const packageInfo = (helper.find(data, { kind: 'package' }) || [])[0];
  if (packageInfo && packageInfo.name) {
    dest = path.join(dest, packageInfo.name, packageInfo.version || '');
  }

  // // Directories needed for processing and output
  // const dirs = [cleanJSDocNextPath, dest];

  // // Removing existing directories
  // // dirs.forEach((dir) => removeDir(dir));

  // // Creating necessary directories
  // dirs.forEach((dir) => createDir(dir));

  //
  //
  //
  //
  //
  // Skipping copying static files and
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //

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

  const members = helper.getMembers(data);
  members.tutorials = tutorials.children;

  const canOutputSourceFiles = Boolean(
    templateConfig.default && templateConfig.default.outputSourceFiles !== false
  );

  const indexFile = [
    {
      data: opts.readme,
    },
  ];

  generate({
    pageTitle: 'Homepage',
    docs: indexFile,
    type: 'readme',
    env,
    helper,
    dest: cleanJSDocNextPath,
    filename: indexUrl,
    canOutputSourceFiles,
    isNeededToResolveLinks: true,
  });
}

module.exports = {
  publish,
};
