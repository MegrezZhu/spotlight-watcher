#!/usr/bin/env node
'use strict';

const program = require('commander');
const path = require('path');
const shell = require('shelljs');
const assert = require('assert');
const moment = require('moment');
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
  .command('update')
  .description('force update')
  .action(async () => {
    try {
      await check();
      const imager = require('./src/imager');
      const logger = require('./src/logger');
      const result = await imager();
      logger.info(`done. ${result} files copied.`);
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
      const targetDir = (await getSetting()).targetDir.replace(/\//g, '\\');
      shell.exec(`explorer ${targetDir}`);
    } catch (err) {
      console.error(err.message);
    }
  });

program
  .command('log')
  .description('list logs for today')
  .action(async () => {
    // for cmd, use 'more' instruction
    shell.exec(`more ${path.resolve(__dirname, 'logs', `${moment().format('YYYY-MM-DD')}.log`)}`);
  });

program
  .command('logs')
  .description('open log directory')
  .action(async () => {
    shell.exec(`explorer ${path.resolve(__dirname, 'logs')}`);
  });

program
  .command('set-target')
  .description('set target folder to which wallpapers are copied')
  .action(async (targetDir) => {
    try {
      assert(targetDir, 'target required');
      const normalized = path.resolve(process.cwd(), targetDir);
      // TODO: check path existency
      setValue('targetDir', normalized);
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
  assert(setting.targetDir, 'warn: target directory not yet set');
  return setting;
}

async function check () {
  await fs.ensureFileAsync(config.settingPath);
  const setting = (await fs.readJsonAsync(config.settingPath, {throws: false})) || {};
  assert(setting.targetDir, 'warn: target directory not yet set');
}
