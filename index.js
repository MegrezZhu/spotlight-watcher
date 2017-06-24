#!/usr/bin/env node
const sizeOf = require('image-size');
const moment = require('moment');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const path = require('path');
const idGen = require('crypto-random-string');
const crypto = require('crypto');

const config = require('./config');
const imagePath = path.resolve(`C:/Users/${config.username}/AppData/local`, config.imageDir.replace(/%localappdata%\//, ''));
const historyPath = path.resolve(__dirname, './history.json');

const history = fs.readJsonSync(historyPath, {throws: false}) || {};
const hashSet = new Set(history.hashSet || []);
const lastUpdate = moment(history.lastUpdate || 0);

(async () => {
  const files = fs.readdirSync(imagePath)
    .map(file => {
      return {
        name: file,
        path: path.resolve(imagePath, file)
      };
    })
    .filter(file => {
      const stat = fs.statSync(file.path);
      const createTime = moment(stat.ctime);
      file.time = createTime;
      return createTime > lastUpdate;
    })
    .filter(file => {
      try {
        const {height, width} = sizeOf(file.path);
        return height > 1000 && width > height; // PC version wallpaper
      } catch (err) {
        return false;
      }
    });

  let copyCount = 0;
  await Promise.all(files.map(async file => {
    const date = file.time.format('YYYY-MM-DD');
    const hash = await sha1(file.path);
    if (hashSet.has(hash)) return;
    else hashSet.add(hash);
    copyCount++;
    return fs.copyAsync(file.path, path.resolve(config.targetDir, `${date}_${idGen(16)}.jpg`));
  }));
  console.log(`${copyCount} files copied.`);

  fs.writeJsonSync(historyPath, {
    lastUpdate: moment().valueOf(),
    hashSet: Array.from(hashSet)
  });
})()
  .catch(console.error);

async function sha1 (filePath) {
  const gen = crypto.createHash('sha1');
  gen.update(await fs.readFileAsync(filePath));
  return gen.digest('hex');
}
