const path = require('path');

const env = require('jsdoc/env');
const cleanJSDocNextPath = path.join(env.pwd, '.clean-jsdoc-next');

module.exports = {
  cleanJSDocNextPath,
};
