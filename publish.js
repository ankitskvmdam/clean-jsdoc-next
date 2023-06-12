const { publish } = require('./src/main');

exports.publish = (data, opts, tutorials) => publish(data, opts, tutorials);
