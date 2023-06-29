const { publish } = require('./src/publish');

exports.publish = (data, opts, tutorials) => {
  /**
   * TODO: Add proper build step.
   */
  publish(data, opts, tutorials);
};
