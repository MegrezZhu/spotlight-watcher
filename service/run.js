const imager = require('../src/imager');
const logger = require('../src/logger');

function driver (fn, interval) {
  const _fn = async () => {
    await fn();
    setTimeout(_fn, interval);
  };

  _fn();
}

driver(async () => {
  try {
    const result = await imager();
    logger.info(`done. ${result} files copied.`);
  } catch (err) {
    logger.error(err);
  }
}, require('./config').interval);
