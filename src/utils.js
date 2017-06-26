const fs = require('bluebird').promisifyAll(require('fs-extra'));
const crypto = require('crypto');

exports.sha1 = async filePath => {
  const gen = crypto.createHash('sha1');
  gen.update(await fs.readFileAsync(filePath));
  return gen.digest('hex');
};
