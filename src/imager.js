const sizeOf = require('image-size');
const moment = require('moment');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const path = require('path');
const idGen = require('crypto-random-string');
const assert = require('assert');

const {sha1} = require('./utils');
const config = require('./config');
const homeDir = require('os').homedir();

module.exports = async () => {
  await fs.ensureFileAsync(config.settingPath);
  const setting = (await fs.readJsonAsync(config.settingPath, {throws: false})) || {};
  assert(setting.targetDir, 'target directory required');
  const imagePath = path.resolve(homeDir, `AppData/local`, config.imageDir.replace(/%localappdata%\//, ''));
  const historyPath = path.resolve(__dirname, '../history.json');

  const history = (await fs.readJsonAsync(historyPath, {throws: false})) || {};
  const hashSet = new Set(history.hashSet || []);
  const lastUpdate = moment(history.lastUpdate || 0);

  const files = (await fs.readdirAsync(imagePath)).map(file => {
    return {
      name: file,
      path: path.resolve(imagePath, file)
    };
  });

  let copyCount = 0;
  // process each potential wallpaper
  await Promise.all(files.map(async file => {
    try {
      // check update time
      const stat = await fs.statAsync(file.path);
      file.time = moment(stat.ctime);
      assert(file.time > lastUpdate);

      // check image size
      const {height, width} = sizeOf(file.path);
      assert(height > 1000 && width > height); // PC version wallpaper

      // check hash duplication
      const hash = await sha1(file.path);
      assert(!hashSet.has(hash));
      hashSet.add(hash);

      // ok, copy file to dest
      const date = file.time.format('YYYY-MM-DD');
      await fs.copyAsync(file.path, path.resolve(setting.targetDir, `${date}_${idGen(16)}.jpg`));
      copyCount++;
    } catch (err) {
    }
  }));

  // history writeback
  await fs.writeJsonAsync(historyPath, {
    lastUpdate: moment().valueOf(),
    hashSet: Array.from(hashSet)
  });

  return copyCount; // just return number of copied files
};
