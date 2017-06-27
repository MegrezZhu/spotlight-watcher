#!/usr/bin/env node
'use strict';

const program = require('commander');
const shell = require('shelljs');
const assert = require('assert');
const fs = require('bluebird').promisifyAll(require('fs-extra'));
const config = require('./src/config');

program
  .usage('[options] [command]')
  .version('1.0.0');

program
  .command('install')
  .description('install Spotlight Watcher as a windows service')
  .action(async () => {
    try {
      await check();
      require('./service/install');
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('uninstall')
  .description('uninstall Spotlight Watcher service')
  .action(async () => {
    try {
      await check();
      require('./service/uninstall');
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('open')
  .description('open destination directory')
  .action(async () => {
    try {
      await check();
      shell.exec(`explorer ${(await getSetting()).targetDir.replace('/', '\\')}`);
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('log')
  .description('open log directory')
  .action(async () => {
    shell.exec(`explorer ${require('path').resolve(__dirname, 'logs')}`);
  });

program
  .command('setUser [username]')
  .description('set username to help locate the windows spotlight directory')
  .action(async (username) => {
    try {
      assert(username, 'username required');
      setValue('username', username);
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('setTarget [absolute-target-directory]')
  .description('set target directory to store copied wallpapers')
  .action(async (targetDir) => {
    try {
      assert(targetDir, 'target required');
      setValue('targetDir', targetDir);
    } catch (err) {
      console.error(err.message);
    }
  });

program.parse(process.argv);

async function setValue (key, value) {
  await fs.ensureFileAsync(config.settingPath);
  const setting = (await fs.readJsonAsync(config.settingPath, {throws: false})) || {};
  setting[key] = value;
  await fs.writeJsonAsync(config.settingPath, setting);
}

async function getSetting () {
  await fs.ensureFileAsync(config.settingPath);
  const setting = (await fs.readJsonAsync(config.settingPath, {throws: false})) || {};
  assert(setting.username, 'warn: username not yet set');
  assert(setting.targetDir, 'warn: target directory not yet set');
  return setting;
}

async function check () {
  await fs.ensureFileAsync(config.settingPath);
  const setting = (await fs.readJsonAsync(config.settingPath, {throws: false})) || {};
  assert(setting.username, 'warn: username not yet set');
  assert(setting.targetDir, 'warn: target directory not yet set');
}
