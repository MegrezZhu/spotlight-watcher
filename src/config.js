const path = require('path');

module.exports = {
  imageDir: '%localappdata%/Packages/Microsoft.Windows.ContentDeliveryManager_cw5n1h2txyewy/LocalState/Assets',
  logDir: path.resolve(__dirname, '../logs'),
  settingPath: path.resolve(__dirname, '../setting.json')
};
