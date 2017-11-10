const fs = require('fs-extra');
const crypto = require('crypto');
const os = require('os');
const path = require('path');
const config = require('./config');

exports.sha1 = async filePath => {
  const gen = crypto.createHash('sha1');
  gen.update(await fs.readFile(filePath));
  return gen.digest('hex');
};

exports.getSpotlightFolder = async () => {
  const { username, homedir } = await getUsername();
  const imagePath = path.resolve(homedir, `AppData/local`, config.imageDir.replace(/%localappdata%\//, ''));
  if (!await exports.checkSpotlightFolder({ username, homedir })) {
    throw new Error(`Path ${imagePath} not exists! It may due to an incorrect username (${username}) or unavailable Windows Spotlight App.`);
  }
  return imagePath;
};

exports.checkSpotlightFolder = async ({ username, homedir }) => {
  const imagePath = path.resolve(homedir, `AppData/local`, config.imageDir.replace(/%localappdata%\//, ''));
  return fs.pathExists(imagePath);
};

async function getUsername () {
  await fs.ensureFile(config.settingPath);
  const setting = (await fs.readJson(config.settingPath, { throws: false })) || {};
  if (setting.username) {
    return {
      username: setting.username,
      homedir: setting.homedir
    };
  }

  // get from os info
  const { username, homedir } = os.userInfo();
  return { username, homedir };
}
