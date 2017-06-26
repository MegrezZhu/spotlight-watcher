const Service = require('node-windows').Service;
const logger = require('../src/logger');

const config = require('./config');

// Create a new service object
const service = new Service(config.service);

// Listen for the "install" event, which indicates the
// process is available as a service.
service.on('install', function () {
  logger.info('service installed');
  service.start();
  logger.info('service started');
});

// Listen for the "uninstall" event so we know when it's done.
service.on('uninstall', function () {
  logger.info('Uninstall complete.');
  logger.info('The service exists: ', service.exists ? 'yes' : 'no');
});

module.exports = service;
