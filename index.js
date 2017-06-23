#!/usr/bin/env node
const sizeOf = require('image-size');
const moment = require('moment');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const path = require('path');
const idGen = require('crypto-random-string');

const config = require('./config');
const imagePath = path.resolve(`C:/Users/${config.username}/AppData/local`, config.imageDir.replace(/%localappdata%\//, ''));
const cachePath = path.resolve(__dirname, './cache.json');

const cache = fs.readJsonSync(cachePath, {throws: false}) || {};
const lastUpdate = moment(cache.lastUpdate || 0);

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

  files
    .forEach(file => {
      const date = file.time.format('YYYY-MM-DD');
      fs.copySync(file.path, path.resolve(config.targetDir, `${date}_${idGen(16)}.jpg`));
    });
  console.log(`${files.length} files copied.`);

  fs.writeJsonSync(cachePath, {lastUpdate: moment().valueOf()});
})()
  .catch(console.error);
