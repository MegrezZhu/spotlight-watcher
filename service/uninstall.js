const service = require('./service');

// Uninstall the service.
service._directory = __dirname;
service.uninstall();
